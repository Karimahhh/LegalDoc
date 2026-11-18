import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Download, FileText, Printer, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InlineLoader } from "@/components/shared/ui-blocks";
import { formatIDR } from "@/lib/data";
import { getTransaction, type Transaction } from "@/lib/payment-store";

export const Route = createFileRoute("/pembayaran/$id")({
  head: () => ({
    meta: [
      { title: "Bukti Pembayaran — LegalDoc" },
      {
        name: "description",
        content: "Rincian bukti pembayaran LegalDoc: nomor invoice, metode pembayaran, dan item yang dibeli.",
      },
      { property: "og:title", content: "Bukti Pembayaran — LegalDoc" },
      { property: "og:description", content: "Simpan bukti pembayaran dan lanjutkan ke dokumen atau sesi Anda." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BuktiPembayaran,
});

function BuktiPembayaran() {
  const { id } = Route.useParams();
  const [trx, setTrx] = useState<Transaction | null | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => setTrx(getTransaction(id)), 400);
    return () => clearTimeout(t);
  }, [id]);

  if (trx === undefined) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <InlineLoader label="Memverifikasi pembayaran" />
      </div>
    );
  }

  if (!trx) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <h1 className="text-xl">Bukti pembayaran tidak ditemukan</h1>
            <p className="text-sm text-muted-foreground">
              Nomor transaksi {id} tidak ada pada perangkat ini. Riwayat pembayaran tersimpan per browser pada versi demo.
            </p>
            <Button asChild className="mt-2">
              <Link to="/dashboard/pembayaran">Buka riwayat pembayaran</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-7" />
        </span>
        <h1 className="mt-4 text-2xl sm:text-3xl">Pembayaran berhasil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terima kasih, {trx.buyerName}. Bukti pembayaran telah dikirim ke {trx.buyerEmail}.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-gold" />
              <span className="font-medium">{trx.id}</span>
            </div>
            <Badge className="bg-success/15 text-success hover:bg-success/20">{trx.status}</Badge>
          </div>

          <Separator className="my-5" />

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Item</dt>
              <dd className="mt-1 text-sm font-medium">{trx.title}</dd>
              <dd className="mt-0.5 text-xs text-muted-foreground">{trx.subtitle}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Metode pembayaran</dt>
              <dd className="mt-1 text-sm">{trx.method}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Waktu pembayaran</dt>
              <dd className="mt-1 text-sm">
                {new Date(trx.createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
              </dd>
            </div>
            {trx.note && (
              <div>
                <dt className="text-xs text-muted-foreground">Catatan</dt>
                <dd className="mt-1 text-sm">{trx.note}</dd>
              </div>
            )}
          </dl>

          <Separator className="my-5" />

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatIDR(trx.amount)}</dd>
            </div>
            {trx.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Potongan voucher</dt>
                <dd>-{formatIDR(trx.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">PPN 11%</dt>
              <dd>{formatIDR(trx.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold">
              <dt>Total dibayar</dt>
              <dd>{formatIDR(trx.total)}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Simulasi unduhan invoice selesai", {
                  description: "Pada versi demo berkas PDF tidak benar-benar dibuat.",
                })
              }
            >
              <Download className="mr-2 size-4" /> Unduh invoice
            </Button>
            <Button variant="ghost" onClick={() => window.print()}>
              <Printer className="mr-2 size-4" /> Cetak
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        {trx.type === "dokumen" && (
          <Button asChild>
            <Link to="/dokumen/$slug/hasil" params={{ slug: trx.refId }}>
              <FileText className="mr-2 size-4" /> Buka & unduh dokumen
            </Link>
          </Button>
        )}
        {trx.type === "konsultasi" && (
          <Button asChild>
            <Link to="/konsultasi/$id" params={{ id: trx.refId }}>
              Lihat detail konsultan
            </Link>
          </Button>
        )}
        {trx.type === "paket" && (
          <Button asChild>
            <Link to="/dashboard">Buka dasbor</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link to="/dashboard/pembayaran">Riwayat pembayaran</Link>
        </Button>
      </div>
    </div>
  );
}
