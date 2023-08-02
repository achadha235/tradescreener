"use client";
import { ThemeProvider } from "@emotion/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { themeOptions } from "@/theme";
import { CssBaseline } from "@mui/material";
import Splash from "@/app/components/Splash";
import Demo from "@/app/components/Demo";
import AppHeader from "./components/AppHeader";
import Headline from "./components/Headline";
import CommunityScreeners from "./components/CommunityScreeners";
import { OtherScreeners } from "./components/OtherScreeners";
import CreateScreener from "./components/CreateScreener";
import { motion, AnimatePresence } from "framer-motion";

export default async function Home() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Headline />
        <div className="flex justify-center">
          <CommunityScreeners />
        </div>
      </motion.div>
      <div className="fixed w-screen bottom-0 gradientbg mx-1">
        <div className="flex w-full justify-center shadow-md">
          <CreateScreener />
        </div>
      </div>
    </>
  );
}
