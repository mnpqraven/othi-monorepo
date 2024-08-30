import "@othi/css/globals.css";
import "jotai-devtools/styles.css";

import { AppProvider } from "@othi/components/AppProvider";
import { AppListener } from "@othi/components/AppListener";
import { Toaster } from "ui/primitive";
import { GeistSans } from "geist/font/sans";
import { Navbar } from "@othi/components/Navbar";
import { MainCommandCenter } from "@othi/components/MainCommandCenter";

export const metadata = {
  title: "Othi",
  description: "Othi's site",
};

interface RootProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <AppProvider>
          <AppListener>
            <Navbar />

            <main>{children}</main>

            <Toaster />
            <MainCommandCenter />
          </AppListener>
        </AppProvider>
      </body>
    </html>
  );
}
