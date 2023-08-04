"use client";

import useScreener from "@/client/getScreener";
import LoadingScreen from "./LoadingScreen";
import ScreenerTable from "./ScreenerTable";
import { OtherScreeners } from "./OtherScreeners";
import { ScreenerControls } from "./ScreenerControls";
import { ScreenerPrompt } from "./ScreenerPrompt";
import { ScreenerLoading } from "./ScreenerLoading";
import { useEffect, useState } from "react";
import useScreenerFilter from "@/client/runScreenerFilter";
import clsx from "clsx";
import { isNil } from "lodash";

export default function Screener({ id }) {
  const [customCondition, setCustomCondition] = useState();
  const { isLoading, data } = useScreener(id);
  const status = data?.screener?.screenerData.status;
  const screenerPrompt =
    data?.screener?.screenerData.userRequest.screenerPrompt;
  const {
    trigger,
    isMutating,
    data: fetchScreenerData,
  } = useScreenerFilter({
    onSuccess: (data) => {
      console.log("Screener filter success", data);
    },
    onError: (error) => {
      console.error("Error while running screener filter", error);
    },
  });
  useEffect(() => {
    console.log("Run the screener");
    if (
      customCondition &&
      customCondition["clauses"] &&
      (customCondition["clauses"] as any)?.length > 0
    ) {
      trigger(JSON.stringify(customCondition));
    }
  }, [customCondition]);

  let screenerIsReady = false;
  if (status === "completed") {
    screenerIsReady = true;
  }

  if (isLoading) {
    return (
      <div className="max-w-8xl h-[50vh] mx-auto flex flex-col gap-4 mt-10 px-4">
        <LoadingScreen />
      </div>
    );
  }

  if (!data?.screener) {
    return (
      <div className="w-full flex-col h-[60vh] flex justify-center items-center">
        This screener was not found. Try some of these screeners instead.
        <OtherScreeners title=" " cta={" "} />
      </div>
    );
  }

  const screenerName = data?.screener?.screenerData?.name;
  const screenerNumberID = "Screener #" + parseInt(id?.slice(-5), 16);
  const displayId = screenerName || screenerNumberID;

  const screenerTitle = (
    <div
      className={clsx("flex justify-center items-center", {
        "text-neutral-500": isNil(screenerName),
      })}
    >
      {displayId}
    </div>
  );

  if (!screenerIsReady) {
    return (
      <div className="max-w-8xl mx-auto flex flex-col gap-4 mt-10 px-4">
        {screenerTitle}
        <ScreenerPrompt prompt={screenerPrompt} />
        <ScreenerLoading screener={data.screener} />
        <OtherScreeners />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto flex flex-col gap-4 mt-10 px-4">
      {screenerTitle}
      <ScreenerPrompt prompt={screenerPrompt} />
      {data && (
        <ScreenerControls
          loading={isMutating}
          screenerConditionChanged={(newCondition) => {
            setCustomCondition(newCondition);
          }}
          screener={data.screener}
        />
      )}
      {data.screener && (
        <ScreenerTable
          loading={isMutating}
          screenerName={data.screener.screenerData.name}
          csv={fetchScreenerData?.result || data.screener.screenerData.csv}
        />
      )}
    </div>
  );
}
