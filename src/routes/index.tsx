import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  FileText,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { A4Preview } from "@/components/shared/a4-preview";
import { PageHero, RatingStars, SectionHeading, StatBlock } from "@/components/shared/ui-blocks";
import { articles, consultants, documents, formatIDR, formatTanggal, plans, stats } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LegalDoc — Susun Dokumen Hukum dalam 10 Menit" },
      {
        name: "description",
        content:
          "Buat perjanjian, kontrak kerja, dan surat kuasa lewat panduan bertahap, lalu konsultasikan hasilnya dengan konsultan hukum terverifikasi.",
      },
      { property: "og:title", content: "LegalDoc — Susun Dokumen Hukum dalam 10 Menit" },
      {
        property: "og:description",
        content: "Dokumen hukum siap pakai, pratinjau A4 langsung, dan konsultasi dengan konsultan hukum berpengalaman.",
      },
    ],
  }),
  component: Beranda,
});

const alurLangkah = [
  {
    icon: FileText,
    title: "Pilih template dokumen",
    text: "Telusuri katalog berdasarkan kategori kebutuhan, dari perjanjian bisnis hingga urusan keluarga.",
  },
  {
    icon: Sparkles,
    title: "Isi panduan bertahap",
    text: "Jawab pertanyaan sederhana. Isi dokumen tersusun otomatis dan tampil pada pratinjau A4 secara langsung.",
  },
  {
    icon: BadgeCheck,
    title: "Tinjau dan unduh",
    text: "Periksa kelengkapan klausul, minta pendapat konsultan bila perlu, lalu unduh dalam format PDF atau DOCX.",
  },
];

