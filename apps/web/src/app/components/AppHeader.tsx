"use client";
import { themeOptions } from "@/theme";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "@emotion/react";
import { Button, CssBaseline } from "@mui/material";
import Logo from "./Logo";
import { useParams } from "next/navigation";
import useScreener from "@/client/getScreener";
import { isNil } from "lodash";
import clsx from "clsx";

export default function AppHeader() {
  const params: any = useParams();
  const { data } = useScreener(params?.screenerId, isNil(params.screenerId));

  const screenerName = null; // data?.screener?.screenerData?.name;
  const screenerNumberID =
    "Screener #" + parseInt(data?.screener.id.slice(-5), 16);
  const displayId = screenerName || screenerNumberID;
  return (
    <ThemeProvider theme={themeOptions}>
      <CssBaseline />
      <UserProvider>
        <div className="flex w-full justify-between p-2">
          <Logo />
          {data && (
            <div
              className={clsx("flex justify-center items-center", {
                "text-neutral-500": isNil(screenerName),
              })}
            >
              {displayId}
            </div>
          )}
          <Button>My Screeners</Button>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}
