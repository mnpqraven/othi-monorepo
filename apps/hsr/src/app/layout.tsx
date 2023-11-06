import { Toaster } from "ui/primitive";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";
import "@hsr/css/globals.css";
import { Merriweather_Sans } from "next/font/google";

const inter = Merriweather_Sans({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Honkai Star Rail Gacha Planner",
  description: "Honkai Star Rail Gacha Planner",
};

type RootProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
