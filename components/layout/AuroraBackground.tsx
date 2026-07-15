export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-base-950" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute left-1/2 top-[-10%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-600/20 blur-[140px]" />
      <div className="absolute right-[-10%] top-[30%] h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-[130px]" />
      <div className="absolute left-[-10%] bottom-[5%] h-[380px] w-[380px] rounded-full bg-emerald-700/15 blur-[130px]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
