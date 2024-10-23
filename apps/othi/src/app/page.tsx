import { Metadata } from "next";
import { Authed } from "./Authed";

export const metadata: Metadata = {
  title: "Othi's box",
  description: "My personal site",
};

export default function Page() {
  return <Authed />;
}
