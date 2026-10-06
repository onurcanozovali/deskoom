"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { BagIcon, HeartIcon } from "./Icons";

export function ProductCard({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);

  return <article className="product-card">
    <div className="product-media">
      <div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={product.name} />
      <button className={`wishlist ${saved ? "is-saved" : ""}`} onClick={() => setSaved(!saved)} aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`}><HeartIcon /></button>
      <button className="quick-add" onClick={() => { setAdded(true); window.setTimeout(() => setAdded(false), 1400); }}><BagIcon size={17} />{added ? "Added" : "Add to cart"}</button>
    </div>
    <div className="price-badge">{product.price}</div>
    <div className="product-info"><span className="collection-label">{product.collection}</span><h3>{product.name}</h3><p>{product.variant}</p></div>
  </article>;
}
