import useScreeners from "@/client/getAllScreeners";
import { Skeleton } from "@mui/material";
import { range } from "lodash";
import { ScreenerCard } from "./ScreenerCard";

export default function CommunityScreeners() {
  const { data, isLoading } = useScreeners();
  if (isLoading) {
    return (
      <div className="w-full relative grid grid-flow-row auto-rows-fr overflow-y-scroll max-w-6xl p-2">
        {range(6).map((i) => {
          return (
            <Skeleton
              className="w-full h-full max-h-80"
              key={i}
              variant="rectangular"
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className="relative grid-flow-row auto-rows-fr grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl p-2 mb-52">
      {data.screeners.map((screener) => {
        return <ScreenerCard key={screener.id} screener={screener} />;
      })}
    </div>
  );
}
