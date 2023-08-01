"use client";
import { motion } from "framer-motion";

export default function LoadingScreen({ text }: { text? }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex-col flex-1 flex justify-center items-center"
    >
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <div>{text}</div>}
    </motion.div>
  );
}
