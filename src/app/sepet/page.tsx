import type { Metadata } from "next";
import { CartPageContent } from "@/components/CartPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Sepet | DESKOOM",
  description: "DESKOOM sepetinizdeki ürünleri inceleyin ve adetlerini düzenleyin.",
};

export default function CartPage() {
  return <main id="top">
    <Header />
    <header className="cart-page-heading container"><p>DESKOOM</p><h1>Sepetiniz.</h1><span>Alanınız için seçtiğiniz parçaları gözden geçirin.</span></header>
    <CartPageContent />
    <section className="cart-assurances container" aria-label="Alışveriş avantajları"><div><span>01</span><strong>Güvenli ödeme</strong><p>Ödeme bilgileriniz koruma altında.</p></div><div><span>02</span><strong>Kolay iade</strong><p>Kullanılmamış ürünlerde 14 gün içinde iade.</p></div><div><span>03</span><strong>Özenli paketleme</strong><p>Her sipariş güvenle hazırlanır.</p></div></section>
    <Footer />
  </main>;
}
