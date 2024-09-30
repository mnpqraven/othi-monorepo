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
      <body className={cn(GeistSans.className, "h-screen")}>
        <AppProvider>
          <AppListener>
            <Navbar />

            <main className="h-[100vh-32px] flex flex-col">{children}</main>

            <ToasterSonner />
            <Toaster />
            <MainCommandCenter />
          </AppListener>
        </AppProvider>
      </body>
    </html>
  );
}
