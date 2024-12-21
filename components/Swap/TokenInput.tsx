"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputputTokenBox } from "./InputputTokenBox";
import { Token, TokenWithBalance } from "@/lib/types";
import { OutputTokenBox } from "./OutputTokenBox";

interface TokenInputProps {
  label: string;
  tokens?: TokenWithBalance[] | null;
  readOnly?: boolean;
  selectedToken?: TokenWithBalance | undefined;
  tokenList?: Token[] | null;
  setInputSelectedToken?: React.Dispatch<React.SetStateAction<string>>;
  setOutputSelectedToken?: React.Dispatch<React.SetStateAction<string>>;
  setAmount?: React.Dispatch<React.SetStateAction<string>>;
  amount?: string;
}

export default function TokenInput({
  label,
  tokens,
  selectedToken,
  tokenList,
  setInputSelectedToken,
  setOutputSelectedToken,
  readOnly = false,
  setAmount,
  amount,
}: TokenInputProps) {
  const isInsufficientFunds =
    amount &&
    selectedToken &&
    parseFloat(amount) > parseFloat(selectedToken.balance || "0");
  const formatNumber = (num: string) => {
    if (!num || num === "") return "";
    const cleanNum = num.toString().replace(/,/g, "");
    if (parseFloat(cleanNum) > 999999999) {
      return parseFloat(cleanNum).toExponential(2);
    }
    const parts = cleanNum.split(".");
    const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.length > 1
      ? `${formattedInteger}.${parts[1]}`
      : formattedInteger;
  };

  return (
    <div
      className={`
        w-full 
        flex 
        bg-white 
        p-4 
        border 
        ${isInsufficientFunds ? "border-red-500" : "border-grey-100"}
        ${readOnly ? "rounded-b-lg" : "rounded-t-lg"}
        flex-col 
        sm:flex-row 
        items-center 
        space-y-2 
        sm:space-y-0 
        sm:space-x-4
      `}
    >
      <div className="flex flex-col w-full sm:w-1/2 space-y-2">
        <p className="text-xs flex float-start font-semibold text-grey-800">
          {label}
        </p>
        {!readOnly
          ? tokens && (
              <InputputTokenBox
                tokens={tokens}
                setInputSelectedToken={setInputSelectedToken}
              />
            )
          : readOnly && (
              <OutputTokenBox
                setOutputSelectedToken={setOutputSelectedToken}
                tokens={tokenList}
              />
            )}
        {!readOnly && (
          <div className="text-xs flex float-start text-grey-400">
            <span>Current Balance: </span>
            <span className="font-bold">
              {formatNumber(selectedToken?.balance || "0")}{" "}
              {selectedToken?.symbol}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full sm:w-1/2 items-end space-y-2">
        {isInsufficientFunds && (
          <div
            className="
            flex 
            flex-row 
            items-center 
            gap-1 
            self-end 
            text-xs 
            font-semibold 
            text-red-500 
            bg-red-50 
            select-none 
            rounded 
            px-1 
            py-0.5
          "
          >
            Insufficient Funds
          </div>
        )}

        <div className="w-full flex flex-col items-end">
          <input
            type="text"
            className={`
              w-full 
              border-none 
              bg-white 
              text-end 
              font-light 
              outline-none 
              text-2xl 
              sm:text-4xl 
              lg:text-5xl 
              break-words 
              overflow-x-auto
              ${isInsufficientFunds ? "text-red-500" : ""}
            `}
            placeholder="0"
            value={formatNumber(amount || "")}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              if (setAmount) {
                setAmount(value);
              }
            }}
            readOnly={readOnly}
          />

          {!readOnly && (
            <Button
              variant="secondary"
              size="sm"
              className="
                mt-2 
                h-6 
                min-h-6 
                px-2 
                text-xs 
                rounded-xl
              "
              onClick={() =>
                setAmount && setAmount(selectedToken?.balance || "")
              }
            >
              Max
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
