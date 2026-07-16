import Link from "next/link";
import { cn } from "@/lib/utils";

function InfinityMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="konita-grad" x1="0" y1="0" x2="120" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#34d399" />
          <stop offset="50%"  stopColor="#10b981" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
      </defs>
      {/*
        Lemniscate / infinity path — two loops crossing at centre (60, 30).
        Left loop: curves counter-clockwise around (28, 30).
        Right loop: curves clockwise around (92, 30).
      */}
      <path
        d="
          M 60 30
          C 60 14, 12 4,  6  20
          C 0  36, 12 56, 28 56
          C 44 56, 60 42, 60 30
          C 60 18, 76  4, 92  4
          C 108 4, 120 24, 114 40
          C 108 56, 60 46, 60 30
        "
        stroke="url(#konita-grad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 focus-visible:outline-none", className)}
      aria-label="Konita AI home"
    >
      <span className="relative flex h-8 w-14 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <InfinityMark className="h-full w-full" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-mist-100">
        Konita <span className="text-emerald-400">AI</span>
      </span>
    </Link>
  );
}
