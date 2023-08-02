import Link from "next/link";
import { ScreenerTickers } from "./ScreenerTickers";

export function ScreenerCard({ screener }) {
  return (
    <Link key={screener.id} href={`/screener/${screener.id}`}>
      <div className="w-full h-full p-4 bg-neutral-800 flex flex-col gap-4 row-span-1 justify-start items-start shadow-lg border-[2px] border-solid border-neutral-600 hover:border-neutral-300 transition-colors rounded-lg">
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
