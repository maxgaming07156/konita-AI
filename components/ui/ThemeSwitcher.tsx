"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder of the exact same size to avoid layout shift
    return <div className="h-10 w-10" />;
  }

  const isLight = resolvedTheme === "light";

  return (
    <button
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-mist-200 shadow-sm backdrop-blur-md transition-all hover:bg-white/10 hover:text-mist-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
    >
      <Sun
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          isLight ? "scale-100 opacity-100 rotate-0 text-amber-500" : "scale-0 opacity-0 -rotate-90"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          isLight ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0 text-mist-200"
        }`}
      />
    </button>
  );
}
