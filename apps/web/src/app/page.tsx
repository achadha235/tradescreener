"use client";
import { motion } from "framer-motion";
import CommunityScreeners from "./components/CommunityScreeners";
import CreateScreener from "./components/CreateScreener";
import Headline from "./components/Headline";

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
