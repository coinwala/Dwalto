"use client";
import React, { useEffect, useState, useTransition, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { Session } from "next-auth";
import { signInAction } from "@/lib/signInAction";
import { decodeToken, web3auth } from "@/lib/web3auth";
import { initClients } from "@/lib/client";
import { handleSignOut } from "@/actions";
import * as CryptoJS from "crypto-js";

type UserInfoProps = {
  session: Session | null;
};

type MessagePayload = {
  type: string;
  windowName: string;
  publicKey: string;
  timestamp?: number;
};

// Enhanced message sender with proper origin handling
const sendMessageToParent = (message: MessagePayload) => {
  if (!window.opener) {
    console.error("No parent window found");
    return;
  }

  const enrichedMessage = {
    ...message,
    timestamp: Date.now(),
  };

  const isDevelopment = process.env.NODE_ENV === "development";
  const developmentOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://wallet.coinwala.io",
  ];
  const productionOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS
    ? JSON.parse(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS)
    : ["https://wallet.coinwala.io"]; 

  const originsToTry = isDevelopment ? developmentOrigins : productionOrigins;

  let messageSent = false;
  for (const origin of originsToTry) {
    try {
      window.opener.postMessage(enrichedMessage, origin);
      console.log(`Successfully sent message to ${origin}:`, enrichedMessage);
      messageSent = true;
      break;
    } catch (err) {
      console.warn(`Failed to send to ${origin}:`, err);
    }
  }

  if (!messageSent) {
    console.error("Failed to send message to any allowed origin");
  }
};

const VISIT_KEY = "has_visited_adapter";
const SIGN_IN_KEY = "has_signed_in";
const ENCRYPTION_KEY = "your_encryption_key";
const ENCRYPTION_VALUE = "your_encryption_value";
const verifier = process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER ?? "";

const encryptWithKeyValue = (data: any, key: string, value: string) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CryptoJS.enc.Utf8.parse(key),
    {
      iv: CryptoJS.enc.Utf8.parse(value),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  return encrypted;
};

const storeSession = (session: Session) => {
  const encryptedSession = encryptWithKeyValue(
    session,
    ENCRYPTION_KEY,
    ENCRYPTION_VALUE
  );
  localStorage.setItem("encrypted_session", encryptedSession);
};

export default function AdapterLogin({ session }: UserInfoProps) {
  const [isPending, startTransition] = useTransition();
  const [hasVisited, setHasVisited] = useState(false);
  const [provider, setProvider] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasSignedIn = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasAlreadySignedIn = sessionStorage.getItem(SIGN_IN_KEY) === "true";

    if (!hasAlreadySignedIn && !hasSignedIn.current) {
      hasSignedIn.current = true;
      sessionStorage.setItem(SIGN_IN_KEY, "true");

      const visitStatus = localStorage.getItem(VISIT_KEY);
      if (!visitStatus) {
        localStorage.setItem(VISIT_KEY, "true");
      }

      setHasVisited(true);
      startTransition(() => {
        signInAction();
      });
    }
  }, []);

  useEffect(() => {
    const getPublicKey = async () => {
      if (provider) {
        try {
          const accounts = await provider.request({ method: "getAccounts" });
          if (Array.isArray(accounts) && accounts.length > 0) {
            const publicKeyString = accounts[0];
            setPublicKey(publicKeyString);
            localStorage.setItem("publicKey", publicKeyString);

          
            const message = {
              type: "login_success", 
              windowName: "",
              publicKey: publicKeyString,
            };

            sendMessageToParent(message);

         
            sessionStorage.setItem(VISIT_KEY, "true");
            setTimeout(() => {
              window.close();
            }, 1000); 
          }
        } catch (error) {
          console.error("Error fetching public key:", error);
          setError("Failed to retrieve public key.");
        }
      }
    };

    getPublicKey();
  }, [provider]);

  useEffect(() => {
    const initWeb3Auth = async () => {
      if (!session?.idToken) return;

      try {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }

        if (web3auth.status === "connected") {
          setProvider(web3auth.provider);
        } else {
          const { payload } = decodeToken(session.idToken);
          const w3aProvider = await web3auth.connect({
            verifier,
            verifierId: (payload as any).email,
            idToken: session.idToken,
          });
          setProvider(w3aProvider);
          localStorage.setItem("provider", JSON.stringify(w3aProvider));
          storeSession(session);
          initClients();
        }
      } catch (e) {
        console.error("Error initializing & connecting to web3auth:", e);
        if (
          e instanceof Error &&
          (e.message.includes("Duplicate token found") ||
            e.message.includes("Wallet is not connected"))
        ) {
          setError(
            "Session expired or wallet disconnected. Please sign in again."
          );
          await handleSignOut();
        } else {
          setError("An error occurred. Please try again.");
        }
        setProvider(null);
        setPublicKey(null);
      }
    };

    initWeb3Auth();
  }, [session]);
  useEffect(() => {
    const encryptedSession = localStorage.getItem("encrypted_session");
    if (encryptedSession) {
      try {
        const session = JSON.parse(
          CryptoJS.AES.decrypt(
            encryptedSession,
            CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
            {
              iv: CryptoJS.enc.Utf8.parse(ENCRYPTION_VALUE),
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            }
          ).toString(CryptoJS.enc.Utf8)
        ) as Session;
      } catch (error) {
        console.error("Error decrypting session:", error);
      }
    }
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black dark:bg-gray-950">
      <div className="mt-[-60px] flex w-full max-w-screen-xl items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full bg-gray-100">
          <Image
            alt="logo"
            height={50}
            width={50}
            src="/icons/logo.png"
            className="object-contain"
            priority
          />
        </div>

        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px]">
          {!isPending && (
            <DotLottieReact src="./lootie/DotAnimation.json" loop autoplay />
          )}
        </div>

        <div className="flex items-center justify-center h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full bg-gray-100">
          <Image
            alt="Google logo"
            height={40}
            width={40}
            src="/assets/images/images/GoogleLogo.png"
            className="object-contain p-1"
            priority
          />
        </div>
      </div>
    </div>
  );
}
