import type { Metadata } from "next";
import { CatalogPageContent } from "@/components/CatalogPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { allProducts } from "@/data/products";

export const metadata: Metadata = { title: "Arama | DESKOOM", description: "DESKOOM ürünlerinde arama yapın." };

export default async function SearchPage({ searchParams }: PageProps<"/arama">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  return <main id="top"><Header/><header className="catalog-hero search"><div className="container"><p>Ürün arama</p><h1>{query ? `“${query}”` : "Ne arıyorsunuz?"}</h1><span>{query ? "Ürün adı, kategori, renk, malzeme ve koleksiyon eşleşmeleri." : "Arama alanından ürün adı, kategori, renk veya malzeme yazabilirsiniz."}</span></div></header><CatalogPageContent key={query} products={allProducts} searchQuery={query} showCollectionFilter/><Footer/></main>;
}
