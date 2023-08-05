"use client";
import useMyScreeners from "@/client/getMyScreeners";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Button,
  CircularProgress,
  Divider,
  Fade,
  Menu,
  MenuItem,
} from "@mui/material";
import { orderBy, partition } from "lodash";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export function AccountButton() {
  const [mounted, setMounted] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [userToken, setUserToken] = useLocalStorage("userToken", null);
  const { data } = useMyScreeners();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!userToken || !mounted) {
    return null;
  }

  if (userToken) {
    const [inProgressScreeners, completedScreeners] = partition(
      data?.screeners,
      (s) => s.screenerData.status !== "completed"
    );
    return (
      <>
        <Button
          size="small"
          className=" min-w-[140px]"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          id="fade-button"
          onClick={handleClick}
          endIcon={<ArrowDropDownIcon />}
        >
          My Screeners
        </Button>{" "}
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {inProgressScreeners?.length > 0 && (
            <p className="uppercase text-sm text-neutral-400 px-2">
              Still Processing
            </p>
          )}
          {inProgressScreeners.map((screener) => (
            <Link key={screener.id} href={`/screener/${screener.id}`}>
              <MenuItem onClick={handleClose}>
                <span>
                  Screener #{parseInt(screener.id.slice(-5), 16)}{" "}
                  <CircularProgress size={12} />{" "}
                </span>
              </MenuItem>
            </Link>
          ))}

          <Divider />
          {inProgressScreeners?.length > 0 && (
            <p className="uppercase text-sm text-neutral-400 px-2">
              My Screeners
            </p>
          )}

          {orderBy(completedScreeners, "createdAt", "desc")
            .filter((s) => s.screenerData.status === "completed")
            .map((screener) => (
              <Link key={screener.id} href={`/screener/${screener.id}`}>
                <MenuItem onClick={handleClose}>
                  {screener.screenerData.name}
                </MenuItem>
              </Link>
            ))}
        </Menu>
      </>
    );
  }
}
