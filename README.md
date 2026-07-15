# Konita AI

**Translate &middot; Speak &middot; Learn**

Konita AI is an AI-powered language learning platform that combines translation, an AI tutor, speech
recognition, text-to-speech, and conversation practice in one app. Every translation includes a full
breakdown: grammar explanation, vocabulary, pronunciation guide, an example sentence, common mistakes,
and learning tips.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **Framer Motion** for animation
- **Lucide React** for icons
- **Google Gemini API** for translation and tutoring
- **Web Speech API** (browser-native) for voice input and text-to-speech
- No database, no accounts &mdash; recent translations, favorite words, and preferences live in
  `localStorage`.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Gemini API key

Get a free key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), then create
a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

This key is only ever read on the server (inside `app/api/*` routes) and is never sent to the browser.

**If you see an error like `429 Too Many Requests ... limit: 0`:** this almost always means the Gemini
model Konita AI is pointed at has been deprecated or retired by Google (this happened to
`gemini-2.0-flash` on June 1, 2026), not that you've actually hit a rate limit. Google periodically
retires older free-tier models. Fix it without touching any code:

1. Check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for the
   current free-tier model lineup.
2. Add `GEMINI_MODEL=<model-name>` to `.env.local` (e.g. `GEMINI_MODEL=gemini-2.5-flash-lite` if
   `gemini-2.5-flash` is ever retired too).

Konita AI ships pointed at `gemini-2.5-flash` by default and uses Google's current `@google/genai` SDK.

### 3. Connect the Contact page to your inbox (optional but recommended)

The Contact page form sends messages to **knootix@gmail.com** using Gmail's SMTP server via
[Nodemailer](https://nodemailer.com). To enable it:

1. Turn on **2-Step Verification** on the Google account you want to send from (Google Account →
   Security → 2-Step Verification).
2. Generate an **App Password** at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   Choose "Mail" as the app — Google will give you a 16-character password.
3. Add both values to `.env.local`:

```
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
```

`EMAIL_USER` is the account that *sends* the message (it can be `knootix@gmail.com` itself, or any
other Gmail address you control) — every message it sends is delivered to `knootix@gmail.com`, with
the visitor's email set as "Reply-To" so you can reply directly from your inbox.

Until these two variables are set, the contact form will show a clear error instead of failing silently.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Translation + AI tutor** — grammar, vocabulary, pronunciation, examples, common mistakes, and tips
  for every translation.
- **Voice input & text-to-speech** — powered by the browser's Web Speech API, with an adjustable voice
  speed and an optional auto-speak setting (gear icon on the AI Tutor page).
- **Conversation practice** — chat with an AI partner that replies naturally and corrects mistakes gently.
- **Daily streak & progress dashboard** (`/progress`) — tracks a daily streak, total translations,
  conversation replies, and languages practiced, all computed from local activity.
- **Flashcard review** (`/flashcards`) — a simple spaced-repetition system over your favorite words:
  correct answers push a word further out; missed answers bring it back the next day.
- **Phrase of the day** — a fresh, useful phrase on the home page each day, in your preferred target
  language, cached locally so it only calls the AI once per day.
- **Data backup** — export everything (translations, favorites, stats, preferences) as a JSON file from
  the Progress page, and import it back on any device.

## Project structure

```
app/
  page.tsx                 Home page (includes Phrase of the Day)
  features/page.tsx        Features page
  about/page.tsx           About page
  contact/page.tsx         Contact page
  progress/                Streak, stats, and data backup dashboard
  flashcards/              Spaced-repetition flashcard review
  tutor/                   AI Tutor page (translation + conversation)
  api/
    translate/route.ts     Gemini-powered translation + tutor breakdown
    conversation/route.ts  Gemini-powered conversation practice
    contact/route.ts       Sends Contact page messages to your inbox via Gmail SMTP
    word-of-day/route.ts   Generates the home page's daily phrase
  layout.tsx, globals.css  Root layout, fonts, theme

components/
  ui/                      Reusable primitives (Button, Card, LanguageSelect, ...)
  layout/                  Navbar, Footer, background
  home/                    Landing page sections
  tutor/                   Translator panel, tutor breakdown, conversation mode

hooks/                     useTranslate, useSpeechRecognition, useSpeechSynthesis,
                            useTranslationHistory, useToast

lib/                       Gemini client, language list, localStorage helpers, utils

types/                     Shared TypeScript types
```

## Notes

- Voice input and text-to-speech rely on the browser's Web Speech API, which is best supported in
  Chrome and Edge. Konita AI detects support and disables those controls gracefully elsewhere.
- The app is fully responsive and keyboard accessible, with visible focus states and ARIA labels
  throughout.
- Ready to deploy on [Vercel](https://vercel.com) &mdash; just add `GEMINI_API_KEY` as an environment
  variable in your project settings.
