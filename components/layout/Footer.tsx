import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Primitives";

const PRODUCT_LINKS = [
  { href: "/tutor", label: "AI Tutor" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LANGUAGE_HIGHLIGHTS = ["Spanish", "French", "Urdu", "Japanese", "German", "Arabic"];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-base-950">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-500">
            Translate, speak, and learn with an AI tutor that explains every word, not just the ones you asked for.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-mist-200">Product</h3>
          <ul className="mt-4 space-y-3">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-mist-500 transition hover:text-emerald-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-mist-200">Languages</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {LANGUAGE_HIGHLIGHTS.map((lang) => (
              <li
                key={lang}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-mist-500"
              >
                {lang}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-mist-200">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-mist-500">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <a href="mailto:knootix@gmail.com" className="transition hover:text-emerald-300">
                knootix@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Instagram className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <a
                href="https://instagram.com/knootix"
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:text-emerald-300"
              >
                @knootix
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <a href="https://wa.me/923414680668" target="_blank" rel="noreferrer noopener" className="transition hover:text-emerald-300">
                +92 341 4680668
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>Lahore, Pakistan</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/[0.06] py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-mist-600 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Konita AI. All rights reserved.</p>
          <p>Translate &middot; Speak &middot; Learn</p>
        </Container>
      </div>
    </footer>
  );
}
