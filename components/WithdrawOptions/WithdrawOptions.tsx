import React from "react";
import GroupButton from "../GroupButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
interface FundingOptionsProps {
  HyperLinkPublicKey: string | null;
}
export default function WithdrawOptions({
  HyperLinkPublicKey,
}: FundingOptionsProps) {
  const { wallet } = useWallet();
  console.log(wallet);
  return (
    <div
      className="mx-auto mt-4 flex-col items-center space-y-2 rounded-xl border border-white bg-white/50 p-[20px] text-center sm:px-[40px] sm:py-[32px] mid:w-[803px]"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.06) 0px 4px 40px, rgba(255, 255, 255, 0.8) 0px 0px 40px inset",
        borderRadius: "12px",
        opacity: 1,
        overflow: "unset",
        transition: "ease-out",
      }}
    >
      <div className="flex-col">
        <h4 className="mb-3 flex w-full items-center justify-start text-left text-lg font-bold text-grey-800 xs:text-[26px]">
          Withdraw
        </h4>
        <div className="divide-y divide-grey-100 overflow-hidden rounded-lg border border-grey-100">
          <GroupButton
            icon={
              <img src={wallet?.adapter.icon} alt="sol" className="h-5 w-5" />
            }
            title="To External Account/Wallet"
            description={`Asset will be sent to the ${wallet?.adapter.name} account.`}
          />
          <GroupButton
            icon={
              <div className="h-5 w-5 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#2D4C5D"
                    d="M2.5 5.833c0-.46.373-.833.833-.833h13.334c.46 0 .833.373.833.833v.834a.833.833 0 001.667 0v-.834a2.5 2.5 0 00-2.5-2.5H3.333a2.5 2.5 0 00-2.5 2.5V12.5a2.5 2.5 0 002.5 2.5H10a.833.833 0 000-1.667H3.333A.833.833 0 012.5 12.5V5.833z"
                  ></path>
                  <path
                    fill="#2D4C5D"
                    d="M10 8.333A.833.833 0 0010 10h.008a.833.833 0 100-1.667H10zM5 9.167c0-.46.373-.834.833-.834h.009a.833.833 0 010 1.667h-.009A.833.833 0 015 9.167z"
                  ></path>
                  <path
                    fill="#2D4C5D"
                    fillRule="evenodd"
                    d="M12.643 9.31a3.333 3.333 0 015.228 4.05l1.052 1.05a.833.833 0 01-1.179 1.18l-1.051-1.052a3.333 3.333 0 01-4.05-5.228zM15 10a1.666 1.666 0 100 3.333A1.666 1.666 0 0015 10z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            }
            title="To Solana Wallet Address"
            description="Assets will be sent to a Solana wallet address you specify."
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
