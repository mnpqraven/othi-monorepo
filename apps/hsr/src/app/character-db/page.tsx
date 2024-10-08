import { trpcServer } from "protocol/trpc/react/server";
import CharacterCatalogue from "./CharacterCatalogue";

export const metadata = {
  title: "Character Database",
  description: "Honkai Star Rail Character Database",
};

export default async function CharacterDb() {
  const characters = await trpcServer.honkai.avatar.list({});

  return (
    <main className="px-2 py-4 md:container md:px-0">
      <CharacterCatalogue list={characters} />
    </main>
  );
}
