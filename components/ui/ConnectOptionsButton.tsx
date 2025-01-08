"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronUp, ChevronDown, Wallet } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";

const ConnectOptionsButton = ({ onSelect }: any) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (option: any) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
    console.log("Selected option:", option);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="w-full h-11 text-white font-bold">
          <span className="relative flex items-center justify-center w-full">
            {selected || "Connect Options"}
            <span className="absolute right-3 flex h-full items-center justify-center">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[458px]">
        <DropdownMenuItem
          className="flex items-start p-3 cursor-pointer"
          onClick={() => handleSelect("Login to Coinwala")}
        >
          <div className="flex w-5 items-center justify-center pt-1 mr-3">
            <FaGoogle size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Login to your Coinwala Account
            </h3>
            <p className="text-sm text-gray-600">
              No sign up needed, simply connect your existing Google account to
              access Coinwala.
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-start p-3 cursor-pointer"
          onClick={() => handleSelect("Connect Wallet")}
        >
          <div className="flex w-5 items-center justify-center pt-1 mr-3">
            <Wallet size={20} className="text-gray-700" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Connect a wallet
            </h3>
            <p className="text-sm text-gray-600">
              We support external wallet such as: Phantom, Solflare, and more.
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectOptionsButton;
