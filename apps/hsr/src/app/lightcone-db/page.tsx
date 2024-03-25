import { server } from "protocol/trpc";
import LightConeCatalogue from "./LightConeCatalogue";

export const metadata = {
  title: "Light Cone Database",
  description: "Honkai Star Rail Light Cone Database",
};

export default async function LightConeDb() {
  const lightCones = await server().honkai.lightCone.list();

  return (
    <main className="px-2 py-4 md:container md:px-0">
      <LightConeCatalogue list={lightCones} />
    </main>
  );
}
