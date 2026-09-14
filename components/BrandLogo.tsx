export default function BrandLogo({ showText = true }: { showText?: boolean }) {
  return (
    <span className="brand-logo inline-flex items-center gap-3">
      <span className="brand-mark inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-zinc-950 text-white font-sans text-base font-extrabold leading-none tracking-normal antialiased shadow-sm">
        M
      </span>
      {showText && (
        <span className="font-sans text-base font-bold leading-none tracking-tight text-zinc-900 md:text-lg">
          Metricores
        </span>
      )}
    </span>
  );
}
