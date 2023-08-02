"use client";

import Screener from "@/app/components/Screener";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ScreenerPage() {
  const { screenerId } = useParams() as any;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Screener id={screenerId} />
    </motion.div>
  );
}
