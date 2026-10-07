"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { collectionLabels } from "@/lib/catalog";
import { HeartIcon } from "./Icons";
import { useWishlist } from "./WishlistProvider";

export function ProductCard({ product }: { product: Product }) {
  const { hasProduct, toggleProduct } = useWishlist();
  const saved = hasProduct(product.id);
  const collectionLabel = collectionLabels[product.collection];

  return <article className="product-card">
    <div className="product-media">
      <Link className="product-image-link" href={`/urun/${product.id}`} aria-label={`${product.name} ürününü incele`}>
        <div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={product.name} />
      </Link>
      <button className={`wishlist ${saved ? "is-saved" : ""}`} onClick={() => toggleProduct(product.id)} aria-pressed={saved} aria-label={`${product.name} ürününü istek ${saved ? "listesinden çıkar" : "listesine ekle"}`}><HeartIcon /></button>
    </div>
    <div className="price-badge">{product.price}</div>
    <div className="product-info"><span className="collection-label">{collectionLabel}</span><h3><Link href={`/urun/${product.id}`}>{product.name}</Link></h3><p>{product.variant}</p></div>
  </article>;
}
