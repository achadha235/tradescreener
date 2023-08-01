import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useScreeners() {
  return useSWR(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/screeners/all`,
    fetcher
  );
}
