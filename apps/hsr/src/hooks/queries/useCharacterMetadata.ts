import type { AvatarConfig } from "@hsr/bindings/AvatarConfig";
import API from "@hsr/server/typedEndpoints";
import type {
  UseQueryOptions,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const optionCharacterMetadata = (charId: number | undefined) =>
  queryOptions<AvatarConfig>({
    queryKey: ["character", charId],
    queryFn: () => API.character.get({ characterId: charId }),
    enabled: Boolean(charId),
  });

export function useCharacterMetadata(
  characterId: number | undefined,
  opt: Options = {}
) {
  const query = useQuery({
    ...optionCharacterMetadata(characterId),
    ...opt,
  });

  return query;
}

export function useSuspendedCharacterMetadata(
  characterId: number | undefined,
  opt: SuspendedOptions = {}
) {
  const query = useQuery({
    ...optionCharacterMetadata(characterId),
    ...opt,
  });

  return query;
}

type Options = Omit<
  UseQueryOptions<AvatarConfig>,
  "queryKey" | "queryFn" | "enabled"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<AvatarConfig>,
  "queryKey" | "queryFn"
>;
