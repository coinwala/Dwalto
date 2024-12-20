import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Toaster, toast } from "react-hot-toast";
import { decodeToken, web3auth } from "@/lib/web3auth";
import { initClients } from "@/lib/client";
import { handleSignOut } from "@/actions";
import { TokenWithBalance } from "@/lib/types";
import WalletOverview from "./WalletOverview";
import LoadingSkeleton from "./LoadingSkeleton";

interface UserWalletDashboardProps {
  session: Session | null;
}

const verifier = process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER ?? "";

const UserWalletDashboard: React.FC<UserWalletDashboardProps> = ({
  session,
}) => {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number>(0);
  const [tokenBalances, setTokenBalances] = useState<TokenWithBalance[]>([]);

  useEffect(() => {
    let loadingToast: string | undefined;

    const initWeb3Auth = async () => {
      if (!session) {
        router.push("/");
        return;
      }

      loadingToast = toast.loading("Preparing your CoinWala account", {
        position: "top-center",
      });

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
          await handleSignOut();
          router.push("/");
        } else {
          setError("An error occurred. Please try again.");
        }
        setProvider(null);
        setPublicKey(null);
      } finally {
        setIsLoading(false);
        if (loadingToast) {
          toast.dismiss(loadingToast);
        }
      }
    };

    initWeb3Auth();

    return () => {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    };
  }, [session, router]);

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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div
        className="flex-col items-center space-y-2 rounded-xl border border-white bg-white/40 text-center sm:my-4 backdrop-blur-[1px]"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.06) 0px 4px 40px, rgba(255, 255, 255, 0.8) 0px 0px 40px inset",
        }}
      >
        <WalletOverview
          session={session}
          totalBalanceUSD={totalBalanceUSD}
          publicKey={publicKey}
          tokenBalances={tokenBalances}
        />
      </div>
    </div>
  );
};

export default UserWalletDashboard;
