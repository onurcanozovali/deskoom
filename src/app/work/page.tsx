import type { Metadata } from "next";
import { CatalogPageContent } from "@/components/CatalogPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { workProducts } from "@/data/products";

export const metadata: Metadata = { title: "Work Koleksiyonu | DESKOOM", description: "DESKOOM Work koleksiyonundaki çalışma alanı ürünlerini keşfedin." };

export default function WorkPage() {
  return <main id="top"><Header/><header className="catalog-hero work"><div className="container"><p>DESKOOM koleksiyonu</p><h1>Work.</h1><span>Daha sakin, düzenli ve iyi çalışan masalar için tasarlanan işlevsel parçalar.</span></div></header><CatalogPageContent products={workProducts}/><Footer/></main>;
}
