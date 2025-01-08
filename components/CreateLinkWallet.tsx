"use client";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import ConnectOptionsButton from "./ui/ConnectOptionsButton";
import { Card } from "./ui/card";

import { Button } from "./ui/button";

import LinkPopup from "./LinkPopup";
import { convertUsdToSol } from "@/lib/KeyStore";
import BouncingDotsLoader from "./BouncingDotsLoader";
import CustomTextField from "./InputComponent";
import { CoinWala } from "@/lib/url";

export default function CreateLinkWallet() {
  const [amount, setAmount] = useState<string>("0");
  const [generatedLink, setGeneratedLink] = useState("");
  const [error, setError] = useState("");
  const { connected, publicKey, sendTransaction } = useWallet();
  const [linkPopupOpen, setLinkPopupOpen] = useState(false);
  const [signature, setSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSelection = (selectedOption: any) => {
    console.log("Selected option:", selectedOption);
    // Handle the selected option here
  };

  const createLinkAndTransfer = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      // Create CoinWala
      setIsLoading(true);
      const coinwala = await CoinWala.create();
      const coinwalaUrl = coinwala.url.toString();

      // Transfer funds
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      let amt: number = Number(await convertUsdToSol(amount));
      const lamports = BigInt(Math.round(amt * LAMPORTS_PER_SOL));
      console.log("amt", amt, lamports);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(coinwala.keypair.publicKey),
          lamports: BigInt(Number(amt) * LAMPORTS_PER_SOL),
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      window.open(coinwalaUrl, "_blank");
      setLinkPopupOpen(true);
      setGeneratedLink(coinwalaUrl);
      setSignature(signature);
      setGeneratedLink(coinwalaUrl);
      setIsLoading(false);
      console.log("Transfer successful. Signature:", signature);
      setError("");
      setAmount("0");
    } catch (err) {
      setIsLoading(false);
      console.error("Error:", err);
      setError("Error creating CoinWala or transferring funds.");
    }
  };
  return (
    <div>
      <Card className="w-full max-w-md mx-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Coinwala</h2>
        <p className="text-center text-sm text-gray-600">
          {
            "Send crypto & NFTs to anyone, even if they don't have a wallet. No app needed!"
          }
        </p>
        <ConnectOptionsButton onSelect={handleSelection} />
        <div className="inline-flex w-full flex-wrap items-center justify-center gap-y-1 py-2 text-xs text-grey-700">
          Supported assets:
          <img
            className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full"
            src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            alt="SOL"
          />
          SOL,
          <img
            className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full"
            src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
            alt="USDC"
          />
          <span className="flex w-max items-center justify-start">
            <span className="shrink-0">USDC, and all Solana tokens + NFTs</span>
          </span>
        </div>

        <CustomTextField setAmount={setAmount} amount={amount} />

        <Button
          disabled={!connected || isLoading}
          onClick={createLinkAndTransfer}
          className="w-full"
        >
          {isLoading ? <BouncingDotsLoader /> : "Create Coinwala and Transfer"}
        </Button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </Card>

      <LinkPopup
        linkPopupOpen={linkPopupOpen}
        link={generatedLink}
        signature={signature}
        setLinkPopupOpen={setLinkPopupOpen}
      />
    </div>
  );
}
