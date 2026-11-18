import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, MapPin, MessageSquare, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/shared/ui-blocks";
import { consultantReviews, formatIDR, formatTanggal, getConsultant } from "@/lib/data";

export const Route = createFileRoute("/konsultasi/$id/")({
  loader: ({ params }) => {
    const consultant = getConsultant(params.id);
    if (!consultant) throw notFound();
    return { consultant };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Konsultan tidak ditemukan — LegalDoc" }, { name: "robots", content: "noindex" }] };
    }
    const { consultant } = loaderData;
    return {
      meta: [
        { title: `${consultant.name} — Konsultan LegalDoc` },
        { name: "description", content: consultant.bio },
        { property: "og:title", content: `${consultant.name} — Konsultan LegalDoc` },
        { property: "og:description", content: consultant.bio },
      ],
    };
  },
  component: DetailKonsultan,
});

function DetailKonsultan() {
  const { consultant } = Route.useLoaderData();
  const reviews = consultantReviews.filter((r) => r.consultantId === consultant.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/konsultasi"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali ke daftar konsultan
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start gap-4">
                <span className="flex size-16 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                  {consultant.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl leading-snug">{consultant.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{consultant.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <RatingStars value={consultant.rating} /> {consultant.rating.toFixed(1).replace(".", ",")} ·{" "}
                      {consultant.reviewCount} ulasan
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {consultant.city}
                    </span>
                    <span>{consultant.experience} tahun pengalaman</span>
                    <span>Bahasa: {consultant.languages.join(", ")}</span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{consultant.bio}</p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {consultant.specialities.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>

              <Separator className="my-6" />

              <h2 className="text-lg">Pendidikan & sertifikasi</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {consultant.education.map((e) => (
                  <li key={e} className="flex gap-2">
                    <GraduationCap className="mt-0.5 size-4 shrink-0 text-gold" /> {e}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg">Ulasan klien</h2>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Belum ada ulasan yang dipublikasikan untuk konsultan ini.
                </p>
              ) : (
                <div className="mt-5 space-y-5">
                  {reviews.map((r) => (
                    <div key={`${r.name}-${r.date}`} className="border-b border-border pb-5 last:border-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{r.name}</p>
                        <span className="text-xs text-muted-foreground">{formatTanggal(r.date)}</span>
                      </div>
                      <RatingStars value={r.rating} className="mt-1.5" />
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-gold/40">
            <CardContent className="p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Tarif sesi</p>
              <p className="mt-3 font-display text-2xl">{formatIDR(consultant.pricePerSession)}</p>
              <p className="text-xs text-muted-foreground">Sesi 45 menit, termasuk catatan tindak lanjut.</p>
              <div className="mt-5 space-y-1.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Jadwal tersedia hari ini</p>
                <div className="flex flex-wrap gap-2">
                  {consultant.availability.map((t) => (
                    <span key={t} className="rounded-md border border-border px-2.5 py-1 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <Button asChild className="mt-6 w-full">
                <Link to="/konsultasi/$id/booking" params={{ id: consultant.id }}>
                  Jadwalkan sesi
                </Link>
              </Button>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/konsultasi/$id/chat" params={{ id: consultant.id }}>
                    <MessageSquare className="mr-1 size-3.5" /> Chat
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/konsultasi/$id/video" params={{ id: consultant.id }}>
                    <Video className="mr-1 size-3.5" /> Video
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
