import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { Navbar } from "@/components/layout/Navbar";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Cozy Crochet | Redefined Luxury",
  description: "A premium brutalist e-commerce experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <CustomCursor />
        <SmoothScroll>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
