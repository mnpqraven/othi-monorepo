import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Othi's box",
  description: "My personal site",
};

export default function Page() {
  return redirect("/blog");
}
