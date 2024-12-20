import React from "react";
import { ArrowLeft } from "lucide-react";
import CustomTextField from "../InputComponent";

type FundingOptionsProps = {
  setStep: (value: number) => void;
  setTransferAmount: (value: string) => void;
  amount: string;
};
export default function SendCoinwala({
  setStep,
  setTransferAmount,
  amount,
}: FundingOptionsProps) {
  return (
    <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
      <div
        onClick={() => setStep(1)}
        className="mb-3.5 mr-auto flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
      >
        <span>
          <ArrowLeft className="w-4 h-4" />
        </span>{" "}
        <span>Back</span>
      </div>
      <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
        <CustomTextField setAmount={setTransferAmount} amount={amount} />
      </div>
    </div>
  );
}
