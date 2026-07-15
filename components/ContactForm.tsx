"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FormState = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Something went wrong. Please try again.");
      }

      setIsSubmitted(true);
      setForm(INITIAL_STATE);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <Card className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="font-display text-xl font-medium text-mist-100">Message sent</h3>
        <p className="max-w-sm text-sm text-mist-500">
          Thanks for reaching out. We read every message and reply from knootix@gmail.com as soon as we can.
        </p>
        <Button variant="secondary" onClick={() => setIsSubmitted(false)}>
          Send another message
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-mist-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your full name"
              className="h-12 w-full rounded-2xl border border-white/10 bg-base-800/60 px-4 text-sm text-mist-100 placeholder:text-mist-500 transition focus:border-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-mist-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-2xl border border-white/10 bg-base-800/60 px-4 text-sm text-mist-100 placeholder:text-mist-500 transition focus:border-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-medium text-mist-300">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={form.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            placeholder="What's this about?"
            className="h-12 w-full rounded-2xl border border-white/10 bg-base-800/60 px-4 text-sm text-mist-100 placeholder:text-mist-500 transition focus:border-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-mist-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Tell us what's on your mind..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-base-800/60 px-4 py-3 text-sm text-mist-100 placeholder:text-mist-500 transition focus:border-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          />
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full sm:w-auto">
            {!isSubmitting && <Send className="h-4 w-4" aria-hidden="true" />}
            Send message
          </Button>
        </motion.div>
      </form>
    </Card>
  );
}
