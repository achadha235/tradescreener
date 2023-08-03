"use client";
import useMyScreeners from "@/client/getMyScreeners";
import useScreener from "@/client/getScreener";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Button,
  CircularProgress,
  Divider,
  Fade,
  Menu,
  MenuItem,
} from "@mui/material";
import clsx from "clsx";
import { isNil } from "lodash";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Logo from "./Logo";

function AccountButton() {
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
    return (
      <>
        <Button
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
          {data?.screeners
            .filter((s) => s.screenerData.status === "completed")
            .map((screener) => (
              <Link key={screener.id} href={`/screener/${screener.id}`}>
                <MenuItem onClick={handleClose}>
                  {screener.screenerData.name}
                </MenuItem>
              </Link>
            ))}

          <Divider />
          <p className="uppercase text-sm text-neutral-400 px-2">
            Still Processing
          </p>
          {data?.screeners
            .filter((s) => s.screenerData.status !== "completed")
            .map((screener) => (
              <Link key={screener.id} href={`/screener/${screener.id}`}>
                <MenuItem onClick={handleClose}>
                  <span>
                    Screener #{parseInt(screener.id.slice(-5), 16)}{" "}
                    <CircularProgress size={12} />{" "}
                  </span>
                </MenuItem>
              </Link>
            ))}
        </Menu>
      </>
    );
  }
}

export default function AppHeader() {
  const params: any = useParams();
  const { data } = useScreener(params?.screenerId, isNil(params.screenerId));
  const screenerName = data?.screener?.screenerData?.name;
  const screenerNumberID =
    "Screener #" + parseInt(data?.screener.id.slice(-5), 16);
  const displayId = screenerName || screenerNumberID;
  return (
    <div className="flex w-full justify-between p-2">
      <Link href="/">
        <Logo />
      </Link>
      {data && (
        <div
          className={clsx("flex justify-center items-center", {
            "text-neutral-500": isNil(screenerName),
          })}
        >
          {displayId}
        </div>
      )}
      <div className="w-auto h-2">
        <AccountButton />
      </div>
    </div>
  );
}
