import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";

async function submitRequest(url, { arg }: { arg: string }) {
  const response = await fetch(url, {
    method: "POST",
    body: arg,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export default function useSubmitEmail({ onSuccess, onError }) {
  const { mutate } = useSWRConfig();
  return useSWRMutation(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/submitEmail`,
    submitRequest,
    {
      onSuccess: (...args) => {
        mutate(`${process.env.NEXT_PUBLIC_APP_URL}/api/screeners/me`);
        onSuccess && onSuccess(...args);
      },
      onError: onError,
    }
  );
}
