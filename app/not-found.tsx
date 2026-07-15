"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <Container className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
          <Compass className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-medium text-mist-100">Page not found</h1>
        <p className="mt-3 max-w-sm text-mist-500">
          This page doesn&apos;t exist, or it moved somewhere we can&apos;t translate.
        </p>
        <Link href="/" className="mt-8">
          <Button size="lg">Back to home</Button>
        </Link>
      </Container>
    </section>
  );
}
