import useSWRMutation from "swr/mutation";

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
  return useSWRMutation(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/submitEmail`,
    submitRequest,
    {
      onSuccess: onSuccess,
      onError: onError,
    }
  );
}
