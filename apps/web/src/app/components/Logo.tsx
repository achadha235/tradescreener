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
    <div className={clsx("text-sm md:text-2xl p-2", className)}>
      <span className="font-bold tracking-tighter">Tradescreener.ai</span>
    </div>
  );
}
