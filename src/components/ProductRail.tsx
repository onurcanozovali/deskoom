"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductRail({ title, products, id, tabs }: { title: string; products: Product[]; id?: string; tabs?: string[] }) {
  const [activeTab, setActiveTab] = useState(tabs?.[0] ?? "all");
  const visibleProducts = activeTab === "all"
    ? products
    : products.filter((product) => product.collection === activeTab);
  const tabLabels: Record<string, string> = { all: "Tümü", work: "Work", kids: "Kids" };

  return <section className="commerce-section container" id={id}>
    <div className="commerce-heading"><h2>{title}</h2>{tabs ? <div className="product-tabs" aria-label="Ürün koleksiyonları">{tabs.map((tab) => <button type="button" className={activeTab === tab ? "active" : ""} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}>{tabLabels[tab]}</button>)}</div> : <Link className="outline-link" href="/urunler">Tüm ürünler <span>→</span></Link>}</div>
    <div className={tabs ? "product-rail" : "product-grid"}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    {tabs && <div className="rail-dots" aria-hidden="true"><i className="active"/><i/><i/><i/></div>}
  </section>;
}
