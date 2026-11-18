import { Link } from "@tanstack/react-router";
import { FileWarning, Inbox, Loader2, Star } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-gold uppercase">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl text-balance-title text-3xl leading-tight sm:text-4xl md:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-gold uppercase">{eyebrow}</p>}
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: "/dokumen" | "/konsultasi" | "/edukasi";
  onAction?: () => void;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="size-5" />
        </span>
        <h3 className="text-lg">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        {actionLabel && actionTo && (
          <Button asChild className="mt-2">
            <Link to={actionTo}>{actionLabel}</Link>
          </Button>
        )}
        {actionLabel && !actionTo && onAction && (
          <Button className="mt-2" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <FileWarning className="size-5" />
        </span>
        <h3 className="text-lg">Data gagal dimuat</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button variant="outline" className="mt-2" onClick={onRetry}>
            Muat ulang
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-9 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function InlineLoader({ label = "Memuat data" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> {label}…
    </div>
  );
}

export function RatingStars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Penilaian ${value} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-3.5", i < Math.round(value) ? "fill-gold text-gold" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  );
}

export function StatBlock({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-[var(--shadow-card)]">
      <CardContent className="p-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        <p className="mt-2 font-display text-2xl">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}
