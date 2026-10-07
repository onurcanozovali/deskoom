export type PaymentMethod = "card" | "eft";
export type PaymentStatus = "pending" | "awaiting_payment" | "paid" | "failed" | "cancelled" | "refunded";
export type OrderStatus = "pending" | "confirmed" | "cancelled";
export type InvoiceType = "individual" | "corporate";

export type Address = {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  district: string;
  city: string;
  postalCode?: string;
  addressTitle?: string;
  country: "Türkiye";
};

export type IndividualInvoice = {
  type: "individual";
  firstName: string;
  lastName: string;
  identityNumber?: string;
  address: string;
};

export type CorporateInvoice = {
  type: "corporate";
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  address: string;
};

export type InvoiceInformation = IndividualInvoice | CorporateInvoice;

export type OrderItemSnapshot = {
  productId: string;
  title: string;
  variant: string;
  image: string;
  crop: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  idempotencyKeyHash: string;
  accessTokenHash: string;
  userEmail?: string;
  contact: { email: string; phone: string };
  deliveryAddress: Address;
  invoiceSameAsDelivery: boolean;
  invoice: InvoiceInformation;
  items: OrderItemSnapshot[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: "TRY";
  shippingMethod: "standard";
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProvider: "paytr" | "bank_transfer";
  paymentProviderReference?: string;
  paymentFailureReason?: string;
  callbackProcessedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutInput = {
  idempotencyKey: string;
  userEmail?: string;
  contact: { email: string; phone: string };
  deliveryAddress: Omit<Address, "country">;
  invoiceSameAsDelivery: boolean;
  invoice: InvoiceInformation;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: PaymentMethod;
  legalAccepted: boolean;
};
