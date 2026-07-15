import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Sparkles } from "lucide-react";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}

interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
}

export function Section({ className, eyebrow, title, description, children, ...props }: SectionProps) {
  return (
    <section className={cn("relative py-20 sm:py-28", className)} {...props}>
      <Container>
        {(eyebrow || title || description) && (
          <div className="mx-auto mb-14 max-w-2xl text-center">
            {eyebrow && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="font-display text-3xl font-medium leading-[1.15] text-mist-100 sm:text-4xl">
                {title}
              </h2>
            )}
            {description && <p className="mt-4 text-balance text-mist-400">{description}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-300",
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-white/[0.06]", className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
        {icon ?? <Sparkles className="h-5 w-5" aria-hidden="true" />}
      </div>
      <p className="font-medium text-mist-200">{title}</p>
      <p className="max-w-xs text-sm text-mist-500">{description}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-14 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-medium text-red-200">Something went wrong</p>
      <p className="max-w-xs text-sm text-red-300/70">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
        >
          Try again
        </button>
      )}
    </div>
  );
}
