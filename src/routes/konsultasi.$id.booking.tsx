import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatIDR, getConsultant } from "@/lib/data";

const methods = ["Chat", "Panggilan Video", "Tatap Muka"] as const;

export const Route = createFileRoute("/konsultasi/$id/booking")({
  loader: ({ params }) => {
    const consultant = getConsultant(params.id);
    if (!consultant) throw notFound();
    return { consultant };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `Jadwalkan Sesi dengan ${loaderData.consultant.name} — LegalDoc` },
            { name: "description", content: "Pilih tanggal, jam, dan metode sesi konsultasi hukum Anda." },
            { property: "og:title", content: "Jadwalkan Sesi Konsultasi — LegalDoc" },
            { property: "og:description", content: "Booking sesi konsultasi hukum dalam beberapa langkah singkat." },
          ],
        }
      : { meta: [{ title: "Konsultan tidak ditemukan — LegalDoc" }, { name: "robots", content: "noindex" }] },
  component: Booking,
});

function Booking() {
  const { consultant } = Route.useLoaderData();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState(consultant.availability[0] ?? "");
  const [method, setMethod] = useState<(typeof methods)[number]>("Panggilan Video");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!date) next["date"] = "Tanggal sesi wajib dipilih.";
    if (!time) next["time"] = "Jam sesi wajib dipilih.";
    if (topic.trim().length < 20) next["topic"] = "Uraikan pokok masalah minimal 20 karakter.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Periksa kembali formulir booking Anda.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Jadwal disiapkan", {
        description: `Lanjutkan pembayaran untuk mengunci sesi ${method} pada ${date} pukul ${time}.`,
      });
      navigate({
        to: "/checkout",
        search: { tipe: "konsultasi" as const, ref: consultant.id, tanggal: date, jam: time, metode: method },
      });
    }, 900);
  };


  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/konsultasi/$id"
        params={{ id: consultant.id }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali ke profil konsultan
      </Link>

      <h1 className="mt-6 text-2xl">Jadwalkan sesi konsultasi</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bersama {consultant.name} · {formatIDR(consultant.pricePerSession)} per sesi 45 menit.
      </p>

      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal sesi</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                {errors["date"] && <p className="text-xs text-destructive">{errors["date"]}</p>}
              </div>
              <div className="space-y-2">
                <Label>Jam tersedia</Label>
                <div className="flex flex-wrap gap-2">
                  {consultant.availability.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                        time === t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors["time"] && <p className="text-xs text-destructive">{errors["time"]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Metode sesi</Label>
              <div className="flex flex-wrap gap-2">
                {methods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      method === m ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Pokok masalah</Label>
              <Textarea
                id="topic"
                rows={5}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: saya perlu meninjau klausul pembagian keuntungan dalam perjanjian kerja sama dengan calon mitra."
                maxLength={1000}
              />
              {errors["topic"] && <p className="text-xs text-destructive">{errors["topic"]}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              <CalendarCheck className="mr-2 size-4" />
              {loading ? "Memproses jadwal…" : "Konfirmasi sesi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
