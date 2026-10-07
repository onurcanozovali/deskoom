"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  ready: boolean;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "deskoom-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);
const EMPTY_CART: CartItem[] = [];
const cartListeners = new Set<() => void>();
let cartSnapshot: CartItem[] = EMPTY_CART;
let cartInitialized = false;

function readStoredCart(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem => {
      if (typeof item !== "object" || item === null) return false;
      const candidate = item as Partial<CartItem>;
      return typeof candidate.productId === "string" && Number.isInteger(candidate.quantity) && Number(candidate.quantity) > 0;
    }).map((item) => ({ ...item, quantity: Math.min(item.quantity, 99) }));
  } catch {
    return [];
  }
}

function emitCartChange() {
  cartListeners.forEach((listener) => listener());
}

function getCartSnapshot() {
  if (!cartInitialized && typeof window !== "undefined") {
    cartSnapshot = readStoredCart();
    cartInitialized = true;
  }
  return cartSnapshot;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

function setCartSnapshot(items: CartItem[]) {
  cartSnapshot = items;
  cartInitialized = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  emitCartChange();
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  const syncCart = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cartSnapshot = readStoredCart();
    cartInitialized = true;
    emitCartChange();
  };
  window.addEventListener("storage", syncCart);
  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", syncCart);
  };
}

function subscribeToHydration() {
  return () => undefined;
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydratedSnapshot() {
  return false;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const ready = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerHydratedSnapshot);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const safeQuantity = Math.max(1, Math.min(99, Math.floor(quantity)));
    const current = getCartSnapshot();
    const existing = current.find((item) => item.productId === productId);
    const next = existing
      ? current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, item.quantity + safeQuantity) } : item)
      : [...current, { productId, quantity: safeQuantity }];
    setCartSnapshot(next);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const current = getCartSnapshot();
    if (quantity <= 0) {
      setCartSnapshot(current.filter((item) => item.productId !== productId));
      return;
    }
    setCartSnapshot(current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, Math.floor(quantity)) } : item));
  }, []);

  const removeItem = useCallback((productId: string) => setCartSnapshot(getCartSnapshot().filter((item) => item.productId !== productId)), []);
  const clearCart = useCallback(() => setCartSnapshot([]), []);
  const itemCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const value = useMemo(() => ({ items, itemCount, ready, addItem, updateQuantity, removeItem, clearCart }), [items, itemCount, ready, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart, CartProvider içinde kullanılmalıdır.");
  return context;
}
