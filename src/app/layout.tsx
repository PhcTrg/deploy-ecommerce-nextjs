import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "../components/nav-bar";
import ClientProviders from "./providers";
import Footer from "@/components/footer";

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
        <ClientProviders>
          <NavBar />
          {children}
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
