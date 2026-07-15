"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Logo } from "./Logo";
import { StreakBadge } from "./StreakBadge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/progress", label: "Progress" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "border-b border-white/[0.06] bg-base-950/80 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-emerald-300" : "text-mist-400 hover:text-mist-100"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-emerald-500/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          <StreakBadge />
          {status === "loading" ? null : session ? (
            <>
              <Link href="/tutor">
                <Button size="sm">Start Learning</Button>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-base-800/80 px-3 py-1.5 text-sm text-mist-300 transition-all hover:border-red-500/30 hover:text-red-300"
                title="Sign out"
              >
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="max-w-[100px] truncate text-xs font-medium">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google", { callbackUrl: "/tutor" })}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-base-800/80 px-4 py-2 text-sm font-medium text-mist-200 transition-all hover:border-emerald-500/30 hover:text-emerald-300"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </button>
              <Link href="/tutor">
                <Button size="sm">Start Learning</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-mist-200 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/[0.06] bg-base-950/95 backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              <div className="mb-1 flex justify-start">
                <StreakBadge />
              </div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium",
                    pathname === link.href ? "bg-emerald-500/10 text-emerald-300" : "text-mist-300"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href="/tutor" className="mt-2">
                    <Button className="w-full">Start Learning</Button>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-medium text-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/tutor" })}
                    className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-base-800/80 py-3 text-sm font-medium text-mist-200"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign in with Google
                  </button>
                  <Link href="/tutor" className="mt-2">
                    <Button className="w-full">Start Learning</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
