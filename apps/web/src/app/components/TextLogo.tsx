import clsx from "clsx";

export default function TextLogo({ className = "" }) {
  return <span className={clsx(className, "font-black")}>Yellowbrick</span>;
}
