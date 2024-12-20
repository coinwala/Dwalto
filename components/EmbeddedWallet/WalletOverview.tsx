import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Session } from "next-auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { TokenWithBalance } from "@/lib/types";
import { decodeToken, web3auth } from "@/lib/web3auth";
import { initClients } from "@/lib/client";
import TokenList from "../WalletCard/TokenList";
import PublicKeyDisplay from "./PublicKeyDisplay";

interface WalletOverviewProps {
  onClose?: () => void;
  showWalletView: boolean;
  session: Session | null;
}
const verifier = process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER ?? "";
const WalletOverview = ({
  onClose,
  showWalletView,
  session,
}: WalletOverviewProps) => {
  const [provider, setProvider] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number>(0);
  const [tokenBalances, setTokenBalances] = useState<TokenWithBalance[]>([]);
  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }
        if (web3auth.status === "connected") {
          setProvider(web3auth.provider);
        } else if (session?.idToken) {
          const { payload } = decodeToken(session.idToken);
          const w3aProvider = await web3auth.connect({
            verifier,
            verifierId: (payload as any).email,
            idToken: session.idToken,
          });
          setProvider(w3aProvider);
          initClients();
        }
      } catch (e) {
        console.error("Error initializing & connecting to web3auth:", e);
        if (
          e instanceof Error &&
          (e.message.includes("Duplicate token found") ||
            e.message.includes("Wallet is not connected"))
        ) {
          setError(
            "Session expired or wallet disconnected. Please sign in again."
          );
        } else {
          setError("An error occurred. Please try again.");
        }
        setProvider(null);
        setPublicKey(null);
      } finally {
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, [session]);
  useEffect(() => {
    const getPublicKey = async () => {
      if (provider) {
        try {
          const accounts = await provider.request({ method: "getAccounts" });
          if (Array.isArray(accounts) && accounts.length > 0) {
            setPublicKey(accounts[0]);
          }
        } catch (error) {
          console.error("Error fetching public key:", error);
          setError("Failed to retrieve public key.");
        }
      }
    };

    getPublicKey();
  }, [provider]);
  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (publicKey) {
        try {
          const response = await fetch(`/api/tokens?address=${publicKey}`);
          if (!response.ok) {
            throw new Error("Failed to fetch token balances");
          }
          const data = await response.json();
          const nonZeroBalances = data.tokens.filter(
            (token: TokenWithBalance) => parseFloat(token.balance) > 0
          );
          setTokenBalances(nonZeroBalances);
          setTotalBalanceUSD(parseFloat(data.totalUsdBalance));
        } catch (error) {
          console.error("Error fetching token balances:", error);
          setError("Failed to retrieve token balances.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTokenBalances();
  }, [publicKey]);

  return (
    <Sheet onOpenChange={onClose} open={showWalletView}>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader className="mb-6">
          <SheetTitle>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <div className="relative flex-shrink-0 rounded-full  bg-white p-[1px]">
                  <Image
                    src={"/icons/logo.png"}
                    alt="TipLink icon"
                    width={52}
                    height={52}
                    className="relative z-10"
                  />
                  <div className="absolute right-[-24px] top-0 z-[1] h-7 w-7 rounded-full bg-white dark:bg-gray-950"></div>
                </div>
                <Image
                  src={session?.user?.image || "/api/placeholder/28/28"}
                  alt="User image"
                  width={28}
                  height={28}
                  className="z-[2] ml-[-16px] h-7 w-7 rounded-full bg-gray-50 shadow-sm dark:bg-gray-800"
                />
              </div>

              <span className="mt-2">Your CoinWala Wallet</span>
            </div>
          </SheetTitle>
          <SheetDescription className="flex items-center justify-center">
            <PublicKeyDisplay publicKey={publicKey!} />
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                ${totalBalanceUSD.toFixed(2)} USD
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full" variant="outline">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Receive
            </Button>
            <Button className="w-full" variant="outline">
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <TokenList tokenBalances={tokenBalances} />
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default WalletOverview;
