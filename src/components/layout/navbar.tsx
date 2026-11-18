import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Scale, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { to: "/dokumen", label: "Dokumen" },
  { to: "/konsultasi", label: "Konsultasi" },
  { to: "/edukasi", label: "Edukasi" },
  { to: "/harga", label: "Harga" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Anda telah keluar dari akun");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform duration-200 group-hover:-rotate-6">
            <Scale className="size-4.5" />
          </span>
          <span className="font-display text-lg tracking-tight">
            Legal<span className="text-gold">Doc</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  {user.name.split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 size-4" /> Dasbor
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/dokumen" className="cursor-pointer">
                    Dokumen saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profil" className="cursor-pointer">
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 size-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/masuk">Masuk</Link>
              </Button>
              <Button asChild>
                <Link to="/daftar">Daftar gratis</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen((o) => !o)}
          className="flex size-10 items-center justify-center rounded-md border border-border lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {user ? (
                <>
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/dashboard">Dasbor saya</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/masuk">Masuk</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/daftar">Daftar gratis</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
