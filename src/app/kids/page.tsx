import type { Metadata } from "next";
import { CatalogPageContent } from "@/components/CatalogPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { kidsProducts } from "@/data/products";

export const metadata: Metadata = { title: "Kids Koleksiyonu | DESKOOM", description: "DESKOOM Kids koleksiyonundaki çocuk ve genç odası ürünlerini keşfedin." };

export default function KidsPage() {
  return <main id="top"><Header/><header className="catalog-hero kids"><div className="container"><p>DESKOOM koleksiyonu</p><h1>Kids.</h1><span>Çocukların büyüyen dünyasına renk, karakter ve işlev katan parçalar.</span></div></header><CatalogPageContent products={kidsProducts}/><Footer/></main>;
}
