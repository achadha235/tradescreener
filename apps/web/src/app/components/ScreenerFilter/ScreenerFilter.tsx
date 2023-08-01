"use client";
import { Info } from "@mui/icons-material";
import { CircularProgress, InputBase, Slider, Tooltip } from "@mui/material";
import clsx from "clsx";
import { filter, find, isNil } from "lodash";
import { useInterpolatedRangeSlider as interpolatedRangeSlider } from "@/app/components/ScreenerFilter/rangeSlider";
import numeral from "numeral";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Decimal from "decimal.js";

const stepSize = 0.01;
const stepRange = [0.25, 0.8];

export function getNumberFormat(tag) {
  let numberFormat = "0,0[.]00[00]";
  if (tag.units.startsWith("USD")) {
    numberFormat = "$0,0.00a";
  } else if (tag.units === "Percentage") {
    numberFormat = "0,0[.][00]%";
  }
  return numberFormat;
}

function getTextFromSliderXValue(x, numberFormat, sliderFn) {
  if (x === 0 || x === 1) {
    return "Any";
  }
  let y = sliderFn.f(x);
  if ([-Infinity, Infinity].includes(y) || Number.isNaN(y)) {
    return "Any";
  }
  debugger;
  if (Math.abs(y) <= 1e-7) {
    return numeral(0).format(numberFormat);
  }

  const rounded = y?.toPrecision(3);
  if (new Decimal(rounded).isZero()) {
    return "0";
  }
  const num = numeral(rounded);
  const formatted = num.format(numberFormat);
  return formatted;
}

function ScreenerFilterHeader({ tag, filterActive }) {
  const headingStyle = clsx("text-base flex items-center pb-2", {
    "text-neutral-500": !filterActive,
    "text-white font-bold": filterActive,
  });
  return (
    <span className={headingStyle}>
      {tag.name}
      {tag.definition && tag.definition.length > 0 && (
        <Tooltip
          componentsProps={{
            tooltip: { className: "bg-background-default text-base" },
          }}
          title={tag.definition}
          placement="right"
        >
          <Info className="ml-2" style={{ height: 15, width: 15 }} />
        </Tooltip>
      )}
    </span>
  );
}

