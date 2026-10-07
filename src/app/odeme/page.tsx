import type { Metadata } from "next";
import { CheckoutPageContent } from "@/components/CheckoutPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { isPaytrConfigured } from "@/lib/payments/paytr";

export const metadata: Metadata = { title: "Güvenli Ödeme | DESKOOM", description: "DESKOOM siparişinizin teslimat ve ödeme bilgilerini güvenle tamamlayın." };
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return <main id="top"><Header/><header className="checkout-heading container"><p>DESKOOM güvenli ödeme</p><h1>Ödeme.</h1><span>Sepetiniz korunur. Ödeme yalnızca doğrulanmış sağlayıcı bildirimiyle tamamlanır.</span></header><CheckoutPageContent paytrConfigured={isPaytrConfigured()}/><Footer/></main>;
}
