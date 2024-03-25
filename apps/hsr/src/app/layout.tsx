import { Toaster } from "ui/primitive";
import { GeistSans } from "geist/font/sans";
import { headers } from "next/headers";
import Navbar from "./components/Navbar";
import { AppProvider } from "./components/Providers";
import "@hsr/css/globals.css";

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
      <body className={GeistSans.className}>
        <AppProvider headers={headers()}>
          <Navbar />
          <Toaster />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