export function ScreenerFilter({
  tag,
  filterConditions,
  stat,
  onConditionChanged,
}) {
  const [lowerboundFilter, setLowerBoundFilter] = useState<any>(null);
  const [upperboundFilter, setUpperBoundFilter] = useState<any>(null);

  const [lowerboundX, setLowerboundX] = useState(0);
  const [upperboundX, setUpperboundX] = useState(1);

  const lowerboundInputRef = useRef<any>();
  const upperboundInputRef = useRef<any>();

  const lowerboundActive = lowerboundX !== 0;
  const upperboundActive = upperboundX !== 1;

  const filterActive = lowerboundActive || upperboundActive;
  const containerStyle = clsx("p-1 px-2 bg-neutral-900", {
    "outline outline-neutral-500 rounded-md": filterActive,
  });
  const numberFormat = getNumberFormat(tag);
  const sliderFn = useMemo(
    () =>
      interpolatedRangeSlider({
        stats: stat,
        stepSize: stepSize,
        stepRange,
      }),
    [stat]
  );

  function getTextForY(y) {
    if (Math.abs(y) < 1e-8) {
      y = 0;
    }
    if (y === -Infinity || y === +Infinity) {
      return "Any";
    }
    return numeral(y.toPrecision(3)).format(numberFormat);
  }

  function getTextForX(x) {
    if (x === 0 || x === 1) {
      return "Any";
    }
    return getTextForY(sliderFn.f(x));
  }

  useEffect(() => {
    const y = sliderFn.f(upperboundX);
    upperboundInputRef.current.value = getTextForY(y);
  }, [sliderFn, upperboundX, upperboundInputRef]);

  useEffect(() => {
    const y = sliderFn.f(lowerboundX);
    lowerboundInputRef.current.value = getTextForY(y);
  }, [sliderFn, lowerboundX, lowerboundInputRef]);

  const syncFiltersEffect = useCallback(
    function () {
      if (!tag || !filterConditions) {
        return;
      }
      setLowerBoundFilter(
        find(filterConditions, (ft) => ["gte", "gt"].includes(ft.operator))
      );
      setUpperBoundFilter(
        find(filterConditions, (ft) => ["lte", "lt"].includes(ft.operator))
      );
    },
    [filterConditions]
  );

  useEffect(() => {
    if (!lowerboundFilter?.value || !sliderFn) {
      return;
    }
    setLowerboundX(
      sliderFn.inv(
        parseFloat(lowerboundFilter.value as string) as number
      ) as number
    );
  }, [lowerboundFilter, sliderFn]);

  useEffect(() => {
    if (!upperboundFilter?.value || !sliderFn) {
      return;
    }
    setUpperboundX(
      sliderFn.inv(
        parseFloat(upperboundFilter.value as string) as number
      ) as number
    );
  }, [upperboundFilter, sliderFn]);

  useEffect(syncFiltersEffect, []);

  const onBlurUpperbound = (e) => {
    let newUpperX;
    if (e.target.value === "Any" || e.target.value.trim() === "") {
      newUpperX = 1;
    }
    const y: any = numeral(e.target.value).value();
    if (isNil(y) && upperboundInputRef?.current) {
      upperboundInputRef.current.value = getTextForX(upperboundX);
    }
    const yLower = sliderFn.f(lowerboundX);
    if (y >= yLower!) {
      newUpperX = sliderFn.inv(y);
    }

    if (newUpperX) {
      setUpperboundX(newUpperX);
    }
  };

  const onBlurLowerbound = (e) => {
    let newLowerX;
    if (e.target.value === "Any") {
      newLowerX = 0;
    }
    const y: any = numeral(e.target.value).value();
    if (isNil(y) && lowerboundInputRef?.current) {
      lowerboundInputRef.current.value = getTextForX(lowerboundX);
    }
    const yUpper = sliderFn.f(upperboundX);
    if (y <= yUpper!) {
      newLowerX = sliderFn.inv(y);
    }

    if (newLowerX) {
      setLowerboundX(newLowerX);
    }
  };

  // useEffect(() => {
  //   if (!sliderFn || !lowerboundX) {
  //     return;
  //   }
  //   const y = sliderFn.f(lowerboundX);
  //   // setLowerboundY(y as number);
  // }, [sliderFn, lowerboundX]);

  // useEffect(() => {
  //   if (lowerboundY === -Infinity) {
  //     setLowerboundLabel("Any");
  //   } else {
  //     setLowerboundLabel(numeral(lowerboundY).format(numberFormat) as string);
  //   }
  // }, [sliderFn, lowerboundY, setLowerboundLabel]);

  // useEffect(() => {
  //   if (upperboundY === +Infinity) {
  //     setUpperboundLabel("Any");
  //   } else {
  //     setUpperboundLabel(numeral(upperboundY).format(numberFormat) as string);
  //   }
  // }, [sliderFn, upperboundY, setUpperboundLabel]);

  // Format values for hover tooltip on slider

  // // useEffect(() => {
  // //   setTagStats(screenerStats[indexingPreference || "all_index"][tag.tag]);
  // // }, [tag, screenerStats]);

  // useEffect(syncFiltersEffect, [filterConditions]);

  const marks = [
    {
      value: sliderFn.inv(stat.median) as number,
      label: "Avg " + numeral(stat.median.toFixed(2)).format(numberFormat),
    },
  ];
  const slider = (
    <Slider
      value={[lowerboundX, upperboundX]}
      onChange={(e: any) => {
        debugger;
        const [lowerboundX, upperboundX] = e.target.value;
        setLowerboundX(lowerboundX);
        setUpperboundX(upperboundX);
      }}
      size="small"
      marks={marks}
      valueLabelDisplay="auto"
      min={0}
      max={1}
      step={stepSize}
      disableSwap
      valueLabelFormat={getTextForX}
      className={clsx({
        "opacity-50": !filterActive,
      })}
      classes={{
        mark: "bg-blue-500 h-[18px] w-[2px] border border-solid border-blue-500 opacity-1",
        markLabel: "text-xs font-mono",
      }}
    />
  );

  const lowerBoundInput = (
    <InputBase
      onBlur={onBlurLowerbound}
      inputRef={lowerboundInputRef}
      classes={{
        input: "text-center",
      }}
      className="w-[90px] h-8 px-[2px] bg-highlight text-white text-sm mx-0 border border-neutral-500 text-center"
    />
  );

  const upperBoundInput = (
    <InputBase
      onBlur={onBlurUpperbound}
      inputRef={upperboundInputRef}
      classes={{
        input: "text-center",
      }}
      className="w-[90px] h-8 px-[2px] bg-highlight text-white text-sm mx-0 border border-neutral-500"
    />
  );

  return (
    <div className={containerStyle}>
      <ScreenerFilterHeader tag={tag} filterActive={filterActive} />
      <div className="w-full flex gap-4">
        {lowerBoundInput}
        {slider}
        {upperBoundInput}
      </div>
    </div>
  );
}

