import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { articles, formatTanggal, getArticle } from "@/lib/data";

export const Route = createFileRoute("/edukasi/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Artikel tidak ditemukan — LegalDoc" }, { name: "robots", content: "noindex" }] };
    }
    const { article } = loaderData;
    return {
      meta: [
        { title: `${article.title} — Edukasi LegalDoc` },
        { name: "description", content: article.excerpt },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.excerpt },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DetailArtikel,
});

function DetailArtikel() {
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/edukasi"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali ke pusat edukasi
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <article>
          <Badge variant="secondary">{article.category}</Badge>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{article.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" /> {formatTanggal(article.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" /> {article.readTime} baca
            </span>
            <span>{article.author}</span>
          </div>

          <p className="mt-6 border-l-2 border-gold pl-4 text-base leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>

          <div className="mt-8 space-y-8">
            {article.content.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl">{section.heading}</h2>
                <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Separator className="my-8" />

          <Button
            variant="outline"
            onClick={() => toast.success("Tautan artikel disalin ke papan klip")}
          >
            <Share2 className="mr-2 size-4" /> Bagikan artikel
          </Button>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-gold/40">
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Langkah lanjut</p>
              <h2 className="mt-3 text-lg leading-snug">Susun dokumennya sekarang</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Terapkan apa yang Anda baca dengan template yang sudah memuat klausul penting.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Button asChild>
                  <Link to="/dokumen">Buka katalog dokumen</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/konsultasi">Tanya konsultan</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {related.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg">Artikel terkait</h2>
                <ul className="mt-4 space-y-4">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link
                        to="/edukasi/$slug"
                        params={{ slug: a.slug }}
                        className="text-sm font-medium leading-snug transition-colors hover:text-gold"
                      >
                        {a.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">{a.readTime} baca</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
