/* eslint-disable @next/next/no-sync-scripts */
"use client";
import { motion, AnimatePresence } from "framer-motion";

import clsx from "clsx";
import "./globals.css";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import AppHeader from "./components/AppHeader";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Yellowbrick",
//   icons: ["/logo.png"],
//   description: "Make screeners with A.I.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.stripe.com/v3/"></script>
      </head>
      <body className={clsx("w-screen h-[100dvh]")}>
        <AppHeader />
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
        </AnimatePresence>
      </body>
    </html>
  );
}
