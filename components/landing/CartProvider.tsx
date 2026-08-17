"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartContextValue = {
  items: string[];
  count: number;
  hasItems: boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setMany: (ids: string[]) => void;
  isSelected: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "smd:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hidrata do localStorage no mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((x) => typeof x === "string"));
      }
    } catch {
      // ignora
    }
    setHydrated(true);
  }, []);

  // Sincroniza no localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignora
    }
  }, [items, hydrated]);

  const toggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const add = useCallback((id: string) => {
    setItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const setMany = useCallback((ids: string[]) => setItems(ids), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      hasItems: items.length > 0,
      toggle,
      add,
      remove,
      clear,
      setMany,
      isSelected: (id) => items.includes(id),
    }),
    [items, toggle, add, remove, clear, setMany]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
