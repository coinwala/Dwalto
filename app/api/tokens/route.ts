import { NextRequest, NextResponse } from "next/server";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import axios from "axios";

interface TokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags: string[];
  extensions?: {
    coingeckoId?: string;
  };
}

interface TokenWithBalanceAndPrice {
  name: string;
  mint: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  native: boolean;
  balance: number;
  usdBalance: number;
  price: number;
}

const connection = new Connection(clusterApiUrl("devnet"));

async function getTokenAccounts(address: string) {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(address),
    { programId: TOKEN_PROGRAM_ID }
  );
  const solBalance = await connection.getBalance(new PublicKey(address));

  const tokenBalances = tokenAccounts.value.map((account) => {
    const mint = account.account.data.parsed.info.mint;
    const processedMint =
      mint === "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        : mint;

    return {
      mint: processedMint,
      balance:
        account.account.data.parsed.info.tokenAmount.amount /
        Math.pow(10, account.account.data.parsed.info.tokenAmount.decimals),
    };
  });

  const solTokenBalance = {
    mint: "So11111111111111111111111111111111111111112",
    balance: solBalance / LAMPORTS_PER_SOL,
  };

  const allTokens = [solTokenBalance, ...tokenBalances];

  return allTokens;
}

async function getTokenMetadata(mint: string): Promise<TokenMetadata | null> {
  try {
    const tokenMetadata = await axios.get<TokenMetadata>(
      `https://tokens.jup.ag/token/${mint}`
    );
    return tokenMetadata.data;
  } catch (error) {
    console.error(`Failed to fetch metadata for mint ${mint}:`, error);
    return null;
  }
}

async function getTokenPrice(
  coingeckoId?: string,
  retries = 3
): Promise<number> {
  if (!coingeckoId) return 0;

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      {
        headers: {
          "x-requested-with": "XMLHttpRequest",
        },
      }
    );
    return response.data[coingeckoId]?.usd || 0;
  } catch (error) {
    if (
      retries > 0 &&
      axios.isAxiosError(error) &&
      error.response?.status === 429
    ) {
      const waitTime = Math.pow(2, 3 - retries) * 1000;
      console.log(`Rate limited. Waiting ${waitTime}ms before retrying.`);

      await new Promise((resolve) => setTimeout(resolve, waitTime));

      return getTokenPrice(coingeckoId, retries - 1);
    }

    console.error(`Error fetching price for ${coingeckoId}:`, error);
    return 0;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") as string;

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Get token accounts and balances
    const accountTokens = await getTokenAccounts(address);

    // Fetch metadata and prices for each token
    const tokenDetailsPromises = accountTokens.map(async (token) => {
      // Determine if the token is native (SOL)
      const isNative =
        token.mint === "So11111111111111111111111111111111111111112";

      // Get token metadata
      const metadata = isNative
        ? {
            name: "Solana",
            symbol: "SOL",
            decimals: 9,
            logoURI:
              "https://assets.coingecko.com/coins/images/4128/standard/solana.png",
            address: token.mint,
            extensions: {
              coingeckoId: "solana",
            },
          }
        : await getTokenMetadata(token.mint);

      // If no metadata, return null
      if (!metadata) return null;

      // Get token price
      const price = isNative
        ? await getTokenPrice("solana")
        : await getTokenPrice(metadata.extensions?.coingeckoId);

      // Calculate USD balance
      const usdBalance = token.balance * price;

      // Construct the token object
      return {
        name: metadata.name,
        mint: token.mint,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        logoURI: metadata.logoURI,
        native: isNative,
        balance: token.balance,
        usdBalance: usdBalance,
        price: price,
      } as TokenWithBalanceAndPrice;
    });

    // Wait for all token details to be processed and filter out null results
    const tokenDetails = (await Promise.all(tokenDetailsPromises)).filter(
      (token): token is TokenWithBalanceAndPrice => token !== null
    );

    return NextResponse.json({
      tokens: tokenDetails,
      totalUsdBalance: tokenDetails.reduce(
        (sum, token) => sum + token.usdBalance,
        0
      ),
    });
  } catch (error) {
    console.error("Error fetching token details:", error);
    return NextResponse.json(
      { error: "Failed to fetch token details" },
      { status: 500 }
    );
  }
}
