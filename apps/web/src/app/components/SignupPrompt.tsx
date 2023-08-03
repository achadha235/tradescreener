"use client";
import { Button, CircularProgress, InputBase } from "@mui/material";
import { useState } from "react";
import useSubmitEmail from "@/client/submitEmail";
import { Check } from "@mui/icons-material";
import { useLocalStorage } from "usehooks-ts";

export function SignupPrompt({ screener }) {
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
