import getQueryClient from "@hsr/lib/queryClientHelper";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { lightConesQ } from "@hsr/hooks/queries/lightcone";
import LightConeCatalogue from "./LightConeCatalogue";

export const metadata = {
  title: "Light Cone Database",
  description: "Honkai Star Rail Light Cone Database",
};

export default async function LightConeDb() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(lightConesQ());

  return (
    <main className="px-2 py-4 md:container md:px-0">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LightConeCatalogue />
      </HydrationBoundary>
    </main>
  );
}
