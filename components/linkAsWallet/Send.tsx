import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ChevronRight, KeyRound, Link2 } from "lucide-react";
type FundingOptionsProps = {
  setStep: (value: number) => void;
};
export default function Send({ setStep }: FundingOptionsProps) {
  return (
    <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
      <div
        onClick={() => setStep(0)}
        className="mb-3.5 mr-auto flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
      >
        <span>
          <ArrowLeft className="w-4 h-4" />
        </span>{" "}
        <span>Back</span>
      </div>
      <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
        <Button
          onClick={() => setStep(2)}
          className="flex justify-between text-base font-medium p-10 xs:w-full xs:text-base"
        >
          <div className="flex items-start justify-start gap-[10px]">
            <div className="flex items-center justify-center align-middle mt-2 rounded-full bg-grey-50 xs:p-3">
              <Link2 />
            </div>
            <div className="flex-col items-start justify-start rounded-full bg-grey-50 xs:p-3">
              <div className="text-left">Send Coinwala</div>
              <div className="text-left text-xs font-normal text-grey-500">
                Create an Coinwala with the value that you can share with
                anyone.
              </div>
            </div>
          </div>
          <ChevronRight />
        </Button>
        <Button
          onClick={() => setStep(3)}
          className="flex justify-between text-base font-medium p-10 xs:w-full xs:text-base"
        >
          <div className="flex items-start justify-start gap-[10px]">
            <div className="flex items-center justify-center align-middle mt-2 rounded-full bg-grey-50 xs:p-3">
              <KeyRound />
            </div>
            <div className="flex-col items-start justify-start rounded-full bg-grey-50 xs:p-3">
              <div className="text-left">Send to public key</div>
              <div className="text-left text-xs font-normal text-grey-500">
                Send to Solana wallet address
              </div>
            </div>
          </div>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
