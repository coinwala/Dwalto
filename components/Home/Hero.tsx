"use client";

import React, { useEffect, useRef, useTransition } from "react";
import { signInAction } from "@/lib/signInAction";
import AnimatedGridSvg from "../ui/beamBG";
import { FlipWords } from "../ui/flip-words";
import { motion } from "framer-motion";
import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";

export default function Hero() {
  const [isPending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;

      const timer = setTimeout(() => {
        videoRef.current?.play();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = () => {
    startTransition(() => {
      signInAction();
    });
  };

  const words = [
    "you can never lose",
    "owned by only you",
    "that your grandma can use",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatedGridSvg />
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col-reverse lg:flex-row justify-between container relative z-10 gap-8 lg:gap-0">
          <div className="flex gap-8 flex-col justify-center">
            <div className="space-y-8">
              <div className="space-y-4 flex align-middle flex-col items-center lg:items-start">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white text-center lg:text-left">
                  <span>Choose a crypto wallet</span>
                  <br />
                  <span className="flex items-baseline pt-2">
                    <div className="w-full h-[80px] lg:h-auto lg:w-[800px]">
                      <span className="inline-block">
                        <FlipWords
                          className="bg-gradient-to-r from-blue-600 to-amber-300 inline-block text-transparent bg-clip-text"
                          words={words}
                        />
                      </span>
                    </div>
                  </span>
                </h1>
              </div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row gap-5 max-w-fit rounded-xl w-full border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group"
              >
                <div>
                  <p className="flex justify-center flex-col text-center sm:text-left">
                    <span className="text-white text-lg sm:text-xl font-bold">
                      Create your wallet in just two clicks!
                    </span>
                    <span className="text-gray-400 text-base sm:text-lg">
                      Just sign in with Google Account
                    </span>
                  </p>
                </div>
                <div className="flex justify-center sm:justify-start">
                  <Button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="
                      flex items-center gap-3 
                      px-6 sm:px-8 py-2 sm:py-3
                      text-sm sm:text-base 
                      bg-white/10 
                      backdrop-blur-sm 
                      border border-white/20 
                      hover:bg-white/20 
                      transition-all duration-300 
                      group"
                  >
                    <span className="transition-all pr-1 duration-300 group-hover:mr-2">
                      {isPending ? "Logging in..." : "Login with "}
                    </span>
                    <FcGoogle className="text-xl transition-transform group-hover:scale-110" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:justify-end "
          >
            <video
              className="rounded-lg w-full max-w-[180px] lg:max-w-[360px] h-auto"
              ref={videoRef}
              muted
              loop
              playsInline
            >
              <source src="/assets/video/mobileLogin.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
