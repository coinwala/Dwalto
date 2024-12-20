import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Image from "next/image";

type TransactionDetailsType = {
  solAmount?: number;
  usdAmount?: number;
  receivingAsset?: {
    name: string;
    amount: number;
  };
  hyperLinkHandle?: string;
  feePayer?: string;
  recentBlockhash?: string;
  instructionsCount?: number;
  originalMessage?: string;
};

interface TransactionDialogProps {
  onConfirm: (transactionDetails: TransactionDetailsType) => Promise<void>;
  onCancel: () => void;
  transactionDetails: TransactionDetailsType;
  isLoading?: boolean;
}

const TransactionDialog = ({
  onConfirm,
  onCancel,
  transactionDetails,
  isLoading = false,
}: TransactionDialogProps) => {
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [open, setOpen] = useState(true);

  const {
    solAmount = 0,
    usdAmount = 0,
    receivingAsset = { name: "Unknown Asset", amount: 0 },
    hyperLinkHandle = "@unknown",
    feePayer,
    recentBlockhash,
    instructionsCount = 0,
  } = transactionDetails;

  const handleConfirm = async () => {
    await onConfirm(transactionDetails);
  };
  const handleCancel = async () => {
    setOpen(false);
    await onCancel();
  };

  console.log(receivingAsset, transactionDetails);
  return (
    <Dialog defaultOpen={open} onOpenChange={handleCancel}>
      <DialogContent className="relative w-full max-w-md bg-black p-6 text-white rounded-xl">
        <div className="flex justify-center space-x-2 mb-4">
          {/* <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-xl">T</span>
          </div> */}
          <div className="w-13 h-13  rounded-full flex items-center justify-center">
            <Image
              src="/icons/logo.png"
              alt="logo"
              width={90}
              height={90}
              priority
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Review Transaction
        </h2>

        <div className="space-y-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm mb-2">You will pay:</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                <span>Solana</span>
              </div>
              <div className="text-right">
                <div className="text-red-400">-{solAmount.toFixed(4)} SOL</div>
                <div className="text-sm text-slate-400">
                  ≈ ${usdAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-sm mb-2">You will receive:</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  ?
                </div>
                <span>{receivingAsset.name}</span>
              </div>
              <div className="text-green-400">+{receivingAsset.amount}</div>
            </div>
          </div> */}

          <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Via CoinWala Wallet:</span>
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                T
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{hyperLinkHandle}</span>
              <Eye className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        <button
          className="w-full text-center mt-4 text-slate-400 hover:text-white transition-colors"
          onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
        >
          Additional Details {showAdditionalDetails ? "▲" : "▼"}
        </button>

        {showAdditionalDetails && (
          <div className="mt-4 space-y-2 bg-slate-800 p-4 rounded-lg text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Fee Payer:</span>
              <span className="text-white break-all">{feePayer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recent Blockhash:</span>
              <span className="text-white break-all">{recentBlockhash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Instructions:</span>
              <span className="text-white">{instructionsCount}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-none"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-white hover:bg-gray-100 text-black"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Confirming..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
