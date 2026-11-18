import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHero, SectionHeading } from "@/components/shared/ui-blocks";
import { articleCategories, articles, formatTanggal } from "@/lib/data";

export const Route = createFileRoute("/edukasi/")({
  head: () => ({
    meta: [
      { title: "Pusat Edukasi Hukum Praktis — LegalDoc" },
      {
        name: "description",
        content:
          "Artikel praktis tentang kontrak, ketenagakerjaan, properti, dan legalitas usaha, ditulis oleh praktisi hukum Indonesia.",
      },
      { property: "og:title", content: "Pusat Edukasi Hukum — LegalDoc" },
      {
        property: "og:description",
        content: "Panduan hukum yang mudah dipahami untuk pelaku usaha dan individu.",
      },
    ],
  }),
  component: Edukasi,
});

function Edukasi() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (category === "Semua" || a.category === category) &&
        (q === "" || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const featured = list[0];
  const rest = featured ? list.slice(1) : [];

  return (
    <div>
      <PageHero
        eyebrow="Edukasi"
        title="Memahami hukum tanpa harus jadi sarjana hukum"
        description="Penjelasan singkat, contoh nyata, dan langkah praktis yang bisa langsung Anda terapkan pada perjanjian maupun usaha Anda."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari artikel, misalnya: PKWT"
              className="pl-9"
              aria-label="Cari artikel"
            />
          </div>
          <p className="text-xs text-muted-foreground">{list.length} artikel</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Semua", ...articleCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                category === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Artikel tidak ditemukan"
              description="Coba kata kunci lain atau pilih kategori berbeda untuk melihat artikel yang tersedia."
              actionLabel="Lihat katalog dokumen"
              actionTo="/dokumen"
            />
          </div>
        ) : (
          <>
            {featured && (
              <Link
                to="/edukasi/$slug"
                params={{ slug: featured.slug }}
                className="mt-8 block"
              >
                <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant">
                  <CardContent className="p-6 sm:p-8">
                    <Badge variant="secondary">{featured.category}</Badge>
                    <h2 className="mt-3 text-2xl leading-snug">{featured.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" /> {formatTanggal(featured.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" /> {featured.readTime}
                      </span>
                      <span>{featured.author}</span>
                      <span className="flex items-center gap-1 text-foreground">
                        Baca artikel <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="mt-14">
                <SectionHeading eyebrow="Artikel lain" title="Bacaan pilihan lainnya" />
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((a) => (
                    <Link key={a.slug} to="/edukasi/$slug" params={{ slug: a.slug }} className="block h-full">
                      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant">
                        <CardContent className="flex h-full flex-col p-6">
                          <Badge variant="secondary" className="w-fit">
                            {a.category}
                          </Badge>
                          <h3 className="mt-3 text-lg leading-snug">{a.title}</h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
                          <div className="mt-4 flex items-center gap-x-3 text-xs text-muted-foreground">
                            <span>{formatTanggal(a.date)}</span>
                            <span>·</span>
                            <span>{a.readTime}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
