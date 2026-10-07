import type { Metadata } from "next";
import { CatalogPageContent } from "@/components/CatalogPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { allProducts, type ProductCategory } from "@/data/products";
import { categoryLabels } from "@/lib/catalog";

export const metadata: Metadata = { title: "Tüm Ürünler | DESKOOM", description: "DESKOOM Work ve Kids koleksiyonlarındaki tüm ürünleri keşfedin." };

export default async function ProductsPage({ searchParams }: PageProps<"/urunler">) {
  const query = await searchParams;
  const requestedCategory = typeof query.kategori === "string" ? query.kategori : "all";
  const initialCategory = requestedCategory in categoryLabels ? requestedCategory as ProductCategory : "all";
  const heading = initialCategory === "all" ? "Tüm ürünler." : `${categoryLabels[initialCategory]}.`;
  return <main id="top"><Header/><header className="catalog-hero all"><div className="container"><p>DESKOOM seçkisi</p><h1>{heading}</h1><span>Work ve Kids dünyalarındaki işlevsel, kişisel ve iyi düşünülmüş tüm parçalar.</span></div></header><CatalogPageContent key={initialCategory} products={allProducts} initialCategory={initialCategory} showCollectionFilter/><Footer/></main>;
}
