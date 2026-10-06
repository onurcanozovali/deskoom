import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const editorial = Instrument_Serif({ variable: "--font-editorial", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "DESKOOM — Alanını Kendine Göre Tasarla.",
  description: "Çalıştığınız, yaşadığınız ve büyüdüğünüz alanlar için işlevsel ürünler, aydınlatma ve aksesuarlar.",
  keywords: ["masa aksesuarları", "çalışma alanı", "ev ofis", "aydınlatma", "çocuk odası", "DESKOOM"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${editorial.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
