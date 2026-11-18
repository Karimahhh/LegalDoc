import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHero, RatingStars } from "@/components/shared/ui-blocks";
import { consultants, formatIDR } from "@/lib/data";

export const Route = createFileRoute("/konsultasi/")({
  head: () => ({
    meta: [
      { title: "Konsultasi Hukum dengan Konsultan Terverifikasi — LegalDoc" },
      {
        name: "description",
        content: "Pilih konsultan hukum sesuai bidang keahlian, lalu jadwalkan sesi chat, panggilan video, atau tatap muka.",
      },
      { property: "og:title", content: "Konsultasi Hukum — LegalDoc" },
      { property: "og:description", content: "Konsultan hukum bisnis, ketenagakerjaan, properti, dan keluarga siap membantu." },
    ],
  }),
  component: DaftarKonsultan,
});

function DaftarKonsultan() {
  const [query, setQuery] = useState("");

  const hasil = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return consultants;
    return consultants.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.specialities.some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="Konsultasi"
        title="Bicara dengan konsultan hukum yang menguasai bidangnya"
        description="Enam konsultan aktif dengan pengalaman rata-rata sepuluh tahun. Pilih metode sesi sesuai kebutuhan Anda."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau bidang keahlian"
            className="pl-9"
            aria-label="Cari konsultan"
          />
        </div>

        {hasil.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Konsultan tidak ditemukan"
              description="Kata kunci Anda belum cocok dengan konsultan mana pun. Coba istilah bidang hukum yang lebih umum."
              actionLabel="Tampilkan semua konsultan"
              onAction={() => setQuery("")}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hasil.map((c) => (
              <Card key={c.id} className="flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">
                      {c.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.title}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <RatingStars value={c.rating} /> {c.rating.toFixed(1).replace(".", ",")} · {c.reviewCount} ulasan
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.specialities.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[11px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" /> {c.city} · {c.experience} tahun pengalaman
                    {c.online ? (
                      <span className="ml-1 flex items-center gap-1 text-success">• tersedia hari ini</span>
                    ) : (
                      <span className="ml-1">• jadwal terbatas</span>
                    )}
                  </p>
                  <div className="mt-5 flex flex-1 items-end justify-between border-t border-border pt-4">
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
        )}
      </div>
    </>
  );
}
