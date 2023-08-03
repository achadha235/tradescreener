"use client";
import { LinearProgress } from "@mui/material";
import { SignupPrompt } from "./SignupPrompt";

export function ScreenerLoading({ screener }) {
  return (
    <div className="bg-neutral-900 p-4 rounded">
      <div className="max-w-md mx-auto py-10">
        <div className="text-4xl">🔍 Finding your stocks...</div>
        <p className=" font-light">
          Our robots are hard at work building your screener. This usually takes
          2-5 minutes.{" "}
        </p>
        <LinearProgress
          style={{ height: 14 }}
          className="rounded-lg"
          color="info"
          value={100}
          variant="indeterminate"
        />

        <SignupPrompt screener={screener} />
      </div>
    </div>
  );
}
