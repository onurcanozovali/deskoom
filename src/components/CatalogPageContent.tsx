"use client";

import { useMemo, useState } from "react";
import type { Collection, Product, ProductCategory } from "@/data/products";
import { priceToNumber } from "@/data/products";
import { categoryLabels, collectionLabels, matchesProductQuery } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

type CategoryFilter = "all" | ProductCategory;
type CollectionFilter = "all" | Collection;
type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function CatalogPageContent({ products, initialCategory = "all", searchQuery = "", showCollectionFilter = false }: { products: Product[]; initialCategory?: CategoryFilter; searchQuery?: string; showCollectionFilter?: boolean }) {
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [collection, setCollection] = useState<CollectionFilter>("all");
  const [variant, setVariant] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const variants = useMemo(() => Array.from(new Set(products.map((product) => product.variant).filter((item): item is string => Boolean(item)))).sort((a, b) => a.localeCompare(b, "tr")), [products]);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (!matchesProductQuery(product, searchQuery)) return false;
      if (category !== "all" && product.category !== category) return false;
      if (collection !== "all" && product.collection !== collection) return false;
      if (variant !== "all" && product.variant !== variant) return false;
      return true;
    });
    if (sort === "price-asc") return [...filtered].sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
    if (sort === "price-desc") return [...filtered].sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
    if (sort === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name, "tr"));
    return filtered;
  }, [category, collection, products, searchQuery, sort, variant]);
  const activeFilterCount = Number(category !== "all") + Number(collection !== "all") + Number(variant !== "all");

  const clearFilters = () => {
    setCategory("all");
    setCollection("all");
    setVariant("all");
    setSort("featured");
  };

  return <section className="catalog-shell container">
    <div className="catalog-toolbar"><div><strong>{visibleProducts.length}</strong><span>ürün</span></div><button className="catalog-filter-toggle" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((current) => !current)}>Filtreler {activeFilterCount > 0 && <b>{activeFilterCount}</b>}<span>{filtersOpen ? "−" : "+"}</span></button><label className="catalog-sort"><span>Sırala</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="featured">Önerilen</option><option value="price-asc">Fiyat: artan</option><option value="price-desc">Fiyat: azalan</option><option value="name">Ürün adı</option></select></label></div>
    <div className={`catalog-content ${filtersOpen ? "filters-open" : ""}`}>
      <aside className="catalog-filters" aria-label="Ürün filtreleri">
        <div className="filter-heading"><p>Filtrele</p>{activeFilterCount > 0 && <button type="button" onClick={clearFilters}>Temizle</button>}</div>
        {showCollectionFilter && <fieldset><legend>Koleksiyon</legend><label><input type="radio" name="collection" checked={collection === "all"} onChange={() => setCollection("all")}/><span>Tümü</span></label>{(["work", "kids"] as const).map((item) => <label key={item}><input type="radio" name="collection" checked={collection === item} onChange={() => setCollection(item)}/><span>{collectionLabels[item]}</span></label>)}</fieldset>}
        <fieldset><legend>Kategori</legend><label><input type="radio" name="category" checked={category === "all"} onChange={() => setCategory("all")}/><span>Tümü</span></label>{(Object.entries(categoryLabels) as Array<[ProductCategory, string]>).map(([value, label]) => <label key={value}><input type="radio" name="category" checked={category === value} onChange={() => setCategory(value)}/><span>{label}</span></label>)}</fieldset>
        <label className="variant-filter"><span>Renk / seçenek</span><select value={variant} onChange={(event) => setVariant(event.target.value)}><option value="all">Tümü</option>{variants.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <button className="mobile-apply-filter" type="button" onClick={() => setFiltersOpen(false)}>{visibleProducts.length} ürünü göster</button>
      </aside>
      <div className="catalog-results">{visibleProducts.length > 0 ? <div className="catalog-product-grid">{visibleProducts.map((product) => <ProductCard product={product} key={product.id}/>)}</div> : <div className="catalog-empty"><p>Sonuç bulunamadı</p><h2>Filtreleri biraz genişletin.</h2><span>Aradığınız ürünü bulmak için renk veya kategori seçimini temizleyebilirsiniz.</span><button className="outline-link" type="button" onClick={clearFilters}>Filtreleri temizle <b>→</b></button></div>}</div>
    </div>
  </section>;
}
