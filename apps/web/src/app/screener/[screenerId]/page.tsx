"use client";

import LoadingScreen from "@/app/components/LoadingScreen";
import Screener from "@/app/components/Screener";
import { useParams } from "next/navigation";
import { ThemeProvider } from "@emotion/react";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { themeOptions } from "@/theme";
import { CssBaseline } from "@mui/material";
import { motion } from "framer-motion";
export default function ScreenerPage() {
  const { screenerId } = useParams() as any;
  return (
    <ThemeProvider theme={themeOptions}>
      <CssBaseline />
      <UserProvider>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Screener id={screenerId} />
        </motion.div>
      </UserProvider>
    </ThemeProvider>
  );
}
