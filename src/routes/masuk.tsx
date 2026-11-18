import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/masuk")({
  head: () => ({
    meta: [
      { title: "Masuk ke Akun LegalDoc" },
      {
        name: "description",
        content: "Masuk untuk melanjutkan draf dokumen, melihat jadwal konsultasi, dan mengelola berkas hukum Anda.",
      },
      { property: "og:title", content: "Masuk — LegalDoc" },
      { property: "og:description", content: "Akses dasbor dokumen dan konsultasi hukum Anda." },
    ],
  }),
  component: Masuk,
});

function Masuk() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Masukkan alamat email yang valid.";
    if (password.length < 8) next.password = "Kata sandi minimal 8 karakter.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Periksa kembali data masuk Anda.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const name = email.split("@")[0]?.replace(/[._]/g, " ") ?? "Pengguna";
      login({
        name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        plan: "Profesional",
      });
      setLoading(false);
      toast.success("Berhasil masuk", { description: "Selamat datang kembali di LegalDoc." });
      navigate({ to: "/dashboard" });
    }, 800);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">Masuk</p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">Lanjutkan pekerjaan hukum Anda</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Semua draf dokumen, riwayat unduhan, dan jadwal konsultasi tersimpan rapi dalam satu dasbor.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {[
            "Lanjutkan draf dokumen dari langkah terakhir",
            "Pantau jadwal sesi dengan konsultan",
            "Unduh ulang dokumen kapan pun dibutuhkan",
          ].map((f) => (
            <li key={f} className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.co.id"
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                autoComplete="current-password"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 size-4" />
              {loading ? "Memverifikasi…" : "Masuk ke akun"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/daftar" className="font-medium text-foreground underline hover:text-gold">
                Daftar gratis
              </Link>
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Ini demo produk. Gunakan email apa pun dan kata sandi minimal 8 karakter.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
