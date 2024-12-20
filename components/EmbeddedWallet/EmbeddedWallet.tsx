"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import WalletOverview from "./WalletOverview";
import { createMessageId, isAllowedOrigin } from "@/lib/messageUtils";
import { ExtendedTransactionDetails, MessageData } from "@/lib/types";
import nacl from "tweetnacl";
import { ALLOWED_ORIGINS } from "@/lib/constants";
import { Session } from "next-auth";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import { LoginDialog } from "./LoginDialog";
import TransactionDialog from "./TransactionDialog";
import { getPrivateKey } from "@/lib/client";

// View types enum
enum ViewType {
  WALLET = "WALLET",
  LOGIN = "LOGIN",
  TRANSACTION = "TRANSACTION",
}

const useMessageHandler = () => {
  const parentOriginRef = useRef<string | null>(null);
  const processedMessages = useRef<Set<string>>(new Set());
  const publicKeyRef = useRef<string | null>(null);

  const sendMessageToParent = useCallback((message: MessageData) => {
    if (typeof window === "undefined" || !window.parent) {
      console.error("No parent window found");
      return;
    }

    const enrichedMessage = {
      ...message,
      windowName: "",
      timestamp: Date.now(),
    };

    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      try {
        window.parent.postMessage(enrichedMessage, "*");
      } catch (err) {
        console.error("Failed to send message:", err);
      }
      return;
    }

    if (parentOriginRef.current) {
      try {
        window.parent.postMessage(enrichedMessage, parentOriginRef.current);
      } catch (err) {
        console.warn(`Failed to send to ${parentOriginRef.current}:`, err);
      }
    } else {
      let messageSent = false;
      for (const origin of ALLOWED_ORIGINS) {
        try {
          window.parent.postMessage(enrichedMessage, origin);
          parentOriginRef.current = origin;
          messageSent = true;
          break;
        } catch (err) {
          console.warn(`Failed to send to ${origin}:`, err);
        }
      }

      if (!messageSent) {
        console.error("Failed to send message to any allowed origin");
      }
    }
  }, []);

  const sendPublicKey = useCallback(
    (publicKey: string, dAppSessionId?: string, tipLinkSessionId?: string) => {
      publicKeyRef.current = publicKey;
      sendMessageToParent({
        type: "public_key",
        publicKey,
        windowName: "",
        timestamp: Date.now(),
        dAppSessionId,
        tipLinkSessionId,
      });
    },
    [sendMessageToParent]
  );

  return {
    sendMessageToParent,
    sendPublicKey,
    parentOriginRef,
    processedMessages,
    publicKeyRef,
  };
};

type UserInfoProps = {
  session: Session | null;
};

