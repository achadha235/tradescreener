"use client";
import useGetMe from "@/client/getMe";
import { analytics } from "@/tracking";
import {
  useParams,
  usePathname,
  useSearchParams,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  const [fsReady, setFSReady] = useState(false);
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
    console.log("Triggered user change");
    if (isLoading || !user?.id) {
      console.log("Not identifying user");
      return;
    }
    console.log("Identifying user", user.id, user.email);
    if (!analytics) {
      console.log("Analytics not ready");
    }

    analytics?.identify(user.id, {
      email: user.email,
    });
  }, [user?.id, isLoading]);

  useEffect(() => {
    if (isLoading || !user?.id || !fsReady) {
      console.log("Not identifying fullstory user");
      return;
    }
    console.log("Identifying user for FullStory", user.id, user.email);
    FS?.identify(user.id, {
      email: user.email,
    });
  }, [user?.id, isLoading, fsReady]);

  useEffect(() => {
    window["_fs_ready"] = function () {
      console.log("Fullstory is ready");
      setFSReady(true);
    };
  }, []);

  return <div className="hidden" />;
}
