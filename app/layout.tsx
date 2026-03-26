import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CalcHub",
  description: "Free online calculators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full overflow-x-hidden antialiased scroll-smooth`}>
      {/* 
        Global background: very subtle slate-50 base 
        with a soft, fixed radial gradient to add depth without distracting 
      */}
      <body className="relative min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-900">
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 pointer-events-none" />
        
        <Navbar />
        
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 relative z-0">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