// export function ScreenerFilter({
//   tag,
//   filterConditions,
//   screenerStats,
//   indexingPreference,
// }) {
//   let stats, tag_stats;
//   stats = screenerStats[indexingPreference || "all_index"];
//   tag_stats = stats[tag.tag];
//   const sliderFn = useInterpolatedRangeSlider({
//     stats: tag_stats,
//     stepSize: stepSize,
//     stepRange,
//   });
//   const numberFormat = getNumberFormat(tag);
//   const [value, setValue] = useState([0, 1]);
//   const [upperBoundText, setUpperboundText] = useState("Any");
//   const [lowerBoundText, setLowerboundText] = useState("Any");
//   const lowerboundInputRef = useRef<any>();
//   const upperboundInputRef = useRef<HTMLInputElement>();

//   const lowerboundActive = value[0] !== 0;
//   const upperboundActive = value[1] !== 1;

//   const filterActive = lowerboundActive || upperboundActive;

//   const onSliderMoved = (e, newValue) => {
//     setValue(newValue);
//   };

//   const getSliderValueText = useCallback(
//     (x) => getTextFromSliderXValue(x, numberFormat, sliderFn),
//     [sliderFn, numberFormat]
//   );

//   const updateBoundsTextEffect =
//     (updateBoundary, ref, getBoundaryVal) => () => {
//       if (document.activeElement === ref.current) {
//         return;
//       }
//       updateBoundary(getSliderValueText(getBoundaryVal(value)));
//     };

//   const onFilterConditionUpdated = () => {
//     if (!tag || !filterConditions) {
//       return;
//     }
//     const findOperators = (tag: string, operators: string[]) => (clause) =>
//       clause.field === tag && operators.includes(clause.operator);

//     const lowerFilter = find(
//       filterConditions.clauses,
//       findOperators(tag.tag, ["gte", "gt"])
//     );
//     const upperFilter = find(
//       filterConditions.clauses,
//       findOperators(tag.tag, ["lte", "lt"])
//     );

//     if (lowerFilter) {
//       const lowerValue = parseFloat(lowerFilter.value);
//       const lowerX = sliderFn.inv(lowerValue) as number;
//       setValue([lowerX, value[1]]);
//       setLowerboundText(getSliderValueText(lowerX));
//     }

//     if (upperFilter) {
//       const upperValue = parseFloat(upperFilter.value);
//       const upperX = sliderFn.inv(upperValue) as number;
//       setValue([value[0], upperX]);
//       setUpperboundText(getSliderValueText(upperX));
//     }
//   };

//   const lowerBoundGetter = (value) => value[0];
//   const upperBoundGetter = (value) => value[0];

//   useEffect(() => {
//     updateBoundsTextEffect(
//       setLowerboundText,
//       lowerboundInputRef,
//       lowerBoundGetter
//     );
//   }, [value, setLowerboundText, lowerboundInputRef]);

//   useEffect(() => {
//     updateBoundsTextEffect(
//       setUpperboundText,
//       upperboundInputRef,
//       upperBoundGetter
//     );
//   }, [value, setUpperboundText, upperboundInputRef]);

//   useEffect(onFilterConditionUpdated, [filterConditions, tag]);

