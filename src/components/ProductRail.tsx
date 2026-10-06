"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductRail({ title, products, id, tabs }: { title: string; products: Product[]; id?: string; tabs?: string[] }) {
  const [activeTab, setActiveTab] = useState(tabs?.[0] ?? "All");
  const visibleProducts = activeTab === "All"
    ? products
    : products.filter((product) => product.collection === activeTab.toLowerCase());

  return <section className="commerce-section container" id={id}>
    <div className="commerce-heading"><h2>{title}</h2>{tabs ? <div className="product-tabs" aria-label="Product collections">{tabs.map((tab) => <button type="button" className={activeTab === tab ? "active" : ""} aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div> : <a className="outline-link" href="#shop">All products <span>→</span></a>}</div>
    <div className={tabs ? "product-rail" : "product-grid"}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    {tabs && <div className="rail-dots" aria-hidden="true"><i className="active"/><i/><i/><i/></div>}
  </section>;
}
