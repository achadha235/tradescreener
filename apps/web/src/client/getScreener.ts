import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useScreener(screenerId, skip = false) {
  return useSWR(
    skip
      ? null
      : `${process.env.NEXT_PUBLIC_APP_URL}/api/screener/${screenerId}`,
    fetcher
  );
}
