"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

export function OrderConfirmationCartEffect({ clear }: { clear: boolean }) {
  const { clearCart } = useCart();
  useEffect(() => {
    if (clear) clearCart();
  }, [clear, clearCart]);
  return null;
}
