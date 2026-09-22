import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getToken, isLoggedIn } from "../api/client";
import { getWallet } from "../api/wallet";
import { WalletContext } from "./wallet-context";

/**
 * Cached wallet summary for the navbar chip, checkout and subscription pages.
 *
 * Re-fetches whenever the signed-in token changes (login, logout, expiry), so
 * the balance never shows one account's money to another. The server stays
 * authoritative - every charge is decided there, this only mirrors it.
 */
export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const fetchedFor = useRef(undefined);

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) {
      fetchedFor.current = null;
      setWallet(null);
      return null;
    }

    fetchedFor.current = getToken();
    setLoading(true);

    try {
      const data = await getWallet();
      setWallet(data);
      setError(null);
      return data;
    } catch (err) {
      if (err.status === 401) setWallet(null);
      else setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Route changes are when login/logout become visible; refetch only if the
  // identity actually changed, not on every navigation.
  useEffect(() => {
    const token = isLoggedIn() ? getToken() : null;
    if (token !== fetchedFor.current) refresh();
  }, [location.pathname, refresh]);

  const value = useMemo(
    () => ({
      wallet,
      balance: Number(wallet?.balance ?? 0),
      forecast: wallet?.forecast ?? null,
      loading,
      error,
      refresh,
      setWallet,
    }),
    [wallet, loading, error, refresh]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
