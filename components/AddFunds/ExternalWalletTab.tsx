"use client";
import React, { useEffect, useState } from "react";
import CustomTextField from "../InputComponent";
import { Button } from "../ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import BouncingDotsLoader from "../BouncingDotsLoader";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ArrowLeft } from "lucide-react";
import { Combobox } from "../Combobox";
import { convertUsdToSol, convertSolToUsd } from "@/lib/KeyStore";
import { useTransferSOL } from "@/app/hooks/useTransferSOL";

interface FundingOptionsProps {
  CoinWalaPublicKey: string | null;
  setShowExternalWallet: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Token {
  value: string;
  label: string;
  symbol: string;
  logoURI: string;
  balance: number;
}

export default function ExternalWalletTab({
  CoinWalaPublicKey,
  setShowExternalWallet,
}: FundingOptionsProps) {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const { transferSOL, isTransferring, error } = useTransferSOL();
  const [transferredAmount, setTransferredAmount] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    const updateBalance = (updatedAccountInfo: any) => {
      setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
    };

    const subscriptionId = connection.onAccountChange(
      publicKey,
      updateBalance,
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    });

    // Cleanup function
    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, publicKey]);

  const handleDeposit = async () => {
    if (!CoinWalaPublicKey) {
      console.error("CoinWalaPublicKey is null");
      return;
    }

    try {
      setLoading(true);
      const amtInSolString = await convertUsdToSol(amount);
      const amtInSol = parseFloat(amtInSolString);

      if (isNaN(amtInSol)) {
        throw new Error("Invalid SOL amount");
      }

      const amtInLamports = Math.round(amtInSol * LAMPORTS_PER_SOL);

      // Get the initial balance
      const initialBalance = await connection.getBalance(
        new PublicKey(CoinWalaPublicKey)
      );

      // Perform the transfer
      await transferSOL(CoinWalaPublicKey, amtInLamports);

      if (error) {
        console.error("Transfer error:", error);
        // Handle error, maybe show it to the user
      } else {
        // Get the final balance after transfer
        const finalBalance = await connection.getBalance(
          new PublicKey(CoinWalaPublicKey)
        );

        // Calculate the actual transferred amount
        const transferredLamports = finalBalance - initialBalance;
        const transferredSol = transferredLamports / LAMPORTS_PER_SOL;

        // Convert back to USD for display
        const transferredUsd = await convertSolToUsd(transferredSol.toString());
        setTransferredAmount(parseFloat(transferredUsd));

        console.log(
          `Transfer successful. Transferred amount: ${transferredUsd} USD`
        );
        // Update UI to show success and transferred amount
      }
    } catch (err) {
      console.error("Deposit error:", err);
      // Handle error, maybe show it to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="py-5">
        <div
          onClick={() => {
            setShowExternalWallet(false);
          }}
          className="mb-3.5 mr-auto text-gray-500 flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
        >
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>{" "}
          <span>Back</span>
        </div>
        <div className=" flex-col px-15 py-1">
          <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans  text-gray-500 xs:text-[26px]">
            Deposit via connected wallet
          </h4>
          <p className="pb-3 text-sm text-left font-normal text-gray-500">
            Specify asset and amount:
          </p>
        </div>
        <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          <div>
            <Combobox
              CoinWalaPublicKey={publicKey?.toString() ?? ""}
              onTokenSelect={setSelectedToken}
            />
          </div>
          <div className="flex w-full items-center text-gray-500 justify-center text-left text-sm font-normal text-grey-700 xs:text-base">
            <span className="text-sm font-semibold text-grey-700 ">
              Your available SOL:{" "}
            </span>
            <span className="text-sm font-bold text-grey-700">
              {balance ? balance.toFixed(2) : "0.00"}
              {" SOL"}
            </span>
          </div>
          <div>
            <div>
              <CustomTextField amount={amount} setAmount={setAmount} />
            </div>
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  setShowExternalWallet(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={loading || isTransferring}
                onClick={handleDeposit}
              >
                {loading || isTransferring ? <BouncingDotsLoader /> : "Deposit"}
              </Button>
            </div>
            {transferredAmount !== null && (
              <p className="mt-2 text-sm text-gray-600">
                Actual amount transferred: ${transferredAmount.toFixed(2)} USD
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
