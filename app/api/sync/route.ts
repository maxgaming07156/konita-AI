import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { TutorBreakdown } from "@/types";
import { DEFAULT_PREFERENCES, DEFAULT_STATS, type ExportBundle } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // The incoming bundle from the client's localStorage
    const bundle = (await request.json()) as Partial<ExportBundle>;

    // 1. Merge Translations
    if (Array.isArray(bundle.recent) && bundle.recent.length > 0) {
      // Upsert translations using timestamp as a unique pseudo-identifier for merging 
      // since the client generates CUIDs that might clash or duplicate if same translation happens.
      // Actually, standard `id` is fine since they are CUIDs. We'll use `id` but avoid inserting duplicates.
      for (const rec of bundle.recent) {
        await prisma.translationRecord.upsert({
          where: { id: rec.id },
          update: {}, // Do nothing if it exists
          create: {
            id: rec.id,
            userId,
            sourceText: rec.sourceText,
            translatedText: rec.translatedText,
            sourceLang: rec.sourceLang,
            targetLang: rec.targetLang,
            timestamp: BigInt(rec.timestamp),
            tutorData: rec.tutor ? JSON.parse(JSON.stringify(rec.tutor)) : null,
          },
        });
      }
    }

    // 2. Merge Favorites
    if (Array.isArray(bundle.favorites) && bundle.favorites.length > 0) {
      for (const fav of bundle.favorites) {
        // We ensure uniqueness on [userId, word, targetLang]
        await prisma.favoriteWord.upsert({
          where: {
            userId_word_targetLang: {
              userId,
              word: fav.word,
              targetLang: fav.targetLang,
            },
          },
          update: {
            // Keep the best SRS box
            srsBox: fav.srsBox && fav.srsBox > 0 ? fav.srsBox : undefined,
            srsDueAt: fav.srsDueAt ? BigInt(fav.srsDueAt) : undefined,
          },
          create: {
            userId,
            word: fav.word,
            translation: fav.translation,
            sourceLang: fav.sourceLang,
            targetLang: fav.targetLang,
            meaning: fav.meaning,
            timestamp: BigInt(fav.timestamp),
            srsBox: fav.srsBox ?? 0,
            srsDueAt: fav.srsDueAt ? BigInt(fav.srsDueAt) : null,
          },
        });
      }
    }

    // 3. Merge Preferences
    if (bundle.preferences) {
      await prisma.userPreference.upsert({
        where: { userId },
        update: {
          defaultSourceLang: bundle.preferences.defaultSourceLang,
          defaultTargetLang: bundle.preferences.defaultTargetLang,
          autoSpeak: bundle.preferences.autoSpeak,
          voiceRate: bundle.preferences.voiceRate,
        },
        create: {
          userId,
          defaultSourceLang: bundle.preferences.defaultSourceLang,
          defaultTargetLang: bundle.preferences.defaultTargetLang,
          autoSpeak: bundle.preferences.autoSpeak,
          voiceRate: bundle.preferences.voiceRate,
        },
      });
    }

    // 4. Merge Stats
    if (bundle.stats) {
      const dbStats = await prisma.stats.findUnique({ where: { userId } });
      const languagesSet = new Set([...(dbStats?.languagesPracticed || []), ...(bundle.stats.languagesPracticed || [])]);

      await prisma.stats.upsert({
        where: { userId },
        update: {
          totalTranslations: Math.max(dbStats?.totalTranslations || 0, bundle.stats.totalTranslations || 0),
          totalConversationMessages: Math.max(dbStats?.totalConversationMessages || 0, bundle.stats.totalConversationMessages || 0),
          longestStreak: Math.max(dbStats?.longestStreak || 0, bundle.stats.longestStreak || 0),
          languagesPracticed: Array.from(languagesSet),
        },
        create: {
          userId,
          totalTranslations: bundle.stats.totalTranslations || 0,
          totalConversationMessages: bundle.stats.totalConversationMessages || 0,
          longestStreak: bundle.stats.longestStreak || 0,
          languagesPracticed: Array.from(languagesSet),
        },
      });
    }

    // 5. Merge Activity
    if (Array.isArray(bundle.activity) && bundle.activity.length > 0) {
      for (const date of bundle.activity) {
        await prisma.activity.upsert({
          where: { userId_date: { userId, date } },
          update: {},
          create: { userId, date },
        });
      }
    }

    // --- FETCH CLOUD STATE TO RETURN ---

    const dbTranslations = await prisma.translationRecord.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 100, // Reasonable limit for recent history
    });

    const dbFavorites = await prisma.favoriteWord.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    const dbPreferences = await prisma.userPreference.findUnique({ where: { userId } });
    const dbStats = await prisma.stats.findUnique({ where: { userId } });
    const dbActivity = await prisma.activity.findMany({ where: { userId } });

    const serverBundle: ExportBundle = {
      version: 1,
      exportedAt: Date.now(),
      recent: dbTranslations.map((r) => ({
        id: r.id,
        sourceText: r.sourceText,
        translatedText: r.translatedText,
        sourceLang: r.sourceLang,
        targetLang: r.targetLang,
        timestamp: Number(r.timestamp),
        tutor: r.tutorData as unknown as TutorBreakdown,
      })),
      favorites: dbFavorites.map((f) => ({
        id: f.id,
        word: f.word,
        translation: f.translation,
        sourceLang: f.sourceLang,
        targetLang: f.targetLang,
        meaning: f.meaning || undefined,
        timestamp: Number(f.timestamp),
        srsBox: f.srsBox,
        srsDueAt: f.srsDueAt ? Number(f.srsDueAt) : undefined,
      })),
      preferences: dbPreferences
        ? {
            defaultSourceLang: dbPreferences.defaultSourceLang,
            defaultTargetLang: dbPreferences.defaultTargetLang,
            autoSpeak: dbPreferences.autoSpeak,
            voiceRate: dbPreferences.voiceRate,
          }
        : DEFAULT_PREFERENCES,
      stats: dbStats
        ? {
            totalTranslations: dbStats.totalTranslations,
            totalConversationMessages: dbStats.totalConversationMessages,
            languagesPracticed: dbStats.languagesPracticed,
            longestStreak: dbStats.longestStreak,
          }
        : DEFAULT_STATS,
      activity: dbActivity.map((a) => a.date),
    };

    return NextResponse.json({ data: serverBundle }, { status: 200 });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Failed to sync with cloud" }, { status: 500 });
  }
}
