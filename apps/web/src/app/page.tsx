"use client";
import { ThemeProvider } from "@emotion/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { themeOptions } from "@/theme";
import { CssBaseline } from "@mui/material";
import Splash from "@/app/components/Splash";
import Demo from "@/app/components/Demo";
import AppHeader from "./components/AppHeader";
import Headline from "./components/Headline";
import CommunityScreeners, {
  OtherScreeners,
} from "./components/CommunityScreeners";
import CreateScreener from "./components/CreateScreener";
import { motion, AnimatePresence } from "framer-motion";

export default async function Home() {
  return (
    <ThemeProvider theme={themeOptions}>
      <CssBaseline />
      <UserProvider>
        {/* <Demo /> */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Headline />
          <div className="flex justify-center">
            <CommunityScreeners />
          </div>
          <div className="absolute w-screen bottom-0">
            <div className="flex w-full justify-center">
              <CreateScreener />
            </div>
          </div>
        </motion.div>
      </UserProvider>
    </ThemeProvider>
  );
}
