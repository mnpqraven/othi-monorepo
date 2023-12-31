import type { Metadata } from "next";

interface Prop {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Gacha Probability",
  description:
    "Probability of pulling a specific character/light cone in X amount of pulls",
};
export default function Layout({ children }: Prop) {
  return <main className="flex flex-col items-center">{children}</main>;
}
