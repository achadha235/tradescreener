"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AccountButton } from "./AccountButton";
import { FeedbackButton } from "./FeedbackButton";
import Logo from "./Logo";

export default function AppHeader() {
  const params: any = useParams();

  return (
    <div className="flex w-full justify-between p-2">
      <Link href="/">
        <Logo />
      </Link>

      <div className="w-auto flex justify-center items-center h-full gap-x-5">
        <FeedbackButton />
        <AccountButton />
      </div>
    </div>
  );
}
