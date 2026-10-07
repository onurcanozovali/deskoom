"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useRef, useState } from "react";
import { allProducts, formatPrice, priceToNumber } from "@/data/products";
import { calculateShipping } from "@/lib/commerce/config";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";

type PaymentSession = { orderId: string; orderNumber: string; iframeUrl: string };

function value(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

function Field({ label, name, type = "text", optional, defaultValue, autoComplete, inputMode }: { label: string; name: string; type?: string; optional?: boolean; defaultValue?: string; autoComplete?: string; inputMode?: "text" | "tel" | "email" | "numeric" }) {
  return <label className="checkout-field"><span>{label}{optional && <em>İsteğe bağlı</em>}</span><input name={name} type={type} defaultValue={defaultValue} autoComplete={autoComplete} inputMode={inputMode} required={!optional}/></label>;
}

function CardFormPreview() {
  const [number, setNumber] = useState("4242 4242 4242 4242");
  const [holder, setHolder] = useState("ADMİN DEMO");
  const [expiry, setExpiry] = useState("12/30");

  const formatNumber = (next: string) => next.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (next: string) => {
    const digits = next.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  return <section className="card-design-preview" aria-labelledby="card-preview-title">
    <div className="preview-mode-note"><span>Önizleme modu</span><p>PAYTR henüz bağlı değil. Bu alanlar yalnızca tasarımı görmeniz ve düzenlemeniz içindir; hiçbir kart bilgisi sunucuya gönderilmez veya saklanmaz. Gerçek kart bilgisi kullanmayın.</p></div>
    <div className="card-preview-layout">
      <div className="payment-card-art" aria-hidden="true"><i/><small>DESKOOM / PAYTR</small><strong>{number || "•••• •••• •••• ••••"}</strong><div><span>{holder || "KART SAHİBİ"}</span><span>{expiry || "AA/YY"}</span></div></div>
      <div className="card-preview-fields">
        <label><span id="card-preview-title">Kart numarası</span><input value={number} onChange={(event) => setNumber(formatNumber(event.target.value))} inputMode="numeric" autoComplete="off" maxLength={19}/></label>
        <label><span>Kart üzerindeki isim</span><input value={holder} onChange={(event) => setHolder(event.target.value.toLocaleUpperCase("tr-TR").slice(0, 28))} autoComplete="off"/></label>
        <div><label><span>Son kullanma</span><input value={expiry} onChange={(event) => setExpiry(formatExpiry(event.target.value))} inputMode="numeric" autoComplete="off" maxLength={5}/></label><label><span>CVV</span><input defaultValue="123" inputMode="numeric" autoComplete="off" maxLength={3}/></label></div>
      </div>
    </div>
  </section>;
}

export function CheckoutPageContent({ paytrConfigured }: { paytrConfigured: boolean }) {
  const { items, ready: cartReady, clearCart } = useCart();
  const { user, ready: authReady, isAuthenticated } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKey = useRef("");
  const [step, setStep] = useState<1 | 2>(1);
  const [invoiceSame, setInvoiceSame] = useState(true);
  const [invoiceType, setInvoiceType] = useState<"individual" | "corporate">("individual");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "eft">("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const products = useMemo(() => items.flatMap((item) => {
    const product = allProducts.find((candidate) => candidate.id === item.productId);
    return product ? [{ ...item, product }] : [];
  }), [items]);
  const subtotal = products.reduce((sum, item) => sum + priceToNumber(item.product.price) * item.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const nameParts = user?.name.split(" ") ?? [];
  const defaultFirstName = nameParts[0] === "Admin" ? "Admin" : nameParts[0] ?? "";
  const defaultLastName = nameParts.slice(1).join(" ") || "Demo";

  if (!cartReady || !authReady) return <section className="checkout-layout container" aria-busy="true"><div className="checkout-loading"/><div className="checkout-loading summary"/></section>;
  if (products.length === 0) return <section className="checkout-empty container"><p>Ödeme</p><h1>Sepetiniz boş.</h1><span>Ödeme adımına geçmek için önce alanınıza uygun parçaları seçin.</span><Link className="corner-button" href="/#shop">Alışverişe devam et <b>→</b></Link></section>;
  if (!isAuthenticated) return <section className="checkout-empty container"><p>Güvenli ödeme</p><h1>Ödeme için giriş yapın.</h1><span>Sepetiniz korunur; girişten sonra ödeme bilgilerinize kaldığınız yerden devam edersiniz.</span><Link className="corner-button" href="/giris?yonlendir=%2Fodeme">Giriş yap <b>→</b></Link></section>;

  const focusFlow = () => requestAnimationFrame(() => document.getElementById("checkout-flow")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  const continueToPayment = () => {
    const panel = formRef.current?.querySelector<HTMLElement>("[data-checkout-step='customer']");
    const invalid = Array.from(panel?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea") ?? []).find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      invalid.focus();
      return;
    }
    setError("");
    setStep(2);
    focusFlow();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (paymentMethod === "card" && !paytrConfigured) {
      setError("Kart alanları şu anda yalnızca tasarım önizlemesidir. Gerçek ödeme başlatmak için PAYTR bilgileri yapılandırılmalıdır.");
      return;
    }
    setSubmitting(true);
    if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
    const form = new FormData(event.currentTarget);
    const deliveryAddress = {
      firstName: value(form, "firstName"), lastName: value(form, "lastName"), address: value(form, "address"), apartment: value(form, "apartment"),
      district: value(form, "district"), city: value(form, "city"), postalCode: value(form, "postalCode"), addressTitle: value(form, "addressTitle"),
    };
    const deliveryInvoiceAddress = `${deliveryAddress.address}${deliveryAddress.apartment ? `, ${deliveryAddress.apartment}` : ""}, ${deliveryAddress.district}/${deliveryAddress.city}`;
    const invoice = invoiceType === "individual"
      ? { type: "individual", firstName: value(form, "invoiceFirstName"), lastName: value(form, "invoiceLastName"), identityNumber: value(form, "identityNumber"), address: invoiceSame ? deliveryInvoiceAddress : value(form, "invoiceAddress") }
      : { type: "corporate", companyName: value(form, "companyName"), taxOffice: value(form, "taxOffice"), taxNumber: value(form, "taxNumber"), address: invoiceSame ? deliveryInvoiceAddress : value(form, "invoiceAddress") };
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey.current,
          userEmail: user?.email,
          contact: { email: value(form, "email"), phone: value(form, "phone") },
          deliveryAddress,
          invoiceSameAsDelivery: invoiceSame,
          invoice,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          paymentMethod,
          legalAccepted: form.get("preInformation") === "on" && form.get("distanceSales") === "on",
        }),
      });
      const payload = await response.json() as { error?: string; orderId?: string; orderNumber?: string; payment?: { iframeUrl?: string } };
      if (!response.ok) throw new Error(payload.error || "Sipariş oluşturulamadı.");
      if (!payload.orderId || !payload.orderNumber) throw new Error("Sipariş yanıtı doğrulanamadı.");
      if (paymentMethod === "eft") {
        clearCart();
        router.push(`/siparis-onayi/${payload.orderId}`);
        return;
      }
      if (!payload.payment?.iframeUrl) throw new Error("Güvenli ödeme penceresi başlatılamadı.");
      setPaymentSession({ orderId: payload.orderId, orderNumber: payload.orderNumber, iframeUrl: payload.payment.iframeUrl });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sipariş şu anda oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  return <section className="checkout-layout container" id="checkout-flow">
    <div className="checkout-main">
      {paymentSession ? <section className="checkout-payment-stage"><p>PAYTR güvenli ödeme</p><h2>Ödeme bilgilerinizi tamamlayın.</h2><span>Sipariş no: {paymentSession.orderNumber}. Kart bilgileriniz DESKOOM tarafından görülmez veya saklanmaz.</span><iframe title="PAYTR güvenli ödeme formu" src={paymentSession.iframeUrl}/><Link href={`/siparis-onayi/${paymentSession.orderId}`}>Sipariş durumunu görüntüle →</Link></section> : <form ref={formRef} className="checkout-form" onSubmit={handleSubmit}>
        <nav className="checkout-steps" aria-label="Ödeme adımları"><button type="button" className={step === 1 ? "active" : "complete"} onClick={() => { setStep(1); focusFlow(); }}><b>01</b><span>Bilgiler</span></button><i/><button type="button" className={step === 2 ? "active" : ""} onClick={continueToPayment}><b>02</b><span>Ödeme</span></button></nav>

        <div className="checkout-step-panel" data-checkout-step="customer" hidden={step !== 1}>
          <section><div className="checkout-section-title"><span>01</span><div><p>İletişim</p><h2>Size nasıl ulaşalım?</h2></div></div><div className="checkout-fields"><Field label="E-posta" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={user?.email}/><Field label="Telefon" name="phone" type="tel" inputMode="tel" autoComplete="tel"/></div></section>
          <section><div className="checkout-section-title"><span>02</span><div><p>Teslimat</p><h2>Teslimat adresi</h2></div></div><div className="checkout-fields"><Field label="Ad" name="firstName" autoComplete="given-name" defaultValue={defaultFirstName}/><Field label="Soyad" name="lastName" autoComplete="family-name" defaultValue={defaultLastName}/><label className="checkout-field full"><span>Adres</span><textarea name="address" autoComplete="street-address" required/></label><Field label="Apartman / bina / kat / kapı" name="apartment" optional/><Field label="İlçe" name="district" autoComplete="address-level2"/><Field label="Şehir" name="city" autoComplete="address-level1"/><Field label="Posta kodu" name="postalCode" optional inputMode="numeric" autoComplete="postal-code"/><Field label="Adres başlığı" name="addressTitle" optional/><label className="checkout-field"><span>Ülke</span><input value="Türkiye" readOnly aria-readonly="true"/></label></div></section>
          <section><div className="checkout-section-title"><span>03</span><div><p>Fatura</p><h2>Fatura bilgileri</h2></div></div><div className="invoice-controls"><label className="checkout-check"><input type="checkbox" checked={invoiceSame} onChange={(event) => setInvoiceSame(event.target.checked)}/><span>Fatura adresi teslimat adresiyle aynı</span></label><div className="invoice-tabs" role="radiogroup" aria-label="Fatura tipi"><label><input type="radio" name="invoiceType" value="individual" checked={invoiceType === "individual"} onChange={() => setInvoiceType("individual")}/><span>Bireysel</span></label><label><input type="radio" name="invoiceType" value="corporate" checked={invoiceType === "corporate"} onChange={() => setInvoiceType("corporate")}/><span>Kurumsal</span></label></div></div>{invoiceType === "individual" ? <div className="checkout-fields"><Field label="Ad" name="invoiceFirstName" defaultValue={defaultFirstName}/><Field label="Soyad" name="invoiceLastName" defaultValue={defaultLastName}/><Field label="T.C. kimlik numarası" name="identityNumber" optional inputMode="numeric"/>{!invoiceSame && <label className="checkout-field full"><span>Fatura adresi</span><textarea name="invoiceAddress" required/></label>}</div> : <div className="checkout-fields"><Field label="Şirket adı" name="companyName"/><Field label="Vergi dairesi" name="taxOffice"/><Field label="Vergi numarası" name="taxNumber" inputMode="numeric"/>{!invoiceSame && <label className="checkout-field full"><span>Fatura adresi</span><textarea name="invoiceAddress" required/></label>}</div>}</section>
          <button className="checkout-next" type="button" onClick={continueToPayment}>Teslimat ve ödemeye devam et <span>→</span></button>
        </div>

        <div className="checkout-step-panel" data-checkout-step="payment" hidden={step !== 2}>
          <div className="checkout-step-edit"><div><p>İletişim ve teslimat</p><strong>{user?.email} · {defaultFirstName} {defaultLastName}</strong></div><button type="button" onClick={() => { setStep(1); focusFlow(); }}>Düzenle</button></div>
          <section><div className="checkout-section-title"><span>04</span><div><p>Teslimat yöntemi</p><h2>Standart teslimat</h2></div></div><label className="shipping-option"><input type="radio" defaultChecked name="shipping"/><span><strong>Standart teslimat</strong><small>2–4 iş günü</small></span><b>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</b></label></section>
          <section><div className="checkout-section-title"><span>05</span><div><p>Ödeme</p><h2>Ödeme yöntemi</h2></div></div><div className="payment-options"><label className={paymentMethod === "card" ? "active" : ""}><input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")}/><span><strong>Kredi / banka kartı</strong><small>PAYTR ile güvenli ödeme</small></span><b>PAYTR</b></label><label className={paymentMethod === "eft" ? "active" : ""}><input type="radio" name="payment" value="eft" checked={paymentMethod === "eft"} onChange={() => setPaymentMethod("eft")}/><span><strong>Havale / EFT</strong><small>Ödeme onayından sonra hazırlanır</small></span><b>EFT</b></label></div>{paymentMethod === "card" && (paytrConfigured ? <p className="payment-security">Kart bilgileriniz sipariş oluşturulduktan sonra açılan PAYTR güvenli ödeme formunda girilir.</p> : <CardFormPreview/>)}</section>
          <section className="checkout-legal"><label><input name="preInformation" type="checkbox" required/><span><a id="on-bilgilendirme" href="#on-bilgilendirme">Ön Bilgilendirme Formu</a>&apos;nu okudum ve kabul ediyorum.</span></label><label><input name="distanceSales" type="checkbox" required/><span><a id="mesafeli-satis" href="#mesafeli-satis">Mesafeli Satış Sözleşmesi</a>&apos;ni okudum ve kabul ediyorum.</span></label></section>
          {error && <p className="checkout-error" role="alert">{error}</p>}
          <button className="place-order" type="submit" disabled={submitting}>{submitting ? "İşleniyor…" : paymentMethod === "eft" ? "Siparişi oluştur" : paytrConfigured ? "PAYTR ile ödemeye geç" : "Kart tasarımını önizle"}<span>→</span></button>
        </div>
      </form>}
    </div>

    <aside className="checkout-summary" aria-label="Sipariş özeti"><p>Sipariş özeti</p><h2>{products.reduce((sum, item) => sum + item.quantity, 0)} ürün</h2><div className="checkout-summary-items">{products.map(({ product, quantity }) => <article key={product.id}><div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }}/><div><strong>{product.name}</strong><span>{product.variant} · Adet {quantity}</span></div><b>{formatPrice(priceToNumber(product.price) * quantity)}</b></article>)}</div><dl><div><dt>Ara toplam</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Kargo</dt><dd>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</dd></div><div><dt>Toplam</dt><dd>{formatPrice(total)}</dd></div></dl><p className="checkout-summary-note">Standart teslimat · 2–4 iş günü<br/>Vergiler toplam fiyata dahildir.</p></aside>
  </section>;
}
