import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WishlistPageContent } from "@/components/WishlistPageContent";

export const metadata: Metadata = { title: "İstek Listem | DESKOOM", description: "Beğendiğiniz DESKOOM ürünlerini saklayın ve dilediğinizde sepetinize ekleyin." };

export default function WishlistPage() {
  return <main id="top"><Header/><header className="cart-page-heading container"><p>DESKOOM</p><h1>İstek listeniz.</h1><span>İlham veren parçalar, sizin için bir arada.</span></header><WishlistPageContent/><Footer/></main>;
}
