"use client";
import useGetMe from "@/client/getMe";
import { analytics, fsReady, segmentReady } from "@/tracking";
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
  const { data, isLoading } = useGetMe();
  const params = useParams();
  const selectedLayoutSegment = useSelectedLayoutSegment();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = data?.user;

  // Track page changes
  useEffect(() => {
    analytics?.page?.(
      (selectedLayoutSegment as string) || (pathname as string) || "/",
      { params }
    );
  }, [pathname, searchParams]);

  const [userToken, setUserToken] = useLocalStorage<any>("userToken", null);

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

  useEffect(() => {
    if (!fsReady || isLoading) {
      return;
    }
    if (!user) {
      return;
    }
    console.log("Identifed Fullstory user:", user.id, user.email);
    FS?.identify(user.id, {
      email: user.email,
    });
  }, [fsReady, isLoading]);

  useEffect(() => {
    if (!segmentReady || isLoading) {
      return;
    }
    if (!user) {
      return;
    }
    console.log("Identifed Segment user:", user.id, user.email);
    analytics?.identify(user.id, {
      email: user.email,
    });
  }, [segmentReady, isLoading]);

  return <div className="hidden" />;
}
