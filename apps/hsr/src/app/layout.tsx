import { Toaster } from "ui/primitive";
import { Merriweather_Sans } from "next/font/google";
import { headers } from "next/headers";
import Navbar from "./components/Navbar";
import { AppProvider } from "./components/Providers";
import "@hsr/css/globals.css";

const font = Merriweather_Sans({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Honkai Star Rail Gacha Planner",
  description: "Honkai Star Rail Gacha Planner",
};

interface RootProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <AppProvider headers={headers()}>
          <Navbar />
          <Toaster />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
