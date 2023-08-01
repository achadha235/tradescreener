"use client";

import useStaticJSON from "@/client/getStaticJSON";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import { groupBy, orderBy, uniq } from "lodash";
import { useState } from "react";
import { ScreenerFilter } from "./ScreenerFilter/ScreenerFilter";

function SelectTagCategory({
  setCurrentTagType,
  currentTagType,
  categories,
  categoriesInCondition,
}) {
  const tagTypeSelectorClass = "px-2 rounded-sm hover:bg-neutral-600";
  return (
    <div className="flex flex-row">
      <div className="inline-flex flex-1 flex-wrap gap-2 text-[16px] p-2 pb-2">
        <div
          onClick={() => setCurrentTagType("Active")}
          className={clsx("cursor-pointer", tagTypeSelectorClass, {
            "outline-white outline outline-1": currentTagType === "Active",
          })}
        >
          Enabled Filters
        </div>
        {categories.map((category) => {
          return (
            <div
              onClick={() => setCurrentTagType(category)}
              key={category}
              className={clsx("cursor-pointer", tagTypeSelectorClass, {
                " outline-white outline outline-1": category === currentTagType,
                "bg-blue-800": categoriesInCondition.includes(category),
                "bg-neutral-800": !categoriesInCondition.includes(category),
              })}
            >
              {category}
            </div>
          );
        })}
        <div
          onClick={() => setCurrentTagType("All")}
          className={clsx("cursor-pointer", tagTypeSelectorClass, {
            "outline-white outline outline-1": currentTagType === "All",
          })}
        >
          All
        </div>
      </div>
    </div>
  );
}

export function ScreenerControls({ screener }) {
  const [currentTagType, setCurrentTagType] = useState("Active");
  const [indexingPreference, setIndexingPreference] = useState("all_index");

  const { data: allDatatags, isLoading } = useStaticJSON("/datatags.json");
  const { data: enabledTagsStr, isLoading: isLoadingEnabledTags } =
    useStaticJSON("/enabledtags.json");

  const { data: screenerStats, isLoading: isLoadingScreenerStats } =
    useStaticJSON("/screener-index-stats.json");

  if (isLoading || isLoadingScreenerStats || isLoadingEnabledTags) {
    return <CircularProgress />;
  }
  const enabledTags = enabledTagsStr
    ?.split(", ")
    .map((s) => s?.split(":")[0]?.trim());

  let enabledTagsData = orderBy(
    allDatatags.filter((d) => enabledTags?.includes(d.tag)),
    "name"
  );

  const categories = uniq(enabledTagsData.map((d) => d.type));
  const datatagsByCategory = groupBy(enabledTagsData, "type");

  const filterConditions = JSON.parse(screener.screenerData.filter_conditions);
  const tagsInCondition = filterConditions?.clauses.map((c) => c.field);
  let visibleTags: any;

  if (currentTagType === "All") {
    visibleTags = enabledTagsData;
  } else if (currentTagType === "Active") {
    visibleTags = enabledTagsData.filter((d) =>
      tagsInCondition.includes(d.tag)
    );
  } else {
    visibleTags = datatagsByCategory[currentTagType];
  }

  const categoriesInCondition = enabledTagsData
    .filter((d) => tagsInCondition?.includes(d.tag))
    .map((d) => d.type);
  const useDefaultIndexTags = ["marketcap"];
  return (
    <div className="text-2xl bg-background-paper rounded-md p-4  min-h-[250px]">
      <SelectTagCategory
        setCurrentTagType={setCurrentTagType}
        currentTagType={currentTagType}
        categories={categories}
        categoriesInCondition={categoriesInCondition}
      />

      <div className="grid grid-cols-4 gap-4 w-full max-h-[500px] overflow-scroll p-1">
        {visibleTags.map((tag) => (
          <ScreenerFilter
            filterConditions={filterConditions.clauses.filter(
              (filterCondition) => {
                return filterCondition.field === tag.tag;
              }
            )}
            key={tag.tag}
            onConditionChanged={(newConditon) => {
              console.log(newConditon);
            }}
            stat={
              screenerStats[
                useDefaultIndexTags.includes(tag.tag)
                  ? "all"
                  : indexingPreference
              ][tag.tag]
            }
            tag={tag}
          />
        ))}
      </div>
      <div className="w-full flex justify-end">
        <div className="ml-auto">
          <select
            outline-none
            value={indexingPreference}
            onChange={(e) => {
              setIndexingPreference(e.target.value);
            }}
            className=" bg-black text-white outline-none rounded-md p-1 text-xs border-none"
          >
            <option value="all">All Stocks</option>
            <option value="all_index">S&P500 + DowJones</option>
          </select>
        </div>
      </div>
    </div>
  );
}
