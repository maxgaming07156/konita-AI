"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/utils";

interface LanguageSelectProps {
  value: string;
  onChange: (code: string) => void;
  excludeAuto?: boolean;
  label: string;
  className?: string;
}

export function LanguageSelect({ value, onChange, excludeAuto = false, label, className }: LanguageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = excludeAuto ? LANGUAGES.filter((l) => l.code !== "auto") : LANGUAGES;
  const selected = options.find((l) => l.code === value) ?? options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-base-800/60 px-4 text-sm text-mist-100 transition hover:border-emerald-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      >
        <span className="flex items-center gap-2 truncate">
          <span aria-hidden="true">{selected?.flag}</span>
          <span className="truncate font-medium">{selected?.name}</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-mist-400 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-base-900/95 p-1.5 shadow-glow backdrop-blur-2xl"
          >
            {options.map((lang) => (
              <li key={lang.code} role="option" aria-selected={lang.code === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-emerald-500/10",
                    lang.code === value ? "text-emerald-300" : "text-mist-200"
                  )}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span aria-hidden="true">{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                    <span className="truncate text-xs text-mist-500">{lang.nativeName}</span>
                  </span>
                  {lang.code === value && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
