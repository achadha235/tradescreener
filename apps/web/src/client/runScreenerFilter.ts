import useSWRMutation from "swr/mutation";
import { useLocalStorage } from "usehooks-ts";
import { useSWRConfig } from "swr";
import axios from "axios";

const submitRequest =
  (userToken) =>
  async (url, { arg }: { arg: string }) => {
    const response = await axios.post(url, arg, {
      headers: {
        ...(userToken ? { Authorization: userToken } : {}),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  };

export default function useScreenerFilter({ onSuccess, onError }) {
  const [userToken, _] = useLocalStorage("userToken", null);
  return useSWRMutation(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/screener/filter`,
    submitRequest(userToken),
    {
      onSuccess: (...args) => {
        onSuccess && onSuccess(...args);
      },
      onError: onError,
    }
  );
}
