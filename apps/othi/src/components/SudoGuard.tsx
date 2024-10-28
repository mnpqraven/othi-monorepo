import { getServerSession } from "next-auth";
import { isSuperAdmin } from "auth";
import { Suspense, type ReactNode } from "react";

interface Prop {
  children: ReactNode;
  level?: "authed" | "sudo";
  fallback?: ReactNode;
}
export function SudoGuard(props: Prop) {
  const { fallback, ...rest } = props;
  return (
    <Suspense fallback={fallback ?? null}>
      <InnerRSC {...rest} />
    </Suspense>
  );
}

async function InnerRSC({ children, level: _ }: Omit<Prop, "fallback">) {
  const isSudo = await isSuperAdmin({
    sessionFn: getServerSession,
  });

  if (!isSudo) return null;

  return <>{children}</>;
}
