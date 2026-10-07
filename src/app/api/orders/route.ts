import { NextResponse, type NextRequest } from "next/server";
import { orderAccessCookieName } from "@/lib/orders/access";
import { OrderStorageConfigurationError } from "@/lib/orders/repository";
import { CheckoutValidationError, createValidatedOrder, parseCheckoutInput } from "@/lib/orders/service";
import { PaytrConfigurationError, PaytrInitializationError, paytrProvider } from "@/lib/payments/paytr";

export const runtime = "nodejs";

function requestIp(request: NextRequest) {
  const forwardedIp = request.headers.get("cf-connecting-ip")?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim();
  if (!forwardedIp && process.env.NODE_ENV === "production") throw new PaytrInitializationError("Müşteri IP adresi belirlenemedi.");
  return forwardedIp || "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const input = parseCheckoutInput(await request.json());
    const { order, accessToken } = await createValidatedOrder(input);
    const responsePayload: Record<string, unknown> = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    };

    if (order.paymentMethod === "card") {
      responsePayload.payment = await paytrProvider.initialize({ order, userIp: requestIp(request), origin: request.nextUrl.origin });
    }

    const response = NextResponse.json(responsePayload, { status: order.paymentMethod === "eft" ? 201 : 200 });
    response.cookies.set(orderAccessCookieName(order.id), accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/order-confirmation/${order.id}`,
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    if (error instanceof CheckoutValidationError) return NextResponse.json({ error: error.message, fields: error.fields }, { status: 400 });
    if (error instanceof PaytrConfigurationError) return NextResponse.json({ error: error.message, code: "PAYTR_NOT_CONFIGURED" }, { status: 503 });
    if (error instanceof PaytrInitializationError) return NextResponse.json({ error: error.message, code: "PAYTR_INITIALIZATION_FAILED" }, { status: 502 });
    if (error instanceof OrderStorageConfigurationError) return NextResponse.json({ error: error.message, code: "ORDER_STORAGE_NOT_CONFIGURED" }, { status: 503 });
    return NextResponse.json({ error: "Sipariş şu anda oluşturulamadı." }, { status: 500 });
  }
}
