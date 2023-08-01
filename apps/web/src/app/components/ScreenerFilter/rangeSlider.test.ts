import { interpolateLinearFunction } from "@/app/components/ScreenerFilter/rangeSlider";
import { expect, test } from "vitest";

test("home", () => {
  const result = interpolateLinearFunction([
    [0.01, 0],
    [0.1, 0],
    [0.9, 0.038491],
    [0.99, 3.81435],
  ]);
  console.log("result", result);

  const x = result.inv(0);
  expect(x).toBe(0.01);
});
