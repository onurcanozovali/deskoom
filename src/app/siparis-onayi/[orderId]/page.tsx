import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OrderConfirmationCartEffect } from "@/components/OrderConfirmationCartEffect";
import { formatPrice } from "@/data/products";
import { getBankTransferConfig } from "@/lib/commerce/server-config";
import { orderAccessCookieName, verifyOrderAccessToken } from "@/lib/orders/access";
import { findOrderById } from "@/lib/orders/repository";
import type { Order } from "@/lib/orders/types";

export const metadata: Metadata = { title: "Sipariş Durumu | DESKOOM", description: "DESKOOM siparişinizin durumunu görüntüleyin." };

const paymentStatusLabels = {
  pending: "Ödeme bildirimi bekleniyor",
  awaiting_payment: "Havale / EFT bekleniyor",
  paid: "Ödeme onaylandı",
  failed: "Ödeme onaylanmadı",
  cancelled: "İptal edildi",
  refunded: "İade edildi",
} as const;

function addressText(order: Order) {
  const address = order.deliveryAddress;
  return `${address.address}${address.apartment ? `, ${address.apartment}` : ""}, ${address.district}/${address.city}, ${address.country}`;
}

export default async function OrderConfirmationPage({ params }: PageProps<"/siparis-onayi/[orderId]">) {
  const { orderId } = await params;
  let order: Order | null = null;
  try { order = await findOrderById(orderId); } catch { order = null; }
  const token = (await cookies()).get(orderAccessCookieName(orderId))?.value;
  const allowed = Boolean(order && token && verifyOrderAccessToken(token, order.accessTokenHash));

  if (!allowed || !order) return <main id="top"><Header/><section className="confirmation-denied container"><p>Sipariş durumu</p><h1>Bu sipariş görüntülenemiyor.</h1><span>Sipariş bağlantısı geçersiz, süresi dolmuş veya bu tarayıcıya ait olmayabilir.</span><Link className="corner-button" href="/hesabim">Hesabıma dön <b>→</b></Link></section><Footer/></main>;

  const bank = getBankTransferConfig();
  const clearCart = order.paymentMethod === "eft" || order.paymentStatus === "paid";

  return <main id="top">
    <Header/><OrderConfirmationCartEffect clear={clearCart}/>
    <header className="confirmation-heading container"><p>{order.paymentStatus === "paid" ? "Teşekkür ederiz" : "Siparişiniz alındı"}</p><h1>{order.paymentMethod === "eft" ? "Ödemenizi bekliyoruz." : order.paymentStatus === "paid" ? "Siparişiniz onaylandı." : "Ödeme sonucu bekleniyor."}</h1><span>Sipariş numarası <b>{order.orderNumber}</b></span></header>
    <section className="confirmation-layout container">
      <div className="confirmation-main">
        <div className={`payment-state ${order.paymentStatus}`}><span>{order.paymentStatus === "paid" ? "✓" : order.paymentStatus === "failed" ? "!" : "→"}</span><div><p>Ödeme durumu</p><h2>{paymentStatusLabels[order.paymentStatus]}</h2><small>{order.paymentStatus === "paid" ? "PAYTR bildirimi güvenli biçimde doğrulandı." : order.paymentMethod === "eft" ? "Siparişiniz ödeme teyidinden sonra hazırlanmaya başlayacak." : "Bu sayfa tek başına ödemeyi onaylamaz; PAYTR callback sonucu beklenir."}</small></div></div>

        {order.paymentMethod === "eft" && <section className="bank-instructions"><p>Havale / EFT bilgileri</p><h2>Ödeme açıklamasına sipariş numaranızı yazın.</h2>{bank.configured ? <dl><div><dt>Hesap sahibi</dt><dd>{bank.accountHolder}</dd></div><div><dt>Banka</dt><dd>{bank.bank}</dd></div><div><dt>IBAN</dt><dd>{bank.iban}</dd></div><div><dt>Açıklama</dt><dd>{order.orderNumber}</dd></div></dl> : <div className="bank-placeholder"><strong>Geliştirme yapılandırması</strong><span>Gerçek banka ve IBAN bilgileri henüz tanımlanmadı. Bu alan üretimde yapılandırılmadan ödeme talimatı olarak kullanılamaz.</span></div>}</section>}

        <section className="confirmation-products"><div className="confirmation-section-title"><p>Sipariş içeriği</p><h2>Seçtiğiniz parçalar</h2></div>{order.items.map((item) => <article key={item.productId}><div className={`sheet-image ${item.crop}`} style={{ backgroundImage: `url(${item.image})` }}/><div><h3>{item.title}</h3><span>{item.variant} · Adet {item.quantity}</span></div><strong>{formatPrice(item.lineTotal)}</strong></article>)}</section>
      </div>

      <aside className="confirmation-summary"><p>Sipariş özeti</p><h2>{order.orderNumber}</h2><dl><div><dt>Ödeme yöntemi</dt><dd>{order.paymentMethod === "eft" ? "Havale / EFT" : "Kredi / banka kartı"}</dd></div><div><dt>Ara toplam</dt><dd>{formatPrice(order.subtotal)}</dd></div><div><dt>Kargo</dt><dd>{order.shipping === 0 ? "Ücretsiz" : formatPrice(order.shipping)}</dd></div><div className="total"><dt>Toplam</dt><dd>{formatPrice(order.total)}</dd></div></dl><div className="delivery-detail"><p>Teslimat</p><strong>{order.deliveryAddress.firstName} {order.deliveryAddress.lastName}</strong><span>{addressText(order)}</span><small>Standart teslimat · 2–4 iş günü</small></div><Link href="/hesabim">Hesabıma dön →</Link></aside>
    </section>
    <Footer/>
  </main>;
}
