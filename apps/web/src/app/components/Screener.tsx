"use client";

import useScreener from "@/client/getScreener";
import LoadingScreen from "./LoadingScreen";
import ScreenerTable from "./ScreenerTable";
import {
  Button,
  CircularProgress,
  InputBase,
  LinearProgress,
} from "@mui/material";
import { OtherScreeners } from "./OtherScreeners";
import { ScreenerControls } from "./ScreenerControls";
import { useState } from "react";
import useSubmitEmail from "@/client/submitEmail";
import { Check } from "@mui/icons-material";
import { useLocalStorage } from "usehooks-ts";

function ScreenerPrompt({ prompt }) {
  return (
    <div className="text-2xl bg-background-paper rounded-md border border-neutral-500 border-solid p-4">
      {prompt}
    </div>
  );
}

function SignupPrompt({ screener }) {
  const [userToken, setUserToken] = useLocalStorage("userToken", null);
  const [email, setEmail] = useState("");

  const { trigger, data, isMutating } = useSubmitEmail({
    onSuccess: (data) => {
      if (data && data.token) {
        setUserToken(data.token);
      }
    },
    onError: () => {
      console.log("error");
    },
  });

  const onEmailSubmitted = () => {
    trigger(JSON.stringify({ email, screenerId: screener.id }));
  };

  if (userToken) {
    return (
      <div className="mt-14 flex flex-col gap-4 text-neutral-500 text-center text-base">
        <p>{"You'll"} get an email once your screener is ready.</p>
      </div>
    );
  }

  return (
    <div className="mt-14 flex flex-col gap-4">
      <div className="font-normal">
        Create a free account to save your screener and get notified when its
        ready.
      </div>
      <div className="w-full flex gap-2">
        <InputBase
          disabled={isMutating}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-grow"
          placeholder="Enter your email"
        />
        <Button
          startIcon={isMutating && <CircularProgress size={12} />}
          disabled={isMutating}
          onClick={onEmailSubmitted}
          variant="contained"
          color="secondary"
          size="large"
        >
          Sign Up
        </Button>
      </div>
      {data && data.success && (
        <div className="text-sm flex font-normal justify-center items-center gap-2">
          <Check fontSize={"small"} />
          <p>
            {"You're"} signed up. {"You'll"} get an email at{" "}
            <span className="font-bold">{email}</span> once your screener is
            ready.
          </p>
        </div>
      )}
    </div>
  );
}

function ScreenerLoading({ screener }) {
  const [userToken, setUserToken] = useLocalStorage("userToken", null);
  const [email, setEmail] = useState("");

  const { trigger, data, isMutating } = useSubmitEmail({
    onSuccess: (data) => {
      if (data && data.token) {
        setUserToken(data.token);
      }
    },
    onError: () => {
      console.log("error");
    },
  });

  const onEmailSubmitted = () => {
    trigger(JSON.stringify({ email, screenerId: screener.id }));
  };

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
  // screenerIsReady = false;
  if (!screenerIsReady) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-4 mt-10">
        <ScreenerPrompt prompt={screenerPrompt} />
        <ScreenerLoading screener={data.screener} />
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
      {data.screener && (
        <ScreenerTable
          screenerName={data.screener.screenerData.name}
          csv={data.screener.screenerData.csv}
        />
      )}
    </>
  );
}
