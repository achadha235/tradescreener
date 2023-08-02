import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

const fetcher = (userToken) => (url) =>
  fetch(url, {
    headers: {
      Authorization: userToken,
    },
  }).then((res) => res.json());

export default function useMyScreeners() {
  const [userToken, setUserToken] = useLocalStorage("userToken", null);
  return useSWR(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/screeners/me`,
    fetcher(userToken)
  );
}
