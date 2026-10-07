"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { allProducts, formatPrice, priceToNumber } from "@/data/products";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";

const FREE_SHIPPING_LIMIT = 1500;

export function CartPageContent() {
  const { items, ready, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const cartProducts = useMemo(() => items.flatMap((item) => {
    const product = allProducts.find((candidate) => candidate.id === item.productId);
    return product ? [{ ...item, product }] : [];
  }), [items]);
  const subtotal = cartProducts.reduce((total, item) => total + priceToNumber(item.product.price) * item.quantity, 0);
  const remainingForShipping = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_LIMIT) * 100);
  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/giris?yonlendir=%2Fsepet");
      return;
    }
    setCheckoutMessage("Oturumunuz doğrulandı. Güvenli ödeme entegrasyonu için hazırsınız.");
  };

  if (!ready) {
    return <section className="cart-shell container" aria-busy="true" aria-label="Sepet yükleniyor"><div className="cart-loading"/><div className="cart-loading summary"/></section>;
  }

  if (cartProducts.length === 0) {
    return <section className="empty-cart container">
      <div className="empty-cart-image" role="img" aria-label="DESKOOM çalışma ve yaşam alanı"/>
      <div className="empty-cart-copy"><p>Sepetiniz</p><h2>Alanınız için ilk parçayı seçin.</h2><span>Çalışma masanızdan çocuk odasına, işlevsel ve kişisel DESKOOM ürünlerini keşfedin.</span><Link className="corner-button" href="/#shop">Ürünleri keşfet <b>→</b></Link></div>
    </section>;
  }

  return <section className="cart-shell container">
    <div className="cart-items">
      <div className="cart-list-heading"><p>{itemCount} ürün</p><button type="button" onClick={clearCart}>Sepeti boşalt</button></div>
      {cartProducts.map(({ product, quantity }) => <article className="cart-item" key={product.id}>
        <Link className="cart-item-image" href={`/urun/${product.id}`} aria-label={`${product.name} ürününü incele`}><div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }}/></Link>
        <div className="cart-item-main">
          <p>{product.collection === "work" ? "DESKOOM Çalışma" : "DESKOOM Çocuk"}</p>
          <h2><Link href={`/urun/${product.id}`}>{product.name}</Link></h2>
          <span>{product.variant}</span>
          <button className="cart-remove" type="button" onClick={() => removeItem(product.id)}>Kaldır</button>
        </div>
        <div className="cart-item-controls">
          <strong>{formatPrice(priceToNumber(product.price) * quantity)}</strong>
          <div className="cart-quantity" role="group" aria-label={`${product.name} adedi`}>
            <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={`${product.name} adedini azalt`}>−</button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={`${product.name} adedini artır`}>+</button>
          </div>
        </div>
      </article>)}
      <Link className="continue-shopping" href="/#shop">← Alışverişe devam et</Link>
    </div>

    <aside className="cart-summary" aria-labelledby="summary-title">
      <p>Sipariş özeti</p><h2 id="summary-title">Sepet toplamı</h2>
      <div className="shipping-progress"><span style={{ width: `${shippingProgress}%` }}/></div>
      <p className="shipping-message">{remainingForShipping > 0 ? `Ücretsiz kargo için ${formatPrice(remainingForShipping)} daha ekleyin.` : "Ücretsiz kargo kazandınız."}</p>
      <dl><div><dt>Ara toplam</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Kargo</dt><dd>{remainingForShipping === 0 ? "Ücretsiz" : "Ödeme adımında"}</dd></div><div className="summary-total"><dt>Tahmini toplam</dt><dd>{formatPrice(subtotal)}</dd></div></dl>
      <button className="checkout-button" type="button" onClick={handleCheckout}>Güvenli ödemeye geç <span>→</span></button>
      <p className="checkout-message" aria-live="polite">{checkoutMessage || (isAuthenticated ? "Oturumunuz açık. Ödeme adımına güvenle devam edebilirsiniz." : "Ödeme adımında giriş yapmanız istenir; sepetiniz kaybolmaz.")}</p>
      <div className="accepted-payments" aria-label="Ödeme avantajları"><span>Güvenli ödeme</span><span>Kolay iade</span></div>
    </aside>
  </section>;
}
