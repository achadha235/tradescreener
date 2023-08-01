"use client";

import useScreener from "@/client/getScreener";
import LoadingScreen from "./LoadingScreen";
import ScreenerTable from "./ScreenerTable";
import { Button, InputBase, LinearProgress } from "@mui/material";
import CommunityScreeners, { OtherScreeners } from "./CommunityScreeners";
import { ScreenerControls } from "./ScreenerControls";

function ScreenerPrompt({ prompt }) {
  return (
    <div className="text-2xl bg-background-paper rounded-md border border-neutral-500 border-solid p-4">
      {prompt}
    </div>
  );
}

export default function Screener({ id }) {
  const { isLoading, data } = useScreener(id);
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!data) {
    return <div>Not found</div>;
  }

  let screenerIsReady = false;
  const status = data.screener.screenerData.status;
  if (status === "completed") {
    screenerIsReady = true;
  }

  const screenerPrompt = data.screener.screenerData.userRequest.screenerPrompt;

  if (!screenerIsReady) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-4 mt-10">
        <ScreenerPrompt prompt={screenerPrompt} />

        <div className="bg-neutral-900 p-4 rounded">
          <div className="max-w-md mx-auto py-10">
            <div className="text-4xl">🔍 Finding your stocks...</div>
            <p className=" font-light">
              Our robots are hard at work building your screener. This usually
              takes 2-5 minutes.{" "}
            </p>
            <LinearProgress
              style={{ height: 14 }}
              className="rounded-lg"
              color="info"
              value={100}
              variant="indeterminate"
            />

            <div className="mt-14 flex flex-col gap-4">
              <div className="font-normal">
                Tell us your email and we’ll let you know when its ready
              </div>
              <div className="w-full flex gap-2">
                <InputBase
                  className="flex-grow"
                  placeholder="Enter your email"
                />
                <Button variant="contained" color="secondary" size="large">
                  Let me know
                </Button>
              </div>
            </div>
          </div>
        </div>
        <OtherScreeners />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-8xl mx-auto flex flex-col gap-4 mt-10 px-4">
        <ScreenerPrompt prompt={screenerPrompt} />
        {data && <ScreenerControls screener={data.screener} />}
      </div>
      <ScreenerTable csv={data.screener.screenerData.csv} />
    </>
  );
}
