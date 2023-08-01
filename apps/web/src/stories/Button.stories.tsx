import { Button } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";

// import { Button } from './Button';

// Button

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    variant: "contained",
    children: <div> yO </div>,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    color: "secondary",
  },
};
