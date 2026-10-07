export const FREE_SHIPPING_THRESHOLD = 1500;
export const STANDARD_SHIPPING_PRICE = 79;
export const CURRENCY = "TRY" as const;

export function calculateShipping(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_PRICE;
}
