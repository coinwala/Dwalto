import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-28 px-4 bg-black">
      <div className="relative px-4 py-12 md:py-16 lg:py-20 rounded-xl max-w-full md:max-w-[900px] lg:max-w-[1300px] container mx-auto bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 via-gray-100/20 to-gray-300/30 rounded-xl -z-10 blur-sm"></div>
        <div className="absolute inset-0.5 border-2 border-gray-100/50 rounded-xl -z-10"></div>

        <div className="max-w-[540px] mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text text-center mb-5">
            Sign up to get started.
          </h2>
          <p className="text-base sm:text-lg tracking-tighter text-black/70 text-center mb-10">
            Ready to Secure Your Crypto Assets? Sign Up Now to Get Started with
            Our Easy-to-Use Wallet Generator.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-3 
              px-6 sm:px-8 py-3
              text-sm sm:text-base
              bg-gray-100/10 
              border-r-2
              backdrop-blur-sm 
              border border-gray-300/30 
              hover:bg-gray-100/20 
              transition-all duration-300 
              group
              text-black
              hover:text-black/80
            "
          >
            Get started
          </Button>
          <Button
            size="lg"
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-3 
              px-6 sm:px-8 py-3
              text-sm sm:text-base
              bg-black 
              text-white
              hover:bg-black/90 
              transition-all duration-300 
              group
            "
          >
            <span>Learn more</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
