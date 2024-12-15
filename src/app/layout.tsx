import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../components/nav-bar";
import Footer from "@/components/Footer";
import { WixClientContextProvider } from "@/context/wixContext";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce Application",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <WixClientContextProvider>
            <NavBar />
            {children}
            <Footer />
          </WixClientContextProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
