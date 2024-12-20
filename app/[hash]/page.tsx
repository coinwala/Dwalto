"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CoinWalaCard from "./(components)/CoinWalaCard";

export default function HashPage() {
  const router = useRouter();
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const extractHash = () => {
      if (typeof window === "undefined") return null;
      if (!window.location.pathname.startsWith("/i")) {
        router.push("/");
        return null;
      }

      const fullHash = window.location.hash;

      if (!fullHash || fullHash.length <= 1) {
        router.push("/");
        return null;
      }

      return fullHash.slice(1);
    };

    const hashValue = extractHash();
    if (hashValue) {
      setHash(hashValue);
    }
  }, [router]);

  if (hash === null) {
    return <div>Loading...</div>;
  }

  return <CoinWalaCard />;
}
