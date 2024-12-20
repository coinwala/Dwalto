import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CustomTextField from "../InputComponent";
import { Button } from "../ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import BouncingDotsLoader from "../BouncingDotsLoader";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ArrowLeft } from "lucide-react";
import { Combobox } from "../Combobox";
import { convertUsdToSol } from "@/lib/KeyStore";
import { useTransferSOL } from "@/app/hooks/useTransferSOL";
import {
  sendTransaction,
  initClients,
  getConnection,
  getPublicKey,
  getBalance,
} from "@/lib/client";
import { Input } from "../ui/input";
import { CoinWala } from "@/lib/url";

interface FundingOptionsProps {
  CoinWalaPublicKey: string | null;
  setDisplayExternalWallet: React.Dispatch<React.SetStateAction<string>>;
  displayExternalWallet: string;
}

interface Token {
  value: string;
  label: string;
  symbol: string;
  logoURI: string;
  balance: number;
}

export default function ConnectedWallet({
  CoinWalaPublicKey,
  setDisplayExternalWallet,
  displayExternalWallet,
}: FundingOptionsProps) {
  const [amount, setAmount] = useState("");
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isTransferring, error } = useTransferSOL();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [externalWalletAddress, setExternalWalletAddress] = useState("");
  const [isValidExternalAddress, setIsValidExternalAddress] = useState(false);
  const [generatedCoinWala, setGeneratedCoinWala] = useState<CoinWala | null>(
    null
  );

  useEffect(() => {
    initClients();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!CoinWalaPublicKey) {
        console.error("CoinWala wallet address not set");
        return;
      }
      const conn = getConnection();
      if (!conn) {
        console.error("Connection not initialized");
        return;
      }

      try {
        const hyperLinkPubKey = new PublicKey(CoinWalaPublicKey);
        console.log("Attempting to fetch balance for:", CoinWalaPublicKey);
        const balanceStr = await getBalance(hyperLinkPubKey);
        const balanceInSOL = parseFloat(balanceStr);
        setBalance(balanceInSOL);
        console.log(`CoinWala wallet balance: ${balanceInSOL} SOL`);
      } catch (error) {
        console.error("Error fetching balance:", error);
        if (error instanceof Error) {
          console.error("Error name:", error.name);
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
      }
    };

    fetchBalance();
  }, [CoinWalaPublicKey]);

  const validateExternalAddress = (address: string) => {
    try {
      new PublicKey(address);
      setIsValidExternalAddress(true);
    } catch (error) {
      setIsValidExternalAddress(false);
    }
  };

  const handleExternalAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const address = e.target.value;
    setExternalWalletAddress(address);
    validateExternalAddress(address);
  };

  const handleWithdrawal = async () => {
    console.log("Attempting withdrawal...");
    console.log("Wallet connected:", connected);
    console.log("Public key:", publicKey?.toString());

    let destinationAddress: string;
    let isCoinWala = false;
    let hyperLinkUrl: URL | null = null;

    if (displayExternalWallet === "Coinwala") {
      try {
        const newCoinWala = await CoinWala.create();
        setGeneratedCoinWala(newCoinWala);
        destinationAddress = newCoinWala.keypair.publicKey.toString();
        isCoinWala = true;

        try {
          const urlString = newCoinWala.url.toString();
          if (!urlString.startsWith("http")) {
            hyperLinkUrl = new URL(`https://${urlString}`);
          } else {
            hyperLinkUrl = new URL(urlString);
          }
        } catch (urlError) {
          console.error("Error creating URL:", urlError);
        }

        console.log(
          "CoinWala created successfully:",
          destinationAddress,
          newCoinWala
        );
      } catch (error) {
        console.error("Error creating CoinWala:", error);
        toast.error("Failed to create CoinWala");
        return;
      }
    } else if (displayExternalWallet === "externalWallet") {
      if (!isValidExternalAddress) {
        toast.error("Invalid external wallet address");
        return;
      }
      destinationAddress = externalWalletAddress;
    } else {
      if (!connected || !publicKey) {
        console.error("Wallet not connected or public key not available");
        toast.error(
          "User wallet not connected. Please connect your wallet first."
        );
        return;
      }
      destinationAddress = publicKey.toString();
    }

    setLoading(true);
    try {
      const amtInSolString = await convertUsdToSol(amount);
      const amtInSol = parseFloat(amtInSolString);
      if (isNaN(amtInSol)) {
        throw new Error("Invalid SOL amount");
      }
      const amtInLamports = Math.round(amtInSol * LAMPORTS_PER_SOL);

      if (amtInLamports > balance * LAMPORTS_PER_SOL) {
        throw new Error(
          `Insufficient balance for withdrawal. Requested: ${amtInSol} SOL, Available: ${balance} SOL`
        );
      }

      const signature = await sendTransaction(
        new PublicKey(CoinWalaPublicKey ?? ""),
        destinationAddress,
        amtInLamports
      );
      if (hyperLinkUrl) {
        window.open(hyperLinkUrl.toString(), "_blank", "noopener,noreferrer");
      }

      console.log(
        "Withdrawal transaction sent successfully. Signature:",
        signature
      );

      if (isCoinWala && generatedCoinWala) {
        const hyperLinkUrlString = hyperLinkUrl
          ? hyperLinkUrl.toString()
          : "URL not available";
        console.log("Generated CoinWala URL:", hyperLinkUrlString);
        toast.success(`CoinWala created: ${hyperLinkUrlString}`, {
          duration: 10000,
          position: "top-center",
        });
      }

      toast.success("Withdrawal successful!", {
        duration: 5000,
        position: "top-center",
      });

      if (CoinWalaPublicKey) {
        const newBalance = await getBalance(new PublicKey(CoinWalaPublicKey));
        setBalance(parseFloat(newBalance));
      }

      setTimeout(() => {
        setDisplayExternalWallet("");
      }, 5000);
    } catch (err) {
      console.error("Withdrawal error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred during withdrawal",
        {
          duration: 5000,
          position: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 py-7">
        <div
          onClick={() => {
            setDisplayExternalWallet("");
          }}
          className="mb-3.5 mr-auto text-gray-500 flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
        >
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>{" "}
          <span>Back</span>
        </div>
        <div className="flex-col px-15 py-1">
          <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans text-gray-500 xs:text-[26px]">
            Withdraw to wallet
          </h4>
          <p className="pb-3 text-sm text-left font-normal text-gray-500">
            Specify asset and amount:
          </p>
        </div>
        <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          <div>
            <Combobox
              CoinWalaPublicKey={CoinWalaPublicKey ?? ""}
              onTokenSelect={setSelectedToken}
            />
          </div>
          {displayExternalWallet === "externalWallet" && (
            <div>
              <Input
                placeholder="Enter Solana wallet address"
                value={externalWalletAddress}
                onChange={handleExternalAddressChange}
                className={
                  isValidExternalAddress ? "border-green-500" : "border-red-500"
                }
              />
              {!isValidExternalAddress && externalWalletAddress && (
                <p className="text-red-500 text-sm mt-1">
                  Invalid Solana address
                </p>
              )}
            </div>
          )}
          <div>
            <div>
              <CustomTextField amount={amount} setAmount={setAmount} />
            </div>
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  setDisplayExternalWallet("");
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  loading ||
                  isTransferring ||
                  (displayExternalWallet === "externalWallet" &&
                    !isValidExternalAddress) ||
                  (!CoinWalaPublicKey &&
                    displayExternalWallet !== "externalWallet")
                }
                onClick={handleWithdrawal}
              >
                {loading || isTransferring ? (
                  <BouncingDotsLoader />
                ) : (
                  "Withdraw"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
