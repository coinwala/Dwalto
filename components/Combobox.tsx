import React, { useState, useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface Token {
  value: string;
  label: string;
  symbol: string;
  logoURI: string;
  balance: number;
}

interface TokenMetadata {
  symbol: string;
  name: string;
  logoURI: string;
}

interface ComboboxProps {
  CoinWalaPublicKey: string;
  onTokenSelect: (token: Token | null) => void;
}

const SOLANA_TOKEN_LIST_URL =
  "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json";

export function Combobox({ CoinWalaPublicKey, onTokenSelect }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenList, setTokenList] = useState<Record<string, TokenMetadata>>({});

  useEffect(() => {
    fetch(SOLANA_TOKEN_LIST_URL)
      .then((response) => response.json())
      .then((data) => {
        const tokenMetadata: Record<string, TokenMetadata> = {};
        data.tokens.forEach((token: any) => {
          if (token.chainId === 103) {
            // devnet chainId
            tokenMetadata[token.address] = {
              symbol: token.symbol,
              name: token.name,
              logoURI: token.logoURI,
            };
          }
        });
        setTokenList(tokenMetadata);
      })
      .catch((error) => console.error("Error fetching token list:", error));
  }, []);

  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!CoinWalaPublicKey) return;

      const connection = new Connection("https://api.devnet.solana.com");
      const publicKey = new PublicKey(CoinWalaPublicKey);

      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          }
        );

        const fetchedTokens: Token[] = tokenAccounts.value
          .map((tokenAccount) => {
            const mintAddress = tokenAccount.account.data.parsed.info.mint;
            const balance =
              tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
            const metadata = tokenList[mintAddress] || {
              symbol: "Unknown",
              name: "Unknown Token",
              logoURI: "",
            };

            return {
              value: mintAddress,
              label: metadata.name,
              symbol: metadata.symbol,
              logoURI: metadata.logoURI,
              balance: balance,
            };
          })
          .filter((token) => token.balance > 0);

        const solBalance = await connection.getBalance(publicKey);
        if (solBalance > 0) {
          fetchedTokens.unshift({
            value: "SOL",
            label: "Solana",
            symbol: "SOL",
            logoURI:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            balance: solBalance / LAMPORTS_PER_SOL,
          });
        }

        setTokens(fetchedTokens);
        if (fetchedTokens.length > 0) {
          setValue(fetchedTokens[0].value);
          onTokenSelect(fetchedTokens[0]);
        } else {
          onTokenSelect(null);
        }
      } catch (error) {
        console.error("Error fetching token balances:", error);
        onTokenSelect(null);
      }
    };

    if (Object.keys(tokenList).length > 0) {
      fetchTokenBalances();
    }
  }, [CoinWalaPublicKey, tokenList, onTokenSelect]);

  const selectedToken = tokens.find((token) => token.value === value);

  useEffect(() => {
    onTokenSelect(selectedToken || null);
  }, [selectedToken, onTokenSelect]);

  if (tokens.length === 0) {
    return (
      <div className="flex items-center justify-center p-2 border rounded-md">
        No tokens with balance found
      </div>
    );
  }

  if (tokens.length === 1) {
    return (
      <div className="flex items-center gap-2 p-2 border rounded-md">
        <img
          src={tokens[0].logoURI}
          alt={tokens[0].symbol}
          className="w-5 h-5 rounded-full"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://via.placeholder.com/20?text=" +
              tokens[0].symbol.charAt(0);
          }}
        />
        <span>{tokens[0].label}</span>
        <span className="ml-auto text-sm text-gray-500">
          {tokens[0].balance.toFixed(4)}
        </span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[50px] justify-between"
        >
          <div className="flex items-center justify-center flex-1">
            {selectedToken ? (
              <div className="flex items-center gap-2">
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://via.placeholder.com/20?text=" +
                      selectedToken.symbol.charAt(0);
                  }}
                />
                <span>{selectedToken.label}</span>
              </div>
            ) : (
              "Select Token..."
            )}
          </div>
          <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search Token..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Token found.</CommandEmpty>
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  key={token.value}
                  value={token.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-5 h-5 rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/20?text=" +
                          token.symbol.charAt(0);
                      }}
                    />
                    <span>{token.label}</span>
                    <span className="ml-auto text-sm text-gray-500">
                      {token.balance.toFixed(4)}
                    </span>
                  </div>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === token.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
