import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LoginPanel } from "@/components/LoginPanel";

export const metadata: Metadata = { title: "Giriş Yap | DESKOOM", description: "DESKOOM hesabınıza giriş yapın." };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ yonlendir?: string | string[] }> }) {
  const query = await searchParams;
  const requestedPath = typeof query.yonlendir === "string" ? query.yonlendir : "/hesabim";
  const nextPath = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/hesabim";

  return <main id="top">
    <Header/>
    <section className="auth-page">
      <div className="auth-visual"><div><p>Üyeliksiz alışveriş</p><h2>Seçmek için hesaba ihtiyacınız yok.</h2><span>Sepetinizi misafir olarak oluşturun. Yalnızca ödeme adımına geldiğinizde giriş yapın.</span><div><b>01</b> Sepetiniz korunur</div><div><b>02</b> İstek listeniz saklanır</div><div><b>03</b> Demo giriş tek tık sürer</div></div></div>
      <div className="auth-form-side"><LoginPanel nextPath={nextPath}/></div>
    </section>
    <Footer/>
  </main>;
}
