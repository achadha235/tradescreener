/* eslint-disable @next/next/no-sync-scripts */
"use client";
import { AnimatePresence } from "framer-motion";
import { themeOptions } from "@/theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import clsx from "clsx";
import { Suspense } from "react";
import AppHeader from "./components/AppHeader";
import LoadingScreen from "./components/LoadingScreen";
import Tracking from "./components/Tracking";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ThemeProvider theme={themeOptions}>
      <CssBaseline />

      <html lang="en">
        <body className={clsx("w-screen h-[100dvh]")}>
          <AppHeader />
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingScreen />}>
              {children}
              <motion.footer
                initial={{ opacity: 0 }} // Initial state with 0 opacity
                animate={{ opacity: 1 }} // Target state with full opacity
                transition={{ delay: 1 }} // 1-second delay before the animation starts
              >
                <div
                  className={clsx(
                    "text-sm font-light p-4 text-neutral-500  mx-auto max-w-6xl",
                    {
                      "pb-52 ": pathname === "/",
                    }
                  )}
                >
                  The information provided on Tradescreener.ai is for
                  informational purposes only and does not constitute investment
                  advice or any other sort of advice, and you should not treat
                  any of the {"site's"} content as such. By using
                  Tradescreener.ai, you agree to the{" "}
                  <a
                    target="_blank"
                    className="font-bold underline"
                    href="/privacy.html"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    target="_blank"
                    className="font-bold underline"
                    href="/terms.html"
                  >
                    Terms of Service.
                  </a>{" "}
                  We hope you find Tradescreener.ai useful.
                </div>
              </motion.footer>
            </Suspense>
          </AnimatePresence>

          <Tracking />
        </body>
      </html>
    </ThemeProvider>
  );
}
