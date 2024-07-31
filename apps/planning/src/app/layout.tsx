import "./globals.css";
import "jotai-devtools/styles.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { AppProvider } from "@planning/components/providers/AppProvider";
import { Navbar } from "@planning/components/navbar/Navbar";
import { Toaster } from "ui/primitive";

export const metadata: Metadata = {
  title: "Othi's gacha planner",
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

          <main className="px-4 py-8">{children}</main>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
