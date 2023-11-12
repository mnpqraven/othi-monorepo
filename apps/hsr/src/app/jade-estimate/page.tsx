import { EidolonTable } from "../components/Character/EidolonTable";
import { StateProvider } from "../components/StateProvider";
import JadeEstimateForm from "./JadeEstimateForm";
import JadeRewardTable from "./JadeRewardTable";

export default function Home({
  searchParams,
}: {
  searchParams: { chara: string };
}) {
  return (
    <main className="mt-4 flex w-screen flex-col items-center gap-4 md:flex-row md:items-start md:justify-evenly">
      <StateProvider devTools>
        <div className="w-11/12 md:w-[45%]">
          <JadeEstimateForm
            eidolonTableChildren={
              <EidolonTable
                characterId={Number(searchParams.chara)}
                searchParams={{ ...searchParams }}
              />
            }
          />
        </div>
        <div className="w-11/12 md:w-[45%]">
          <JadeRewardTable />
        </div>
      </StateProvider>
    </main>
  );
}
