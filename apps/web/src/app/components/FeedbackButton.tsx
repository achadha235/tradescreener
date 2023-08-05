"use client";
import {
  Button,
  CircularProgress,
  InputBase,
  Modal,
  Paper,
} from "@mui/material";
import { Check, CommentRounded } from "@mui/icons-material";
import { HoverRating } from "./HoverRating";
import { useState } from "react";
import { isNil } from "lodash";
import useSubmitFeedback from "@/client/submitFeedback";
import { analytics, trackFullstory } from "@/tracking";

export function FeedbackButton() {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const { trigger, isMutating } = useSubmitFeedback({
    onError: () => {
      console.log("There was an error submitting feedback");
      setSuccess(true);
    },
    onSuccess: () => {
      setSuccess(true);
    },
  });

  function onSubmitFeedback() {
    const payload = {
      rating,
      comment,
    };
    console.log("Submitting feedback", payload);
    trigger(JSON.stringify(payload));
    analytics.track("submit feedback", payload);
    trackFullstory("submit feedback", payload);
  }
  const modalContent = (
    <Paper className=" p-4">
      <div className="flex flex-col w-96 h-96">
        <div className="flex flex-row justify-between p-2">
          <div className="flex flex-col w-full text-center text-neutral-500">
            {"We'd"} love to hear from you!
          </div>
        </div>
        <div className="p-4">
          <HoverRating
            onChange={(rating) => {
              if (isMutating) {
                return;
              }
              setRating(rating);
            }}
          />
        </div>
        <div className="flex flex-col p-2">
          <p className="text-sm">Add a comment</p>
          <InputBase
            disabled={isMutating}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            rows={5}
            minRows={5}
            multiline
            placeholder="Type your message here..."
          />
        </div>
      </div>
      <Button
        startIcon={
          isMutating ? <CircularProgress size={10} /> : <CommentRounded />
        }
        onClick={onSubmitFeedback}
        disabled={isNil(rating) || comment.length === 0 || isMutating}
        className="mt-16"
        fullWidth
        size="large"
        variant="contained"
        color="secondary"
      >
        {isMutating ? "Submitting feedback..." : "Submit Feedback"}
      </Button>
    </Paper>
  );

  const successModalContent = (
    <Paper className=" p-4">
      <div className="flex flex-col w-96 h-96">
        <div className="flex flex-row justify-between p-2">
          <div className="flex flex-col w-full text-center text-neutral-500">
            Your feedback was submitted.
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-center items-center">
            <Check className="text-9xl text-neutral-300" />
            <p className="text-2xl text-neutral-300">Thank you!</p>
          </div>
        </div>
      </div>
      <Button
        size="large"
        color="primary"
        variant="outlined"
        fullWidth
        onClick={() => {
          setModalOpen(false);
        }}
      >
        Okay
      </Button>
    </Paper>
  );

  const modal = (
    <Modal
      classes={{ backdrop: "bg-[rgba(0,0,0,0.8)]" }}
      onClose={() => {
        setModalOpen(false);
      }}
      open={modalOpen}
      className="flex justify-center items-center"
    >
      {success ? successModalContent : modalContent}
    </Modal>
  );

  return (
    <>
      {modal}
      <Button
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Feedback
      </Button>
    </>
  );
}
