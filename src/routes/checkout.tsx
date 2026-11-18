import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, CreditCard, Landmark, Loader2, QrCode, ShieldCheck, Smartphone, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { formatIDR, getConsultant, getDocument, plans } from "@/lib/data";
import { addTransaction, priceBreakdown, type ItemType } from "@/lib/payment-store";

interface CheckoutSearch {
  tipe: ItemType;
  ref: string;
  tanggal?: string;
  jam?: string;
  metode?: string;
}


const asString = (v: unknown) => (typeof v === "string" ? v : "");

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => {
    const tipe = asString(search["tipe"]);
    return {
      tipe: (tipe === "dokumen" || tipe === "paket" || tipe === "konsultasi" ? tipe : "dokumen") as ItemType,
      ref: asString(search["ref"]),
      tanggal: asString(search["tanggal"]),
      jam: asString(search["jam"]),
      metode: asString(search["metode"]),
    };
  },
  head: () => ({
    meta: [
      { title: "Pembayaran Aman — LegalDoc" },
      {
        name: "description",
        content:
          "Selesaikan pembayaran dokumen, paket langganan, atau sesi konsultasi LegalDoc dengan kartu, virtual account, QRIS, atau e-wallet.",
      },
      { property: "og:title", content: "Pembayaran — LegalDoc" },
      { property: "og:description", content: "Ringkasan pesanan, pilihan metode pembayaran, dan konfirmasi instan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

const methods = [
  { id: "Kartu Kredit/Debit", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
  { id: "Virtual Account BCA", icon: Landmark, desc: "Transfer dari mobile atau internet banking" },
  { id: "QRIS", icon: QrCode, desc: "Pindai dari aplikasi bank atau e-wallet apa pun" },
  { id: "E-Wallet", icon: Smartphone, desc: "GoPay, OVO, DANA, ShopeePay" },
] as const;

function useOrder(search: CheckoutSearch) {
  return useMemo(() => {
    if (search.tipe === "paket") {
      const plan = plans.find((p) => p.id === search.ref);
      if (!plan) return null;
      return {
        title: `Paket ${plan.name}`,
        subtitle: `Langganan per ${plan.period} · ${plan.tagline}`,
        amount: plan.price,
        badge: "Langganan",
        backTo: "/harga" as const,
        backLabel: "Kembali ke daftar harga",
      };
    }
    if (search.tipe === "konsultasi") {
      const c = getConsultant(search.ref);
      if (!c) return null;
      const detail = [search.metode, search.tanggal, search.jam ? `pukul ${search.jam}` : ""].filter(Boolean).join(" · ");
      return {
        title: `Sesi konsultasi dengan ${c.name}`,
        subtitle: detail || "Sesi 45 menit bersama konsultan hukum",
        amount: c.pricePerSession,
        badge: "Konsultasi",
        backTo: "/konsultasi" as const,
        backLabel: "Kembali ke daftar konsultan",
      };
    }
    const doc = getDocument(search.ref);
    if (!doc) return null;
    return {
      title: doc.title,
      subtitle: `${doc.pages} halaman · unduhan PDF dan DOCX tanpa tanda pratinjau`,
      amount: doc.price,
      badge: "Dokumen",
      backTo: "/dokumen" as const,
      backLabel: "Kembali ke katalog dokumen",
    };
  }, [search]);
}

function Checkout() {
  const search = Route.useSearch();
  const order = useOrder(search);
  const navigate = useNavigate();
  const { user, update } = useAuth();

  const [method, setMethod] = useState<string>(methods[0].id);
  const [form, setForm] = useState({
    nama: user?.name ?? "",
    email: user?.email ?? "",
    kartu: "",
    berlaku: "",
    cvv: "",
  });
  const [voucher, setVoucher] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const amount = order?.amount ?? 0;
  const bill = priceBreakdown(amount, appliedVoucher);

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <h1 className="text-xl">Pesanan tidak ditemukan</h1>
            <p className="text-sm text-muted-foreground">
              Item yang ingin dibayar sudah tidak tersedia. Pilih kembali dari katalog dokumen atau daftar harga.
            </p>
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline">
                <Link to="/dokumen">Katalog dokumen</Link>
              </Button>
              <Button asChild>
                <Link to="/harga">Lihat paket</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const applyVoucher = () => {
    const { rate } = priceBreakdown(amount, voucher);
    if (rate === 0) {
      setAppliedVoucher("");
      toast.error("Kode voucher tidak dikenali", { description: "Coba kode LEGAL10 untuk potongan 10%." });
      return;
    }
    setAppliedVoucher(voucher.trim().toUpperCase());
    toast.success(`Voucher diterapkan · potongan ${Math.round(rate * 100)}%`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.nama.trim().length < 3) next["nama"] = "Nama penagihan minimal 3 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next["email"] = "Format email belum benar.";
    if (method === "Kartu Kredit/Debit") {
      if (form.kartu.replace(/\D/g, "").length < 16) next["kartu"] = "Nomor kartu harus 16 angka.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.berlaku)) next["berlaku"] = "Gunakan format MM/YY.";
      if (form.cvv.replace(/\D/g, "").length < 3) next["cvv"] = "CVV terdiri dari 3 angka.";
    }
    if (!agree) next["agree"] = "Setujui ketentuan layanan sebelum membayar.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Periksa kembali data pembayaran Anda.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const trx = addTransaction({
        type: search.tipe,
        refId: search.ref,
        title: order.title,
        subtitle: order.subtitle,
        amount,
        discount: bill.discount,
        tax: bill.tax,
        total: bill.total,
        method,
        buyerName: form.nama.trim(),
        buyerEmail: form.email.trim(),
        note: appliedVoucher ? `Voucher ${appliedVoucher}` : "",
      });
      if (search.tipe === "paket" && user) {
        const plan = plans.find((p) => p.id === search.ref);
        if (plan) update({ plan: plan.name });
      }
      setLoading(false);
      toast.success("Pembayaran berhasil", { description: `Nomor transaksi ${trx.id}.` });
      navigate({ to: "/pembayaran/$id", params: { id: trx.id } });
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        to={order.backTo}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {order.backLabel}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl">Pembayaran</h1>
        <Badge variant="secondary">{order.badge}</Badge>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <ShieldCheck className="size-4 text-gold" /> Transaksi pada versi demo ini disimulasikan, tidak ada uang yang
        berpindah.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={submit} className="space-y-6" noValidate>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg">Data penagihan</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama lengkap</Label>
                  <Input
                    id="nama"
                    value={form.nama}
                    onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                    placeholder="Nama sesuai kartu atau rekening"
                  />
                  {errors["nama"] && <p className="text-xs text-destructive">{errors["nama"]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email penerima invoice</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="nama@perusahaan.co.id"
                  />
                  {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg">Metode pembayaran</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm ${
                      method === m.id ? "border-primary bg-accent" : "border-border"
                    }`}
                  >
                    <m.icon className={`mt-0.5 size-5 shrink-0 ${method === m.id ? "text-gold" : "text-muted-foreground"}`} />
                    <span>
                      <span className="block text-sm font-medium">{m.id}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{m.desc}</span>
                    </span>
                  </button>
                ))}
              </div>

              {method === "Kartu Kredit/Debit" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_auto]">
                  <div className="space-y-2">
                    <Label htmlFor="kartu">Nomor kartu</Label>
                    <Input
                      id="kartu"
                      inputMode="numeric"
                      value={form.kartu}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          kartu: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16)
                            .replace(/(.{4})/g, "$1 ")
                            .trim(),
                        }))
                      }
                      placeholder="4321 8765 1234 5678"
                    />
                    {errors["kartu"] && <p className="text-xs text-destructive">{errors["kartu"]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="berlaku">Berlaku</Label>
                    <Input
                      id="berlaku"
                      className="sm:w-24"
                      value={form.berlaku}
                      onChange={(e) => {
                        const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setForm((f) => ({ ...f, berlaku: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                      }}
                      placeholder="09/29"
                    />
                    {errors["berlaku"] && <p className="text-xs text-destructive">{errors["berlaku"]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      className="sm:w-20"
                      value={form.cvv}
                      onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                      placeholder="123"
                    />
                    {errors["cvv"] && <p className="text-xs text-destructive">{errors["cvv"]}</p>}
                  </div>
                </div>
              )}

              {method === "Virtual Account BCA" && (
                <p className="mt-5 rounded-md bg-muted/60 p-4 text-sm text-muted-foreground">
                  Nomor virtual account akan ditampilkan setelah pesanan dikonfirmasi, dan berlaku 24 jam.
                </p>
              )}
              {method === "QRIS" && (
                <p className="mt-5 rounded-md bg-muted/60 p-4 text-sm text-muted-foreground">
                  Kode QR muncul di halaman konfirmasi. Pindai dengan aplikasi bank atau e-wallet Anda.
                </p>
              )}
              {method === "E-Wallet" && (
                <p className="mt-5 rounded-md bg-muted/60 p-4 text-sm text-muted-foreground">
                  Anda akan diarahkan ke aplikasi e-wallet untuk menyetujui pembayaran.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg">Kode voucher</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Input
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value.toUpperCase())}
                  placeholder="Contoh: LEGAL10"
                  className="sm:max-w-xs"
                  aria-label="Kode voucher"
                />
                <Button type="button" variant="outline" onClick={applyVoucher} disabled={voucher.trim().length === 0}>
                  <Tag className="mr-2 size-4" /> Terapkan
                </Button>
              </div>
              {appliedVoucher && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
                  <BadgeCheck className="size-4" /> Voucher {appliedVoucher} aktif untuk pesanan ini.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex items-start gap-3">
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
            <div>
              <Label htmlFor="agree" className="text-sm font-normal">
                Saya menyetujui ketentuan layanan dan memahami{" "}
                <Link to="/disclaimer" className="underline underline-offset-4">
                  batasan layanan LegalDoc
                </Link>
                .
              </Label>
              {errors["agree"] && <p className="mt-1 text-xs text-destructive">{errors["agree"]}</p>}
            </div>
          </div>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="border-gold/40">
            <CardContent className="p-6">
              <h2 className="text-lg">Ringkasan pesanan</h2>
              <div className="mt-4">
                <p className="text-sm font-medium">{order.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{order.subtitle}</p>
              </div>
              <Separator className="my-5" />
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatIDR(amount)}</dd>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <dt>Potongan voucher</dt>
                    <dd>-{formatIDR(bill.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">PPN 11%</dt>
                  <dd>{formatIDR(bill.tax)}</dd>
                </div>
              </dl>
              <Separator className="my-5" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total bayar</span>
                <span className="font-display text-2xl">{formatIDR(bill.total)}</span>
              </div>
              <Button onClick={submit} disabled={loading} className="mt-6 w-full">
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ShieldCheck className="mr-2 size-4" />}
                {loading ? "Memproses pembayaran…" : `Bayar ${formatIDR(bill.total)}`}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Invoice dikirim ke email Anda setelah pembayaran dikonfirmasi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
