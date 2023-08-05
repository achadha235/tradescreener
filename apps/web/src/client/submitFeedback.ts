import useSWRMutation from "swr/mutation";
import { useLocalStorage } from "usehooks-ts";
import { useSWRConfig } from "swr";

const submitRequest =
  (userToken) =>
  async (url, { arg }: { arg: string }) => {
    const response = await fetch(url, {
      method: "POST",
      body: arg,
      headers: {
        ...(userToken ? { Authorization: userToken } : {}),
        "Content-Type": "application/json",
      },
    });
    return response.json();
  };

export default function useSubmitFeedback({ onSuccess, onError }) {
  const [userToken, setUserToken] = useLocalStorage("userToken", null);
  return useSWRMutation(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/submitFeedback`,
    submitRequest(userToken),
    {
      onSuccess: (...args) => {
        onSuccess && onSuccess(...args);
      },
      onError: onError,
    }
  );
}
