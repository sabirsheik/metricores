export default function BrandLogo({ showText = true }: { showText?: boolean }) {
  return (
    <span className="inline-flex items-center space-x-3">
      <span className="inline-flex w-8 h-8 rounded-xl bg-zinc-950 items-center justify-center text-white text-sm font-mono font-bold tracking-tighter shadow-sm">
        M
      </span>
      {showText && (
        <span className="font-semibold tracking-tight text-zinc-900 text-sm md:text-base">
          Metricores
        </span>
      )}
    </span>
  );
}
