import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import {
  Menu,
  Wallet,
  Coins,
  PlugZap,
  ArrowRight,
  Briefcase,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Session } from "next-auth";
import Logo from "../icons/Logo";
import SignOut from "../auth/signout-button";
import Link from "next/link";

export default function UserActionPanel({
  session,
}: {
  session: Session | null;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className=" focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg">
          <div className="flex gap-2 items-center justify-between w-full p-2 sm:p-2.5 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 bg-white">
            <div className="relative flex-shrink-0">
              <Image
                width={28}
                height={28}
                alt="User avatar"
                className="rounded-full border border-gray-200 h-6 w-6 sm:h-7 sm:w-7"
                src={session?.user?.image || "/api/placeholder/28/28"}
                draggable={false}
                priority
              />
            </div>
            <Menu
              size={18}
              className="text-gray-500 focus:text-black group-hover:text-black transition-colors duration-200"
            />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="!p-0 flex flex-col h-full w-full sm:max-w-md">
        <div className="flex-shrink-0">
          <div className="w-max px-5 py-4">
            <Link
              href="/"
              className="rounded-lg focus:outline-none focus:ring-2 focus:black/50"
            >
              <Image
                className="rounded-lg"
                src="/icons/LogoLight.png"
                alt="logo"
                width={40}
                height={40}
                priority
              />
            </Link>
          </div>

          {session?.user && (
            <div className="w-full select-none p-5 pt-0">
              <div className="flex w-full items-center justify-start">
                <Image
                  width={60}
                  height={60}
                  alt="user avatar"
                  className="rounded-full border border-[#E0E7EB] mr-3 h-[60px] w-[60px]"
                  src={session.user.image || "https://via.placeholder.com/60"}
                  draggable="false"
                />
                <div className="w-max cursor-pointer flex-col items-start justify-center">
                  <p className="line-clamp-1 break-all text-left font-bold text-grey-800">
                    {session.user.name}
                  </p>
                  <p className="line-clamp-1 break-all text-left text-sm text-grey-800">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex w-full items-center gap-2">
                <Button
                  variant="outline"
                  className="w-1/2 !px-2 !text-sm mobile:!px-4 mobile:!text-base"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Wallet Address
                </Button>
                <Button
                  variant="outline"
                  className="w-1/2 !px-2 !text-sm mobile:!px-4 mobile:!text-base"
                >
                  <Coins className="h-5 w-5 mr-2" />
                  Crowdfund Link
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3 p-5 pb-3 pt-0 border-b border-b-grey-100">
            <Button className="w-full justify-center !bg-white !text-blue-500 border border-blue-500 hover:!bg-blue-50">
              <Wallet className="h-5 w-5 mr-2 text-blue-500" />
              Connect Wallet
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="space-y-3 border-b border-b-grey-100 px-5 py-6">
            <p className="text-xs font-bold text-gray-500">Products</p>
            <div className="space-y-2">
              <OptionItem
                icon={<Wallet className="h-5 w-5" />}
                title="CoinWala Wallet"
                description="The world's simplest wallet"
              />
              {/* <OptionItem
                icon={<Coins className="h-5 w-5" />}
                title="Coinwala Pro"
                description="Send digital assets at scale, even to non-crypto users"
              /> */}
              <OptionItem
                icon={<PlugZap className="h-5 w-5" />}
                title="CoinWala Wallet Adapter"
                description="Making blockchain apps consumer-ready"
              />
            </div>
          </div>

          <SimpleOption title="API & Docs" />
          <SimpleOption title="FAQ" />

          <div className="space-y-3 px-5 py-6">
            <p className="text-xs font-bold text-gray-500">Company</p>
            <div className="space-y-2">
              <OptionItem
                icon={<Briefcase className="h-5 w-5" />}
                title="Career"
              />
              <OptionItem
                icon={<Newspaper className="h-5 w-5" />}
                title="Blog"
              />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 mt-auto mb-4">
          <SignOut />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function OptionItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="group relative flex cursor-pointer select-none items-start space-x-2 rounded-lg bg-gray-50 px-5 py-3 pr-12 text-gray-700 transition-colors duration-150 ease-linear hover:bg-blue-50 hover:text-blue-500">
      {icon}
      <div className="space-y-[2px]">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 group-hover:text-blue-500">
            {description}
          </p>
        )}
      </div>
      <ArrowRight className="absolute right-5 top-[50%] h-5 w-5 translate-y-[-50%]" />
    </div>
  );
}

function SimpleOption({ title }: { title: string }) {
  return (
    <div className="flex cursor-pointer items-center justify-between px-5 py-6 font-medium text-gray-700 hover:font-bold border-b border-b-grey-100">
      <div className="text-base">{title}</div>
      <ArrowRight className="h-5 w-5" />
    </div>
  );
}
