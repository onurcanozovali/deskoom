"use client";

import Link from "next/link";
import { useState } from "react";
import { allProducts } from "@/data/products";
import { collectionLabels } from "@/lib/catalog";
import { useCart } from "./CartProvider";
import { HeartIcon } from "./Icons";
import { useWishlist } from "./WishlistProvider";

export function WishlistPageContent() {
  const { productIds, ready, removeProduct } = useWishlist();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const products = productIds.flatMap((id) => {
    const product = allProducts.find((item) => item.id === id);
    return product ? [product] : [];
  });

  const addToCart = (productId: string) => {
    addItem(productId);
    setAddedId(productId);
    window.setTimeout(() => setAddedId((current) => current === productId ? null : current), 1500);
  };

  if (!ready) return <section className="wishlist-shell container" aria-busy="true"><div className="wishlist-loading"/></section>;

  if (products.length === 0) {
    return <section className="wishlist-empty container">
      <div className="wishlist-empty-art"><HeartIcon size={42}/></div>
      <div><p>İstek listeniz</p><h2>Sevdiklerinizi burada biriktirin.</h2><span>Ürünlerdeki kalp simgesine dokunun; ilham veren parçalar sizi burada beklesin.</span><Link className="corner-button" href="/urunler">Ürünleri keşfet <b>→</b></Link></div>
    </section>;
  }

  return <section className="wishlist-shell container">
    <div className="wishlist-toolbar"><p>{products.length} kayıtlı ürün</p><span>İstek listeniz bu tarayıcıda otomatik olarak saklanır.</span></div>
    <div className="wishlist-grid">{products.map((product) => <article className="wishlist-card" key={product.id}>
      <div className="wishlist-card-media"><Link href={`/urun/${product.id}`} aria-label={`${product.name} ürününü incele`}><div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }}/></Link><button type="button" onClick={() => removeProduct(product.id)} aria-label={`${product.name} ürününü istek listesinden çıkar`}><HeartIcon/></button></div>
      <div className="wishlist-card-info"><div><p>DESKOOM {collectionLabels[product.collection]}</p><h2><Link href={`/urun/${product.id}`}>{product.name}</Link></h2><span>{product.variant}</span></div><strong>{product.price}</strong></div>
      <button className="wishlist-add" type="button" onClick={() => addToCart(product.id)}>{addedId === product.id ? "Sepete eklendi" : "Sepete ekle"}<span>→</span></button>
    </article>)}</div>
  </section>;
}
