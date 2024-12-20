import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const DocsShowcase = () => {
  return (
    <section className="relative py-16 px-4 md:py-28 md:px-6 lg:px-8 overflow-hidden">
      <div className="absolute -top-12 -left-12 md:-top-20 md:-left-20 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 md:-bottom-20 md:-right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          className="w-full rounded-2xl 
          bg-black text-white 
          border-4 border-white/10 
          bg-gradient-to-br from-[#3a3a3a] via-[#1a1a1a] to-[#2a2a2a] 
          shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]
          overflow-hidden
          p-4 sm:p-6 md:p-8 lg:p-12"
        >
          <div className="text-xs sm:text-sm inline-flex border border-[#fff]/20 px-2 pt-1 pb-1 rounded-lg tracking-tight shadow-inner shadow-white text-white/70">
            CoinWala API
          </div>
          <div className="flex flex-col-reverse md:flex-row mt-5 space-y-6 md:space-y-0 md:space-x-8 lg:space-x-12">
            <div className="w-full md:w-1/2 lg:w-5/12">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/70 text-transparent bg-clip-text">
                Ready for developers
              </h1>
              <p className="text-sm sm:text-base md:text-lg tracking-tighter text-white/70 mt-4 mb-6">
                Coinwala wallets can be programmatically generated to hold
                tokens and NFTs at scale with our API.
              </p>
              <Button className="bg-white text-black hover:bg-white/90 flex items-center gap-3 w-full sm:w-auto">
                Read Docs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-full md:w-1/2 lg:w-7/12 flex justify-end">
              <div className="bg-zinc-950 backdrop:blur-sm shadow-inner shadow-white/60 rounded-lg overflow-hidden max-w-full">
                <Image
                  src="/assets/images/images/code.png"
                  alt="api image"
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocsShowcase;
