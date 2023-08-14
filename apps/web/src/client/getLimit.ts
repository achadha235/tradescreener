import { useEffect } from "react";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

const fetcher = (userToken) => (url) =>
  fetch(url, {
    headers: {
      Authorization: userToken,
    },
  }).then((res) => res.json());

export default function useLimit() {
  const [userToken, setUserToken] = useLocalStorage("userToken", null);
  const props = useSWR(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/limit`,
    fetcher(userToken)
  );

  useEffect(() => {
    props?.mutate();
  }, [userToken, props]);

  return props;
}
