import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mic, MicOff, MonitorUp, PhoneOff, Video, VideoOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getConsultant } from "@/lib/data";

export const Route = createFileRoute("/konsultasi/$id/video")({
  loader: ({ params }) => {
    const consultant = getConsultant(params.id);
    if (!consultant) throw notFound();
    return { consultant };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `Panggilan Video dengan ${loaderData.consultant.name} — LegalDoc` },
            { name: "description", content: "Simulasi ruang panggilan video konsultasi hukum LegalDoc." },
            { property: "og:title", content: "Panggilan Video Konsultasi — LegalDoc" },
            { property: "og:description", content: "Sesi tatap muka daring bersama konsultan hukum pilihan Anda." },
          ],
        }
      : { meta: [{ title: "Konsultan tidak ditemukan — LegalDoc" }, { name: "robots", content: "noindex" }] },
  component: VideoCall,
});

function VideoCall() {
  const { consultant } = Route.useLoaderData();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const durasi = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const end = () => {
    toast.success("Sesi berakhir", { description: `Durasi panggilan ${durasi}. Catatan sesi dikirim ke email Anda.` });
    navigate({ to: "/konsultasi/$id", params: { id: consultant.id } });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to="/konsultasi/$id"
        params={{ id: consultant.id }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Kembali ke profil konsultan
      </Link>

      <Card className="mt-6 overflow-hidden">
        <div className="relative aspect-video bg-ink">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-primary-foreground">
            <span className="flex size-20 items-center justify-center rounded-full bg-primary font-display text-2xl">
              {consultant.initials}
            </span>
            <p className="text-lg">{consultant.name}</p>
            <p className="text-xs text-primary-foreground/70">{consultant.title}</p>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-md bg-black/40 px-2.5 py-1.5 text-xs text-primary-foreground backdrop-blur">
            <span className="size-2 animate-pulse rounded-full bg-red-500" /> Sesi berlangsung · {durasi}
          </div>

          <div className="absolute right-4 bottom-4 flex size-24 items-center justify-center rounded-md border border-primary-foreground/20 bg-black/50 text-[10px] text-primary-foreground sm:size-32">
            {cam ? "Kamera Anda" : "Kamera nonaktif"}
          </div>
        </div>

        <CardContent className="flex flex-wrap items-center justify-center gap-3 p-5">
          <Button variant={mic ? "outline" : "secondary"} onClick={() => setMic((v) => !v)}>
            {mic ? <Mic className="mr-2 size-4" /> : <MicOff className="mr-2 size-4" />}
            {mic ? "Mikrofon aktif" : "Mikrofon mati"}
          </Button>
          <Button variant={cam ? "outline" : "secondary"} onClick={() => setCam((v) => !v)}>
            {cam ? <Video className="mr-2 size-4" /> : <VideoOff className="mr-2 size-4" />}
            {cam ? "Kamera aktif" : "Kamera mati"}
          </Button>
          <Button variant="outline" onClick={() => toast.success("Layar Anda mulai dibagikan (simulasi)")}>
            <MonitorUp className="mr-2 size-4" /> Bagikan layar
          </Button>
          <Button variant="destructive" onClick={end}>
            <PhoneOff className="mr-2 size-4" /> Akhiri sesi
          </Button>
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Panggilan ini simulasi demo tanpa akses kamera maupun mikrofon perangkat Anda.
      </p>
    </div>
  );
}
