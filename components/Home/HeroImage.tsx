"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, Link } from "lucide-react";
import { World } from "../ui/globe";
import { globeConfig, sampleArcs } from "@/lib/GlobeConstant";
import { CardDemo } from "../AnimatedCard";

const AnimatedBeamBorder = () => {
  return (
    <div className="absolute rounded-2xl top-0 left-0 right-0 pointer-events-none z-10">
      <svg
        width="100%"
        height="4"
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
        className="absolute top-0"
      >
        <motion.rect
          initial={{ x: -10 }}
          animate={{ x: 110 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          x="-10"
          y="0"
          width="20"
          height="1"
          fill="url(#beamGradient)"
        />
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(100,200,255,0)" />
            <stop offset="50%" stopColor="rgba(100,200,255,0.8)" />
            <stop offset="100%" stopColor="rgba(100,200,255,0)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
  children,
  icon,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[rgba(40,40,40,0.30)] shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group"
  >
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
      }}
      className={`
    p-8 
    flex 
    items-center 
    justify-center 
    rounded-full 
    border 
    border-[rgba(255,255,255,0.10)] 
    
    shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset]
    group
    backdrop-blur-md
    transition-all
    duration-300
     w-[20px]
    h-[20px] 
    aspect-square
   
  `}
    >
      <div className="h-6 w-6 flex justify-center text-center align-middle items-center">
        {icon}
      </div>
    </motion.div>
    <div className="h-[10rem] rounded-xl z-40 bg-radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)">
      <div className=" overflow-hidden h-full">{children}</div>
    </div>
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-2xl font-semibold text-white py-2"
    >
      {title}
    </motion.h3>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="text-lg font-normal text-neutral-400 max-w-full"
    >
      {description}
    </motion.div>
  </motion.div>
);

const FeatureShowcase = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Set playback rate to 0.5x speed (slower)
      videoRef.current.playbackRate = 0.5;

      // Add 1 second delay before starting
      const timer = setTimeout(() => {
        videoRef.current?.play();
      }, 3000);

      // Cleanup timeout on unmount
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FeatureCard
        title="Swap coins on Solana blockchain seamlessly"
        description="Enjoy lightning-fast swaps with top-tier security, ensuring your assets stay protected at every step —Say bye to external exchanges"
        icon={<ArrowRightLeft color="white" size={24} />}
      >
        <div className="flex  items-center justify-center h-full ">
          <CardDemo />
        </div>
      </FeatureCard>
      <FeatureCard
        title="Sharing crypto made easy via a link"
        description="Send crypto to anyone with ease—just create a link and share it. No wallet address needed, making transfers simple and secure"
        icon={<Link color="white" size={24} />}
      >
        <World data={sampleArcs} globeConfig={globeConfig} />
      </FeatureCard>
    </div>
  );
};

const HeroImage = () => {
  return (
    <section className="relative rounded-2xl  max-w-[1300px] mx-auto px-4 md:mt-20 my-10">
      <div
        className=" inset-0 border-4 border-white/10 rounded-2xl 
        bg-gradient-to-br from-[#3a3a3a] via-[#1a1a1a] to-[#2a2a2a] 
        shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]"
      >
        <div className="relative p-3 bg-black rounded-2xl overflow-hidden">
          <AnimatedBeamBorder />
          <div className="bg-black rounded-2xl text-white py-10">
            <div className="container rounded-2xl mx-auto">
              <FeatureShowcase />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroImage;
