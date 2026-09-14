export default function BrandLogo({
  showText = true,
  className = '',
}: {
  showText?: boolean;
  className?: string;
}) {
  const defaultClasses = 'h-10 md:h-12 w-auto object-contain shrink-0';
  return (
    <span className="brand-logo inline-flex items-center">
      <img
        src="/Logo.png"
        alt="Metricores"
        className={`${defaultClasses} ${className}`}
      />
    </span>
  );
}
