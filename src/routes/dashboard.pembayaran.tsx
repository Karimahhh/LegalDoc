import { createFileRoute, Link } from "@tanstack/react-router";
import { Receipt, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/ui-blocks";
import { formatIDR } from "@/lib/data";
import { listTransactions, type Transaction } from "@/lib/payment-store";

export const Route = createFileRoute("/dashboard/pembayaran")({
  head: () => ({
    meta: [
      { title: "Riwayat Pembayaran — Dasbor LegalDoc" },
      {
        name: "description",
        content:
          "Lihat riwayat pembayaran LegalDoc Anda: pembelian dokumen, paket langganan, dan sesi konsultasi beserta buktinya.",
      },
      { property: "og:title", content: "Riwayat Pembayaran — LegalDoc" },
      { property: "og:description", content: "Semua transaksi Anda tercatat lengkap dengan bukti pembayaran." },
    ],
  }),
  component: RiwayatPembayaran,
});

const typeLabel: Record<Transaction["type"], string> = {
  dokumen: "Dokumen",
  paket: "Paket langganan",
  konsultasi: "Konsultasi",
};

function RiwayatPembayaran() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setItems(listTransactions());
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (t) => t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.method.toLowerCase().includes(q),
    );
  }, [items, query]);

  const total = items.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Riwayat pembayaran</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} transaksi · total {formatIDR(total)}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Cari nomor invoice atau item"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Belum ada pembayaran"
          description="Transaksi Anda akan muncul di sini setelah menyelesaikan pembelian dokumen, paket, atau sesi konsultasi."
        />
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <Card key={t.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Receipt className="size-4 text-gold" />
                    <span className="text-sm font-medium">{t.id}</span>
                    <Badge variant="secondary">{typeLabel[t.type]}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })} ·{" "}
                    {t.method}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">{formatIDR(t.total)}</span>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/pembayaran/$id" params={{ id: t.id }}>
                      Lihat bukti
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
