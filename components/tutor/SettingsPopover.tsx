"use client";

import { useEffect, useRef, useState } from "react";
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsPopoverProps {
  autoSpeak: boolean;
  voiceRate: number;
  onAutoSpeakChange: (value: boolean) => void;
  onVoiceRateChange: (value: number) => void;
}

const RATE_OPTIONS = [0.75, 1, 1.25, 1.5];

export function SettingsPopover({
  autoSpeak,
  voiceRate,
  onAutoSpeakChange,
  onVoiceRateChange,
}: SettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Voice settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-base-800/60 text-mist-300 transition hover:border-emerald-400/40 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      >
        <Settings2 className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-white/10 bg-base-900/95 p-4 shadow-glow backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="auto-speak-toggle" className="text-sm font-medium text-mist-200">
              Auto-speak translations
            </label>
            <button
              id="auto-speak-toggle"
              type="button"
              role="switch"
              aria-checked={autoSpeak}
              onClick={() => onAutoSpeakChange(!autoSpeak)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
                autoSpeak ? "bg-emerald-500" : "bg-white/10"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                  autoSpeak ? "translate-x-[22px]" : "translate-x-0.5"
                )}
              />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-mist-200">Voice speed</p>
            <div className="mt-2 flex gap-1.5">
              {RATE_OPTIONS.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onVoiceRateChange(rate)}
                  aria-pressed={voiceRate === rate}
                  className={cn(
                    "flex-1 rounded-xl border px-2 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
                    voiceRate === rate
                      ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                      : "border-white/10 text-mist-400 hover:border-white/20"
                  )}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
