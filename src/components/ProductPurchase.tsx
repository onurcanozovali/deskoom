"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { HeartIcon } from "./Icons";
import { useWishlist } from "./WishlistProvider";

export function ProductPurchase({ productId, productName }: { productId: string; productName: string }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { hasProduct, toggleProduct } = useWishlist();
  const saved = hasProduct(productId);

  const handleAdd = () => {
    addItem(productId, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return <div className="purchase-block">
    <div className="purchase-actions">
      <div className="quantity-control" role="group" aria-label="Ürün adedi">
        <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Adedi azalt">−</button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" onClick={() => setQuantity((current) => current + 1)} aria-label="Adedi artır">+</button>
      </div>
      <button className="detail-add-button" type="button" onClick={handleAdd}>{added ? "Sepete eklendi" : "Sepete ekle"}<span>→</span></button>
      <button className={`detail-wishlist ${saved ? "is-saved" : ""}`} type="button" onClick={() => toggleProduct(productId)} aria-pressed={saved} aria-label={`${productName} ürününü istek ${saved ? "listesinden çıkar" : "listesine ekle"}`}><HeartIcon /></button>
    </div>
    <p className="purchase-note" aria-live="polite">{added ? `${quantity} adet ${productName} sepetinize eklendi.` : "Güvenli ödeme · Kolay iade · ₺1.500 üzeri ücretsiz kargo"}</p>
  </div>;
}
