import React, { ReactNode } from "react";
import {
  ShieldCheck,
  Package,
  ArrowUpRight,
  PlugZap,
  MonitorSmartphone,
  LucideIcon,
} from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: ReactNode;
  description: string;
  imageAlt: string;
  viewDocs?: boolean;
  className?: string;
  imageClassName?: string;
}

interface CardStyles {
  boxShadow: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  imageAlt,
  viewDocs,
  className = "",
  imageClassName = "",
}) => {
  const cardStyle: CardStyles = {
    boxShadow: `
      rgba(0, 0, 0, 0.06) 0px 2px 40px 0px,
      rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset,
      rgba(255, 255, 255, 0.8) 0px 0px 40px 0px inset
    `,
  };

  const iconContainerStyle: CardStyles = {
    boxShadow: "rgba(0, 124, 191, 0.1) 0px 2px 40px 0px",
  };

  return (
    <div
      className={`flex flex-col rounded-xl bg-black/10 p-6 mobile:p-8 lg:p-10 ${className}`}
      style={cardStyle}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full mobile:h-11 mobile:w-11"
            style={iconContainerStyle}
          >
            <Icon className="h-[18px] w-[18px] text-[#e82523] mobile:h-[22px] mobile:w-[22px]" />
          </div>
          {viewDocs && (
            <div className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-[#e82523] hover:text-[#c41f1d] hover:underline">
              <p>View Docs</p>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
        </div>
        <p className="text-left text-[24px] font-bold leading-tight text-black mobile:text-[30px]">
          {title}
        </p>
        <p className="text-left text-sm text-neutral-standard mobile:text-base">
          {description}
        </p>
      </div>
      {/* <div className={imageClassName}>
        <img
          draggable={false}
          alt={imageAlt}
          loading="lazy"
          className="h-auto w-full"
          src="/api/placeholder/1080/800"
        />
      </div> */}
    </div>
  );
};

const FeaturesGrid: React.FC = () => {
  return (
    <div className="mx-auto mt-5 max-w-[1200px] space-y-3 mobile:space-y-5 lg:mt-10 lg:space-y-10">
      <div className="flex w-full  gap-3 mobile:gap-5 tablet:flex-row tablet:flex-wrap lg:flex-nowrap lg:gap-10">
        {/* Security Feature */}

        <FeatureCard
          icon={ShieldCheck}
          title={
            <>
              Self-custody wallet{" "}
              <span className="text-[#e82523]">without wallet drainers</span>
            </>
          }
          description="Coinwala wallets will only be allowed for vetted sites. Coinwala nor the app have access to your private keys."
          imageClassName="mx-auto flex w-full max-w-[307px] items-center justify-center tablet:mx-[unset] tablet:w-[50%] tablet:justify-start"
          imageAlt="Security Feature"
        />

        {/* SDK Feature */}
        <FeatureCard
          icon={Package}
          title={
            <>
              SDK is just{" "}
              <span className="text-[#e82523]">a few lines of code</span>
            </>
          }
          description="Just install the SDK and pass in our wallet to the Solana wallet adapter."
          viewDocs={true}
          className="flex w-full flex-col space-y-5 pb-0 tablet:w-[calc(50%-10px)] lg:w-[35.416%]"
          imageClassName="flex items-end"
          imageAlt="SDK Feature"
        />

        {/* Composable Feature - Mobile/Tablet */}
        <div className="lg:hidden">
          <FeatureCard
            icon={PlugZap}
            title={
              <>
                Composable across{" "}
                <span className="text-[#e82523]">Solana apps</span>
              </>
            }
            description="Users can leverage the most popular dApps on Solana with a single Google account."
            className="flex w-full flex-col space-y-5 pb-0 tablet:w-[calc(50%-10px)]"
            imageClassName="ml-[-20px] w-[calc(100%_+_40px)] !max-w-[unset] mobile:ml-[-32px] mobile:w-[calc(100%_+_64px)] lg:ml-[-40px] lg:w-[calc(100%_+_80px)]"
            imageAlt="Composable Apps"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 mobile:gap-5 lg:flex-row lg:gap-10">
        {/* Composable Feature - Desktop */}
        <div className="hidden lg:flex lg:w-[35.416%]">
          <FeatureCard
            icon={PlugZap}
            title={
              <>
                Composable across{" "}
                <span className="text-[#e82523]">Solana apps</span>
              </>
            }
            description="Users can leverage the most popular dApps on Solana with a single Google account."
            className="flex-col space-y-5 pb-0"
            imageClassName="ml-[-20px] w-[calc(100%_+_40px)] !max-w-[unset] mobile:ml-[-32px] mobile:w-[calc(100%_+_64px)] lg:ml-[-40px] lg:w-[calc(100%_+_80px)]"
            imageAlt="Composable Apps"
          />
        </div>

        {/* Cross-device Feature */}
        <FeatureCard
          icon={MonitorSmartphone}
          title={
            <>
              <span className="text-[#e82523]">Works across all devices</span>{" "}
              with just a single Google account
            </>
          }
          description="No need to manage accounts between an app and a Chrome extension."
          className="flex w-full flex-col items-start justify-between space-y-5 pb-0 tablet:flex-row lg:w-[61.25%]"
          imageClassName="flex w-full translate-x-[28px] items-end mobile:translate-x-[32px] tablet:translate-x-[40px] mid:max-w-[332px]"
          imageAlt="Cross-device Feature"
        />
      </div>
    </div>
  );
};

export default FeaturesGrid;
