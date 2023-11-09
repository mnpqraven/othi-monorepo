import { Toaster } from "ui/primitive";
import { Merriweather_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
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
        <Providers>
          <Navbar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
