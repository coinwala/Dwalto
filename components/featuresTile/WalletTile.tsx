"use client";
import React, { useTransition } from "react";
import { AnimatedBeam } from "../ui/AnimatedBeam";
import { AnimatedBeam2 } from "../ui/AnimatedBeam2";
import { FcGoogle } from "react-icons/fc";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { signInAction } from "@/lib/signInAction";

export default function WalletTile() {
  const [isPending, startTransition] = useTransition();
  const handleSubmit = () => {
    startTransition(() => {
      signInAction();
    });
  };
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col justify-center gap-4 md:gap-6 w-full md:w-1/2">
          <div>
            <span className="max-w-fit">
              <span className="py-2 px-2 max-w-fit flex items-center rounded-lg border border-[rgba(255,255,255,0.10)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group backdrop-blur-md transition-all duration-300">
                <p className="text-base md:text-xl font-semibold text-white flex items-center gap-2">
                  <Wallet className="h-4 w-4 md:h-5 md:w-5" />
                  WALLET
                </p>
              </span>
            </span>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Create a{" "}
              <span className="inset-0 bg-gradient-to-r from-blue-400 via-blue-700 to-blue-400 bg-clip-text text-transparent">
                self-custodial wallet
              </span>{" "}
              using just your existing Google account.
            </p>

            <p className="text-gray-400 text-base md:text-lg mt-2 md:mt-4">
              Experience true ownership with CoinWala Wallet—log in effortlessly
              with your Google account while retaining full control of your
              wallet, NFTs, and keys. Your assets, your freedom.
            </p>
          </div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-black"
            >
              Learn More
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isPending}
              className="
                w-full sm:w-auto
                flex items-center gap-3 
                px-4 md:px-8 py-2 md:py-3
                text-sm md:text-base 
                bg-white/10 
                backdrop-blur-sm 
                border border-white/20 
                hover:bg-white/20 
                transition-all duration-300 
                group"
            >
              <span className="transition-all pr-1 duration-300 group-hover:mr-2">
                {isPending ? "Logging in..." : "Get Started with "}
              </span>
              <FcGoogle className="text-base md:text-xl transition-transform group-hover:scale-110" />
            </Button>
          </motion.div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="hidden md:flex flex-col items-center justify-center h-full">
            <div className="ml-[25px] md:ml-[65px]">
              <AnimatedBeam />
            </div>

            <div className="p-4 md:p-8 flex items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group">
              <FcGoogle className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <div className="ml-[35px] md:ml-[75px]">
              <AnimatedBeam2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
