"use client";
import { useState } from "react";
import type { Product } from "@/data/products";
import { HeartIcon } from "./Icons";
export function ProductCard({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false); const [added, setAdded] = useState(false);
  return <article className="product-card"><div className="product-media"><div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={product.name} />{product.hoverImage && <div className="product-hover" style={{ backgroundImage: `url(${product.hoverImage})` }} />}<button className={`wishlist ${saved ? "is-saved" : ""}`} onClick={() => setSaved(!saved)} aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`}><HeartIcon /></button><button className="quick-add" onClick={() => { setAdded(true); window.setTimeout(() => setAdded(false), 1600); }}>{added ? "Added" : "Quick add"}</button></div><div className="product-info"><div><h3>{product.name}</h3>{product.variant && <p>{product.variant}</p>}</div><span>{product.price}</span></div></article>;
}
