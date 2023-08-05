"use client";
import useGetMe from "@/client/getMe";
import { analytics } from "@/tracking";
import {
  useParams,
  usePathname,
  useSearchParams,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useCallback, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

declare var FS;

export default function Tracking({}) {
  const { data: user, isLoading } = useGetMe();
  const params = useParams();
  const selectedLayoutSegment = useSelectedLayoutSegment();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page changes
  useEffect(() => {
    analytics?.page?.(
      (selectedLayoutSegment as string) || (pathname as string) || "/",
      { params }
    );
  }, [pathname, searchParams]);

  const [userToken, setUserToken] = useLocalStorage<any>("userToken", null);

  // const removeAuthSearchParam = useCallback(() => {
  //   // Get the current URL
  // }, [searchParams]);

  useEffect(() => {
    let url = new URL(window.location.href);
    // Remove the 'auth' parameter
    const authToken = url.searchParams.get("auth");
    if (authToken) {
      setUserToken(authToken as string);
      url.searchParams.delete("auth");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Identify users
  useEffect(() => {
    if (isLoading || !user?.id) {
      return;
    }
    console.log("Identifying user", user.id, user.email);

    analytics?.identify(user.id, {
      email: user.email,
    });
    if (typeof FS !== "undefined") {
      console.log("Identifying user for FS", user.id, user.email);
      FS?.identify(user.id, {
        email: user.email,
      });
    }
  }, [user?.id, isLoading]);

  return <div className="hidden" />;
}
