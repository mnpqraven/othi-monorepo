import API from "@hsr/server/typedEndpoints";
import { useQuery } from "@tanstack/react-query";

export const useFuturePatchDateList = () => {
  const { data: futurePatchDateList } = useQuery({
    queryKey: ["patchDates"],
    queryFn: async () => await API.patchDates.get(),
    select: (data) => data.list,
    initialData: { list: [] },
  });

  return { futurePatchDateList };
};
