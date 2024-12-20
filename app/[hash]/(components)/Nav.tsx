"use client";

import Logo from "@/components/icons/Logo";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import Image from "next/image";

export default function Nav() {
  const { connected } = useWallet();
  return (
    <div className="flex mt-1  justify-between items-center">
      <div className="flex  items-center">
        <div className="border h-10 w-10 ml-4 rounded-lg inline-flex justify-center items-center">
          <Image
            className="rounded-lg"
            src="/assets/images/images/symbolLogo.png"
            alt="logo"
            width={40}
            height={40}
            priority
          />
        </div>
      </div>
      <div>
        <div className=" flex items-center justify-end ">
          <div className="flex gap-4 items-center pr-2">
            <WalletMultiButton
              style={{ backgroundColor: "black", height: "42px" }}
            >
              {!connected && <Wallet />}
            </WalletMultiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
