import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { web3auth } from "./web3auth";

let connection: Connection | null = null;
let publicKey: PublicKey | null = null;
const SOLANA_RPC_ENDPOINT = "https://api.devnet.solana.com";

export function initClients() {
  if (typeof window !== "undefined" && web3auth.provider) {
    connection = new Connection(SOLANA_RPC_ENDPOINT);

    web3auth.provider
      .request({ method: "getAccounts" })
      .then((accounts: unknown) => {
        if (
          Array.isArray(accounts) &&
          accounts.length > 0 &&
          typeof accounts[0] === "string"
        ) {
          publicKey = new PublicKey(accounts[0]);
        } else {
          console.error("Unable to get a valid public key from Web3Auth");
        }
      })
      .catch((error) => {
        console.error("Error getting accounts from Web3Auth:", error);
      });
  }
}

export function getConnection() {
  if (typeof window !== "undefined" && !connection) {
    initClients();
  }
  return connection;
}

export function getPublicKey() {
  if (typeof window !== "undefined" && !publicKey) {
    initClients();
  }
  return publicKey;
}

export function getPrivateKey() {
  if (typeof window !== "undefined" && web3auth.provider) {
    return web3auth.provider.request({ method: "solanaPrivateKey" });
  }
  return null;
}

export function formatSOL(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(9);
}

export function parseSOL(sol: string): number {
  return Math.floor(parseFloat(sol) * LAMPORTS_PER_SOL);
}

export async function getBalance(address: PublicKey): Promise<string> {
  if (!connection) throw new Error("Connection not initialized");
  const balance = await connection.getBalance(address);
  return formatSOL(balance);
}

export async function getTokenBalance(
  ownerAddress: PublicKey,
  mintAddress: PublicKey
): Promise<number> {
  if (!connection) throw new Error("Connection not initialized");

  try {
    const tokenAccount = await getAssociatedTokenAddress(
      mintAddress,
      ownerAddress
    );
    const tokenAccountInfo = await connection.getParsedTokenAccountsByOwner(
      ownerAddress,
      { mint: mintAddress }
    );
    if (tokenAccountInfo.value.length > 0) {
      return tokenAccountInfo.value[0].account.data.parsed.info.tokenAmount
        .uiAmount;
    }

    return 0;
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return 0;
  }
}

export async function sendTransaction(
  from: PublicKey,
  to: string,
  amount: number,
  mintAddress?: string
) {
  if (!connection || !web3auth.provider)
    throw new Error("Connection or provider not initialized");
  if (mintAddress && mintAddress !== "SOL") {
    const mintPublicKey = new PublicKey(mintAddress);
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      from
    );
    const tokenAccountInfo = await connection.getParsedTokenAccountsByOwner(
      from,
      { mint: mintPublicKey }
    );
    if (tokenAccountInfo.value.length === 0) {
      throw new Error(`No token account found for mint ${mintAddress}`);
    }

    const tokenBalance =
      tokenAccountInfo.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    const amountInUIAmount =
      amount /
      Math.pow(
        10,
        tokenAccountInfo.value[0].account.data.parsed.info.tokenAmount.decimals
      );

    if (tokenBalance < amountInUIAmount) {
      throw new Error(
        `Insufficient token balance. Required: ${amountInUIAmount}, Available: ${tokenBalance}`
      );
    }
  }

  let transaction: Transaction;

  if (!mintAddress || mintAddress === "SOL") {
    transaction = await createSolTransferTransaction(from, to, amount);
  } else {
    transaction = await createTokenTransferTransaction(
      from,
      to,
      amount,
      new PublicKey(mintAddress)
    );
  }

  try {
    const privateKeyHex = (await web3auth.provider.request({
      method: "solanaPrivateKey",
    })) as string;

    if (!privateKeyHex)
      throw new Error("Failed to get private key from Web3Auth");
    const privateKeyUint8 = new Uint8Array(Buffer.from(privateKeyHex, "hex"));
    const keypair = Keypair.fromSecretKey(privateKeyUint8);
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);

    return signature;
  } catch (error) {
    console.error("Transaction error:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

async function createSolTransferTransaction(
  from: PublicKey,
  to: string,
  amount: number
) {
  if (!connection) throw new Error("Connection not initialized");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: new PublicKey(to),
      lamports: amount,
    })
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = from;

  return transaction;
}

async function createTokenTransferTransaction(
  from: PublicKey,
  to: string,
  amount: number,
  mint: PublicKey
) {
  if (!connection) throw new Error("Connection not initialized");
  const fromTokenAccount = await getAssociatedTokenAddress(mint, from);
  const toTokenAccount = await getAssociatedTokenAddress(
    mint,
    new PublicKey(to)
  );

  const transaction = new Transaction();
  const fromTokenAccountInfo = await connection.getAccountInfo(
    fromTokenAccount
  );
  if (!fromTokenAccountInfo) {
    throw new Error("Sender's token account does not exist");
  }
  const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);
  if (!toTokenAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        from,
        toTokenAccount,
        new PublicKey(to),
        mint
      )
    );
  }
  transaction.add(
    createTransferInstruction(fromTokenAccount, toTokenAccount, from, amount, [
      from,
    ])
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = from;

  return transaction;
}
