import "server-only";

import { randomBytes, randomUUID } from "node:crypto";
import { calculateShipping, CURRENCY } from "@/lib/commerce/config";
import { allProducts, priceToNumber } from "@/data/products";
import { hashOrderAccessToken } from "./access";
import { createOrderIfAbsent } from "./repository";
import type { Address, CheckoutInput, InvoiceInformation, Order, OrderItemSnapshot, PaymentMethod } from "./types";

export class CheckoutValidationError extends Error {
  constructor(message: string, public readonly fields: Record<string, string> = {}) {
    super(message);
  }
}

function record(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new CheckoutValidationError("Gönderilen bilgiler geçersiz.");
  return value as Record<string, unknown>;
}

function text(source: Record<string, unknown>, key: string, label: string, options: { optional?: boolean; max?: number } = {}) {
  const value = typeof source[key] === "string" ? source[key].trim() : "";
  if (!value && !options.optional) throw new CheckoutValidationError(`${label} alanı zorunludur.`, { [key]: `${label} alanı zorunludur.` });
  if (value.length > (options.max ?? 200)) throw new CheckoutValidationError(`${label} çok uzun.`, { [key]: `${label} çok uzun.` });
  return value;
}

function validateEmail(value: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new CheckoutValidationError("Geçerli bir e-posta adresi girin.", { email: "Geçerli bir e-posta adresi girin." });
}

function validatePhone(value: string) {
  if (!/^[+\d][\d\s()-]{9,19}$/.test(value)) throw new CheckoutValidationError("Geçerli bir telefon numarası girin.", { phone: "Geçerli bir telefon numarası girin." });
}

function parseAddress(value: unknown): Omit<Address, "country"> {
  const source = record(value);
  const postalCode = text(source, "postalCode", "Posta kodu", { optional: true, max: 5 });
  if (postalCode && !/^\d{5}$/.test(postalCode)) throw new CheckoutValidationError("Posta kodu 5 haneli olmalıdır.", { postalCode: "Posta kodu 5 haneli olmalıdır." });
  return {
    firstName: text(source, "firstName", "Ad", { max: 60 }),
    lastName: text(source, "lastName", "Soyad", { max: 60 }),
    address: text(source, "address", "Adres", { max: 400 }),
    apartment: text(source, "apartment", "Apartman bilgisi", { optional: true, max: 120 }) || undefined,
    district: text(source, "district", "İlçe", { max: 80 }),
    city: text(source, "city", "Şehir", { max: 80 }),
    postalCode: postalCode || undefined,
    addressTitle: text(source, "addressTitle", "Adres başlığı", { optional: true, max: 80 }) || undefined,
  };
}

function parseInvoice(value: unknown): InvoiceInformation {
  const source = record(value);
  const type = source.type;
  if (type === "individual") {
    const identityNumber = text(source, "identityNumber", "T.C. kimlik numarası", { optional: true, max: 11 });
    if (identityNumber && !/^\d{11}$/.test(identityNumber)) throw new CheckoutValidationError("T.C. kimlik numarası 11 haneli olmalıdır.");
    return {
      type,
      firstName: text(source, "firstName", "Fatura adı", { max: 60 }),
      lastName: text(source, "lastName", "Fatura soyadı", { max: 60 }),
      identityNumber: identityNumber || undefined,
      address: text(source, "address", "Fatura adresi", { max: 400 }),
    };
  }
  if (type === "corporate") {
    const taxNumber = text(source, "taxNumber", "Vergi numarası", { max: 10 });
    if (!/^\d{10}$/.test(taxNumber)) throw new CheckoutValidationError("Vergi numarası 10 haneli olmalıdır.");
    return {
      type,
      companyName: text(source, "companyName", "Şirket adı", { max: 150 }),
      taxOffice: text(source, "taxOffice", "Vergi dairesi", { max: 100 }),
      taxNumber,
      address: text(source, "address", "Fatura adresi", { max: 400 }),
    };
  }
  throw new CheckoutValidationError("Fatura tipi geçersiz.");
}

