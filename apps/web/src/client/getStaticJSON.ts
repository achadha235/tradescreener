import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useStaticJSON(filepath) {
  return useSWR(`${process.env.NEXT_PUBLIC_APP_URL}${filepath}`, fetcher);
}
