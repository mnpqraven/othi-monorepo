import { AppProvider } from "@/components/providers/AppProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Merriweather_Sans } from "next/font/google";
import { Navbar } from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Merriweather_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Othi's DB Center ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          <Navbar />

          <main className="container">{children}</main>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
