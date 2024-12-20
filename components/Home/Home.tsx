import React from "react";
import Hero from "./Hero";
import HeroImage from "./HeroImage";
import DocsShowcase from "./DocsShowcase";
import CallToAction from "./CallToAction";
import WalletTile from "../featuresTile/WalletTile";
import WalletAdapterTile from "../featuresTile/WalletAdapterTile";

export default function Home() {
  return (
    <div className="bg-black">
      <div className="mt-10 md:mt-30 lg:mt-10 relative z-10">
        <Hero />
      </div>
      <div className="px-4 md:px-10">
        <div className="flex flex-col gap-10">
          <WalletTile />
          <div>
            <HeroImage />
          </div>
          <WalletAdapterTile />
        </div>
      </div>

      <div className="max-w-full">
        <DocsShowcase />
        <CallToAction />
      </div>
    </div>
  );
}
