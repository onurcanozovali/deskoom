import { findOrderByNumber, updateOrder } from "@/lib/orders/repository";
import { PaytrConfigurationError, verifyPaytrCallback } from "@/lib/payments/paytr";

export const runtime = "nodejs";

function required(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" && value ? value : null;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const merchantOid = required(form, "merchant_oid");
  const status = required(form, "status");
  const totalAmount = required(form, "total_amount");
  const hash = required(form, "hash");
  if (!merchantOid || !status || !totalAmount || !hash || (status !== "success" && status !== "failed") || !/^\d+$/.test(totalAmount)) {
    return new Response("PAYTR notification failed: invalid payload", { status: 400 });
  }

  try {
    if (!verifyPaytrCallback({ merchantOid, status, totalAmount, hash })) return new Response("PAYTR notification failed: bad hash", { status: 400 });
  } catch (error) {
    if (error instanceof PaytrConfigurationError) return new Response("PAYTR not configured", { status: 503 });
    return new Response("PAYTR notification failed", { status: 400 });
  }

  const order = await findOrderByNumber(merchantOid);
  if (!order) return new Response("Order not found", { status: 404 });
  if (["paid", "failed", "cancelled", "refunded"].includes(order.paymentStatus)) return new Response("OK", { status: 200 });

  const expectedAmount = Math.round(order.total * 100);
  if (status === "success" && Number(totalAmount) < expectedAmount) return new Response("PAYTR notification failed: amount mismatch", { status: 400 });

  const now = new Date().toISOString();
  await updateOrder(order.id, (current) => ({
    ...current,
    paymentStatus: status === "success" ? "paid" : "failed",
    orderStatus: status === "success" ? "confirmed" : "cancelled",
    paymentProviderReference: merchantOid,
    paymentFailureReason: status === "failed" ? String(form.get("failed_reason_msg") ?? "Ödeme onaylanmadı.").slice(0, 300) : undefined,
    callbackProcessedAt: now,
    updatedAt: now,
  }));
  return new Response("OK", { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } });
}
