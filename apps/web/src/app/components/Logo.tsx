import { Home, RocketLaunchTwoTone } from "@mui/icons-material";
import clsx from "clsx";
import Image from "next/image";

export default function Logo({
  className,
  color = "#1E1E1E",
}: {
  className?;
  color?;
}) {
  return (
    <div className={clsx("md:text-2xl p-2", className)}>
      <span className="font-bold tracking-tighter hidden md:flex">
        📊 Tradescreener.ai
      </span>
      <span className="font-bold tracking-tighter flex md:hidden">
        <RocketLaunchTwoTone /> Tradescreener.ai
      </span>
    </div>
  );
}