export function parseCheckoutInput(value: unknown): CheckoutInput {
  const source = record(value);
  const contact = record(source.contact);
  const email = text(contact, "email", "E-posta", { max: 100 }).toLowerCase();
  const phone = text(contact, "phone", "Telefon", { max: 20 });
  validateEmail(email);
  validatePhone(phone);
  const paymentMethod = source.paymentMethod;
  if (paymentMethod !== "card" && paymentMethod !== "eft") throw new CheckoutValidationError("Ödeme yöntemi geçersiz.");
  if (source.legalAccepted !== true) throw new CheckoutValidationError("Sözleşmeleri onaylamanız gerekir.");
  if (!Array.isArray(source.items) || source.items.length === 0) throw new CheckoutValidationError("Sepetiniz boş.");
  const items = source.items.map((value) => {
    const item = record(value);
    const productId = text(item, "productId", "Ürün", { max: 100 });
    const quantity = typeof item.quantity === "number" ? item.quantity : Number.NaN;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new CheckoutValidationError("Ürün adedi geçersiz.");
    return { productId, quantity };
  });
  const idempotencyKey = text(source, "idempotencyKey", "İşlem anahtarı", { max: 100 });
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) throw new CheckoutValidationError("İşlem anahtarı geçersiz.");
  return {
    idempotencyKey,
    userEmail: typeof source.userEmail === "string" ? source.userEmail.trim().toLowerCase() : undefined,
    contact: { email, phone },
    deliveryAddress: parseAddress(source.deliveryAddress),
    invoiceSameAsDelivery: source.invoiceSameAsDelivery === true,
    invoice: parseInvoice(source.invoice),
    items,
    paymentMethod: paymentMethod as PaymentMethod,
    legalAccepted: true,
  };
}

function createItemSnapshots(items: CheckoutInput["items"]): OrderItemSnapshot[] {
  const seen = new Set<string>();
  return items.map((item) => {
    if (seen.has(item.productId)) throw new CheckoutValidationError("Aynı ürün birden fazla satırda gönderilemez.");
    seen.add(item.productId);
    const product = allProducts.find((candidate) => candidate.id === item.productId);
    if (!product) throw new CheckoutValidationError("Sepetinizde artık bulunmayan bir ürün var.");
    const unitPrice = priceToNumber(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) throw new CheckoutValidationError("Ürün fiyatı doğrulanamadı.");
    return {
      productId: product.id,
      title: product.name,
      variant: product.variant ?? "Standart",
      image: product.image,
      crop: product.crop,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity,
    };
  });
}

function createOrderNumber() {
  const date = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  return `DSK${date}${randomBytes(5).toString("hex").toUpperCase()}`;
}

export async function createValidatedOrder(input: CheckoutInput) {
  const items = createItemSnapshots(input.items);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = calculateShipping(subtotal);
  const now = new Date().toISOString();
  const accessToken = input.idempotencyKey;
  const accessTokenHash = hashOrderAccessToken(accessToken);
  const order: Order = {
    id: randomUUID(),
    orderNumber: createOrderNumber(),
    idempotencyKeyHash: accessTokenHash,
    accessTokenHash,
    userEmail: input.userEmail,
    contact: input.contact,
    deliveryAddress: { ...input.deliveryAddress, country: "Türkiye" },
    invoiceSameAsDelivery: input.invoiceSameAsDelivery,
    invoice: input.invoice,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: CURRENCY,
    shippingMethod: "standard",
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === "eft" ? "awaiting_payment" : "pending",
    orderStatus: input.paymentMethod === "eft" ? "confirmed" : "pending",
    paymentProvider: input.paymentMethod === "eft" ? "bank_transfer" : "paytr",
    createdAt: now,
    updatedAt: now,
  };
  const result = await createOrderIfAbsent(order);
  return { ...result, accessToken };
}
