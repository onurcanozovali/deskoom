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

export function CheckoutPageContent() {
  const { items, ready: cartReady, clearCart } = useCart();
  const { user, ready: authReady, isAuthenticated } = useAuth();
  const router = useRouter();
  const idempotencyKey = useRef("");
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

  if (!isAuthenticated) return <section className="checkout-empty container"><p>Güvenli ödeme</p><h1>Ödeme için giriş yapın.</h1><span>Sepetiniz korunur; girişten sonra ödeme bilgilerinize kaldığınız yerden devam edersiniz.</span><Link className="corner-button" href="/giris?yonlendir=%2Fcheckout">Giriş yap <b>→</b></Link></section>;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
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
        router.push(`/order-confirmation/${payload.orderId}`);
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

  return <section className="checkout-layout container">
    <div className="checkout-main">
      {paymentSession ? <section className="checkout-payment-stage"><p>PAYTR güvenli ödeme</p><h2>Ödeme bilgilerinizi tamamlayın.</h2><span>Sipariş no: {paymentSession.orderNumber}. Kart bilgileriniz DESKOOM tarafından görülmez veya saklanmaz.</span><iframe title="PAYTR güvenli ödeme formu" src={paymentSession.iframeUrl}/><Link href={`/order-confirmation/${paymentSession.orderId}`}>Sipariş durumunu görüntüle →</Link></section> : <form className="checkout-form" onSubmit={handleSubmit}>
        <section><div className="checkout-section-title"><span>01</span><div><p>İletişim</p><h2>Size nasıl ulaşalım?</h2></div></div><div className="checkout-fields two"><Field label="E-posta" name="email" type="email" inputMode="email" autoComplete="email" defaultValue={user?.email}/><Field label="Telefon" name="phone" type="tel" inputMode="tel" autoComplete="tel"/></div></section>

        <section><div className="checkout-section-title"><span>02</span><div><p>Teslimat</p><h2>Teslimat adresi</h2></div></div><div className="checkout-fields two"><Field label="Ad" name="firstName" autoComplete="given-name" defaultValue={defaultFirstName}/><Field label="Soyad" name="lastName" autoComplete="family-name" defaultValue={defaultLastName}/><label className="checkout-field full"><span>Adres</span><textarea name="address" autoComplete="street-address" required/></label><Field label="Apartman / bina / kat / kapı" name="apartment" optional/><Field label="İlçe" name="district" autoComplete="address-level2"/><Field label="Şehir" name="city" autoComplete="address-level1"/><Field label="Posta kodu" name="postalCode" optional inputMode="numeric" autoComplete="postal-code"/><Field label="Adres başlığı" name="addressTitle" optional/><label className="checkout-field"><span>Ülke</span><input value="Türkiye" readOnly aria-readonly="true"/></label></div></section>

        <section><div className="checkout-section-title"><span>03</span><div><p>Fatura</p><h2>Fatura bilgileri</h2></div></div><label className="checkout-check"><input type="checkbox" checked={invoiceSame} onChange={(event) => setInvoiceSame(event.target.checked)}/><span>Fatura adresi teslimat adresiyle aynı</span></label><div className="invoice-tabs" role="radiogroup" aria-label="Fatura tipi"><label><input type="radio" name="invoiceType" value="individual" checked={invoiceType === "individual"} onChange={() => setInvoiceType("individual")}/><span>Bireysel</span></label><label><input type="radio" name="invoiceType" value="corporate" checked={invoiceType === "corporate"} onChange={() => setInvoiceType("corporate")}/><span>Kurumsal</span></label></div>{invoiceType === "individual" ? <div className="checkout-fields two"><Field label="Ad" name="invoiceFirstName" defaultValue={defaultFirstName}/><Field label="Soyad" name="invoiceLastName" defaultValue={defaultLastName}/><Field label="T.C. kimlik numarası" name="identityNumber" optional inputMode="numeric"/>{!invoiceSame && <label className="checkout-field full"><span>Fatura adresi</span><textarea name="invoiceAddress" required/></label>}</div> : <div className="checkout-fields two"><Field label="Şirket adı" name="companyName"/><Field label="Vergi dairesi" name="taxOffice"/><Field label="Vergi numarası" name="taxNumber" inputMode="numeric"/>{!invoiceSame && <label className="checkout-field full"><span>Fatura adresi</span><textarea name="invoiceAddress" required/></label>}</div>}</section>

        <section><div className="checkout-section-title"><span>04</span><div><p>Teslimat yöntemi</p><h2>Standart teslimat</h2></div></div><label className="shipping-option"><input type="radio" defaultChecked name="shipping"/><span><strong>Standart teslimat</strong><small>2–4 iş günü</small></span><b>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</b></label></section>

        <section><div className="checkout-section-title"><span>05</span><div><p>Ödeme</p><h2>Ödeme yöntemi</h2></div></div><div className="payment-options"><label className={paymentMethod === "card" ? "active" : ""}><input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")}/><span><strong>Kredi / banka kartı</strong><small>PAYTR ile güvenli ödeme</small></span><b>PAYTR</b></label><label className={paymentMethod === "eft" ? "active" : ""}><input type="radio" name="payment" value="eft" checked={paymentMethod === "eft"} onChange={() => setPaymentMethod("eft")}/><span><strong>Havale / EFT</strong><small>Ödeme onayından sonra hazırlanır</small></span><b>EFT</b></label></div><p className="payment-security">Kart bilgileri mağazamıza iletilmez. PAYTR güvenli ödeme penceresinde işlenir.</p></section>

        <section className="checkout-legal"><label><input name="preInformation" type="checkbox" required/><span><a id="on-bilgilendirme" href="#on-bilgilendirme">Ön Bilgilendirme Formu</a>&apos;nu okudum ve kabul ediyorum.</span></label><label><input name="distanceSales" type="checkbox" required/><span><a id="mesafeli-satis" href="#mesafeli-satis">Mesafeli Satış Sözleşmesi</a>&apos;ni okudum ve kabul ediyorum.</span></label></section>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="place-order" type="submit" disabled={submitting}>{submitting ? "İşleniyor…" : paymentMethod === "eft" ? "Siparişi oluştur" : "PAYTR ile ödemeye geç"}<span>→</span></button>
      </form>}
    </div>

    <aside className="checkout-summary" aria-label="Sipariş özeti"><p>Sipariş özeti</p><h2>{products.reduce((sum, item) => sum + item.quantity, 0)} ürün</h2><div className="checkout-summary-items">{products.map(({ product, quantity }) => <article key={product.id}><div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }}/><div><strong>{product.name}</strong><span>{product.variant} · Adet {quantity}</span></div><b>{formatPrice(priceToNumber(product.price) * quantity)}</b></article>)}</div><dl><div><dt>Ara toplam</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Kargo</dt><dd>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</dd></div><div><dt>Toplam</dt><dd>{formatPrice(total)}</dd></div></dl><p className="checkout-summary-note">Standart teslimat · 2–4 iş günü<br/>Vergiler toplam fiyata dahildir.</p></aside>
  </section>;
}
