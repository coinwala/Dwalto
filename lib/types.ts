/**
 * Token related interfaces
 */
export interface TokenDetails {
  name: string;
  mint: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  price?: string;
  native?: boolean;
}

export interface TokenWithBalance extends TokenDetails {
  balance: string;
  usdBalance: string;
}

/**
 * Allowed origins for message communication
 */
export type AllowedOrigin =
  | "http://localhost:3000"
  | "http://localhost:3001"
  | "https://wallet.coinwala.io";

/**
 * Base transaction details interface
 */
export interface BaseTransactionDetails {
  feePayer?: string;
  recentBlockhash?: string;
  instructionsCount: number;
}

/**
 * Extended transaction details with additional information
 */
export interface ExtendedTransactionDetails extends BaseTransactionDetails {
  solAmount: number;
  usdAmount: number;
  receivingAsset: {
    name: string;
    amount: number;
  };
  hyperLinkHandle: string;
  originalMessage: string;
  transactionHash?: string;
}

/**
 * Transaction with confirmed hash
 */
export interface TransactionWithHash extends ExtendedTransactionDetails {
  transactionHash: string;
}

/**
 * Message data structure for communication
 */
export interface MessageData {
  type: string;
  windowName?: string;
  dAppSessionId?: string;
  tipLinkSessionId?: string;
  publicKey?: string;
  title?: string;
  requestId?: string;
  timestamp?: number;
  message?: string;
  status?: string;
  signedTransaction?: string;
  error?: string;
  transactionHash?: string;
  signed_transaction?: string;
  signed_message?: string;
}

/**
 * Message structure for parent window communication
 */
export interface MessageToParent {
  type: string;
  status: string;
  requestId?: string;
  signedTransaction?: string;
  windowName?: string;
  publicKey?: string;
  error?: string;
}

/**
 * Solana price data structure
 */
export interface SolanaPrice {
  solana: {
    usd: number;
  };
}

export interface NFTMetadata {
  mint: string;
  name: string;
  uri: string;
  symbol: string;
  image: string | undefined;
  metadataAddress?: string;
  updateAuthorityAddress?: string;
  sellerFeeBasisPoints?: number;
  primarySaleHappened?: boolean;
  isMutable?: boolean;
  tokenStandard?: number | null;
  model?: string;
  collection?: {
    address: string;
    verified: boolean;
  } | null;
  json?: {
    description: string;
    image: string;
    name: string;
    symbol: string;
  };
  uses?: any;
  creators?: Array<{
    address: string;
    verified?: boolean;
    share?: number;
  }>;
}

export interface Token {
  address: string;
  created_at: string;
  daily_volume: number;
  decimals: number;
  extensions: {
    coingeckoId?: string;
  };
  freeze_authority: null;
  logoURI: string;
  mint_authority: null;
  minted_at: null;
  name: string;
  permanent_delegate: null;
  symbol: string;
  tags: string[];
}
export interface SwapRouteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: "ExactIn" | "ExactOut";
  slippageBps: number;
  platformFee: null | number;
  priceImpactPct: string;
  routePlan: RoutePlanItem[];
  scoreReport: null | any;
  contextSlot: number;
  timeTaken: number;
}

export interface RoutePlanItem {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}
