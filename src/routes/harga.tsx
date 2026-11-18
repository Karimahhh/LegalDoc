import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero, SectionHeading } from "@/components/shared/ui-blocks";
import { formatIDR, plans } from "@/lib/data";

export const Route = createFileRoute("/harga")({
  head: () => ({
    meta: [
      { title: "Paket Harga Layanan Dokumen Hukum — LegalDoc" },
      {
        name: "description",
        content:
          "Bandingkan paket Dasar, Profesional, dan Korporat LegalDoc: dokumen tanpa batas, unduhan PDF dan DOCX, serta sesi konsultasi hukum.",
      },
      { property: "og:title", content: "Paket Harga — LegalDoc" },
      {
        property: "og:description",
        content: "Pilih paket LegalDoc sesuai kebutuhan dokumen dan konsultasi hukum Anda.",
      },
    ],
  }),
  component: Harga,
});

const comparison = [
  { label: "Jumlah dokumen aktif", dasar: "1 per bulan", profesional: "Tanpa batas", korporat: "Tanpa batas" },
  { label: "Unduhan tanpa tanda air", dasar: false, profesional: true, korporat: true },
  { label: "Riwayat revisi", dasar: "7 hari", profesional: "12 bulan", korporat: "Tanpa batas" },
  { label: "Sesi konsultasi", dasar: "Bayar per sesi", profesional: "1 sesi / bulan", korporat: "4 sesi / bulan" },
  { label: "Template khusus", dasar: false, profesional: false, korporat: true },
  { label: "Akun pengguna", dasar: "1", profesional: "3", korporat: "15" },
  { label: "Manajer akun khusus", dasar: false, profesional: false, korporat: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto size-4 text-gold" />
    ) : (
      <Minus className="mx-auto size-4 text-muted-foreground/60" />
    );
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
}

function Harga() {
  return (
    <div>
      <PageHero
        eyebrow="Harga"
        title="Paket yang tumbuh bersama kebutuhan hukum Anda"
        description="Mulai gratis untuk kebutuhan sesekali, naik ke Profesional saat dokumen menjadi rutinitas, dan pilih Korporat ketika seluruh tim perlu terlibat."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.highlight ? "border-gold/60 shadow-elegant" : undefined}
            >
              <CardContent className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl">{plan.name}</h2>
                  {plan.highlight && <Badge className="bg-gold text-gold-foreground">Paling dipilih</Badge>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>
                <p className="mt-6 font-display text-3xl">
                  {plan.price === 0 ? "Gratis" : formatIDR(plan.price)}
                  <span className="ml-1 font-sans text-sm text-muted-foreground">/ {plan.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold" /> {f}
                    </li>
                  ))}
                </ul>
                {plan.price === 0 ? (
                  <Button asChild className="mt-7 w-full" variant="outline">
                    <Link to="/daftar">{plan.cta}</Link>
                  </Button>
                ) : (
                  <Button asChild className="mt-7 w-full" variant={plan.highlight ? "default" : "outline"}>
                    <Link to="/checkout" search={{ tipe: "paket" as const, ref: plan.id }}>
                      Berlangganan sekarang
                    </Link>
                  </Button>
                )}

              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <SectionHeading
            eyebrow="Perbandingan"
            title="Rincian setiap paket"
            description="Semua paket mencakup akses penuh ke katalog template dan pratinjau A4 sebelum dokumen diunduh."
          />
          <div className="mt-6 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold">Fitur</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Dasar</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Profesional</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Korporat</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-t border-border transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 text-sm">{row.label}</td>
                    <td className="px-4 py-3 text-center">
                      <Cell value={row.dasar} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Cell value={row.profesional} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Cell value={row.korporat} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Harga dalam Rupiah dan belum termasuk PPN. Pada versi demo ini seluruh transaksi disimulasikan.
          </p>
        </div>

        <Card className="mt-14 border-gold/40">
          <CardContent className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h2 className="text-xl">Masih ragu memilih paket?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Lihat pertanyaan umum tentang pembayaran, atau bicarakan langsung dengan konsultan kami.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/faq">Baca FAQ</Link>
              </Button>
              <Button asChild>
                <Link to="/konsultasi">Cari konsultan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
