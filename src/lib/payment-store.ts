export type ItemType = "dokumen" | "paket" | "konsultasi";

export interface Transaction {
  id: string;
  type: ItemType;
  refId: string;
  title: string;
  subtitle: string;
  amount: number;
  discount: number;
  tax: number;
  total: number;
  method: string;
  buyerName: string;
  buyerEmail: string;
  status: "Berhasil";
  createdAt: string;
  note: string;
}

const KEY = "legaldoc.transaksi";
export const TAX_RATE = 0.11;
export const VOUCHERS: Record<string, number> = { LEGAL10: 0.1, MITRA20: 0.2 };

const read = (): Transaction[] => {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
};

const write = (list: Transaction[]) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* penyimpanan tidak tersedia */
  }
};

export const listTransactions = (): Transaction[] =>
  read().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export const getTransaction = (id: string): Transaction | null =>
  read().find((t) => t.id === id) ?? null;

const newId = () => `INV-${Date.now().toString().slice(-8)}`;

export const addTransaction = (input: Omit<Transaction, "id" | "createdAt" | "status">): Transaction => {
  const trx: Transaction = { ...input, id: newId(), createdAt: new Date().toISOString(), status: "Berhasil" };
  write([trx, ...read()]);
  return trx;
};

export const hasPaidDocument = (slug: string) =>
  read().some((t) => t.type === "dokumen" && t.refId === slug);

export const paidPlanId = (): string | null => {
  const plan = read().find((t) => t.type === "paket");
  return plan ? plan.refId : null;
};

export const hasUnlimitedAccess = () => {
  const plan = paidPlanId();
  return plan === "profesional" || plan === "korporat";
};

export const priceBreakdown = (amount: number, voucher: string) => {
  const rate = VOUCHERS[voucher.trim().toUpperCase()] ?? 0;
  const discount = Math.round(amount * rate);
  const base = amount - discount;
  const tax = Math.round(base * TAX_RATE);
  return { discount, tax, total: base + tax, rate };
};
