import { Button } from "@mui/material";
import Logo from "./Logo";
import TextLogo from "./TextLogo";
import { LoginOutlined } from "@mui/icons-material";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingScreen from "./LoadingScreen";
import CreateScreener from "./CreateScreener";
import CommunityScreeners from "./CommunityScreeners";

export default function Splash() {
  // const { user, isLoading } = useUser();
  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-10 p-4">
      <div className="flex flex-col justify-center items-center">
        <Logo color={"#FFFFFF"} className={"h-10 w-10"} />
        <TextLogo className="text-2xl" />
      </div>

      <div className="text-4xl max-w-3xl font-light tracking-tight leading-snug text-center">
        A.I. Powered Stock Screeners
      </div>

      <CreateScreener />

      <CommunityScreeners />
    </div>
  );
}
