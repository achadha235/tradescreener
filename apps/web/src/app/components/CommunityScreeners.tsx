import useScreeners from "@/client/getAllScreeners";
import { Skeleton } from "@mui/material";
import { range } from "lodash";
import { ScreenerCard } from "./ScreenerCard";

export default function CommunityScreeners() {
  const { data, isLoading } = useScreeners();
  if (isLoading || !data) {
    return (
      <div className="relative grid-flow-row auto-rows-fr grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl p-2 mb-52">
        {range(6).map((i) => {
          return (
            <Skeleton
              className="overflow-hidden w-max h-max p-4 bg-neutral-800 flex flex-col gap-4 row-span-1 justify-start items-start shadow-lg border-[2px] border-solid border-neutral-600 hover:border-neutral-300 transition-colors rounded-lg"
              key={i}
              animation={isLoading ? "wave" : false}
              variant="rectangular"
            >
              <ScreenerCard
                screener={{
                  screenerData: {
                    name: "Another great screener",
                    tickers: [],
                    userRequest: {
                      screenerPrompt:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
                    },
                  },
                }}
              />
            </Skeleton>
          );
        })}
      </div>
    );
  }
  return (
    <div className="relative grid-flow-row auto-rows-fr grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl p-2 mb-52">
      {data?.screeners.map((screener) => {
        return <ScreenerCard key={screener.id} screener={screener} />;
      })}
    </div>
  );
}
