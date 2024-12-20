"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Copy,
  QrCodeIcon,
  RefreshCw,
  SendIcon,
  Wallet,
  Wifi,
} from "lucide-react";

import { toast } from "sonner";
import { Tooltip } from "flowbite-react";
import WalletModal from "@/components/WalletModal";
import { useWallet } from "@solana/wallet-adapter-react";
import Send from "@/components/linkAsWallet/Send";
import SendCoinwala from "@/components/linkAsWallet/SendCoinwala";
import { convertUsdToSol } from "@/lib/KeyStore";
import { Input } from "@/components/ui/input";
import { CoinWala } from "@/lib/url";

interface HyperLinkData {
  keypair: {
    publicKey: PublicKey;
    secretKey: Uint8Array;
  };
  url: URL;
}

const HyperLinkCard: React.FC = () => {
  const [coinwala, setCoinwala] = useState<HyperLinkData | null>(null);
  const [balance, setBalance] = useState<number | null>(0);
  const [usdBalance, setUsdBalance] = useState<number | null>(null);
  const [url, setUrl] = useState<URL>(new URL(window.location.href));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [recipentPublicKey, setRecipentPublicKey] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { publicKey } = useWallet();

  const loadHyperLink = useCallback(async () => {
    const hash = window.location.hash.slice(1);
    setUrl(new URL(window.location.href));
    if (hash) {
      const url = `${process.env.NEXT_PUBLIC_HYPERLINK_ORIGIN}#${hash}`;
      try {
        const coinwalaInstance = await CoinWala.fromLink(url);
        setCoinwala(coinwalaInstance);
        await fetchBalance(coinwalaInstance);
      } catch (error) {
        console.error("Invalid CoinWala link:", error);
        // Handle error state if needed
      }
    }
  }, []);

  useEffect(() => {
    loadHyperLink();
  }, [loadHyperLink, isLoading]);

  const fetchBalance = async (
    coinwalaInstance: HyperLinkData
  ): Promise<void> => {
    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const balanc = await connection.getBalance(
        coinwalaInstance.keypair.publicKey
      );
      console.log("12", coinwalaInstance.keypair.publicKey.toBase58());
      const solBalance = balanc / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data: { solana: { usd: number } } = await response.json();
      setUsdBalance(solBalance * data.solana.usd);
    } catch (error) {
      console.error("Error fetching balance:", error);
      // Handle error state if needed
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url.href);
    toast("Copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completeAmount = async () => {
    if (!coinwala) {
      console.error("No HyperLink available to transfer from.");
      return;
    }
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    const currentBalance = await connection.getBalance(
      coinwala.keypair.publicKey
    );
    createLinkAndTransfer({ amount: currentBalance });
  };

  const handleTransferAmount = async () => {
    if (!coinwala) {
      console.error("No HyperLink available to transfer from.");
      return;
    }
    const amt = await convertUsdToSol(transferAmount);
    const amount = Number(amt) * LAMPORTS_PER_SOL;
    createLinkAndTransfer({ amount: amount });
  };

  const createLinkAndTransfer = async ({ amount }: { amount: number }) => {
    if (!coinwala) {
      console.error("No HyperLink available to transfer from.");
      return;
    }

    try {
      setIsLoading(true);
      const newCoinwala = await CoinWala.create();
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const currentBalance = amount;
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: coinwala.keypair.publicKey,
          toPubkey: newCoinwala.keypair.publicKey,
          lamports: currentBalance - 5000,
        })
      );

      transaction.feePayer = coinwala.keypair.publicKey;
      transaction.recentBlockhash = blockhash;

      const coinwalaInstance = await CoinWala.fromLink(window.location.href);
      if (!coinwalaInstance || !coinwalaInstance.keypair) {
        throw new Error("Invalid HyperLink or missing keypair");
      }
      transaction.sign(coinwalaInstance.keypair);

      const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      setCoinwala(newCoinwala);
      await fetchBalance(coinwala);
      await fetchBalance(newCoinwala);
      setUrl(new URL(newCoinwala.url));
      window.open(newCoinwala.url.toString(), "_blank");
      console.log("newCoinwala", newCoinwala);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      // Handle error state if needed
    }
  };

  const handleTransferToPublickkey = async () => {
    console.log(recipentPublicKey, transferAmount);
    if (!recipentPublicKey || transferAmount === "") {
      toast.error("Missing required information for transfer.");
      return;
    }
    try {
      const publicKey = new PublicKey(recipentPublicKey);
      if (publicKey.toBytes().length !== 32) {
        throw new Error("Invalid public key length");
      }
      const amt = await convertUsdToSol(transferAmount);
      const amount = Number(amt) * LAMPORTS_PER_SOL;
      handleTransfer(publicKey, amount);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Invalid public key:");
    }
  };

  const handleTransferToPersonalWallet = async () => {
    if (!publicKey || !balance || !coinwala) {
      toast.error("Wallet not connected.");
      return;
    }
    const amount = balance * LAMPORTS_PER_SOL;
    handleTransfer(publicKey, amount);
  };

  const handleTransfer = async (publicKey: PublicKey, amount: number) => {
    if (!publicKey || !balance || !coinwala) {
      toast.error("Missing required information for transfer.");
      return;
    }
    setIsLoading(true);

    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: coinwala.keypair.publicKey,
          toPubkey: publicKey,
          lamports: amount - 5000,
        })
      );
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = coinwala.keypair.publicKey;
      transaction.sign(coinwala.keypair);
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [coinwala.keypair]
      );

      console.log(`Transfer successful! Signature: ${signature}`);
      toast.success(`Transfer successful! Signature: ${signature}`);

      await fetchBalance(coinwala);
      setRecipentPublicKey("");
      setTransferAmount("");
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error(
        `Transfer failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSteps = (step: number) => {
    switch (step) {
      case 1:
        return <Send setStep={setStep} />;
      case 2:
        return (
          <div>
            <SendCoinwala
              setStep={setStep}
              setTransferAmount={setTransferAmount}
              amount={transferAmount}
            />
            <Button
              className="mt-1 w-full"
              disabled={transferAmount === ""}
              onClick={() => handleTransferAmount()}
            >
              Send
            </Button>
          </div>
        );

      case 3:
        return (
          <div>
            <SendCoinwala
              setStep={setStep}
              setTransferAmount={setTransferAmount}
              amount={transferAmount}
            />
            <Input
              onChange={(e) => setRecipentPublicKey(e.target.value)}
              placeholder="Public Key"
              className="mt-3"
              value={recipentPublicKey}
            />
            <Button
              className="mt-1 w-full"
              disabled={transferAmount === ""}
              onClick={() => handleTransferToPublickkey()}
            >
              Send
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className=" flex-col flex justify-center items-center my-10">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setShowQrModal(true)}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <QrCodeIcon className="w-4 h-4 mr-2" />
              QR code
            </Button>
          </div>

          {balance !== null && (
            <div className="space-y-6">
              <div className="rounded-xl relative shadow-lg p-6 flex flex-col justify-between w-full h-auto min-h-[16rem] bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Your Balance</h1>
                    <p className="text-sm opacity-75">Solana Wallet</p>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={copied ? "Copied" : "Copy balance"}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-end mt-8">
                  <div>
                    <p className="text-lg font-medium mb-1">
                      {balance.toFixed(2)} SOL
                    </p>
                    {usdBalance !== null && (
                      <h1 className="text-3xl font-bold">
                        ${usdBalance.toFixed(2)}
                      </h1>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-1">
                      <Wifi className="w-6 h-6" />
                    </div>
                    <p className="text-xs opacity-75">POWERED BY</p>
                    <p className="text-sm font-semibold">Coinwala</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <SendIcon className="w-5 h-5 mr-2" />
                  Send
                </Button>
                <Button
                  onClick={completeAmount}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Create new link
                </Button>
                <Button
                  onClick={handleTransferToPersonalWallet}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Transfer
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6">{handleSteps(step)}</div>

          {showQrModal && coinwala?.keypair?.publicKey && (
            <WalletModal
              isVisible={showQrModal}
              onClose={() => setShowQrModal(false)}
              publicKey={coinwala?.keypair?.publicKey.toBase58().toString()}
            />
          )}
        </CardContent>
        <p className="text-sm text-muted-foreground text-center p-4 border-t">
          The link to this page contains this value. Make sure you don't lose
          it!
        </p>
      </Card>
    </div>
  );
};

export default HyperLinkCard;
