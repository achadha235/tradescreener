import Analytics from "analytics-node"; // for Segment analytics
export const analytics = new Analytics(
  process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY
);
