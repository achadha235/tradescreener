"use client";
import useLimit from "@/client/getLimit";
import useSubmitScreenerRequest from "@/client/submitScreenerRequest";
import { analytics, trackFullstory } from "@/tracking";
import { Check, Search } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  InputBase,
  Modal,
  Paper,
} from "@mui/material";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import useGetMe from "@/client/getMe";
import { isNil } from "lodash";
import { SignupPrompt } from "./SignupPrompt";

const monthlyUrlBase = "https://buy.stripe.com/test_6oE8zw0pI9K87tu000";

export function Plan({
  currentPlan,
  paymentLink,
  name,
  features,
  price,
  discount,
}: {
  currentPlan: boolean;
  paymentLink?;
  name;
  features;
  price;
  discount?;
}) {
  let button;
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const btnClass = "w-full self-end place-self-end justify-self-end mt-auto";
  if (currentPlan) {
    button = (
      <Button
        variant="contained"
        disabled
        color="primary"
        fullWidth
        className={btnClass}
      >
        Current Plan
      </Button>
    );
  } else {
    let cta = "Subscribe";
    if (price === "Free") {
      cta = "Create a free account";
      button = (
        <>
          <Button
            onClick={() => {
              setSignupModalOpen(true);
            }}
            variant="contained"
            color="secondary"
            fullWidth
            className={btnClass}
          >
            {cta}
          </Button>

          <Modal
            onClose={() => {
              setSignupModalOpen(false);
            }}
            open={signupModalOpen}
            className="flex justify-center items-center"
          >
            <Paper className="w-full max-w-xl p-10">
              <div className="text-3xl">Sign Up</div>
              <SignupPrompt screener={{}} />
            </Paper>
          </Modal>
        </>
      );
    } else {
      button = (
        <Link href={paymentLink} className={btnClass}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            className={btnClass}
          >
            {cta}
          </Button>
        </Link>
      );
    }
  }

  return (
    <div className="bg-neutral-800 w-full p-4 flex flex-col gap-6 rounded-lg">
      <div className="text-2xl">{name}</div>
      <div className="font-bold text-4xl flex items-center gap-3">
        {price}{" "}
        {discount && (
          <span className="bg-blue-700 text-white rounded-full p-1 px-3 text-base">
            {discount}
          </span>
        )}
      </div>
      {features.map((feature) => {
        return (
          <div key={feature} className="flex">
            <Check className="mr-2" color="success" />
            {feature}
          </div>
        );
      })}
      {button}
      {/* {currentPlan ? (
        <Button
          variant="contained"
          disabled
          color="primary"
          fullWidth
          className="w-full self-end place-self-end justify-self-end mt-auto"
        >
          Current Plan
        </Button>
      ) : (
        <Link
          href={paymentLink}
          className="w-full self-end place-self-end justify-self-end mt-auto"
        >
          <Button variant="contained" color="secondary" fullWidth>
            Subscribe
          </Button>
        </Link>
      )} */}
    </div>
  );
}

export function PremiumPlans({ open, onClose, user, plan, billingPeriod }) {
  const monthlyPlan = new URL(monthlyUrlBase);
  if (user && user.id && user.email) {
    monthlyPlan.searchParams.set("client_reference_id", user.id);
    monthlyPlan.searchParams.set("prefilled_email", user.email);
  }

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      className="flex justify-center items-center outline-none"
    >
      <Paper className="p-10 rounded-lg outline-none">
        <div className="text-4xl">Upgrade Your Plan</div>
        <p>Upgrade your plan to get unlimited screeners</p>
        <div className="flex flex-row gap-4">
          <Plan
            currentPlan={plan === "Basic"}
            price={"Free"}
            name={"Basic"}
            features={["3 screeners / week", "Limited access to new features"]}
          />

          <Plan
            currentPlan={plan === "Pro" && billingPeriod === "monthly"}
            price={"$9.99"}
            paymentLink={monthlyPlan}
            name={"Monthly"}
            features={[
              "Unlimited screeners",
              "Exclusive access to new features",
            ]}
          />

          <Plan
            currentPlan={plan === "Pro" && billingPeriod === "yearly"}
            price={"$95.90"}
            discount={"20% discount"}
            paymentLink={monthlyUrlBase}
            name={"Yearly"}
            features={[
              "Unlimited screeners",
              "Exclusive access to new features",
            ]}
          />
        </div>
      </Paper>
    </Modal>
  );
}

