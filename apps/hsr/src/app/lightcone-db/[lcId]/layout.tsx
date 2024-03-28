import { cn } from "lib";

interface Prop {
  children: React.ReactNode;
}
export default function Layout({ children }: Prop) {
  return (
    <main
      className={cn(
        "container flex flex-col px-2 pt-4 sm:px-8 md:flex-row",
        "max-h-[calc(100vh-3rem)]",
        "[&>*]:max-h-[calc(100vh-4rem)]",
      )}
    >
      {children}
    </main>
  );
}
