import useSubmitScreenerRequest from "@/client/submitScreenerRequest";
import { Search } from "@mui/icons-material";
import { Button, CircularProgress, InputBase } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateScreener() {
  const success = false;
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
      <div className="w-full flex flex-col bg-highlight">
        <InputBase
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
