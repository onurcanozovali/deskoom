import type { Order } from "@/lib/orders/types";

export type PaymentInitializationContext = {
  order: Order;
  userIp: string;
  origin: string;
};

export type PaymentInitializationResult = {
  provider: "paytr";
  iframeToken: string;
  iframeUrl: string;
};

export interface CardPaymentProvider {
  isConfigured(): boolean;
  initialize(context: PaymentInitializationContext): Promise<PaymentInitializationResult>;
}
