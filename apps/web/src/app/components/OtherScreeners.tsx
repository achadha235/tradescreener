import useScreeners from "@/client/getAllScreeners";
import { ScreenerCard } from "./ScreenerCard";

export function OtherScreeners() {
  const { data, isLoading } = useScreeners();
  if (isLoading) {
    return null;
  }
  return (
    <div>
      <div className="flex flex-col gap-2 py-10">
        <div className="text-4xl">💡Other Ideas</div>
        <div className="font-normal text-xl">
          Check out some of these other screeners while you wait.
        </div>
      </div>
      <div className="relative gap-4 grid grid-cols-2 grid-rows-1 overflow-x-scroll overflow-y-hidden">
        {data.screeners.map((screener) => {
          return <ScreenerCard key={screener.id} screener={screener} />;
        })}
      </div>
    </div>
  );
}
