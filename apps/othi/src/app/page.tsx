import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Othi's box",
  description: "My personal site",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Othi&apos;s ramblings</h1>
      <h2>Blogs, rants and random snippets regarding tech, gaming and music</h2>
    </div>
  );
}
