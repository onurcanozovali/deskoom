"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

type WishlistContextValue = {
  productIds: string[];
  itemCount: number;
  ready: boolean;
  hasProduct: (productId: string) => boolean;
  toggleProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
};

const STORAGE_KEY = "deskoom-wishlist-v1";
const WishlistContext = createContext<WishlistContextValue | null>(null);
const EMPTY_WISHLIST: string[] = [];
const wishlistListeners = new Set<() => void>();
let wishlistSnapshot: string[] = EMPTY_WISHLIST;
let wishlistInitialized = false;

function readStoredWishlist(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((item): item is string => typeof item === "string"))];
  } catch {
    return [];
  }
}

function emitWishlistChange() {
  wishlistListeners.forEach((listener) => listener());
}

function getWishlistSnapshot() {
  if (!wishlistInitialized && typeof window !== "undefined") {
    wishlistSnapshot = readStoredWishlist();
    wishlistInitialized = true;
  }
  return wishlistSnapshot;
}

function getServerWishlistSnapshot() {
  return EMPTY_WISHLIST;
}

function setWishlistSnapshot(productIds: string[]) {
  wishlistSnapshot = productIds;
  wishlistInitialized = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
  emitWishlistChange();
}

function subscribeToWishlist(listener: () => void) {
  wishlistListeners.add(listener);
  const syncWishlist = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    wishlistSnapshot = readStoredWishlist();
    wishlistInitialized = true;
    emitWishlistChange();
  };
  window.addEventListener("storage", syncWishlist);
  return () => {
    wishlistListeners.delete(listener);
    window.removeEventListener("storage", syncWishlist);
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

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const productIds = useSyncExternalStore(subscribeToWishlist, getWishlistSnapshot, getServerWishlistSnapshot);
  const ready = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerHydratedSnapshot);
  const hasProduct = useCallback((productId: string) => getWishlistSnapshot().includes(productId), []);
  const toggleProduct = useCallback((productId: string) => {
    const current = getWishlistSnapshot();
    setWishlistSnapshot(current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
  }, []);
  const removeProduct = useCallback((productId: string) => {
    setWishlistSnapshot(getWishlistSnapshot().filter((id) => id !== productId));
  }, []);
  const value = useMemo(() => ({ productIds, itemCount: productIds.length, ready, hasProduct, toggleProduct, removeProduct }), [productIds, ready, hasProduct, toggleProduct, removeProduct]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist, WishlistProvider içinde kullanılmalıdır.");
  return context;
}
