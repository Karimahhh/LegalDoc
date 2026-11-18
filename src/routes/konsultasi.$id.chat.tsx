import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Paperclip, Send, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { chatTranscript, getConsultant } from "@/lib/data";

export const Route = createFileRoute("/konsultasi/$id/chat")({
  loader: ({ params }) => {
    const consultant = getConsultant(params.id);
    if (!consultant) throw notFound();
    return { consultant };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `Chat dengan ${loaderData.consultant.name} — LegalDoc` },
            { name: "description", content: "Ruang percakapan demo dengan konsultan hukum LegalDoc." },
            { property: "og:title", content: "Chat Konsultasi — LegalDoc" },
            { property: "og:description", content: "Diskusikan perkara Anda melalui percakapan tertulis." },
          ],
        }
      : { meta: [{ title: "Konsultan tidak ditemukan — LegalDoc" }, { name: "robots", content: "noindex" }] },
  component: Chat,
});

interface Message {
  from: "user" | "consultant";
  time: string;
  text: string;
}

const jam = () =>
  new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");

function Chat() {
  const { consultant } = Route.useLoaderData();
  const [messages, setMessages] = useState<Message[]>(chatTranscript);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (text.length < 2) {
      toast.error("Tulis pesan Anda terlebih dahulu.");
      return;
    }
    setMessages((m) => [...m, { from: "user", time: jam(), text }]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          from: "consultant",
          time: jam(),
          text: "Baik, saya catat poin tersebut. Saya akan menyiapkan usulan rumusan klausulnya dan mengirimkan ringkasan setelah sesi ini.",
        },
      ]);
    }, 1400);
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

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
              {consultant.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{consultant.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500" /> Aktif sekarang
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/konsultasi/$id/video" params={{ id: consultant.id }}>
              <Video className="mr-1 size-3.5" /> Video
            </Link>
          </Button>
        </div>

        <CardContent className="max-h-[26rem] space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={`${m.time}-${i}`} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {m.text}
                <span
                  className={`mt-1 block text-[10px] ${
                    m.from === "user" ? "text-primary-foreground/65" : "text-muted-foreground"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
                {consultant.name.split(" ")[0]} sedang menulis…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </CardContent>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Lampirkan berkas"
            onClick={() => toast.success("Lampiran terkirim (simulasi)")}
          >
            <Paperclip className="size-4" />
          </Button>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Tulis pesan untuk konsultan…"
            aria-label="Pesan"
          />
          <Button type="submit" aria-label="Kirim pesan">
            <Send className="size-4" />
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-xs text-muted-foreground">
        Percakapan ini merupakan simulasi demo. Balasan konsultan dihasilkan otomatis untuk memperlihatkan alur layanan.
      </p>
    </div>
  );
}
