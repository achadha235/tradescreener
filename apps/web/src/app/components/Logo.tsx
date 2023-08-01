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
    <div className={clsx("text-2xl p-2", className)}>
      🟨 <span className="font-bold tracking-tighter">Yellowbrick</span>
    </div>
  );
}
