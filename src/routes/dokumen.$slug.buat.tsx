import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Eye, Loader2, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { A4Preview } from "@/components/shared/a4-preview";
import { getDocument, type DocField } from "@/lib/data";
import { loadDraft, saveDraft } from "@/lib/draft-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dokumen/$slug/buat")({
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
        { title: `Buat ${loaderData.doc.title} — LegalDoc` },
        {
          name: "description",
          content: `Isi ${loaderData.doc.steps.length} langkah panduan dan lihat hasil ${loaderData.doc.title} pada pratinjau A4 secara langsung.`,
        },
        { property: "og:title", content: `Buat ${loaderData.doc.title} — LegalDoc` },
        {
          property: "og:description",
          content: "Generator dokumen bertahap dengan pratinjau A4 yang diperbarui saat Anda mengisi data.",
        },
      ],
    };
  },
  component: GeneratorDokumen,
});

function validateField(field: DocField, value: string): string | null {
  const v = (value ?? "").trim();
  if (field.required && !v) return `${field.label} wajib diisi`;
  if (!v) return null;
  if (field.type === "number" && Number.isNaN(Number(v))) return `${field.label} harus berupa angka`;
  if (field.type === "number" && Number(v) < 0) return `${field.label} tidak boleh negatif`;
  if (field.type === "text" && v.length < 3) return `${field.label} minimal 3 karakter`;
  if (v.length > 400) return `${field.label} maksimal 400 karakter`;
  return null;
}

function GeneratorDokumen() {
  const { doc } = Route.useLoaderData();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  useEffect(() => {
    setValues(loadDraft(doc.slug));
  }, [doc.slug]);

  const step = doc.steps[stepIndex]!;
  const progress = Math.round(((stepIndex + 1) / doc.steps.length) * 100);
  const paragraphs = useMemo(() => doc.previewBody(values), [doc, values]);

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateStep = () => {
    const stepErrors: Record<string, string> = {};
    step.fields.forEach((field) => {
      const err = validateField(field, values[field.name] ?? "");
      if (err) stepErrors[field.name] = err;
    });
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      toast.error("Periksa kembali isian Anda", {
        description: `${Object.keys(stepErrors).length} isian pada langkah ini belum lengkap atau tidak valid.`,
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    saveDraft(doc.slug, values);
    if (stepIndex < doc.steps.length - 1) {
      setStepIndex((i) => i + 1);
      toast.success(`Langkah ${stepIndex + 1} selesai`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setFinishing(true);
    setTimeout(() => {
      setFinishing(false);
      saveDraft(doc.slug, values);
      toast.success("Dokumen selesai disusun", { description: "Silakan tinjau hasil akhir sebelum diunduh." });
      navigate({ to: "/dokumen/$slug/hasil", params: { slug: doc.slug } });
    }, 1200);
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => {
      saveDraft(doc.slug, values);
      setSaving(false);
      toast.success("Draf tersimpan", { description: "Anda dapat melanjutkan pengisian kapan pun dari dasbor." });
    }, 700);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/dokumen/$slug"
            params={{ slug: doc.slug }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Kembali ke detail dokumen
          </Link>
          <h1 className="mt-3 text-2xl sm:text-3xl">{doc.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Langkah {stepIndex + 1} dari {doc.steps.length} — {step.title}
          </p>
        </div>
        <Badge variant="secondary">{doc.category}</Badge>
      </div>

      <div className="mt-6">
        <Progress value={progress} className="h-2" />
        <div className="mt-4 flex flex-wrap gap-2">
          {doc.steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => {
                if (i <= stepIndex) setStepIndex(i);
              }}
              disabled={i > stepIndex}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                i === stepIndex && "border-gold bg-gold/10 text-foreground",
                i < stepIndex && "border-border text-muted-foreground hover:bg-accent",
                i > stepIndex && "border-dashed border-border text-muted-foreground/60",
              )}
            >
              {i < stepIndex ? <Check className="size-3.5 text-success" /> : <span>{i + 1}</span>}
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-lg">{step.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              noValidate
            >
              {step.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="ml-1 text-destructive">*</span>}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      value={values[field.name] ?? ""}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      aria-invalid={Boolean(errors[field.name])}
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={values[field.name] ?? ""}
                      onValueChange={(val) => setValue(field.name, val)}
                    >
                      <SelectTrigger id={field.name} aria-invalid={Boolean(errors[field.name])}>
                        <SelectValue placeholder="Pilih salah satu" />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      value={values[field.name] ?? ""}
                      onChange={(e) => setValue(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      aria-invalid={Boolean(errors[field.name])}
                    />
                  )}

                  {errors[field.name] ? (
                    <p className="text-xs text-destructive">{errors[field.name]}</p>
                  ) : (
                    field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                {stepIndex > 0 && (
                  <Button type="button" variant="outline" onClick={() => setStepIndex((i) => i - 1)}>
                    <ArrowLeft className="mr-1 size-4" /> Sebelumnya
                  </Button>
                )}
                <Button type="submit" disabled={finishing}>
                  {finishing ? (
                    <>
                      <Loader2 className="mr-1 size-4 animate-spin" /> Menyusun dokumen
                    </>
                  ) : stepIndex === doc.steps.length - 1 ? (
                    <>
                      Selesaikan dokumen <ArrowRight className="ml-1 size-4" />
                    </>
                  ) : (
                    <>
                      Lanjut <ArrowRight className="ml-1 size-4" />
                    </>
                  )}
                </Button>
                <Button type="button" variant="ghost" onClick={handleSaveDraft} disabled={saving}>
                  {saving ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Save className="mr-1 size-4" />}
                  Simpan draf
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="lg:hidden"
                  onClick={() => setShowPreviewMobile((s) => !s)}
                >
                  <Eye className="mr-1 size-4" /> {showPreviewMobile ? "Sembunyikan" : "Lihat"} pratinjau
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <aside className={cn("lg:sticky lg:top-24 lg:block lg:self-start", showPreviewMobile ? "block" : "hidden")}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Pratinjau A4</p>
            <span className="text-xs text-muted-foreground">Diperbarui otomatis</span>
          </div>
          <A4Preview
            title={doc.previewTitle}
            paragraphs={paragraphs}
            signatures={[
              values["pihak1"] || values["perusahaan"] || values["pemilik"] || values["pemberi"] || "Pihak Pertama",
              values["pihak2"] || values["karyawan"] || values["penyewa"] || values["penerima"] || "Pihak Kedua",
            ]}
          />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Bagian yang masih dalam tanda kurung siku akan terisi setelah Anda melengkapi isian pada langkah terkait.
          </p>
        </aside>
      </div>
    </div>
  );
}
