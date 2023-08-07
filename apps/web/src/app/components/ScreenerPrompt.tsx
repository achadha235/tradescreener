"use client";

import { Box, Button, Fade, Modal, Paper } from "@mui/material";
import { useState } from "react";
import CreateScreener from "./CreateScreener";
import { Close } from "@mui/icons-material";

export function ScreenerPrompt({ prompt }) {
  const [modalOpen, setModalOpen] = useState(false);
  const onCopyPrompt = () => {
    setModalOpen(true);
  };
  return (
    <div className="flex flex-col">
      <div className="text-2xl bg-background-paper rounded-md border border-neutral-500 border-solid p-4">
        {prompt || <span className=" opacity-60"> No prompt provided </span>}
      </div>
      <Button onClick={onCopyPrompt} className="self-end">
        Modify Prompt
      </Button>
      <Modal
        onClose={() => {
          setModalOpen(false);
        }}
        open={modalOpen}
      >
        <Box
          onClick={() => {
            setModalOpen(false);
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Paper
            className="w-full max-w-2xl p-4 relative"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Button
              className="absolute top-2 right-2"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              <Close />
            </Button>
            <div className="text-xl text-neutral-600">Modify Prompt</div>
            <CreateScreener defaultValue={prompt} />
          </Paper>
        </Box>
      </Modal>
    </div>
  );
}
