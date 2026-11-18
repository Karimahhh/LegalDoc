import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/profil")({
  head: () => ({
    meta: [
      { title: "Profil Pengguna — Dasbor LegalDoc" },
      {
        name: "description",
        content: "Perbarui nama, email, nomor telepon, dan data usaha yang dipakai otomatis pada dokumen Anda.",
      },
      { property: "og:title", content: "Profil Pengguna — LegalDoc" },
      { property: "og:description", content: "Data profil dipakai untuk mengisi dokumen secara otomatis." },
    ],
  }),
  component: Profil,
});

function Profil() {
  const { user, update } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    company: user?.company ?? "",
    address: "Menara Sudirman Lantai 12, Jakarta Selatan",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next["name"] = "Nama lengkap minimal 3 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next["email"] = "Masukkan alamat email yang valid.";
    if (form.phone && !/^0\d{8,12}$/.test(form.phone.replace(/[\s-]/g, "")))
      next["phone"] = "Nomor telepon diawali 0 dan terdiri dari 9–13 angka.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Periksa kembali data profil Anda.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      update({ name: form.name.trim(), email: form.email, phone: form.phone, company: form.company });
      setSaving(false);
      toast.success("Profil diperbarui");
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Profil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Data ini dipakai untuk mengisi identitas pihak pada dokumen yang Anda susun.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                {(form.name || "P").slice(0, 1).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold">{form.name || "Pengguna LegalDoc"}</p>
                <p className="text-xs text-muted-foreground">Paket {user?.plan ?? "Dasar"}</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama lengkap</Label>
                <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
                {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor telepon</Label>
                <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="081234567890" />
                {errors["phone"] && <p className="text-xs text-destructive">{errors["phone"]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Nama usaha (opsional)</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="PT Cipta Karya Nusantara"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat surat-menyurat</Label>
              <Textarea id="address" rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} />
            </div>

            <Button type="submit" disabled={saving}>
              <Save className="mr-2 size-4" />
              {saving ? "Menyimpan…" : "Simpan perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
