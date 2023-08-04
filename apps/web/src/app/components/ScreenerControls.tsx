"use client";

import useStaticJSON from "@/client/getStaticJSON";
import { Close, Lightbulb } from "@mui/icons-material";
import { Box, Button, CircularProgress, Modal, Paper } from "@mui/material";
import clsx from "clsx";
import { groupBy, orderBy, uniq } from "lodash";
import { useEffect, useState } from "react";
import { ScreenerFilter } from "./ScreenerFilter/ScreenerFilter";
import { motion, AnimatePresence } from "framer-motion";

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

export function ScreenerControls({
  loading,
  screener,
  screenerConditionChanged,
}) {
  const [currentTagType, setCurrentTagType] = useState("Active");
  const [indexingPreference, setIndexingPreference] = useState("all_index");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: allDatatags, isLoading } = useStaticJSON("/datatags.json");
  const { data: enabledTagsStr, isLoading: isLoadingEnabledTags } =
    useStaticJSON("/enabledtags.json");

  const { data: screenerStats, isLoading: isLoadingScreenerStats } =
    useStaticJSON("/screener-index-stats.json");

  const enabledTags = enabledTagsStr
    ?.split(", ")
    .map((s) => s?.split(":")[0]?.trim());

  let enabledTagsData = orderBy(
    allDatatags?.filter((d) => enabledTags?.includes(d.tag)),
    "name"
  );

  const categories = uniq(enabledTagsData.map((d) => d.type));
  const datatagsByCategory = groupBy(enabledTagsData, "type");

  const filterConditions = JSON.parse(screener.screenerData.filter_conditions);
  const [updatedFilterCondition, setUpdatedFilterCondition] =
    useState(filterConditions);

  const tagsInCondition = uniq([
    ...filterConditions?.clauses.map((c) => c.field),
    ...updatedFilterCondition?.clauses.map((c) => c.field),
  ]);
  let visibleTags: any;
  useEffect(() => {
    screenerConditionChanged?.(updatedFilterCondition);
  }, [updatedFilterCondition]);

  if (isLoading || isLoadingScreenerStats || isLoadingEnabledTags) {
    return <CircularProgress />;
  }
  if (currentTagType === "All") {
    visibleTags = enabledTagsData.map((t) => t.tag);
  } else if (currentTagType === "Active") {
    visibleTags = enabledTagsData
      .filter((d) => tagsInCondition.includes(d.tag))
      .map((d) => d.tag);
  } else {
    visibleTags = datatagsByCategory[currentTagType].map((t) => t.tag);
  }

  const categoriesInCondition = enabledTagsData
    .filter((d) => tagsInCondition?.includes(d.tag))
    .map((d) => d.type);
  const useDefaultIndexTags = ["marketcap"];

  const onScreenerFilterConditionChanged = ({ tag, upper, lower }) => {
    const otherConditions = updatedFilterCondition.clauses.filter((c) => {
      return c.field !== tag.tag;
    });
    if (upper !== "Any") {
      otherConditions.push({
        field: tag.tag,
        operator: "lte",
        value: upper.toString(),
      });
    }

    if (lower !== "Any") {
      otherConditions.push({
        field: tag.tag,
        operator: "gte",
        value: lower.toString(),
      });
    }

    setUpdatedFilterCondition({
      ...updatedFilterCondition,
      clauses: otherConditions,
    });
  };

  return (
    <div className="text-2xl relative bg-background-paper rounded-md p-2  min-h-[250px]">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",

            top: 0,
            left: 0,
            zIndex: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="absolute w-full h-full bg-[rgba(0,0,0,0.4)] top-0 left-0 z-40 flex justify-center items-center"
        >
          <CircularProgress />
        </motion.div>
      )}
      <SelectTagCategory
        setCurrentTagType={setCurrentTagType}
        currentTagType={currentTagType}
        categories={categories}
        categoriesInCondition={categoriesInCondition}
      />

      <div
        className={clsx(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full overflow-scroll p-1 mt-4",
          { "max-h-[500px]": currentTagType !== "Active" }
        )}
      >
        {enabledTagsData.map((tag) => (
          <div
            key={tag.tag}
            className={clsx({ hidden: !visibleTags.includes(tag.tag) })}
          >
            <ScreenerFilter
              onConditionChanged={onScreenerFilterConditionChanged}
              filterConditions={filterConditions.clauses.filter(
                (filterCondition) => {
                  return filterCondition.field === tag.tag;
                }
              )}
              stat={
                screenerStats[
                  useDefaultIndexTags.includes(tag.tag)
                    ? "all"
                    : indexingPreference
                ][tag.tag]
              }
              tag={tag}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end mt-4">
        <Button startIcon={<Lightbulb />} onClick={() => setModalOpen(true)}>
          Explain
        </Button>
        <div className="ml-auto">
          <select
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
            className="w-full max-w-2xl p-4 overflow-scroll relative"
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
            <div className="text-lg font-bold text-neutral-500 mb-4">
              Explanation
            </div>
            <ol className="text-base gap-4 flex-col flex">
              {screener.screenerData.explanation.map((reason, i) => {
                if (
                  reason.indexOf("Country") > -1 &&
                  reason.indexOf("'United States of America'") > -1
                ) {
                  return null;
                }
                return <li key={i}>{reason}</li>;
              })}
            </ol>
          </Paper>
        </Box>
      </Modal>
    </div>
  );
}