export default function EmbeddedWallet({ session }: UserInfoProps) {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.LOGIN);
  const [transactionDetails, setTransactionDetails] =
    useState<ExtendedTransactionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string>("");

  const {
    sendMessageToParent,
    sendPublicKey,
    parentOriginRef,
    processedMessages,
    publicKeyRef,
  } = useMessageHandler();

  const handleTransactionConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!transactionDetails) {
        throw new Error("No transaction details available");
      }

      console.log("Starting transaction signing process");

      const keypair = await getKeypair();
      if (!keypair) {
        throw new Error("Failed to generate keypair");
      }

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

      const { blockhash } = await connection.getLatestBlockhash();

      let signedTransaction: Transaction;

      try {
        const transaction = Transaction.from(
          Buffer.from(transactionDetails.originalMessage, "base64")
        );

        if (!transaction.feePayer) {
          transaction.feePayer = keypair.publicKey;
        }

        transaction.recentBlockhash = blockhash;

        // Sign the transaction
        transaction.sign(keypair);

        const isVerified = transaction.verifySignatures();
        if (!isVerified) {
          throw new Error("Transaction signature verification failed");
        }

        signedTransaction = transaction;
      } catch (error) {
        console.error("Legacy transaction handling failed:", error);
        throw error;
      }
      const signedMessage = signedTransaction.serialize({
        requireAllSignatures: true,
        verifySignatures: true,
      });

      sendMessageToParent({
        type: "signed_transaction",
        status: "success",
        requestId: currentRequestId,
        signed_transaction: signedMessage.toString("base64"),
        windowName: "",
        publicKey: keypair.publicKey.toBase58(),
      });
      try {
        const signature = await connection.sendRawTransaction(signedMessage, {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
        const confirmation = await connection.confirmTransaction(
          signature,
          "confirmed"
        );

        if (confirmation.value.err) {
          throw new Error(`Transaction failed: ${confirmation.value.err}`);
        }

        console.log("Transaction sent successfully! Signature:", signature);
      } catch (sendError) {
        console.error("Error sending transaction:", sendError);
        throw new Error(`Failed to send transaction: ${sendError}`);
      }

      console.log("Transaction signed and sent successfully");
      setCurrentView(ViewType.WALLET);
    } catch (error) {
      console.error("Transaction signing error:", error);
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );

      sendMessageToParent({
        type: "sign_error",
        status: "error",
        requestId: currentRequestId,
        message:
          error instanceof Error ? error.message : "Failed to sign transaction",
        windowName: "",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentRequestId, sendMessageToParent, transactionDetails]);

  function deserializeTransaction(
    base64Message: string | undefined
  ): Transaction {
    try {
      if (!base64Message) {
        throw new Error("No transaction message provided");
      }

      const buffer = Buffer.from(base64Message, "base64");

      const transaction = Transaction.from(buffer);

      if (!transaction) {
        throw new Error("Failed to create transaction from buffer");
      }

      return transaction;
    } catch (error) {
      console.error("Transaction deserialization error:", error);
      throw new Error(
        `Failed to deserialize transaction: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  const hexToUint8Array = (hexString: string): Uint8Array => {
    if (hexString.length % 2 !== 0) {
      throw new Error("Invalid hex string length");
    }

    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
    }
    return bytes;
  };

  async function getKeypair(): Promise<Keypair | null> {
    try {
      const privateKeyString = await getPrivateKey();

      if (!privateKeyString) {
        console.error("No private key found");
        return null;
      }
      console.log("transaction", transactionDetails);
      const secretKey = hexToUint8Array(privateKeyString.toString());
      console.log("secretKey", Keypair.fromSecretKey(secretKey));
      return Keypair.fromSecretKey(secretKey);
    } catch (error) {
      console.error("Error creating keypair:", error);
      throw new Error("Invalid private key format");
    }
  }

  const handleTransactionCancel = useCallback(() => {
    sendMessageToParent({
      type: "transaction_closed",
      status: "cancelled",
    });
  }, [sendMessageToParent]);
  function processTransaction(
    base64Message: string
  ): ExtendedTransactionDetails {
    try {
      const reconstructedTransaction = deserializeTransaction(base64Message);
      const transactionInstructions = reconstructedTransaction.instructions;
      let estimatedSolAmount = 0;
      try {
        if (transactionInstructions.length > 0) {
          const instruction = transactionInstructions[0];
          if (instruction.programId.equals(SystemProgram.programId)) {
            const dataView = new DataView(instruction.data.buffer);
            estimatedSolAmount = Number(dataView.getBigUint64(4, true)) / 1e9;
          }
        }
      } catch (err) {
        console.warn("Error extracting SOL amount:", err);
        estimatedSolAmount = 0;
      }

      const mockSolPrice = 100;
      const estimatedUsdAmount = estimatedSolAmount * mockSolPrice;

      return {
        feePayer: reconstructedTransaction.feePayer?.toBase58(),
        recentBlockhash: reconstructedTransaction.recentBlockhash,
        instructionsCount: reconstructedTransaction.instructions?.length ?? 0,
        solAmount: estimatedSolAmount,
        usdAmount: estimatedUsdAmount,
        receivingAsset: {
          name: "SOL",
          amount: estimatedSolAmount,
        },
        hyperLinkHandle: publicKeyRef.current
          ? `@${publicKeyRef.current.slice(
              0,
              4
            )}...${publicKeyRef.current.slice(-4)}`
          : "@unknown",
        originalMessage: base64Message,
      };
    } catch (error) {
      console.error("Transaction processing error:", error);
      throw error;
    }
  }

  const handleMessage = useCallback(
    (event: MessageEvent<MessageData>) => {
      const isDevelopment = process.env.NODE_ENV === "development";
      if (!isDevelopment && !isAllowedOrigin(event.origin)) {
        console.warn("Unauthorized origin:", event.origin);
        return;
      }

      parentOriginRef.current = event.origin;

      const messageId = createMessageId(
        event.data?.type,
        event.data?.timestamp
      );
      if (processedMessages.current.has(messageId)) return;

      processedMessages.current.add(messageId);
      if (processedMessages.current.size > 100) {
        processedMessages.current.clear();
      }

      if (!event.data || typeof event.data !== "object") {
        console.warn("Invalid message format");
        return;
      }

      switch (event.data.type) {
        case "ack":
          sendMessageToParent({
            type: "ready",
            dAppSessionId: event.data.dAppSessionId,
            tipLinkSessionId: event.data.tipLinkSessionId,
          });
          break;

        case "public_key":
          console.log("Received public key:", event.data.publicKey);
          if (event.data.publicKey) {
            publicKeyRef.current = event.data.publicKey;
            sendMessageToParent({
              type: "public_key",
              windowName: "",
              publicKey: event.data.publicKey,
            });
          }
          break;

        case "ack_loaded_public_key":
          sendMessageToParent({
            type: "loaded_public_key",
            dAppSessionId: event.data.dAppSessionId,
            tipLinkSessionId: event.data.tipLinkSessionId,
            publicKey: publicKeyRef.current || "",
          });
          break;

        case "click_to_continue":
        case "embedded_login":
          sendMessageToParent({
            type: `${event.data.type}_received`,
          });
          break;

        case "show_wallet":
          console.log("show_wallet");
          setCurrentView(ViewType.WALLET);
          sendMessageToParent({
            type: "show_wallet",
            windowName: "",
          });
          break;

        case "login_success":
          console.log("login_success");
          setCurrentView(ViewType.WALLET);
          break;

        case "sign_transaction":
          try {
            const messageData: MessageData = event.data;
            if (messageData.message && messageData.requestId) {
              const processedTx = processTransaction(messageData.message);

              setTransactionDetails({
                ...processedTx,
                originalMessage: messageData.message,
              });

              setCurrentRequestId(messageData.requestId);
              setCurrentView(ViewType.TRANSACTION);
            } else {
              throw new Error("Missing transaction message or requestId");
            }
          } catch (error) {
            console.error("Sign transaction error:", error);
            if (event.data.requestId) {
              sendMessageToParent({
                type: "sign_transaction_response",
                requestId: event.data.requestId,
                status: "error",
                windowName: "",
              });
            }
          }
          break;
        default:
          console.log("Unhandled message type:", event.data.type);
      }
    },
    [sendMessageToParent]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("message", handleMessage);
    console.log("121");
    sendMessageToParent({ type: "ready" });

    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage, sendMessageToParent]);

  const handleLoginSuccess = useCallback(
    (publicKey: string) => {
      if (!publicKey) {
        console.error("No public key received from login");
        return;
      }
      sendPublicKey(publicKey);
      setCurrentView(ViewType.WALLET);
    },
    [sendPublicKey]
  );

  const handleGoogleLogin = useCallback(() => {
    console.log("Initiating Google login");
    sendMessageToParent({
      type: "login_initiated",
      windowName: "",
    });

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const loginUrl = new URL("/embedded_adapter_login", window.location.origin);
    if (parentOriginRef.current) {
      loginUrl.searchParams.set("parentOrigin", parentOriginRef.current);
    }

    const loginWindow = window.open(
      loginUrl.toString(),
      "Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleLoginResponse = (event: MessageEvent) => {
      const isDevelopment = process.env.NODE_ENV === "development";
      const isValidOrigin = isDevelopment
        ? event.origin.startsWith("http://localhost:3000") ||
          event.origin.startsWith("http://localhost:3001")
        : isAllowedOrigin(event.origin);

      if (!isValidOrigin) return;

      if (event.data?.type === "login_success" && event.data?.publicKey) {
        handleLoginSuccess(event.data.publicKey);
        window.removeEventListener("message", handleLoginResponse);
      }
    };

    window.addEventListener("message", handleLoginResponse);
  }, [sendMessageToParent, handleLoginSuccess]);

  const handleOverviewClose = useCallback(() => {
    setCurrentView(ViewType.LOGIN);
    sendMessageToParent({
      type: "hide_wallet",
      windowName: "",
    });

    // Wait for disconnect acknowledgment before final cleanup
    const cleanup = () => {
      processedMessages.current.clear();
    };

    cleanup();
  }, [sendMessageToParent]);

  const handleLoginClose = useCallback(() => {
    sendMessageToParent({
      type: "cancel_connect",
      windowName: "",
    });
  }, [sendMessageToParent]);

  const viewComponents: Record<ViewType, () => JSX.Element> = {
    [ViewType.WALLET]: () => (
      <WalletOverview
        showWalletView={currentView === ViewType.WALLET}
        onClose={handleOverviewClose}
        session={session}
      />
    ),
    [ViewType.LOGIN]: () => (
      <LoginDialog
        showLoginView={currentView === ViewType.LOGIN}
        handleLoginClose={handleLoginClose}
        onGoogleLogin={handleGoogleLogin}
      />
    ),
    [ViewType.TRANSACTION]: () => (
      <TransactionDialog
        onConfirm={handleTransactionConfirm}
        onCancel={handleTransactionCancel}
        transactionDetails={transactionDetails || {}}
        isLoading={isLoading}
      />
    ),
  };

  return viewComponents[currentView]();
}
