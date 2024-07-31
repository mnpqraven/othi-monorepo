import type { ReactNode } from "react";
import { CreateTaskSheet } from "./CreateTaskSheet";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CreateTaskSheet />
    </>
  );
}
