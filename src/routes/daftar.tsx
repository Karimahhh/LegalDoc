import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/daftar")({
  head: () => ({
    meta: [
      { title: "Daftar Akun Gratis LegalDoc" },
      {
        name: "description",
        content:
          "Buat akun LegalDoc gratis untuk menyusun dokumen hukum, menyimpan draf, dan menjadwalkan konsultasi dengan advokat.",
      },
      { property: "og:title", content: "Daftar Gratis — LegalDoc" },
      { property: "og:description", content: "Mulai susun dokumen hukum Anda dalam hitungan menit." },
    ],
  }),
  component: Daftar,
});

const benefits = [
  "Akses seluruh katalog template dokumen",
  "Pratinjau A4 sebelum dokumen diunduh",
  "Draf tersimpan otomatis di dasbor Anda",
  "Tanpa kartu kredit untuk paket Dasar",
];

function Daftar() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next["name"] = "Nama lengkap minimal 3 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next["email"] = "Masukkan alamat email yang valid.";
    if (!/^0\d{8,12}$/.test(form.phone.replace(/[\s-]/g, "")))
      next["phone"] = "Nomor telepon diawali 0 dan terdiri dari 9–13 angka.";
    if (form.password.length < 8) next["password"] = "Kata sandi minimal 8 karakter.";
    if (form.confirm !== form.password) next["confirm"] = "Konfirmasi kata sandi belum sama.";
    if (!agree) next["agree"] = "Anda perlu menyetujui ketentuan layanan.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Periksa kembali formulir pendaftaran Anda.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login({ name: form.name.trim(), email: form.email, phone: form.phone, plan: "Dasar" });
      setLoading(false);
      toast.success("Akun berhasil dibuat", { description: "Selamat bergabung di LegalDoc." });
      navigate({ to: "/dashboard" });
    }, 900);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Daftar</p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">Buat akun dan susun dokumen pertama Anda</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Pendaftaran gratis, tanpa biaya tersembunyi. Anda dapat meningkatkan paket kapan saja dari dasbor.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {benefits.map((b) => (
            <li key={b} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" /> {b}
            </li>
          ))}
        </ul>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama lengkap</Label>
                <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Krisna Pratama" />
                {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor telepon</Label>
                <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="081234567890" />
                {errors["phone"] && <p className="text-xs text-destructive">{errors["phone"]}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="nama@perusahaan.co.id"
              />
              {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Kata sandi</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Minimal 8 karakter"
                />
                {errors["password"] && <p className="text-xs text-destructive">{errors["password"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Ulangi kata sandi</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={(e) => set("confirm", e.target.value)}
                  placeholder="Ulangi kata sandi"
                />
                {errors["confirm"] && <p className="text-xs text-destructive">{errors["confirm"]}</p>}
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
              <Label htmlFor="agree" className="text-xs leading-relaxed font-normal text-muted-foreground">
                Saya menyetujui ketentuan layanan dan telah membaca{" "}
                <Link to="/disclaimer" className="underline hover:text-gold">
                  disclaimer
                </Link>{" "}
                LegalDoc.
              </Label>
            </div>
            {errors["agree"] && <p className="text-xs text-destructive">{errors["agree"]}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="mr-2 size-4" />
              {loading ? "Membuat akun…" : "Daftar sekarang"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/masuk" className="font-medium text-foreground underline hover:text-gold">
                Masuk di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
