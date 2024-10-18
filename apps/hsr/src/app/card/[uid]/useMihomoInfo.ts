"use client";

import type {
  UseQueryOptions,
  UseSuspenseQueryOptions,
} from "@tanstack/react-query";
import {
  queryOptions,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { env } from "env";
import type { LANGS } from "@hsr/lib/constants";
import { useToast } from "ui/primitive";
import type { MihomoResponse } from "../types";

interface ProfileParam {
  uid: string;
  lang: Lang;
}

export const optionsMihomoInfo = (
  uid: string | undefined,
  lang: Lang = "en",
  isServer = false,
) =>
  queryOptions<MihomoResponse, Error, MihomoResponse>({
    queryKey: ["mihoyoInfo", uid, lang, isServer],
    queryFn: () =>
      uid
        ? getMihomoInfo(
          uid,
          lang,
          isServer ? env.NEXT_PUBLIC_HOST_HSR : undefined,
        )
        : Promise.reject(new Error()),
    enabled: Boolean(uid),
  });

export function useMihomoInfo(
  { uid, lang }: Partial<ProfileParam>,
  opt: Options = {},
) {
  const displayToast = opt.displayToast ?? true;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    ...optionsMihomoInfo(uid, lang),
    enabled: Boolean(uid) && uid !== "",
    ...opt,
  });

  function prefetch(uid: string, lang: Lang = "en") {
    void queryClient.prefetchQuery(optionsMihomoInfo(uid, lang));
  }

  useEffect(() => {
    if (query.error && displayToast) {
      toast({
        variant: "destructive",
        title: "Error encountered",
        description: query.error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.error]);

  return { query, prefetch };
}

export function useSuspendedMihomoInfo(
  { uid, lang }: Partial<ProfileParam>,
  opt: SuspendedOptions = {},
) {
  const displayToast = opt.displayToast ?? true;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useSuspenseQuery({
    ...optionsMihomoInfo(uid, lang, true),
    ...opt,
  });

  function prefetch(uid: string, lang: Lang = "en") {
    void queryClient.prefetchQuery(optionsMihomoInfo(uid, lang, true));
  }

  useEffect(() => {
    if (Boolean(query.error) && displayToast) {
      toast({
        variant: "destructive",
        title: "Error encountered",
        description: "ree",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.error]);

  return { query, prefetch };
}

export async function getMihomoInfo(
  uid: string,
  lang = "en",
  host?: string,
): Promise<MihomoResponse> {
  let url = `/api/profile/${uid}?lang=${lang}`;
  if (host) url = host + url;
  const response = await fetch(url);
  if (!response.ok) {
    return response.json().then(({ error }: { error: string }) => {
      return Promise.reject(new Error(error));
    });
  }
  return response.json() as Promise<MihomoResponse>;
}

type Lang = (typeof LANGS)[number];

interface Options
  extends Omit<
    UseQueryOptions<MihomoResponse, Error, MihomoResponse>,
    "queryKey" | "queryFn"
  > {
  displayToast?: boolean;
}

interface SuspendedOptions
  extends Omit<
    UseSuspenseQueryOptions<MihomoResponse, Error, MihomoResponse>,
    "queryKey" | "queryFn"
  > {
  displayToast?: boolean;
}