//   const onLowerBoundBlur = (e) => {
//     const val = numeral(e.target.value).value() as number;
//     const x = sliderFn.inv(val) as any;
//     if (x >= value[1]) {
//       setLowerboundText(getSliderValueText(value[0]));
//       return;
//     }
//     setValue([x, value[1]]);
//   };

//   const onUpperBoundBlur = (e) => {
//     const val = numeral(e.target.value).value() as number;
//     const x = sliderFn.inv(val) as any;
//     if (x <= value[0]) {
//       setUpperboundText(getSliderValueText(value[1]));
//       return;
//     }
//     setValue([value[0], x]);
//   };

//   const onLowerBoundKeyDown = (e) => {
//     if (e.key === "Enter") {
//       (e.target as any).blur();
//     } else if (e.key === "ArrowUp") {
//       debugger;
//       const newX = value[0] + stepSize;
//       setLowerboundText(getSliderValueText(newX));
//       setValue([newX, value[1]]);
//     } else if (e.key === "ArrowDown") {
//       const newX = value[0] - stepSize;
//       setLowerboundText(getSliderValueText(newX));
//       setValue([newX, value[1]]);
//     }
//   };

//   const onUpperBoundKeyDown = (e) => {
//     if (e.key === "Enter") {
//       (e.target as any).blur();
//     } else if (e.key === "ArrowUp") {
//       const newX = value[1] + stepSize;
//       setLowerboundText(getSliderValueText(newX));
//       setValue([value[0], newX]);
//     } else if (e.key === "ArrowDown") {
//       const newX = value[1] - stepSize;
//       setUpperboundText(getSliderValueText(newX));
//       setValue([value[0], newX]);
//     }
//   };

//   const marks = [
//     {
//       value: sliderFn.inv(tag_stats.median) as number,
//       label: "Avg " + numeral(tag_stats.median.toFixed(2)).format(numberFormat),
//     },
//   ];

//   const containerStyle = clsx("p-1 px-2 bg-neutral-900", {
//     "outline outline-neutral-500 rounded-md": filterActive,
//   });

//   const slider = (
//     <Slider
//       size="small"
//       marks={marks}
//       valueLabelDisplay="auto"
//       onChange={onSliderMoved}
//       min={0}
//       max={1}
//       step={stepSize}
//       disableSwap
//       value={value}
//       className={clsx({
//         "opacity-50": !filterActive,
//       })}
//       classes={{
//         mark: "bg-red-500 h-[14px] w-[3px]  border border-solid border-white",
//         markLabel: "text-xs font-mono",
//       }}
//       valueLabelFormat={(x) => {
//         return getSliderValueText(x);
//       }}
//     />
//   );

//   const lowerBoundInput = (
//     <InputBase
//       onKeyDown={onLowerBoundKeyDown}
//       onBlur={onLowerBoundBlur}
//       inputRef={lowerboundInputRef}
//       onChange={(e) => setLowerboundText(e.target.value)}
//       value={lowerBoundText}
//       classes={{
//         input: "text-center",
//       }}
//       defaultValue={"Any"}
//       className="w-[90px] h-8 px-[2px] bg-highlight text-white text-sm mx-0 border border-neutral-500 text-center"
//     />
//   );

//   const upperBoundInput = (
//     <InputBase
//       onKeyDown={onUpperBoundKeyDown}
//       onBlur={onUpperBoundBlur}
//       inputRef={upperboundInputRef}
//       onChange={(e) => setUpperboundText(e.target.value)}
//       value={upperBoundText}
//       classes={{
//         input: "text-center",
//       }}
//       className="w-[90px] h-8 px-[2px] bg-highlight text-white text-sm mx-0 border border-neutral-500"
//     />
//   );

//   if (!tag_stats) {
//     return <CircularProgress />;
//   }

//   return (
//     <div className={containerStyle}>
//       <ScreenerFilterHeader tag={tag} filterActive={filterActive} />

//       <div className="w-full">
//         <div className="flex gap-4">
//           {lowerBoundInput}
//           {slider}
//           {upperBoundInput}
//         </div>
//       </div>
//       <div className="text-xs">
//         {JSON.stringify(
//           filterConditions.clauses.filter((f) => f.field === tag.tag)
//         )}
//       </div>
//     </div>
//   );
// }
