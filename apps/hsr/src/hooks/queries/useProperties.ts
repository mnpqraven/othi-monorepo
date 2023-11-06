import { AvatarPropertyConfig } from "@hsr/bindings/AvatarPropertyConfig";
import { List } from "@hsr/lib/generics";
import API from "@hsr/server/typedEndpoints";
import {
  UseQueryOptions,
  UseSuspenseQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const optionsProperties = () =>
  queryOptions<List<AvatarPropertyConfig>, unknown, AvatarPropertyConfig[]>({
    queryKey: ["properties"],
    queryFn: async () => await API.properties.get(),
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
