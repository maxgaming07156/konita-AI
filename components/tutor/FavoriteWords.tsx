"use client";

import Link from "next/link";
import { Layers, Star, X } from "lucide-react";
import type { FavoriteWord } from "@/types";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/Primitives";
import { getLanguageByCode } from "@/lib/languages";

interface FavoriteWordsProps {
  items: FavoriteWord[];
  onDelete: (id: string) => void;
}

export function FavoriteWords({ items, onDelete }: FavoriteWordsProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <h2 className="font-display text-base font-medium text-mist-100">Favorite words</h2>
        </div>
        {items.length > 0 && (
          <Link
            href="/flashcards"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/10"
          >
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            Review
          </Link>
        )}
      </div>

      <div className="mt-4 flex max-h-[320px] flex-col gap-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <EmptyState
            icon={<Star className="h-5 w-5" aria-hidden="true" />}
            title="No favorites yet"
            description="Tap the star on a translation to save it here."
          />
        ) : (
          items.map((item) => {
            const target = getLanguageByCode(item.targetLang);
            return (
              <div
                key={item.id}
                className="group relative flex items-start justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 pr-9 transition hover:border-emerald-400/25"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-mist-100">{item.word}</p>
                  <p className="mt-0.5 truncate text-xs text-mist-500">
                    {target.flag} {item.translation}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  aria-label={`Remove ${item.word} from favorites`}
                  className="absolute right-2.5 top-3.5 rounded-lg p-1 text-mist-600 opacity-0 transition hover:bg-white/10 hover:text-red-300 group-hover:opacity-100"
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
