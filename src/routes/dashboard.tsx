import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { FileText, LayoutDashboard, LogIn, Receipt, Settings, UserRound } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InlineLoader } from "@/components/shared/ui-blocks";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const menu = [
  { to: "/dashboard", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/dokumen", label: "Dokumen saya", icon: FileText, exact: false },
  { to: "/dashboard/pembayaran", label: "Pembayaran", icon: Receipt, exact: false },
  { to: "/dashboard/profil", label: "Profil", icon: UserRound, exact: false },
  { to: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings, exact: false },
] as const;

function DashboardLayout() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/masuk" });
  }, [ready, user, navigate]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <InlineLoader label="Memuat dasbor Anda" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <LogIn className="size-5" />
            </span>
            <h1 className="text-xl">Masuk untuk membuka dasbor</h1>
            <p className="text-sm text-muted-foreground">
              Dasbor memuat dokumen dan jadwal konsultasi milik akun Anda.
            </p>
            <Button asChild className="mt-2">
              <Link to="/masuk">Masuk ke akun</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">Paket {user.plan}</p>
                </div>
              </div>
              <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {menu.map((m) => (
                  <Link
                    key={m.to}
                    to={m.to}
                    activeOptions={{ exact: m.exact }}
                    className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    activeProps={{ className: "bg-accent text-foreground font-medium" }}
                  >
                    <m.icon className="size-4" /> {m.label}
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
