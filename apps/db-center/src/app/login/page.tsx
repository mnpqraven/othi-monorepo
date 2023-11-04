import { authOptions } from "@db-center/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");

  return <LoginForm />;
}
