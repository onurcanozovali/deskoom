import "server-only";

export type BankTransferConfig = {
  configured: boolean;
  accountHolder: string;
  bank: string;
  iban: string;
};

export function getBankTransferConfig(): BankTransferConfig {
  const accountHolder = process.env.BANK_TRANSFER_ACCOUNT_HOLDER?.trim() ?? "";
  const bank = process.env.BANK_TRANSFER_BANK?.trim() ?? "";
  const iban = process.env.BANK_TRANSFER_IBAN?.trim() ?? "";
  return { configured: Boolean(accountHolder && bank && iban), accountHolder, bank, iban };
}
