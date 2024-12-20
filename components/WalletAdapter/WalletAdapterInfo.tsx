import React from "react";
import { FcGoogle } from "react-icons/fc";
import FeaturesGrid from "./FeaturesGrid";
export default function WalletAdapterInfo() {
  return (
    <div className="my-5">
      <div className="flex justify-center ">
        <div
          className="flex w-full max-w-[1200px] flex-col space-y-5 rounded-xl bg-black/10 p-6 pb-0 mobile:gap-5 mobile:p-8 mobile:pb-0 tablet:flex-row lg:gap-10 lg:p-10 lg:pb-0"
          style={{
            boxShadow: `
          rgba(0, 0, 0, 0.06) 0px 2px 40px 0px,
          rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset,
          rgba(255, 255, 255, 0.8) 0px 0px 40px 0px inset
        `,
          }}
        >
          <div className="space-y-3">
            <FcGoogle
              className="h-9 w-9 rounded-full mobile:h-11 mobile:w-11"
              style={{
                boxShadow: "rgba(0, 124, 191, 0.1) 0px 2px 40px 0px",
              }}
            />

            <p className="text-left text-[24px] font-bold leading-tight text-black mobile:text-[30px]">
              Let <span className="text-[#e82523]">anyone</span> login to Solana
              apps
            </p>
            <p className="text-left text-sm text-neutral-standard mobile:text-base tablet:pb-5">
              Getting people started with your Solana app should only take a few
              clicks. Billions of people have Google accounts; meet your users
              in the middle.
            </p>
          </div>

          <div className="flex items-end">
            {/* <img
              draggable="false"
              alt="CoinWala Adapter Auth Graphic"
              loading="lazy"
              width={1080}
              height={800}
              className="h-auto w-full"
              src="/api/placeholder/1080/800"
              srcSet="/api/placeholder/1080/800 1x, /api/placeholder/3840/800 2x"
              style={{ color: "transparent" }}
            /> */}
          </div>
        </div>
      </div>
      <div>
        <FeaturesGrid />
      </div>
    </div>
  );
}
