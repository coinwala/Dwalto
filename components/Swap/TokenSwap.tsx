"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpDown, Check } from "lucide-react";
import TokenInput from "./TokenInput";
import { SwapRouteResponse, Token, TokenWithBalance } from "@/lib/types";
import { useEffect, useState } from "react";
import fetch from "cross-fetch";
import SwapSetting from "./SwapDetails";
import {
  Connection,
  Keypair,
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import { getPrivateKey } from "@/lib/client";

interface TokenSwapProps {
  tokenBalances: TokenWithBalance[];
  publicKey: string | null;
}

export default function TokenSwap({
  tokenBalances,
  publicKey,
}: TokenSwapProps) {
  const [selectedToken, setSelectedToken] = useState<
    TokenWithBalance | undefined
  >(undefined);
  const [tokens, setTokens] = useState<Token[] | null>();
  const [inputSelectedToken, setInputSelectedToken] = useState("SOL");
  const [outputSelectedToken, setOutputSelectedToken] = useState("USDC");
  const [loading, setLoading] = useState(true);
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");
  const [inputToken, setInputToken] = useState<TokenWithBalance | undefined>();
  const [outputToken, setOutputToken] = useState<Token | undefined>();
  const [quote, setQuote] = useState<SwapRouteResponse | null>(null);
  const [slippage, setSlippage] = useState("0.5%");

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://tokens.jup.ag/tokens?tags=verified"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tokens");
        }
        const data = await response.json();
        setTokens(data);
        console.log("data", data);
      } catch (err) {
        console.error("Error fetching tokens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);
  useEffect(() => {
    const inputToken = tokenBalances.find(
      (token) => token.symbol === inputSelectedToken
    );
    setSelectedToken(inputToken);

    const outputToken = tokens?.find(
      (token) => token.symbol === outputSelectedToken
    );

    setInputToken(inputToken);
    setOutputToken(outputToken);

    if (inputToken) {
      fetchSwapQuote();
    }
  }, [inputSelectedToken, outputSelectedToken, inputAmount]);

  const fetchSwapQuote = async () => {
    if (!selectedToken) {
      return;
    }
    const inputAmt = parseFloat(String(inputAmount));
    if (isNaN(inputAmt) || inputAmt <= 0) {
      return;
    }
    const lamports = Math.round(inputAmt * 1_000_000_000);

    // Convert slippage percentage to basis points
    const slippageBps = Math.round(parseFloat(slippage) * 100);

    try {
      const quoteResponse = await (
        await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken?.mint}&outputMint=${outputToken?.address}&amount=${lamports}&slippageBps=${slippageBps}`
        )
      ).json();
      if (inputAmt > 0) {
        setQuote(quoteResponse);
      } else {
        setQuote(null);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const SwapConfirm = async () => {
    const privateKeyString = await getPrivateKey();

    // Add type and existence check
    if (!privateKeyString || typeof privateKeyString !== "string") {
      throw new Error("Invalid private key: must be a non-empty string");
    }

    try {
      // Decode base64 string to Uint8Array
      const privateKey = Uint8Array.from(
        Buffer.from(privateKeyString, "base64")
      );

      // Create connection and continue with existing code
      const connection = new Connection(
        "https://api.mainnet-beta.solana.com",
        "confirmed"
      );
      console.log("Request payload:", {
        quote,
        userPublicKey: publicKey,
        wrapAndUnwrapSol: true,
        feeAccount: process.env.NEXT_PUBLIC_PUBLIC_KEY,
      });

      // Fetch swap transaction from Jupiter API
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quote,
          userPublicKey: publicKey,
          wrapAndUnwrapSol: true,
          feeAccount: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jupiter API Error: ${errorText}`);
      }

      // Parse swap transaction
      const { swapTransaction } = await response.json();
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Create keypair from converted private key
      const wallet = Keypair.fromSecretKey(privateKey);

      // Sign the transaction
      transaction.sign([wallet]);

      // Send the transaction
      const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );

      // Confirm transaction
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      console.log("Swap successful", signature);
      return signature;
    } catch (error) {
      console.error("Swap Error:", error);
      throw error;
    }
  };

  return (
    <Card className="mx-auto mt-4 flex-col items-center space-y-2 rounded-xl border border-white bg-white/50 p-[20px] text-center shadow-[0px_4px_40px_rgba(0,_0,_0,_0.06),_inset_0px_0px_40px_rgba(255,_255,_255,_0.8)] sm:px-[40px] sm:py-[32px] mid:w-[803px]">
      <CardContent className="flex-col">
        <h4 className="mb-3 flex w-full items-center justify-start text-left text-lg font-bold text-grey-800 xs:text-[26px]">
          <div className="flex w-full flex-row justify-between">
            <div className="min-w-fit">Swap Tokens</div>
            <div className="flex flex-row justify-end">
              <p className="chakra-text mr-1 min-w-fit self-center text-[10px] font-normal text-grey-600">
                Powered by
              </p>
              <img
                alt="Powered by logo"
                src="/icons/jupiter-logo.svg"
                width={61}
                height={16}
              />
            </div>
          </div>
        </h4>
        <div className="relative">
          <TokenInput
            tokens={tokenBalances}
            selectedToken={selectedToken}
            label="You Pay:"
            tokenList={null}
            setInputSelectedToken={setInputSelectedToken}
            setAmount={setInputAmount}
            amount={inputAmount}
          />
          <div className="no-tap-highlight absolute inset-x-0 bottom-[-18px] z-50 mx-auto flex h-9 w-9 flex-shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-grey-100 bg-white focus:bg-grey-50 border-grey-50">
            <ArrowUpDown className="h-4 w-4 text-grey-400" />
          </div>
        </div>
        <TokenInput
          label="You Receive:"
          tokenList={tokens}
          setOutputSelectedToken={setOutputSelectedToken}
          readOnly={true}
          setAmount={setOutputAmount}
          amount={
            quote?.outAmount &&
            outputToken &&
            inputAmount &&
            Number(inputAmount) > 0
              ? (
                  Number(quote.outAmount) / Math.pow(10, outputToken.decimals)
                ).toFixed(outputToken.decimals)
              : ""
          }
        />
        <SwapSetting setSlippage={setSlippage} slippage={slippage} />
        <div className="mt-6 flex  gap-3 flex-col-reverse justify-between mobile:flex-row">
          <Button variant="outline" className="text-grey-700">
            Cancel
          </Button>
          <Button
            onClick={() => SwapConfirm()}
            className="w-full mobile:w-auto"
          >
            <Check className="mr-1 h-4 w-4" />
            Confirm & Swap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
