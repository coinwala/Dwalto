"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Book,
  ChevronDown,
  Settings,
  Globe,
  Zap,
  type LucideIcon,
  Code,
  Newspaper,
  MessageCircle,
} from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

const SignIn = dynamic(() => import("../auth/signin-button"), { ssr: false });
const CoinwalaLogo = dynamic(() => import("../CoinWala"), { ssr: false });

interface SubMenuItem {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
}

interface NavMenuItem {
  label: string;
  icon: LucideIcon;
  submenu?: SubMenuItem[];
}

const NavbarResponsive = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { connected } = useWallet();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ensure window is defined before accessing it
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setIsVisible(window.scrollY === 0);
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          setActiveMenu(null);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobileMenuOpen]);

  const menuItems: NavMenuItem[] = [
    {
      label: "Products",
      icon: Zap,
      submenu: [
        {
          title: "Dwalto Wallet",
          description: "Non-custodial Solana wallet",
          href: "/products/wallet",
          icon: Wallet,
        },
        {
          title: "Dwalto Wallet Adapter",
          description: "Seamless blockchain integration",
          href: "/products/dwalto-wallet-adapter",
          icon: Globe,
        },
      ],
    },
    {
      label: "Developers",
      icon: Book,
      submenu: [
        {
          title: "Documentation",
          href: "/docs",
          description: "Comprehensive guides",
          icon: Book,
        },
        {
          title: "API References",
          href: "/api",
          description: "Detailed technical specs",
          icon: Code,
        },
      ],
    },
    {
      label: "Resources",
      icon: Settings,
      submenu: [
        {
          title: "Blog",
          href: "/blog",
          description: "Latest insights",
          icon: Newspaper,
        },
      ],
    },
    {
      label: "FAQ",
      icon: MessageCircle,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-black/80 text-white backdrop-blur-md"
        >
          <div className="max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <nav className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Image
                  src={"/assets/images/images/nameLogo.png"}
                  height={120}
                  width={120}
                  alt="logo"
                />
              </div>
              <div
                className="hidden md:flex items-center space-x-4"
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menuItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setActiveMenu(item.label)}
                  >
                    <button className="flex items-center text-sm font-medium hover:text-blue-600 transition-colors">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                      {item.submenu && (
                        <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                      )}
                    </button>
                    {item.submenu && (
                      <AnimatePresence>
                        {activeMenu === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-4 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 p-4"
                          >
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.title}
                                href={subitem.href}
                                className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                              >
                                {subitem.icon ? (
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md mr-3 flex items-center justify-center">
                                    <subitem.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                  </div>
                                ) : (
                                  <div className="w-10 mr-3" />
                                )}
                                <div className="flex flex-col justify-center">
                                  <p className="font-semibold text-black dark:text-white text-sm group-hover:text-blue-600 leading-tight">
                                    {subitem.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                    {subitem.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <WalletMultiButton
                    style={{
                      backgroundColor: "rgb(255 255 255 / 0.1)",
                      height: "43px",
                      borderRadius: "8px",
                      padding: "0 12px",
                      fontSize: "14px",
                    }}
                  >
                    {!connected && <Wallet className="h-4 w-4 mr-2" />}
                    {connected ? "Connected" : "Connect"}
                  </WalletMultiButton>
                </div>

                <SignIn />
              </div>
            </nav>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default NavbarResponsive;
