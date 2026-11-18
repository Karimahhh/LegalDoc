import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, FilePlus2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState, StatBlock } from "@/components/shared/ui-blocks";
import { bookings, formatTanggal, getConsultant, userDocuments } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Ringkasan Dasbor — LegalDoc" },
      {
        name: "description",
        content: "Pantau dokumen terakhir, draf yang belum selesai, dan jadwal sesi konsultasi Anda dalam satu tampilan.",
      },
      { property: "og:title", content: "Ringkasan Dasbor — LegalDoc" },
      { property: "og:description", content: "Semua dokumen dan jadwal konsultasi Anda dalam satu tempat." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = useAuth();
  const drafts = userDocuments.filter((d) => d.status === "Draf");
  const upcoming = bookings.filter((b) => b.status === "Terjadwal");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl">Selamat datang, {user?.name.split(" ")[0] ?? "Pengguna"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Berikut ringkasan aktivitas dokumen dan konsultasi hukum Anda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock label="Total dokumen" value={String(userDocuments.length)} hint="Termasuk draf" />
        <StatBlock label="Draf belum selesai" value={String(drafts.length)} hint="Lanjutkan kapan saja" />
        <StatBlock label="Sesi terjadwal" value={String(upcoming.length)} hint="Konsultasi mendatang" />
        <StatBlock label="Paket aktif" value={user?.plan ?? "Dasar"} hint="Kelola di pengaturan" />
      </div>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg">Mulai dokumen baru</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Pilih template, isi beberapa langkah, dan unduh dokumen siap tanda tangan.
            </p>
          </div>
          <Button asChild>
            <Link to="/dokumen">
              <FilePlus2 className="mr-2 size-4" /> Buat dokumen
            </Link>
          </Button>
        </CardContent>
      </Card>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg">Dokumen terakhir</h2>
          <Link
            to="/dashboard/dokumen"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Lihat semua <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {userDocuments.slice(0, 3).map((d) => (
            <Card key={d.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.id} · diperbarui {formatTanggal(d.updatedAt)}
                    </p>
                    {d.progress < 100 && <Progress value={d.progress} className="mt-2 h-1.5 w-40" />}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={d.status === "Selesai" ? "default" : "secondary"}>{d.status}</Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      to={d.status === "Selesai" ? "/dokumen/$slug/hasil" : "/dokumen/$slug/buat"}
                      params={{ slug: d.slug }}
                    >
                      {d.status === "Selesai" ? "Lihat" : "Lanjutkan"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg">Jadwal konsultasi</h2>
        <div className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <EmptyState
              title="Belum ada sesi terjadwal"
              description="Pilih konsultan sesuai bidang perkara Anda dan tentukan waktu yang paling nyaman."
              actionLabel="Cari konsultan"
              actionTo="/konsultasi"
            />
          ) : (
            upcoming.map((b) => {
              const c = getConsultant(b.consultantId);
              return (
                <Card key={b.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 items-center justify-center rounded-md bg-gold/15 text-gold">
                        <CalendarClock className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{c?.name ?? "Konsultan LegalDoc"}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTanggal(b.date)} · {b.time} · {b.method}
                        </p>
                      </div>
                    </div>
                    {c && (
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/konsultasi/$id/chat" params={{ id: c.id }}>
                            Chat
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link to="/konsultasi/$id/video" params={{ id: c.id }}>
                            Masuk sesi
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
