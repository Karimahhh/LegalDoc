import { cn } from "@/lib/utils";

export function A4Preview({
  title,
  paragraphs,
  signatures,
  watermark = "PRATINJAU",
  className,
}: {
  title: string;
  paragraphs: string[];
  signatures?: [string, string];
  watermark?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[560px] overflow-hidden rounded-sm bg-card shadow-[var(--shadow-elegant)] ring-1 ring-border",
        className,
      )}
      style={{ aspectRatio: "1 / 1.414" }}
    >
      <div className="absolute inset-0 overflow-y-auto px-[9%] py-[8%]">
        {watermark && (
          <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-30 font-display text-[46px] tracking-widest text-foreground/6 select-none">
            {watermark}
          </span>
        )}
        <div className="relative">
          <div className="mb-5 border-b border-border pb-3 text-center">
            <p className="text-[8px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">LegalDoc</p>
            <h3 className="mt-2 font-display text-[13px] leading-snug tracking-wide uppercase">{title}</h3>
          </div>
          <div className="space-y-2.5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[8.5px] leading-[1.75] whitespace-pre-line text-foreground/85"
                style={{ textAlign: "justify" }}
              >
                {p}
              </p>
            ))}
          </div>
          {signatures && (
            <div className="mt-8 grid grid-cols-2 gap-6 text-center text-[8px]">
              <div>
                <p className="text-muted-foreground">PIHAK PERTAMA</p>
                <div className="mt-10 border-t border-foreground/40 pt-1 font-medium">{signatures[0]}</div>
              </div>
              <div>
                <p className="text-muted-foreground">PIHAK KEDUA</p>
                <div className="mt-10 border-t border-foreground/40 pt-1 font-medium">{signatures[1]}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
