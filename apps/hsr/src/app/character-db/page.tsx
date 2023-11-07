import getQueryClient from "@hsr/lib/queryClientHelper";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { characterMetadatasQ } from "@hsr/hooks/queries/character";
import CharacterCatalogue from "./CharacterCatalogue";

export const metadata = {
  title: "Character Database",
  description: "Honkai Star Rail Character Database",
};

export default async function CharacterDb() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(characterMetadatasQ());

  return (
    <main className="px-2 py-4 md:container md:px-0">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CharacterCatalogue />
      </HydrationBoundary>
    </main>
  );
}
