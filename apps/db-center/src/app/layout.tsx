import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { AppProvider } from "@db-center/components/providers/AppProvider";
import { Navbar } from "@db-center/components/navbar/Navbar";
import { Toaster } from "ui/primitive";

export const metadata: Metadata = {
  title: "Othi's DB Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <AppProvider>
          <Navbar />
          <Toaster />

          <main className="px-4 py-8">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
