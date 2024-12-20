"use client";
import React, { useEffect, useState } from "react";
import {
  Wallet,
  Search,
  Send,
  PlusCircle,
  ArrowDownCircle,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import AssetTabs from "./AssetTabs";
import { TokenWithBalance } from "@/lib/types";
import { Session } from "next-auth";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import FundingOptions from "../AddFunds/FundingOptions";
import WithdrawOptions from "../WithdrawOptions/WithdrawOptions";
import TokenSwap from "../Swap/TokenSwap";

interface WalletOverviewProps {
  totalBalanceUSD: number;
  publicKey: string | null;
  tokenBalances: TokenWithBalance[];
  session: Session | null;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({
  totalBalanceUSD,
  publicKey,
  tokenBalances,
  session,
}) => {
  const [activeTab, setActiveTab] = useState<string>("assets");
  const renderTabContent = () => {
    switch (activeTab) {
      case "assets":
        return (
          <AssetTabs tokenBalances={tokenBalances} publicKey={publicKey} />
        );
      case "add":
        return (
          <div>
            <FundingOptions CoinWalaPublicKey={publicKey} />
          </div>
        );
      case "withdraw":
        return (
          <div>
            <WithdrawOptions CoinWalaPublicKey={publicKey} />
          </div>
        );
      case "swap":
        return (
          <div>
            <TokenSwap tokenBalances={tokenBalances} publicKey={publicKey} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderButton = (
    tabName: string,
    label: string,
    icon: React.ReactNode
  ) => (
    <Button
      variant={activeTab === tabName ? "default" : "outline"}
      className={`h-15 flex-1  ${
        activeTab === tabName ? "bg-primary text-primary-foreground" : ""
      } flex flex-col items-center justify-center p-2 sm:flex-row sm:justify-center`}
      onClick={() => setActiveTab(tabName)}
    >
      <div className="flex items-center justify-center w-5 h-5  sm:hidden">
        {icon}
      </div>
      <span className="text-[10px] sm:text-xs">{label}</span>
    </Button>
  );

  return (
    <div>
      <Card className="rounded-xl bg-white p-4 sm:p-8">
        <CardContent className="p-0">
          <h3 className="mb-4 w-full text-left text-base font-bold text-gray-800 sm:text-[26px]">
            <div className="flex items-center justify-start gap-2 sm:gap-4">
              <Image
                alt="user avatar"
                className="rounded-full border border-gray-200 h-[50px] w-[50px] sm:h-[68px] sm:w-[68px]"
                src={session?.user?.image ? session?.user?.image : ""}
                width={68}
                height={68}
              />
              <p className="text-lg font-bold text-gray-800 sm:text-[26px]">
                Welcome, {session?.user?.name}!
              </p>
            </div>
          </h3>
          <div className="flex w-full items-start justify-between">
            <p className="mb-0 inline-flex items-center justify-start text-left text-xs font-semibold text-gray-400 sm:mb-3 sm:text-sm">
              <Wallet className="mr-1 h-4 w-4" />
              CoinWala Account Assets
            </p>
          </div>
          <div className="flex w-full items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl">
                ${totalBalanceUSD?.toFixed(2)}
                <span className="ml-1 text-xl text-gray-600 sm:text-4xl">
                  USD
                </span>
              </h1>
            </div>
            <Button
              variant="outline"
              className="flex items-center justify-center bg-gray-50 px-2 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 sm:px-3 rounded-xl"
              onClick={() => {
                if (publicKey) {
                  navigator.clipboard.writeText(publicKey);
                  toast.success("Public key copied to clipboard!");
                }
              }}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="ml-1 hidden text-xs font-semibold text-gray-600 sm:inline">
                {publicKey ? "Copy Public Key" : "Loading Public Key..."}
              </span>
            </Button>
          </div>
          <div className="mt-4 flex w-full items-start justify-between gap-1 overflow-hidden sm:mt-6 sm:gap-2 sm:items-center">
            {renderButton("assets", "Send", <Send className="h-4 w-4" />)}
            {renderButton(
              "add",
              "Add Funds",
              <PlusCircle className="h-4 w-4" />
            )}
            {renderButton(
              "withdraw",
              "Withdraw",
              <ArrowDownCircle className="h-4 w-4" />
            )}
            {renderButton("swap", "Swap", <Shuffle className="h-4 w-4" />)}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default WalletOverview;
