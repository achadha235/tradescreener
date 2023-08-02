import useScreeners from "@/client/getAllScreeners";
import LoadingScreen from "./LoadingScreen";
import Link from "next/link";
import { Chip, Skeleton } from "@mui/material";
import { range } from "lodash";

function ScreenerTickers({ screener }) {
  const numTickers = screener.screenerData.tickers.length;
  const displayTickers = screener.screenerData.tickers.slice(0, 3);
  return (
    <span className={"text-sm"}>
      {displayTickers.map((ticker) => {
        return (
          <span className="inline" key={ticker}>
            <Chip
              className="mx-[2px]"
              color="secondary"
              size="small"
              label={ticker}
            />
          </span>
        );
      })}{" "}
      and {numTickers - 3} more tickers
    </span>
  );
}

function ScreenerCard({ screener }) {
  return (
    <Link key={screener.id} href={`/screener/${screener.id}`}>
      <div className="w-full h-full max-h-60 p-4 bg-neutral-800 flex flex-col gap-4 row-span-1 justify-start items-start shadow-lg border-[2px] border-solid border-neutral-600 hover:border-neutral-300 transition-colors rounded-lg">
        <div className="text-2xl">{screener.screenerData.name}</div>
        <div className="text-lg font-normal">
          {screener.screenerData.userRequest.screenerPrompt}
        </div>

        <div className="self-end mt-auto">
          <ScreenerTickers screener={screener} />
        </div>
      </div>
    </Link>
  );
}

export default function CommunityScreeners() {
  const { data, isLoading } = useScreeners();
  if (isLoading) {
    return (
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[50vh] overflow-y-scroll gap-4 max-w-6xl p-2">
        {range(6).map((i) => {
          return (
            <Skeleton
              height={250}
              width={280}
              className="w-full h-full "
              key={i}
              variant="rectangular"
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[50vh] overflow-y-scroll gap-4 max-w-6xl p-2">
      {data.screeners.map((screener) => {
        return <ScreenerCard key={screener.id} screener={screener} />;
      })}
    </div>
  );
}

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