function Beranda() {
  const unggulan = documents.slice(0, 6);
  const contohDokumen = documents[0]!;

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-hero-grid opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Badge className="border-gold/40 bg-gold/15 text-gold hover:bg-gold/20">
              Dipakai 128.400+ dokumen sejak 2023
            </Badge>
            <h1 className="mt-5 text-balance-title text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Dokumen hukum yang rapi, tanpa menunggu berhari-hari
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/75">
              LegalDoc memandu Anda menyusun perjanjian, kontrak kerja, dan surat kuasa langkah demi langkah. Pratinjau
              A4 tampil sejak isian pertama, sehingga Anda tahu persis dokumen yang akan diterima.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/dokumen">
                  Mulai susun dokumen <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/konsultasi">Jadwalkan konsultasi</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-gold" /> Klausul mengikuti hukum Indonesia
              </span>
              <span className="flex items-center gap-2">
                <CalendarClock className="size-4 text-gold" /> Rata-rata selesai 9 menit
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rotate-1 transition-transform duration-500 hover:rotate-0">
              <A4Preview
                title={contohDokumen.previewTitle}
                paragraphs={contohDokumen.previewBody({
                  pihak1: "PT Nusantara Karya Mandiri",
                  alamat1: "Jl. Rasuna Said Kav. 12, Jakarta Selatan",
                  pihak2: "CV Bina Teknologi Andalan",
                  alamat2: "Jl. Diponegoro No. 45, Bandung",
                  lingkup: "pengembangan dan pemasaran produk perangkat lunak logistik",
                  kontribusi1: "modal kerja dan jaringan distribusi",
                  kontribusi2: "tim pengembang dan lisensi teknologi",
                  pembagian: "60 : 40",
                  jangkaWaktu: "24",
                  kota: "Jakarta",
                  tanggal: "2026-09-01",
                  domisiliHukum: "Pengadilan Negeri Jakarta Selatan",
                })}
                signatures={["PT Nusantara Karya Mandiri", "CV Bina Teknologi Andalan"]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {stats.map((s) => (
            <StatBlock key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Cara kerja"
          title="Tiga langkah dari kebutuhan menjadi dokumen"
          description="Alur yang sama dipakai pelaku usaha, tim HR, hingga individu yang mengurus keperluan pribadi."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {alurLangkah.map((step, i) => (
            <Card key={step.title} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-display text-2xl text-muted-foreground/40">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Katalog"
              title="Dokumen yang paling sering dibuat"
              description="Setiap template disusun konsultan hukum dan diperbarui mengikuti perkembangan peraturan."
            />
            <Button asChild variant="outline">
              <Link to="/dokumen">Lihat semua dokumen</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {unggulan.map((doc) => (
              <Card
                key={doc.slug}
                className="group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  <Badge variant="secondary" className="w-fit">
                    {doc.category}
                  </Badge>
                  <h3 className="mt-4 text-lg leading-snug">{doc.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{doc.shortDesc}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-display text-base">{formatIDR(doc.price)}</span>
                    <Button asChild size="sm" variant="ghost" className="text-gold hover:text-gold">
                      <Link to="/dokumen/$slug" params={{ slug: doc.slug }}>
                        Detail <ArrowRight className="ml-1 size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Konsultasi"
            title="Bicara langsung dengan konsultan hukum"
            description="Pilih sesi chat, panggilan video, atau tatap muka sesuai kenyamanan Anda."
          />
          <Button asChild variant="outline">
            <Link to="/konsultasi">Semua konsultan</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {consultants.slice(0, 3).map((c) => (
            <Card key={c.id} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">
                    {c.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.title}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <RatingStars value={c.rating} />
                  {c.rating.toFixed(1).replace(".", ",")} · {c.reviewCount} ulasan
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{c.bio}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-medium">{formatIDR(c.pricePerSession)}/sesi</span>
                  <Button asChild size="sm">
                    <Link to="/konsultasi/$id" params={{ id: c.id }}>
                      Lihat profil
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading
              eyebrow="Paket"
              title="Harga yang bisa Anda hitung sejak awal"
              description="Mulai gratis untuk kebutuhan sesekali, tingkatkan ke Profesional saat dokumen menjadi rutinitas."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={
                    plan.highlight
                      ? "border-gold bg-card shadow-[var(--shadow-card)]"
                      : "transition-shadow hover:shadow-[var(--shadow-card)]"
                  }
                >
                  <CardContent className="p-5">
                    {plan.highlight && (
                      <Badge className="mb-3 bg-gold text-gold-foreground hover:bg-gold">Paling dipilih</Badge>
                    )}
                    <p className="text-sm font-semibold">{plan.name}</p>
                    <p className="mt-2 font-display text-xl">
                      {plan.price === 0 ? "Gratis" : formatIDR(plan.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">per {plan.period}</p>
                    <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                      {plan.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-success" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant={plan.highlight ? "default" : "outline"} size="sm" className="mt-5 w-full">
                      <Link to="/harga">Bandingkan paket</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Edukasi"
            title="Pahami dasarnya sebelum menandatangani"
            description="Artikel ringkas dari konsultan kami untuk keputusan hukum sehari-hari."
          />
          <Button asChild variant="outline">
            <Link to="/edukasi">Pusat edukasi</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Card key={a.slug} className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{a.category}</Badge>
                  <span>{a.readTime} baca</span>
                </div>
                <h3 className="mt-4 text-lg leading-snug transition-colors group-hover:text-gold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <span>{formatTanggal(a.date)}</span>
                  <Link
                    to="/edukasi/$slug"
                    params={{ slug: a.slug }}
                    className="inline-flex items-center gap-1 font-medium text-gold"
                  >
                    Baca <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <MessagesSquare className="size-8 text-gold" />
          <h2 className="max-w-2xl text-3xl">Siap menyusun dokumen pertama Anda?</h2>
          <p className="max-w-xl text-sm text-primary-foreground/75">
            Buat akun gratis, selesaikan satu dokumen hari ini, dan simpan hasilnya di dasbor untuk disunting kapan pun.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/daftar">Daftar gratis</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/dokumen">Telusuri katalog</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
