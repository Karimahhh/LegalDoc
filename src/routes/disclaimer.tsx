import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/shared/ui-blocks";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer & Batasan Layanan — LegalDoc" },
      {
        name: "description",
        content:
          "Batasan penggunaan LegalDoc: dokumen yang dihasilkan bersifat simulasi demo dan bukan nasihat hukum yang mengikat.",
      },
      { property: "og:title", content: "Disclaimer — LegalDoc" },
      { property: "og:description", content: "Ketahui batasan layanan dan tanggung jawab pengguna LegalDoc." },
    ],
  }),
  component: Disclaimer,
});

const sections = [
  {
    title: "Sifat layanan",
    paragraphs: [
      "LegalDoc adalah platform penyusunan dokumen berbasis template. Template disusun mengikuti praktik umum hukum Indonesia, namun tidak dapat menggantikan penilaian profesional atas keadaan khusus setiap pengguna.",
      "Versi yang Anda gunakan saat ini adalah demo produk. Seluruh dokumen, pembayaran, sesi konsultasi, dan hasil unduhan bersifat simulasi.",
    ],
  },
  {
    title: "Bukan nasihat hukum",
    paragraphs: [
      "Informasi pada halaman edukasi, katalog dokumen, dan hasil generator tidak membentuk hubungan advokat dengan klien dan tidak dapat dijadikan dasar tunggal dalam mengambil keputusan hukum.",
      "Untuk perkara yang sedang berjalan atau bernilai material besar, mintalah pendapat langsung dari advokat yang berizin.",
    ],
  },
  {
    title: "Tanggung jawab pengguna",
    paragraphs: [
      "Pengguna bertanggung jawab atas kebenaran data yang dimasukkan, termasuk identitas para pihak, nilai transaksi, dan jangka waktu perjanjian.",
      "Pengguna wajib memeriksa kembali dokumen sebelum ditandatangani serta memastikan pemenuhan syarat formal seperti materai atau pengesahan notaris bila diperlukan.",
    ],
  },
  {
    title: "Kerahasiaan dan data",
    paragraphs: [
      "Data draf dokumen pada demo ini disimpan di peramban Anda sendiri dan tidak dikirimkan ke pihak ketiga.",
      "Riwayat percakapan konsultasi hanya ditampilkan sebagai contoh alur dan tidak memuat data klien nyata.",
    ],
  },
  {
    title: "Perubahan ketentuan",
    paragraphs: [
      "Ketentuan ini dapat diperbarui seiring perkembangan layanan. Tanggal pembaruan terakhir dicantumkan di bawah halaman ini.",
    ],
  },
];

function Disclaimer() {
  return (
    <div>
      <PageHero
        eyebrow="Ketentuan"
        title="Disclaimer layanan LegalDoc"
        description="Bacalah bagian ini sebelum menggunakan dokumen maupun materi edukasi yang tersedia di platform."
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Card className="border-gold/40 bg-gold/5">
          <CardContent className="flex gap-3 p-6">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-gold" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Hasil dokumen pada demo ini bersifat simulasi dan bukan nasihat hukum. Gunakan sebagai gambaran alur kerja,
              bukan sebagai dokumen final untuk transaksi nyata.
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 space-y-9">
          {sections.map((s, i) => (
            <article key={s.title}>
              <h2 className="text-xl">
                <span className="mr-2 font-display text-gold">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground">Pembaruan terakhir: 1 September 2026.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/faq">Pertanyaan umum</Link>
          </Button>
          <Button asChild>
            <Link to="/dokumen">Lihat katalog dokumen</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
