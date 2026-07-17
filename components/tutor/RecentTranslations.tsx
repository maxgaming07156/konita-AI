"use client";

import { History, X } from "lucide-react";
import type { TranslationRecord } from "@/types";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Primitives";
import { getLanguageByCode } from "@/lib/languages";
import { formatRelativeTime, truncate } from "@/lib/utils";

interface RecentTranslationsProps {
  items: TranslationRecord[];
  onSelect: (record: TranslationRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function RecentTranslations({ items, onSelect, onDelete, onClear }: RecentTranslationsProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <h2 className="font-display text-base font-medium text-mist-100">Recent</h2>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-xs font-medium text-mist-500 transition hover:bg-white/5 hover:dark:text-red-300 text-red-800"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4 flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <EmptyState
            icon={<History className="h-5 w-5" aria-hidden="true" />}
            title="No translations yet"
            description="Your recent translations will appear here."
          />
        ) : (
          items.map((item) => {
            const source = getLanguageByCode(item.sourceLang);
            const target = getLanguageByCode(item.targetLang);
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 pr-9 transition hover:border-emerald-400/25 hover:bg-white/[0.04]"
              >
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full text-left focus-visible:outline-none"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-mist-500">
                    <span>{source.flag}</span>
                    <span>{source.code === "auto" ? "Auto" : source.code}</span>
                    <span aria-hidden="true">&rarr;</span>
                    <span>{target.flag}</span>
                    <span>{target.code}</span>
                    <span className="ml-auto normal-case text-mist-600">{formatRelativeTime(item.timestamp)}</span>
                  </div>
                  <p className="mt-1.5 truncate text-sm text-mist-200">{truncate(item.sourceText, 60)}</p>
                  <p className="mt-0.5 truncate text-sm text-emerald-300/90">{truncate(item.translatedText, 60)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  aria-label="Remove from recent translations"
                  className="absolute right-2.5 top-3.5 rounded-lg p-1 text-mist-600 opacity-0 transition hover:bg-white/10 hover:dark:text-red-300 text-red-800 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
