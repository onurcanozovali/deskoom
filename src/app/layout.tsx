import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const editorial = Instrument_Serif({ variable: "--font-editorial", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "DESKOOM — Build a better space.",
  description: "Thoughtful desk accessories, ergonomic essentials and workspace decor for work, play and everything in between.",
  keywords: ["desk accessories", "workspace", "home office", "ergonomic", "DESKOOM"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${editorial.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
