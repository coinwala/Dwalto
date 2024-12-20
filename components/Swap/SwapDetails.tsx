"use client";

import { useState } from "react";
import { Cog, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface swapProps {
  setSlippage: React.Dispatch<React.SetStateAction<string>>;
  slippage: string;
}

export default function SwapSettingsModal({
  setSlippage,
  slippage,
}: swapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("0.5%");
  const [directRouteOnly, setDirectRouteOnly] = useState(false);

  const handleSlippageChange = (value: string) => {
    setSlippage(value);
    if (value !== "custom") {
      setCustomSlippage(value);
    }
  };

  const handleCustomSlippageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomSlippage(e.target.value);
  };

  const resetToDefault = () => {
    setSlippage("0.5%");
    setCustomSlippage("0.5%");
    setDirectRouteOnly(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="flex min-w-max cursor-pointer flex-row items-center justify-end self-center text-grey-700 hover:opacity-80">
          <Cog className="mr-1 w-4" />
          <p className="gap-1 text-xs font-semibold">Settings</p>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Swap Settings
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 mobile:p-8">
          <p className="mb-2 mt-4 text-sm font-semibold text-gray-700 mobile:text-xs">
            Slippage
          </p>
          <ToggleGroup
            type="single"
            value={slippage}
            onValueChange={handleSlippageChange}
            className="flex flex-row"
          >
            {["0.1%", "0.5%", "1%", "custom"].map((value, index) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className={`flex-1 cursor-pointer border py-2 ${
                  index === 0
                    ? "rounded-l-lg"
                    : index === 3
                    ? "rounded-r-lg"
                    : ""
                }`}
              >
                <p className="text-center text-sm mobile:text-xs">
                  {value === "custom" ? "Custom" : value}
                </p>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {slippage === "custom" && (
            <Input
              type="text"
              inputMode="decimal"
              value={customSlippage}
              onChange={handleCustomSlippageChange}
              placeholder="0.00%"
              maxLength={6}
              className="mt-4 rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-blue-500"
            />
          )}
          {slippage === "custom" && parseFloat(customSlippage) === 0 && (
            <p className="mt-3 text-xs font-semibold text-red-500">
              Slippage must be higher than 0%
            </p>
          )}
          {slippage === "custom" &&
            parseFloat(customSlippage) > 0 &&
            parseFloat(customSlippage) < 0.5 && (
              <p className="mt-3 text-xs font-semibold text-yellow-700">
                Warning: Low slippage may result in failed transactions
              </p>
            )}
          <div className="mt-4 flex flex-row justify-between">
            <p className="mb-1 mt-2 grow-0 self-center text-sm font-semibold text-gray-700 mobile:text-xs">
              Direct Route Only
            </p>
            <Switch
              checked={directRouteOnly}
              onCheckedChange={setDirectRouteOnly}
            />
          </div>
          <div className="mt-4 flex flex-col gap-2 mobile:flex-row mobile:justify-between">
            <Button
              variant="outline"
              onClick={resetToDefault}
              className="w-full mobile:w-auto"
            >
              Reset to Default
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full mobile:w-auto"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
