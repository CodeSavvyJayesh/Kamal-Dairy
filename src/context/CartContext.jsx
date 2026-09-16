import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, isLoggedIn } from "../api/client";

const CartContext = createContext(null);

/**
 * Single source of truth for the cart.
 *
 * Before this, every page fetched /api/cart independently and the navbar had
 * no idea anything was in the cart. Now there is one fetch, one cached list,
 * and a count the navbar badge can read.
 *
 * The server is still authoritative for prices and totals - this only caches
 * what the server last told us.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isLoggedIn()) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await api("/api/cart", { auth: true });
      setItems(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      if (err.status === 401) {
        setItems([]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId, quantity = 1) => {
      await api(
        `/api/cart/add?productId=${encodeURIComponent(productId)}&quantity=${quantity}`,
        { method: "POST", auth: true }
      );
      await refresh();
    },
    [refresh]
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      await api(`/api/cart/update?cartItemId=${cartItemId}&quantity=${quantity}`, {
        method: "PUT",
        auth: true,
      });
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (cartItemId) => {
      await api(`/api/cart/remove/${cartItemId}`, { method: "DELETE", auth: true });
      await refresh();
    },
    [refresh]
  );

  const clearLocal = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + (i.quantity || 0), 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      loading,
      error,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      clearLocal,
    }),
    [
      items,
      count,
      total,
      loading,
      error,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
      clearLocal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }

  return ctx;
}
