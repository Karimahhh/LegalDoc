import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, FileText, ListChecks, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { A4Preview } from "@/components/shared/a4-preview";
import { RatingStars } from "@/components/shared/ui-blocks";
import { documents, formatIDR, getDocument } from "@/lib/data";

export const Route = createFileRoute("/dokumen/$slug/")({
  loader: ({ params }) => {
    const doc = getDocument(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Dokumen tidak ditemukan — LegalDoc" }, { name: "robots", content: "noindex" }],
      };
    }
    const { doc } = loaderData;
    return {
      meta: [
        { title: `${doc.title} — LegalDoc` },
        { name: "description", content: doc.shortDesc },
        { property: "og:title", content: `${doc.title} — LegalDoc` },
        { property: "og:description", content: doc.shortDesc },
      ],
    };
  },
  component: DetailDokumen,
});

function DetailDokumen() {
  const { doc } = Route.useLoaderData();
  const terkait = documents.filter((d) => d.category === doc.category && d.slug !== doc.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <nav className="mb-6 flex items-center gap-2 text-xs text-primary-foreground/60">
            <Link to="/" className="transition-colors hover:text-gold">
              Beranda
            </Link>
            <span>/</span>
            <Link to="/dokumen" className="transition-colors hover:text-gold">
              Dokumen
            </Link>
            <span>/</span>
            <span className="text-primary-foreground/85">{doc.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Badge className="border-gold/40 bg-gold/15 text-gold hover:bg-gold/20">{doc.category}</Badge>
              <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{doc.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/75">{doc.description}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-gold" /> {doc.duration} pengisian
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="size-4 text-gold" /> {doc.pages} halaman
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4 text-gold" /> {doc.usedCount.toLocaleString("id-ID")} pemakaian
                </span>
                <span className="flex items-center gap-1.5">
                  <RatingStars value={4.9} /> 4,9 dari pengguna
                </span>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Link to="/dokumen/$slug/buat" params={{ slug: doc.slug }}>
                    Buat dokumen ini <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/konsultasi">Tanya konsultan lebih dulu</Link>
                </Button>
                <span className="font-display text-xl">{formatIDR(doc.price)}</span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[380px]">
              <A4Preview
                title={doc.previewTitle}
                paragraphs={doc.previewBody({})}
                signatures={["Pihak Pertama", "Pihak Kedua"]}
              />
              <p className="mt-3 text-center text-xs text-primary-foreground/55">
                Contoh tampilan dokumen sebelum data Anda diisi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl">Klausul yang disertakan</h2>
              <ul className="mt-5 space-y-3">
                {doc.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Separator className="my-6" />
              <h2 className="text-xl">Langkah pengisian</h2>
              <ol className="mt-5 space-y-4">
                {doc.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm text-accent-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {step.fields.length} isian: {step.fields.map((f) => f.label).join(", ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {terkait.length > 0 && (
            <div>
              <h2 className="text-xl">Dokumen terkait</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {terkait.map((d) => (
                  <Card key={d.slug} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                    <CardContent className="p-5">
                      <p className="text-sm leading-snug font-semibold">{d.title}</p>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{d.shortDesc}</p>
                      <Button asChild size="sm" variant="ghost" className="mt-3 px-0 text-gold hover:text-gold">
                        <Link to="/dokumen/$slug" params={{ slug: d.slug }}>
                          Lihat detail <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-gold/40">
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Ringkasan</p>
              <p className="mt-3 font-display text-2xl">{formatIDR(doc.price)}</p>
              <p className="text-xs text-muted-foreground">Sekali bayar per dokumen, atau gratis pada paket bulanan.</p>
              <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <ListChecks className="mt-0.5 size-4 shrink-0 text-gold" /> {doc.steps.length} langkah pengisian
                </li>
                <li className="flex gap-2">
                  <FileText className="mt-0.5 size-4 shrink-0 text-gold" /> Unduhan PDF dan DOCX
                </li>
                <li className="flex gap-2">
                  <Clock className="mt-0.5 size-4 shrink-0 text-gold" /> Tersimpan otomatis sebagai draf
                </li>
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link to="/dokumen/$slug/buat" params={{ slug: doc.slug }}>
                  Mulai isi dokumen
                </Link>
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link to="/checkout" search={{ tipe: "dokumen" as const, ref: doc.slug }}>
                  Beli dokumen ini
                </Link>
              </Button>
              <Button asChild variant="ghost" className="mt-2 w-full">
                <Link to="/harga">Lihat paket berlangganan</Link>
              </Button>

            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Perlu pendapat kedua?</p>
              <p className="mt-2 leading-relaxed">
                Konsultan hukum kami dapat memeriksa dokumen Anda sebelum ditandatangani, mulai dari sesi 30 menit.
              </p>
              <Button asChild variant="secondary" className="mt-4 w-full">
                <Link to="/konsultasi">Pilih konsultan</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}
