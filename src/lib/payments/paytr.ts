import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { CardPaymentProvider, PaymentInitializationContext } from "./types";

const PAYTR_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";
const PAYTR_IFRAME_URL = "https://www.paytr.com/odeme/guvenli";

export class PaytrConfigurationError extends Error {}
export class PaytrInitializationError extends Error {}

function credentials() {
  return {
    merchantId: process.env.PAYTR_MERCHANT_ID?.trim() ?? "",
    merchantKey: process.env.PAYTR_MERCHANT_KEY?.trim() ?? "",
    merchantSalt: process.env.PAYTR_MERCHANT_SALT?.trim() ?? "",
  };
}

export function isPaytrConfigured() {
  const { merchantId, merchantKey, merchantSalt } = credentials();
  return Boolean(merchantId && merchantKey && merchantSalt);
}

function hmacBase64(value: string, key: string) {
  return createHmac("sha256", key).update(value, "utf8").digest("base64");
}

function resolveSiteOrigin(fallbackOrigin: string) {
  const configuredOrigin = process.env.APP_URL?.trim();
  if (process.env.NODE_ENV === "production" && !configuredOrigin) throw new PaytrConfigurationError("Üretim adresi yapılandırılmamış.");
  try {
    const url = new URL(configuredOrigin || fallbackOrigin);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("unsupported protocol");
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new PaytrConfigurationError("Üretim adresi HTTPS olmalıdır.");
    return url.origin;
  } catch (error) {
    if (error instanceof PaytrConfigurationError) throw error;
    throw new PaytrConfigurationError("Uygulama adresi geçersiz.");
  }
}

export function verifyPaytrCallback(input: { merchantOid: string; status: string; totalAmount: string; hash: string }) {
  const { merchantKey, merchantSalt } = credentials();
  if (!merchantKey || !merchantSalt) throw new PaytrConfigurationError("PAYTR yapılandırılmamış.");
  const expected = hmacBase64(`${input.merchantOid}${merchantSalt}${input.status}${input.totalAmount}`, merchantKey);
  const actualBuffer = Buffer.from(input.hash);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export const paytrProvider: CardPaymentProvider = {
  isConfigured: isPaytrConfigured,
  async initialize({ order, userIp, origin }: PaymentInitializationContext) {
    const { merchantId, merchantKey, merchantSalt } = credentials();
    if (!merchantId || !merchantKey || !merchantSalt) throw new PaytrConfigurationError("PAYTR ödeme altyapısı henüz yapılandırılmamış.");

    const paymentAmount = String(Math.round(order.total * 100));
    const userBasket = Buffer.from(JSON.stringify(order.items.map((item) => [item.title, item.unitPrice.toFixed(2), item.quantity])), "utf8").toString("base64");
    const testMode = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";
    const noInstallment = "0";
    const maxInstallment = "0";
    const currency = "TL";
    const hashString = `${merchantId}${userIp}${order.orderNumber}${order.contact.email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}`;
    const paytrToken = hmacBase64(`${hashString}${merchantSalt}`, merchantKey);
    const siteOrigin = resolveSiteOrigin(origin);
    const address = `${order.deliveryAddress.address}${order.deliveryAddress.apartment ? `, ${order.deliveryAddress.apartment}` : ""}, ${order.deliveryAddress.district}/${order.deliveryAddress.city}`;
    const form = new URLSearchParams({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: order.orderNumber,
      email: order.contact.email,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: process.env.NODE_ENV === "production" ? "0" : "1",
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: `${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName}`,
      user_address: address,
      user_phone: order.contact.phone,
      merchant_ok_url: `${siteOrigin}/siparis-onayi/${order.id}`,
      merchant_fail_url: `${siteOrigin}/siparis-onayi/${order.id}?odeme=basarisiz`,
      timeout_limit: "30",
      currency,
      test_mode: testMode,
      lang: "tr",
    });

    let response: Response;
    try {
      response = await fetch(PAYTR_TOKEN_URL, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: form,
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      });
    } catch {
      throw new PaytrInitializationError("PAYTR servisine şu anda ulaşılamıyor.");
    }
    if (!response.ok) throw new PaytrInitializationError("PAYTR servisi ödeme isteğini kabul etmedi.");
    const payload = await response.json() as { status?: string; token?: string; reason?: string };
    if (payload.status !== "success" || !payload.token) throw new PaytrInitializationError(payload.reason || "PAYTR ödeme oturumu başlatılamadı.");
    return { provider: "paytr", iframeToken: payload.token, iframeUrl: `${PAYTR_IFRAME_URL}/${encodeURIComponent(payload.token)}` };
  },
};
