/* eslint-disable @next/next/no-sync-scripts */
import "./globals.css";
import { Metadata } from "next";
import { RootLayout } from "./RootLayout";
import { Fab } from "@mui/material";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL as string),
  title: "Tradescreener.ai",
  description: "Kickstart your next trade idea with AI. Try it today for free.",
  openGraph: {
    title: "Tradescreener.ai - A.I. Powered Stock Screener",
    description:
      "Kickstart your next trade idea with AI. Try it today for free.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}
