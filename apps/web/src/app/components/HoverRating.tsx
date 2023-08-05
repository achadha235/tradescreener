"use client";
import { Rating } from "@mui/material";
import { Star } from "@mui/icons-material";
import { useEffect, useState } from "react";

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}
const labels: { [index: string]: string } = {
  1: "Useless 🚽",
  2: "Poor 👎",
  3: "Ok 😐",
  4: "Good 👍",
  5: "Excellent! 🚀",
};

export function HoverRating({ onChange }) {
  const [value, setValue] = useState<number | null>(null);
  const [hover, setHover] = useState<any>(-1);

  useEffect(() => {
    onChange(value);
  }, [value]);
  return (
    <div className="flex flex-col justify-center items-center">
      <Rating
        size="large"
        style={{
          transform: "scale(1.5)",
        }}
        name="hover-feedback"
        value={value}
        precision={1}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={
          <Star style={{ opacity: 1, color: "grey" }} fontSize="inherit" />
        }
      />
      <br />

      <span className="text-center font-bold text-lg min-h-[1.5rem]">
        {(hover !== null || value !== null) &&
          labels[hover !== -1 ? hover : value]}
      </span>
    </div>
  );
}
