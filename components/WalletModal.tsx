"use client";
import React, { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import solcan from "@/public/icons/solscan.webp";
import { QRCode } from "react-qrcode-logo";
import toast from "react-hot-toast";
import Image from "next/image";

// Define props for WalletQR component
interface WalletQRProps {
  text: string;
}

// Assuming WalletQR is a custom component

// Define props for WalletModal component
interface WalletModalProps {
  isVisible: boolean;
  onClose: () => void;
  publicKey: string;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isVisible,
  onClose,
  publicKey,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const shortenedKey = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;

  const handleCopy = (): void => {
    navigator.clipboard.writeText(publicKey);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Your Wallet Address</DialogTitle>
        </DialogHeader>
        <div className="text-center mb-4">
          <p className="mb-2">
            You can deposit crypto or NFTs into your account via this
          </p>
          <p>Solana wallet address:</p>
        </div>
        <div className="flex flex-col items-center bg-gray-100 rounded-lg p-4">
          <div className="mb-8">
            <div className="flex flex-col items-center justify-center">
              <QRCode
                logoImage="/assets/images/images/symbolLogo.png"
                logoHeight={60}
                logoWidth={60}
                qrStyle="squares"
                logoPaddingStyle="square"
                ecLevel="L"
                eyeColor="black"
                eyeRadius={10}
                value={publicKey}
                size={200}
              />
            </div>
          </div>
          <div className="relative w-full">
            <Input
              readOnly
              value={shortenedKey}
              className="pr-12 text-center rounded-3xl"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black rounded-full"
              onClick={handleCopy}
            >
              <Copy className="text-white" size={16} />
            </Button>
          </div>

          <p className="text-gray-500 text-sm mt-2">
            Only send crypto to this address via the Solana network.
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={() =>
              window.open(`https://solscan.io/account/${publicKey}`, "_blank")
            }
            className="flex-1 mr-2"
          >
            <Image className="h-5 w-5 mr-2" src={solcan} alt="Solscan" />
            View on SolScan
          </Button>
          <Button onClick={onClose} className="flex-1 ml-2">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
