"use client";
import React, { useState } from "react";
import { LayoutGrid, Wallet } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import UserWalletDashboard from "../WalletCard/UserWalletDashboard";
import UserActionPanel from "./UserActionPanel";

type Tab = "wallet" | "apps";

interface TabButtonProps {
  value: Tab;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface UserInfoProps {
  session: Session | null;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center gap-2 h-full w-full rounded-md
      transition-all duration-200 ease-in-out
      ${
        isActive
          ? "bg-white text-gray-800 shadow-sm"
          : "text-white/90 hover:bg-white/10 hover:text-white"
      }
    `}
  >
    <Icon size={20} className={`${isActive ? "text-black" : ""}`} />
    <span className="font-medium">{label}</span>
  </button>
);

const LoginAppbar: React.FC<UserInfoProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState<Tab>("wallet");

  const LogoSection = () => (
    <div className="flex items-center justify-center p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link
        href="/"
        className="rounded-lg focus:outline-none focus:ring-2 focus:black/50"
      >
        <Image
          className="rounded-lg"
          src="/assets/images/images/symbolLogo.png"
          alt="logo"
          width={40}
          height={40}
          priority
        />
      </Link>
    </div>
  );

  const TabBar = () => (
    <div className="w-full max-w-[400px]">
      <div className="w-full h-12 grid grid-cols-2 bg-gray-800 text-white rounded-lg p-1.5 shadow-md">
        <TabButton
          value="wallet"
          icon={Wallet}
          label="Wallet"
          isActive={activeTab === "wallet"}
          onClick={() => setActiveTab("wallet")}
        />
        <TabButton
          value="apps"
          icon={LayoutGrid}
          label="Apps"
          isActive={activeTab === "apps"}
          onClick={() => setActiveTab("apps")}
        />
      </div>
    </div>
  );

  const MobileTabBar = () => (
    <div className="fixed bottom-0 left-0 z-10 w-full border-t border-gray-200 bg-white/90 backdrop-blur-md ">
      <div className="flex h-16 items-center justify-around px-4">
        {[
          { tab: "wallet" as Tab, icon: Wallet, label: "Wallet" },
          { tab: "apps" as Tab, icon: LayoutGrid, label: "Apps" },
        ].map(({ tab, icon: Icon, label }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center justify-center w-24 h-full
              ${
                activeTab === tab
                  ? "text-black"
                  : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sm:hidden flex items-center justify-between p-4 bg-white">
        <LogoSection />
        <UserActionPanel session={session} />
      </div>

      <div className="hidden sm:flex items-center justify-between p-4 bg-white">
        <LogoSection />
        <div className="flex-grow flex justify-center mx-4">
          <TabBar />
        </div>
        <div>
          <UserActionPanel session={session} />
        </div>
      </div>

      <div className="flex-grow pb-16 sm:pb-0">
        <div className="container mx-auto p-4">
          {activeTab === "wallet" ? (
            <UserWalletDashboard session={session} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
              <h2 className="text-xl font-semibold text-gray-800">Apps</h2>
              <p className="text-gray-600 mt-2">Apps content coming soon...</p>
            </div>
          )}
        </div>
      </div>

      <div className="sm:hidden">
        <MobileTabBar />
      </div>
    </div>
  );
};

export default LoginAppbar;
