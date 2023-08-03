/* eslint-disable @next/next/no-sync-scripts */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import clsx from "clsx";
import "./globals.css";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import AppHeader from "./components/AppHeader";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { themeOptions } from "@/theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={themeOptions}>
      <CssBaseline />
      <UserProvider>
        <html lang="en">
          <head>
            <script src="https://js.stripe.com/v3/"></script>
          </head>
          <body className={clsx("w-screen h-[100dvh]")}>
            <AppHeader />
            <AnimatePresence mode="wait">
              <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
            </AnimatePresence>
            {/* <footer className="text-base font-light p-4 text-neutral-500">
              The information provided on Tradescreener.ai is for informational
              purposes only and does not constitute investment advice or any
              other sort of advice, and you should not treat any of the{" "}
              {"site's"} content as such. We hope you find Tradescreener.ai
              useful.
            </footer> */}
          </body>
        </html>
      </UserProvider>
    </ThemeProvider>
  );
}
