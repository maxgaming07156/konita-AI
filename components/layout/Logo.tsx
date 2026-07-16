import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 focus-visible:outline-none", className)}
      aria-label="Konita AI home"
    >
      <span className="relative flex h-10 w-14 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo.png"
          alt="Konita AI Logo"
          width={56}
          height={40}
          className="object-contain"
        />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-mist-100">
        Konita <span className="text-emerald-400">AI</span>
      </span>
    </Link>
  );
}
