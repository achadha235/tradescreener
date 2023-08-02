import useSubmitScreenerRequest from "@/client/submitScreenerRequest";
import { Search } from "@mui/icons-material";
import { Button, CircularProgress, InputBase } from "@mui/material";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateScreener() {
  const success = false;
  const [active, setActive] = useState(false);
  const [screenerPrompt, setScreenerPrompt] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const onSubmitRequestSuccess = (data) => {
    if (data.success) {
      router.push("/screener/" + data.screener.id);
    }
  };

  const onSubmitRequestError = () => {
    alert("error");
  };

  const { trigger, data, isMutating, error } = useSubmitScreenerRequest({
    onError: onSubmitRequestError,
    onSuccess: onSubmitRequestSuccess,
  });
  function onSubmitRequestClicked() {
    trigger(JSON.stringify({ screenerPrompt, email }));
  }

  const requestScreen = (
    <div className="flex flex-col justify-center items-center gap-4 w-full max-w-2xl">
      <div
        className={clsx(
          "w-full flex flex-col bg-highlight outline-4 outline rounded-md p-4 m-2 shadow-lg",
          {
            "outline-neutral-600": !active,
            "outline-white": active,
          }
        )}
      >
        <InputBase
          onFocus={(e) => setActive(true)}
          onBlur={(e) => setActive(false)}
          disabled={isMutating}
          value={screenerPrompt}
          onChange={(e) => setScreenerPrompt(e.target.value)}
          multiline
          className="w-full border-none rounded-none text-2xl text-white"
          minRows={1}
          maxRows={8}
          placeholder="What kind of stocks are you looking for?"
        />
        <Button
          onClick={onSubmitRequestClicked}
          disabled={isMutating}
          startIcon={isMutating ? <CircularProgress size={10} /> : <Search />}
          className="mt-4 ml-auto"
          variant="contained"
          size="large"
          color="secondary"
        >
          {isMutating ? "Submitting Request" : "Find Stocks"}
        </Button>
      </div>
    </div>
  );

  if (!success) {
    return requestScreen;
  }
}
