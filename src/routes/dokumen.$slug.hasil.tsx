import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Download, FileText, Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { A4Preview } from "@/components/shared/a4-preview";
import { InlineLoader } from "@/components/shared/ui-blocks";
import { formatIDR, getDocument } from "@/lib/data";
import { clearDraft, loadDraft } from "@/lib/draft-store";
import { hasPaidDocument, hasUnlimitedAccess } from "@/lib/payment-store";


export const Route = createFileRoute("/dokumen/$slug/hasil")({
  loader: ({ params }) => {
    const doc = getDocument(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Dokumen tidak ditemukan — LegalDoc" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `Hasil ${loaderData.doc.title} — LegalDoc` },
        { name: "description", content: `Tinjau hasil akhir ${loaderData.doc.title} lalu unduh dalam format PDF atau DOCX.` },
        { property: "og:title", content: `Hasil ${loaderData.doc.title} — LegalDoc` },
        { property: "og:description", content: "Tinjau kelengkapan dokumen sebelum ditandatangani para pihak." },
      ],
    };
  },
  component: HasilDokumen,
});

function HasilDokumen() {
  const { doc } = Route.useLoaderData();
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const [unduh, setUnduh] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setValues(loadDraft(doc.slug)), 600);
    setPaid(hasPaidDocument(doc.slug) || hasUnlimitedAccess());
    return () => clearTimeout(t);
  }, [doc.slug]);

  const handleDownload = (format: "PDF" | "DOCX") => {
    setUnduh(format);
    setTimeout(() => {
      setUnduh(null);
      toast.success(`Simulasi unduhan ${format} selesai`, {
        description: "Pada versi demo ini berkas tidak benar-benar dibuat.",
      });
    }, 1400);
  };


  const isiTerisi = values ? Object.values(values).filter((v) => v?.trim()).length : 0;
  const totalIsian = doc.steps.reduce((acc, s) => acc + s.fields.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/dokumen/$slug/buat"
        params={{ slug: doc.slug }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali menyunting isian
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-success/15 text-success hover:bg-success/20">
            <CheckCircle2 className="mr-1 size-3.5" /> Dokumen siap ditinjau
          </Badge>
          <h1 className="mt-3 text-2xl sm:text-3xl">{doc.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isiTerisi} dari {totalIsian} isian terisi · {doc.pages} halaman · {formatIDR(doc.price)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg">Unduh dokumen</h2>
              {paid ? (
                <>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pembayaran Anda sudah tercatat. Pilih format yang Anda perlukan.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button onClick={() => handleDownload("PDF")} disabled={unduh !== null}>
                      {unduh === "PDF" ? (
                        <Loader2 className="mr-1 size-4 animate-spin" />
                      ) : (
                        <Download className="mr-1 size-4" />
                      )}
                      Unduh PDF
                    </Button>
                    <Button variant="outline" onClick={() => handleDownload("DOCX")} disabled={unduh !== null}>
                      {unduh === "DOCX" ? (
                        <Loader2 className="mr-1 size-4 animate-spin" />
                      ) : (
                        <FileText className="mr-1 size-4" />
                      )}
                      Unduh DOCX
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Selesaikan pembayaran {formatIDR(doc.price)} untuk membuka unduhan PDF dan DOCX tanpa tanda air.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/checkout" search={{ tipe: "dokumen" as const, ref: doc.slug }}>
                        <Download className="mr-1 size-4" /> Bayar & unduh dokumen
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/harga">Lihat paket berlangganan</Link>
                    </Button>
                  </div>
                </>
              )}

              <Separator className="my-6" />
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link to="/dokumen/$slug/buat" params={{ slug: doc.slug }}>
                    <Pencil className="mr-1 size-4" /> Sunting dokumen
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="mr-1 size-4" /> Hapus draf
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus draf dokumen ini?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Seluruh isian yang sudah Anda masukkan akan dihapus dan tidak dapat dikembalikan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          clearDraft(doc.slug);
                          setValues({});
                          toast.success("Draf dokumen dihapus");
                        }}
                      >
                        Ya, hapus draf
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Langkah berikutnya</p>
              <ul className="mt-3 space-y-2">
                <li>1. Periksa nama, alamat, dan nilai angka pada dokumen.</li>
                <li>2. Mintakan pemeriksaan konsultan bila nilai perjanjian besar.</li>
                <li>3. Cetak dua rangkap dan tandatangani bersama para pihak.</li>
              </ul>
              <Button asChild variant="secondary" className="mt-4 w-full">
                <Link to="/konsultasi">Minta pemeriksaan konsultan</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          {values === null ? (
            <Card>
              <CardContent className="p-6">
                <InlineLoader label="Menyiapkan hasil dokumen" />
              </CardContent>
            </Card>
          ) : (
            <>
              <A4Preview
                title={doc.previewTitle}
                paragraphs={doc.previewBody(values)}
                watermark={null}
                signatures={[
                  values["pihak1"] || values["perusahaan"] || values["pemilik"] || values["pemberi"] || "Pihak Pertama",
                  values["pihak2"] || values["karyawan"] || values["penyewa"] || values["penerima"] || "Pihak Kedua",
                ]}
              />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Tampilan akhir dokumen pada kertas A4.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
