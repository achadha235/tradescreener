import { Chip } from "@mui/material";

export function ScreenerTickers({ screener }) {
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
