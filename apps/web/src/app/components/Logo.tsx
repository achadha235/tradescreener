import { RocketLaunchTwoTone } from "@mui/icons-material";
import clsx from "clsx";

export default function Logo({
  className,
  color = "#1E1E1E",
}: {
  className?;
  color?;
}) {
  return (
    <div className={clsx("md:text-xl p-2 px-1 pr-2", className)}>
      <span className="font-bold tracking-tighter hidden sm:flex">
        <RocketLaunchTwoTone />{" "}
        <div className="my-0 py-0 tracking-tight leading-tight">
          Tradescreener.ai{" "}
          <sup className="text-[10px] my-0 py-0 tracking-wider font-normal text-neutral-500">
            alpha
          </sup>
        </div>
      </span>
      <span className="font-bold tracking-tighter flex sm:hidden">
        <RocketLaunchTwoTone />{" "}
        <div className="my-0 py-0 tracking-tight leading-tight ml-1 text-base">
          Tradescreener{" "}
          <sup className="text-[10px] my-0 py-0 tracking-wider font-normal text-neutral-500">
            alpha
          </sup>
        </div>
      </span>
    </div>
  );
}
