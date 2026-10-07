import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export function hashOrderAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyOrderAccessToken(token: string, expectedHash: string) {
  const actual = Buffer.from(hashOrderAccessToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function orderAccessCookieName(orderId: string) {
  return `deskoom-order-${orderId.replace(/[^a-zA-Z0-9-]/g, "")}`;
}