export function ScreenerUsageRemaining() {
  const [open, setOpen] = useState(false);
  const { data: limitData, isLoading: limitIsLoading } = useLimit();
  let text;
  let remaining = 0;
  if (!limitIsLoading && limitData) {
    remaining = limitData.limit - limitData.usage;
    if (remaining === 0) {
      text = "Get Premium to unlock unlimited requests";
    } else if (remaining === 1) {
      text = "1 request remaining. Upgrade now.";
    } else if (remaining > 1) {
      text = `${remaining} requests remaining.`;
    }
  }

  return (
    <>
      {limitData && (
        <PremiumPlans
          billingPeriod={limitData.billingPeriod}
          plan={limitData.plan}
          user={limitData.user}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
      <p
        onClick={() => {
          setOpen(true);
        }}
        className=" bg-blue-700 rounded-full px-4 p-1 my-0"
      >
        {text ? text : <CircularProgress size={10} />}
      </p>
    </>
  );
}

export default function CreateScreener({ defaultValue }: { defaultValue? }) {
  const success = false;
  const [active, setActive] = useState(false);
  const [screenerPrompt, setScreenerPrompt] = useState(defaultValue || "");
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const router = useRouter();
  const onSubmitRequestSuccess = (data) => {
    if (data.success) {
      router.push("/screener/" + data.screener.id);
    }
  };

  // const [monthlyUrl, setMonthlyUrl] = useState(monthlyUrlBase);

  // useEffect(() => {
  //   if (userData && userData.user?.email) {
  //     const { email } = userData;
  //     const newMonthlyUrl = new URL(monthlyUrl.toString());
  //     newMonthlyUrl.searchParams.set("prefilled_email", userData.user?.email);
  //     setMonthlyUrl(newMonthlyUrl);
  //   }
  // }, [userData]);

  const onSubmitRequestError = (error) => {
    console.error("Error submitting prompt request", error);
  };

  const { trigger, data, isMutating, error } = useSubmitScreenerRequest({
    onError: onSubmitRequestError,
    onSuccess: onSubmitRequestSuccess,
  });
  function onSubmitRequestClicked() {
    console.log("Submitting prompt request", screenerPrompt);
    trackFullstory("submit prompt", {
      prompt: screenerPrompt,
    });
    analytics?.track("submit prompt", {
      prompt: screenerPrompt,
    });

    trigger(JSON.stringify({ screenerPrompt }));
  }

  // const goProModal = (
  //   <Modal className="flex justify-center items-center" open={false}>
  //     <Paper className="w-full max-w-4xl p-10">
  //       <div className="text-4xl">Upgrade Your Plan</div>
  //       <p>Upgrade your plan to get unlimited screeners</p>
  //       <div className="flex flex-row">
  //         <div className="flex flex-row justify-between rounded-lg w-full gap-2">
  //           <div className="bg-neutral-800 w-full p-4 flex flex-col gap-4">
  //             <div className="text-2xl">Monthly</div>
  //             <div className="font-bold text-4xl">$9.99</div>
  //             <div className="flex">
  //               <Check /> Unlimited screeners
  //             </div>

  //             <div className="flex">
  //               <Check /> Premium access to Yellowbrick Road Newsletter
  //             </div>

  //             <Link href={monthlyUrl.toString()} className="w-full">
  //               <Button variant="contained" color="secondary">
  //                 Subscribe
  //               </Button>
  //             </Link>
  //           </div>
  //           <div className="bg-neutral-800 w-full p-4 flex flex-col gap-4">
  //             <div className="text-2xl">Yearly</div>
  //             <div className="font-bold text-4xl">
  //               $95.99{" "}
  //               <span className="bg-blue-700 text-white rounded-full p-1 px-3 text-base">
  //                 Save 20%
  //               </span>{" "}
  //             </div>
  //             <div className="flex">
  //               <Check /> Unlimited screeners
  //             </div>

  //             <div className="flex">
  //               <Check /> Premium access to Yellowbrick Road Newsletter
  //             </div>
  //             <Button variant="contained" color="secondary">
  //               Subscribe
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </Paper>
  //   </Modal>
  // );

  const requestScreen = (
    <div className="flex flex-col justify-center items-center gap-4 w-full max-w-2xl p-4 -ml-2">
      <div
        className={clsx(
          "w-full flex flex-col bg-highlight border-4 border-solid p-4 m-2 shadow-lg  rounded-xl",
          {
            "border-neutral-600": !active,
            "border-white": active,
          }
        )}
      >
        <InputBase
          onFocus={(e) => setActive(true)}
          onBlur={(e) => setActive(false)}
          disabled={isMutating}
          value={screenerPrompt}
          onChange={(e) => setScreenerPrompt(e.target.value)}
          multiline
          className="w-full border-none rounded-none text-2xl text-white"
          minRows={1}
          maxRows={8}
          placeholder="What kind of stocks are you looking for?"
        />
        <Button
          onClick={onSubmitRequestClicked}
          disabled={
            isMutating ||
            defaultValue === screenerPrompt ||
            screenerPrompt.trim().length === 0
          }
          startIcon={isMutating ? <CircularProgress size={10} /> : <Search />}
          className="mt-4 ml-auto"
          variant="contained"
          size="large"
          color="secondary"
        >
          {isMutating ? "Submitting Request" : "Find Stocks"}
        </Button>
      </div>
      <ScreenerUsageRemaining />
    </div>
  );

  if (!success) {
    return requestScreen;
  }
}
