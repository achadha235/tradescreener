export function useRangeSlider() {
  return [];
}
import { Decimal } from "decimal.js";
import { first, isNil, last, reduce, reduceRight } from "lodash";

const d = (x) => new Decimal(x);

export type Point = [number, number];

/** Finds a linear function given two points */
function findLinearFunctionAndInverse(p1: Point, p2: Point) {
  const [p1x, p1y] = [d(p1[0]), d(p1[1])];
  const [p2x, p2y] = [d(p2[0]), d(p2[1])];
  if (p2y.minus(p1y).isZero()) {
    throw new Error("Zero gradient");
  }

  let m = p2y.minus(p1y).div(p2x.minus(p1x));
  let c = p1y.minus(m.mul(p1x));

  let f = function (x): number {
    if (isNil(x)) {
      return 0;
    }
    return m.mul(d(x)).plus(c).toNumber();
  };

  let inv = function (y): number {
    if (isNil(y)) {
      return 0;
    }
    return d(y).minus(c).div(m).toNumber();
  };

  return {
    f: f,
    inv: inv,
  };
}

/**
 * interpolates a step-wise linear function to a list of given points
 * @param pts a list of points to interpolate
 * @returns
 */
export function interpolateLinearFunction(pts: Point[]) {
  // takes a list of points and creates a linear function

  const linePoints = reduce(
    pts,
    (prev: Point[], curr: Point) => {
      if (prev.length === 0) {
        return [curr];
      }
      if (last(prev)?.[1] !== curr[1]) {
        return [...prev, curr];
      }
      return prev;
    },
    []
  );

  const xRanges = linePoints.map((p) => p[0]);
  const yRanges = linePoints.map((p) => p[1]);
  const fns = ([] = linePoints.map((p, i) => {
    if (i === linePoints.length - 1) {
      return null;
    }
    return findLinearFunctionAndInverse(linePoints[i], linePoints[i + 1]);
  })).filter((v) => !isNil(v));

  function f(x) {
    const i = xRanges.findIndex((r) => x < r) as number;
    if (i === -1) {
      if (x < xRanges[0]) {
        return first(fns)!.f(x);
      } else {
        return last(fns)!.f(x);
      }
    }
    return fns[i - 1]?.f(x);
  }
  function inv(y) {
    const i = yRanges.findIndex((r) => y < r) as number;
    if (i === -1) {
      if (y < yRanges[0]) {
        return -Infinity;
      } else {
        return +Infinity;
      }
    }

    return fns[i - 1]?.inv(y);
  }

  return { f, inv };
}

export function useInterpolatedRangeSlider({
  stats,
  stepSize = 0.01,
  stepRange = [0.2, 0.8],
}) {
  const stops = [0, stepSize, stepRange[0], stepRange[1], 1 - stepSize, 1];
  const p1 = [stops[1], stats.true_min] as Point;
  const p2 = [stops[2], stats.min] as Point;
  const p3 = [stops[3], stats.max] as Point;
  const p4 = [stops[4], stats.true_max] as Point;

  const lerp = interpolateLinearFunction([p1, p2, p3, p4]);
  function f(x) {
    if (x === 0) {
      return -Infinity;
    } else if (x === 1) {
      return +Infinity;
    } else {
      return lerp.f(x);
    }
  }

  function inv(y) {
    if (y === -Infinity) {
      return 0;
    } else if (y === +Infinity) {
      return 1;
    } else {
      return lerp.inv(y);
    }
  }

  return { f, inv };
}
