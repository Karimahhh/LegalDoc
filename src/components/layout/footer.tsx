import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Scale } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-md bg-gold text-gold-foreground">
                <Scale className="size-4.5" />
              </span>
              <span className="font-display text-lg">
                Legal<span className="text-gold">Doc</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/65">
              Platform penyusunan dokumen hukum dan konsultasi legal untuk pelaku usaha serta individu di Indonesia.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Layanan</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/65">
              <li>
                <Link to="/dokumen" className="transition-colors hover:text-gold">
                  Katalog dokumen
                </Link>
              </li>
              <li>
                <Link to="/konsultasi" className="transition-colors hover:text-gold">
                  Konsultasi hukum
                </Link>
              </li>
              <li>
                <Link to="/harga" className="transition-colors hover:text-gold">
                  Paket harga
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="transition-colors hover:text-gold">
                  Dasbor pengguna
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Informasi</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/65">
              <li>
                <Link to="/edukasi" className="transition-colors hover:text-gold">
                  Pusat edukasi
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition-colors hover:text-gold">
                  Pertanyaan umum
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="transition-colors hover:text-gold">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">Kontak</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/65">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                Menara Sudirman Lantai 12, Jl. Jenderal Sudirman Kav. 60, Jakarta Selatan
              </li>
              <li className="flex gap-2.5">
                <Phone className="size-4 shrink-0 text-gold" />
                (021) 5089 7412
              </li>
              <li className="flex gap-2.5">
                <Mail className="size-4 shrink-0 text-gold" />
                bantuan@legaldoc.id
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LegalDoc. Seluruh hak dilindungi.</p>
          <p>
            Demo produk. Hasil dokumen bersifat simulasi dan bukan nasihat hukum. Baca{" "}
            <Link to="/disclaimer" className="underline transition-colors hover:text-gold">
              disclaimer
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
