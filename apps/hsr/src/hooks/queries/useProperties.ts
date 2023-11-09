import type { AvatarPropertyConfig } from "@hsr/bindings/AvatarPropertyConfig";
import API from "@hsr/server/typedEndpoints";
import type {
  UseQueryOptions,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { List } from "lib/generics";

export const optionsProperties = () =>
  queryOptions<List<AvatarPropertyConfig>, unknown, AvatarPropertyConfig[]>({
    queryKey: ["properties"],
    queryFn: API.properties.get,
    select: (data) => data.list,
  });

export function useProperties(opt: Options = {}) {
  const query = useQuery({
    ...optionsProperties(),
    ...opt,
  });
  return query;
}

export function useSuspendedProperties(opt: SuspendedOptions = {}) {
  const query = useSuspenseQuery({
    ...optionsProperties(),
    ...opt,
  });
  return query;
}

type Options = Omit<
  UseQueryOptions<List<AvatarPropertyConfig>, unknown, AvatarPropertyConfig[]>,
  "queryKey" | "queryFn" | "select"
>;

type SuspendedOptions = Omit<
  UseSuspenseQueryOptions<
    List<AvatarPropertyConfig>,
    unknown,
    AvatarPropertyConfig[]
  >,
  "queryKey" | "queryFn" | "select"
>;
