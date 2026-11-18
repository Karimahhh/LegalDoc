import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FilePlus2, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/ui-blocks";
import { formatTanggal, userDocuments, type UserDocument } from "@/lib/data";

export const Route = createFileRoute("/dashboard/dokumen")({
  head: () => ({
    meta: [
      { title: "Dokumen Saya — Dasbor LegalDoc" },
      {
        name: "description",
        content: "Kelola dokumen hukum Anda: lanjutkan draf, unduh ulang berkas selesai, atau hapus yang tidak dipakai.",
      },
      { property: "og:title", content: "Dokumen Saya — LegalDoc" },
      { property: "og:description", content: "Semua dokumen hukum Anda tersimpan dan siap diunduh ulang." },
    ],
  }),
  component: DokumenSaya,
});

const statuses = ["Semua", "Selesai", "Draf", "Ditinjau"] as const;

function DokumenSaya() {
  const [items, setItems] = useState<UserDocument[]>(userDocuments);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("Semua");
  const [pending, setPending] = useState<UserDocument | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (d) =>
        (status === "Semua" || d.status === status) &&
        (q === "" || d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)),
    );
  }, [items, query, status]);

  const remove = () => {
    if (!pending) return;
    setItems((prev) => prev.filter((d) => d.id !== pending.id));
    toast.success("Dokumen dihapus", { description: `${pending.title} telah dihapus dari dasbor Anda.` });
    setPending(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">Dokumen saya</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {items.length} dokumen tersimpan. Draf dapat dilanjutkan dari langkah terakhir.
          </p>
        </div>
        <Button asChild>
          <Link to="/dokumen">
            <FilePlus2 className="mr-2 size-4" /> Dokumen baru
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau nomor dokumen"
            className="pl-9"
            aria-label="Cari dokumen"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                status === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Tidak ada dokumen di tampilan ini"
          description="Ubah kata kunci atau filter status, atau susun dokumen baru dari katalog template."
          actionLabel="Buka katalog"
          actionTo="/dokumen"
        />
      ) : (
        <div className="space-y-3">
          {list.map((d) => (
            <Card key={d.id} className="transition-shadow hover:shadow-elegant">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{d.title}</p>
                    <Badge variant={d.status === "Selesai" ? "default" : "secondary"}>{d.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {d.id} · diperbarui {formatTanggal(d.updatedAt)}
                  </p>
                  {d.progress < 100 && (
                    <div className="mt-2 flex items-center gap-2">
                      <Progress value={d.progress} className="h-1.5 w-40" />
                      <span className="text-xs text-muted-foreground">{d.progress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {d.status === "Selesai" ? (
                    <>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/dokumen/$slug/hasil" params={{ slug: d.slug }}>
                          <Download className="mr-1.5 size-3.5" /> Unduh
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/dokumen/$slug/buat" params={{ slug: d.slug }}>
                          Sunting
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button asChild size="sm">
                      <Link to="/dokumen/$slug/buat" params={{ slug: d.slug }}>
                        Lanjutkan
                      </Link>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setPending(d)}
                    aria-label={`Hapus ${d.title}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus dokumen ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.title} akan dihapus dari dasbor Anda beserta riwayat revisinya. Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Hapus dokumen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
