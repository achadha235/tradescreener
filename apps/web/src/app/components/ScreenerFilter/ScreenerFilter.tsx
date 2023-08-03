"use client";
import { Info } from "@mui/icons-material";
import { CircularProgress, InputBase, Slider, Tooltip } from "@mui/material";
import clsx from "clsx";
import { debounce, filter, find, isNil, throttle } from "lodash";
import { useInterpolatedRangeSlider as interpolatedRangeSlider } from "@/app/components/ScreenerFilter/rangeSlider";
import numeral from "numeral";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Decimal from "decimal.js";

const stepSize = 0.01;
const stepRange = [0.25, 0.8];

export function getNumberFormat(tag) {
  let numberFormat = "0,0[.]00[00]";
  if (tag.units.startsWith("USD")) {
    numberFormat = "$0,0.0[00]a";
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

  // useEffect(() => {
  //   let lbFilter;
  //   if (lowerboundFilter) {
  //     lbFilter = lowerboundFilter;
  //   } else {
  //     lbFilter = {
  //       field: tag.tag,
  //       operator: "gte",
  //     };
  //   }
  //   const y = sliderFn.f(lowerboundX);
  //   if (y === -Infinity || y === Infinity) {
  //     setLowerBoundFilter(null);
  //     return;
  //   }

  //   setLowerBoundFilter({
  //     ...lbFilter,
  //     value: numeral(y).format("0[.][00000]"),
  //   });
  // }, [lowerboundX, setLowerBoundFilter, sliderFn]);

  // useEffect(() => {
  //   let ubFilter;
  //   if (upperboundFilter) {
  //     ubFilter = upperboundFilter;
  //   } else {
  //     ubFilter = {
  //       field: tag.tag,
  //       operator: "lte",
  //     };
  //   }
  //   const y = sliderFn.f(upperboundX);
  //   if (y === -Infinity || y === Infinity) {
  //     setUpperBoundFilter(null);
  //     return;
  //   }

  //   setUpperBoundFilter({
  //     ...ubFilter,
  //     value: numeral(y).format("0[.][00000]"),
  //   });
  // }, [upperboundX, setUpperBoundFilter, sliderFn]);

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

  const triggerConditionUpdate = () => {
    const getVal = (v) => {
      if (v === "Any") {
        return v;
      }
      return new Decimal(numeral(v).format("0[.][00000]")).toString();
    };
    onConditionChanged({
      tag,
      lower: getVal(lowerboundInputRef.current.value),
      upper: getVal(upperboundInputRef.current.value),
    });
  };

  const onBlurUpperbound = (e) => {
    let newUpperX;
    if (e.target.value === "Any" || e.target.value.trim() === "") {
      newUpperX = 1;
    }
    const y: any = numeral(e.target.value).value();
    if (isNil(y) && upperboundInputRef?.current) {
      upperboundInputRef.current.value = getTextForX(upperboundX);
      triggerConditionUpdate();
    }
    const yLower = sliderFn.f(lowerboundX);
    if (y >= yLower!) {
      newUpperX = sliderFn.inv(y);
    }

    if (newUpperX) {
      setUpperboundX(newUpperX);
      triggerConditionUpdate();
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
      triggerConditionUpdate();
    }
    const yUpper = sliderFn.f(upperboundX);
    if (y <= yUpper!) {
      newLowerX = sliderFn.inv(y);
    }

    if (newLowerX) {
      triggerConditionUpdate();
      setLowerboundX(newLowerX);
    }
  };

  const marks = [
    {
      value: sliderFn.inv(stat.median) as number,
      label: "Avg " + numeral(stat.median.toFixed(2)).format(numberFormat),
    },
  ];
  const slider = (
    <Slider
      onChangeCommitted={() => {
        triggerConditionUpdate();
      }}
      value={[lowerboundX, upperboundX]}
      size="small"
      onChange={(e: any) => {
        const [lowerboundX, upperboundX] = e.target.value;
        setLowerboundX(lowerboundX);
        setUpperboundX(upperboundX);
      }}
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
        markLabel: "text-xs font-mono",
      }}
    />
  );

  const lowerBoundInput = (
    <InputBase
      style={{
        fontSize: 12,
      }}
      onBlur={onBlurLowerbound}
      inputRef={lowerboundInputRef}
      classes={{
        input: "text-center",
      }}
      className="w-[90px] h-8 px-[2px] bg-highlight text-white mx-0 border border-neutral-500 text-center"
    />
  );

  const upperBoundInput = (
    <InputBase
      style={{
        fontSize: 12,
      }}
      onBlur={onBlurUpperbound}
      inputRef={upperboundInputRef}
      classes={{
        input: "text-center text-xs",
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
