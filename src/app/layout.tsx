import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KiboCode — Belajar Coding Bersama Kibo",
  description:
    "Petualangan interaktif belajar logika pemrograman untuk anak SD bersama Kibo di Kibo World.",
  keywords: [
    "KiboCode",
    "Belajar Coding Anak",
    "Logika Pemrograman SD",
    "Edukasi Teknologi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className={plusJakartaSans.className}>
        <a href="#main-content" className="skip-link">
          Lewati ke Konten Utama
        </a>
        <Navbar />
        <main id="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
