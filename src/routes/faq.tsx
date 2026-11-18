import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, PageHero } from "@/components/shared/ui-blocks";
import { faqs } from "@/lib/data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Pertanyaan Umum Seputar Dokumen & Konsultasi — LegalDoc" },
      {
        name: "description",
        content:
          "Jawaban atas pertanyaan umum tentang keabsahan dokumen, cara memesan konsultasi hukum, pembayaran, dan pengelolaan akun LegalDoc.",
      },
      { property: "og:title", content: "Pertanyaan Umum — LegalDoc" },
      { property: "og:description", content: "Temukan jawaban cepat seputar layanan LegalDoc." },
    ],
  }),
  component: Faq,
});

function Faq() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs
      .filter((g) => category === "Semua" || g.category === category)
      .map((g) => ({
        category: g.category,
        items: g.items.filter(
          (i) => q === "" || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, category]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div>
      <PageHero
        eyebrow="Bantuan"
        title="Pertanyaan yang paling sering diajukan"
        description="Cari jawaban dalam hitungan detik. Bila belum menemukan yang Anda butuhkan, tim kami siap membantu."
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan, misalnya: unduhan PDF"
            className="pl-9"
            aria-label="Cari pertanyaan"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Semua", ...faqs.map((f) => f.category)].map((c) => (
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

        <p className="mt-4 text-xs text-muted-foreground">{total} pertanyaan ditampilkan.</p>

        <div className="mt-6 space-y-8">
          {groups.length === 0 ? (
            <EmptyState
              title="Tidak ada pertanyaan yang cocok"
              description="Coba kata kunci lain, atau hubungi tim kami melalui halaman konsultasi."
              actionLabel="Cari konsultan"
              actionTo="/konsultasi"
            />
          ) : (
            groups.map((g) => (
              <div key={g.category}>
                <h2 className="text-lg">{g.category}</h2>
                <Accordion type="single" collapsible className="mt-3">
                  {g.items.map((item) => (
                    <AccordionItem key={item.q} value={item.q}>
                      <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
        </div>

        <Card className="mt-12">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg">Belum terjawab?</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Kirim pertanyaan Anda ke bantuan@legaldoc.id atau jadwalkan sesi dengan konsultan.
              </p>
            </div>
            <Button asChild>
              <Link to="/konsultasi">Jadwalkan konsultasi</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
