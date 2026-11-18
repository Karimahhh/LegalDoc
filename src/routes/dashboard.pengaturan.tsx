import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, KeyRound } from "lucide-react";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan Akun — Dasbor LegalDoc" },
      {
        name: "description",
        content: "Atur notifikasi, ubah kata sandi, kelola paket berlangganan, dan hapus akun LegalDoc Anda.",
      },
      { property: "og:title", content: "Pengaturan Akun — LegalDoc" },
      { property: "og:description", content: "Kendalikan notifikasi, keamanan, dan paket langganan Anda." },
    ],
  }),
  component: Pengaturan,
});

function Pengaturan() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notif, setNotif] = useState({ email: true, sesi: true, promo: false });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (password.current.length < 8) next["current"] = "Kata sandi saat ini minimal 8 karakter.";
    if (password.next.length < 8) next["next"] = "Kata sandi baru minimal 8 karakter.";
    if (password.confirm !== password.next) next["confirm"] = "Konfirmasi kata sandi belum sama.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Periksa kembali kata sandi Anda.");
      return;
    }
    setPassword({ current: "", next: "", confirm: "" });
    toast.success("Kata sandi diperbarui");
  };

  const deleteAccount = () => {
    logout();
    toast.success("Akun dihapus", { description: "Seluruh data demo Anda telah dibersihkan." });
    navigate({ to: "/" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Pengaturan</h1>
        <p className="mt-2 text-sm text-muted-foreground">Kelola notifikasi, keamanan, dan langganan akun Anda.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg">Notifikasi</h2>
          <div className="mt-4 space-y-4">
            {[
              { key: "email" as const, label: "Ringkasan email mingguan", desc: "Rekap dokumen dan sesi setiap Senin." },
              { key: "sesi" as const, label: "Pengingat sesi konsultasi", desc: "Dikirim 1 jam sebelum sesi dimulai." },
              { key: "promo" as const, label: "Informasi produk & promo", desc: "Kabar fitur baru dan penawaran paket." },
            ].map((n) => (
              <div key={n.key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch
                  checked={notif[n.key]}
                  onCheckedChange={(v) => {
                    setNotif((s) => ({ ...s, [n.key]: v }));
                    toast.success(v ? "Notifikasi diaktifkan" : "Notifikasi dimatikan");
                  }}
                  aria-label={n.label}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg">Keamanan</h2>
          <form onSubmit={savePassword} className="mt-4 space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="current">Kata sandi saat ini</Label>
              <Input
                id="current"
                type="password"
                value={password.current}
                onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
              />
              {errors["current"] && <p className="text-xs text-destructive">{errors["current"]}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="next">Kata sandi baru</Label>
                <Input
                  id="next"
                  type="password"
                  value={password.next}
                  onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))}
                />
                {errors["next"] && <p className="text-xs text-destructive">{errors["next"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Ulangi kata sandi baru</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                />
                {errors["confirm"] && <p className="text-xs text-destructive">{errors["confirm"]}</p>}
              </div>
            </div>
            <Button type="submit" variant="outline">
              <KeyRound className="mr-2 size-4" /> Perbarui kata sandi
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg">Langganan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Paket aktif Anda saat ini: <span className="font-medium text-foreground">{user?.plan ?? "Dasar"}</span>.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/harga">Lihat & ubah paket</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 text-lg text-destructive">
            <AlertTriangle className="size-4.5" /> Zona berbahaya
          </h2>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground">
            Menghapus akun akan menghilangkan seluruh dokumen, draf, dan riwayat konsultasi Anda secara permanen.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-4">
                Hapus akun
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus akun secara permanen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Semua dokumen dan jadwal konsultasi akan hilang. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount}>Ya, hapus akun saya</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
