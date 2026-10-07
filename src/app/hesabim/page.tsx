import type { Metadata } from "next";
import { AccountPageContent } from "@/components/AccountPageContent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = { title: "Hesabım | DESKOOM", description: "DESKOOM profilinizi, siparişlerinizi ve istek listenizi yönetin." };

export default function AccountPage() {
  return <main id="top"><Header/><AccountPageContent/><Footer/></main>;
}
