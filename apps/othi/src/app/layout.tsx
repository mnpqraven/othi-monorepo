import "@othi/css/globals.css";
import "jotai-devtools/styles.css";

import { AppProvider } from "@othi/components/AppProvider";
import { AppListener } from "@othi/components/AppListener";
import { Toaster } from "ui/primitive";
import { ToasterSonner } from "ui/primitive/sonner";
import { GeistSans } from "geist/font/sans";
import { Navbar } from "@othi/components/Navbar";
import { MainCommandCenter } from "@othi/components/MainCommandCenter";
import { cn } from "lib";
import { ScrollToTop } from "@othi/components/ScrollToTop";

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
      <body className={cn(GeistSans.className)}>
        <AppProvider>
          <AppListener>
            <Navbar />

            <main className="flex flex-col">
              <div className="p-4 md:w-2/3 justify-center place-self-center">
                {children}
              </div>
            </main>

            <ScrollToTop />
            <ToasterSonner />
            <Toaster />
            <MainCommandCenter />
          </AppListener>
        </AppProvider>
      </body>
    </html>
  );
}
