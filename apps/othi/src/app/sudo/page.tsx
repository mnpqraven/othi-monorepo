import Link from "next/link";
import { Button } from "ui/primitive";

export default function Page() {
  const routes = [
    { path: "/whoami", label: "Auth" },
    { path: "/sudo/blog_tags", label: "Blog Tags" },
  ];
  return (
    <div className="flex gap-4">
      {routes.map(({ path, label }) => (
        <Link href={path} key={path}>
          <Button variant="outline">{label}</Button>
        </Link>
      ))}
    </div>
  );
}
