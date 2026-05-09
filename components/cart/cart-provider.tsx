"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CART_STORAGE_KEY, getCartTotals, type CartItem } from "@/src/lib/cart";

type CartContextValue = {
  items: CartItem[];
  isReady: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totals: ReturnType<typeof getCartTotals>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsed = JSON.parse(storedCart) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((currentItems) => [item, ...currentItems]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => getCartTotals(items), [items]);
  const value = useMemo(
    () => ({ items, isReady, addItem, removeItem, clearCart, totals }),
    [addItem, clearCart, isReady, items, removeItem, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
