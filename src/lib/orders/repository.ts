import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { hashOrderAccessToken } from "./access";
import type { Order } from "./types";

type OrderDatabase = { orders: Order[] };
let writeQueue = Promise.resolve();

export class OrderStorageConfigurationError extends Error {}

function getStorePath() {
  const configured = process.env.ORDER_STORE_PATH?.trim();
  if (process.env.NODE_ENV === "production" && !configured) {
    throw new OrderStorageConfigurationError("Üretimde kalıcı sipariş deposu yapılandırılmamış.");
  }
  return configured ? path.resolve(configured) : path.join(process.cwd(), ".data", "orders.json");
}

async function readDatabase(): Promise<OrderDatabase> {
  const storePath = getStorePath();
  try {
    const content = await readFile(storePath, "utf8");
    const parsed = JSON.parse(content) as Partial<OrderDatabase>;
    return { orders: Array.isArray(parsed.orders) ? parsed.orders : [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { orders: [] };
    throw error;
  }
}

async function writeDatabase(database: OrderDatabase) {
  const storePath = getStorePath();
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(database, null, 2), "utf8");
}

function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function findOrderById(id: string) {
  return (await readDatabase()).orders.find((order) => order.id === id) ?? null;
}

export async function findOrderByNumber(orderNumber: string) {
  return (await readDatabase()).orders.find((order) => order.orderNumber === orderNumber) ?? null;
}

export async function findOrderByIdempotencyKey(idempotencyKey: string) {
  const idempotencyKeyHash = hashOrderAccessToken(idempotencyKey);
  return (await readDatabase()).orders.find((order) => order.idempotencyKeyHash === idempotencyKeyHash) ?? null;
}

export async function saveOrder(order: Order) {
  return withWriteLock(async () => {
    const database = await readDatabase();
    const existingIndex = database.orders.findIndex((item) => item.id === order.id);
    if (existingIndex >= 0) database.orders[existingIndex] = order;
    else database.orders.push(order);
    await writeDatabase(database);
    return order;
  });
}

export async function createOrderIfAbsent(order: Order) {
  return withWriteLock(async () => {
    const database = await readDatabase();
    const existing = database.orders.find((item) => item.idempotencyKeyHash === order.idempotencyKeyHash);
    if (existing) return { order: existing, created: false };
    database.orders.push(order);
    await writeDatabase(database);
    return { order, created: true };
  });
}

export async function updateOrder(id: string, update: (order: Order) => Order) {
  return withWriteLock(async () => {
    const database = await readDatabase();
    const index = database.orders.findIndex((order) => order.id === id);
    if (index < 0) return null;
    const updated = update(database.orders[index]);
    database.orders[index] = updated;
    await writeDatabase(database);
    return updated;
  });
}
