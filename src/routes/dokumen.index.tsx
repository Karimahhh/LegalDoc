import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, FileText, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, PageHero } from "@/components/shared/ui-blocks";
import { docCategories, documents, formatIDR } from "@/lib/data";

export const Route = createFileRoute("/dokumen/")({
  head: () => ({
    meta: [
      { title: "Katalog Dokumen Hukum — LegalDoc" },
      {
        name: "description",
        content:
          "Telusuri template perjanjian bisnis, kontrak kerja, dokumen properti, surat kuasa, dan dokumen keluarga siap pakai.",
      },
      { property: "og:title", content: "Katalog Dokumen Hukum — LegalDoc" },
      {
        property: "og:description",
        content: "Delapan template dokumen hukum yang disusun konsultan dan dapat diselesaikan dalam hitungan menit.",
      },
    ],
  }),
  component: KatalogDokumen,
});

function KatalogDokumen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("semua");
  const [sort, setSort] = useState("populer");

  const hasil = useMemo(() => {
    const filtered = documents.filter((doc) => {
      const cocokKategori = category === "semua" || doc.category === category;
      const q = query.trim().toLowerCase();
      const cocokQuery =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.shortDesc.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));
      return cocokKategori && cocokQuery;
    });
    const sorted = [...filtered];
    if (sort === "populer") sorted.sort((a, b) => b.popularity - a.popularity);
    if (sort === "termurah") sorted.sort((a, b) => a.price - b.price);
    if (sort === "termahal") sorted.sort((a, b) => b.price - a.price);
    if (sort === "nama") sorted.sort((a, b) => a.title.localeCompare(b.title, "id"));
    return sorted;
  }, [query, category, sort]);

  return (
    <>
      <PageHero
        eyebrow="Katalog"
        title="Template dokumen hukum untuk kebutuhan usaha dan pribadi"
        description="Setiap dokumen dilengkapi panduan pengisian bertahap, pratinjau A4, dan daftar klausul yang disertakan."
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Card>
          <CardContent className="grid gap-3 p-4 sm:grid-cols-[1.6fr_1fr_1fr]">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari dokumen, misalnya sewa atau kerahasiaan"
                className="pl-9"
                aria-label="Cari dokumen"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger aria-label="Filter kategori">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua kategori</SelectItem>
                {docCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger aria-label="Urutkan">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="populer">Paling populer</SelectItem>
                <SelectItem value="termurah">Harga terendah</SelectItem>
                <SelectItem value="termahal">Harga tertinggi</SelectItem>
                <SelectItem value="nama">Nama A–Z</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <p className="mt-6 text-sm text-muted-foreground">
          Menampilkan {hasil.length} dari {documents.length} dokumen
          {category !== "semua" ? ` pada kategori ${category}` : ""}.
        </p>

        {hasil.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Dokumen tidak ditemukan"
              description="Coba gunakan kata kunci lain atau atur ulang filter kategori untuk melihat seluruh katalog."
              actionLabel="Tampilkan semua dokumen"
              onAction={() => {
                setQuery("");
                setCategory("semua");
              }}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hasil.map((doc) => (
              <Card
                key={doc.slug}
                className="group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
              >
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant="secondary">{doc.category}</Badge>
                    <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <FileText className="size-4" />
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg leading-snug">{doc.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{doc.shortDesc}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" /> {doc.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="size-3.5" /> {doc.pages} halaman
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5" /> {doc.usedCount.toLocaleString("id-ID")} pemakaian
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-display text-base">{formatIDR(doc.price)}</span>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/dokumen/$slug" params={{ slug: doc.slug }}>
                          Detail
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link to="/dokumen/$slug/buat" params={{ slug: doc.slug }}>
                          Buat <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    </div>
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
