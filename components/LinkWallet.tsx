import CreateLinkWallet from "@/components/CreateLinkWallet";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";

export default function LinkWallet() {
  return (
    <main className="relative mx-auto w-full px-3 mobile:mt-10 mobile:px-5 mt-[60px] ml:mt-[100px] lg:px-8">
      <div className="flex w-full flex-row items-center justify-center gap-3 pb-[20px] mobile:gap-[15px] ml:flex-row ml:items-start ml:gap-6 lg:gap-10 ">
        <div>
          <CreateLinkWallet />
        </div>
        <div className="flex  items-start justify-center gap-3 mobile:gap-[15px]  flex-col ml:items-center ml:gap-6 lg:gap-10 ">
          <div className="relative flex w-full flex-col items-center rounded-[12px] border border-white bg-white/40 p-5 text-center mobile:p-8  max-w-[580px]  py-8 px-[60px] 1200:py-12 shadow-[rgba(0,0,0,0.06)_0px_4px_40px,rgba(255,255,255,0.8)_0px_0px_40px_inset]">
            <div className="mb-5 space-y-2 text-center">
              <h2 className="text-[20px] font-bold leading-tight text-grey-900 ml:text-[24px]">
                Unlock the full power of Hypelink Wallet
              </h2>
              <p className="whitespace-pre-line text-sm text-grey-700 ml:text-base">
                On/off-ramp your crypto securely, swap seamlessly, and more with
                a Hypelink account.
              </p>
            </div>
            <Button className="relative flex h-11 w-[215px] items-center justify-center rounded-lg  duration-150 ease-linear   mobile:!w-[230px]">
              <div className="absolute left-[3px] top-[50%] flex h-9 max-h-9 min-h-9 w-9 min-w-9 max-w-9 translate-y-[-50%] items-center justify-center rounded-md">
                <FaGoogle />
              </div>
              <div className="pl-7">
                <h3 className="font-medium ">Continue with Google</h3>
              </div>
            </Button>
          </div>
          <div className="relative flex w-full flex-col items-center rounded-[12px] border border-white bg-white/40 p-5 text-center mobile:p-8  max-w-[580px]  py-8 px-[60px] 1200:py-12 shadow-[rgba(0,0,0,0.06)_0px_4px_40px,rgba(255,255,255,0.8)_0px_0px_40px_inset]">
            <div className="mb-5 space-y-2 text-center">
              <h2 className="text-[20px] font-bold leading-tight text-grey-900 ml:text-[24px]">
                Send digital assets at scale with Hypelink Pro
              </h2>
              <p className="whitespace-pre-line text-sm text-grey-700 ml:text-base">
                Hypelink Pro enables businesses to distribute limitless assets
                from a single dashboard..
              </p>
            </div>
            <Button className="relative flex h-11 w-[215px] items-center justify-center rounded-lg  duration-150 ease-linear   mobile:!w-[230px]">
              <div className="absolute left-[3px] top-[50%] flex h-9 max-h-9 min-h-9 w-9 min-w-9 max-w-9 translate-y-[-50%] items-center justify-center rounded-md">
                {/* <FaGoogle /> */}
              </div>
              <div className="pl-7">
                <h3 className="font-medium ">Comming Soon</h3>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-center">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <ShieldCheck />
            <span>
              All CoinWala link are non-custodial wallets. CoinWala does not and
              cannot access your digital assets.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
