import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found | Metricores',
  description: 'The page you requested could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">404</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">Page not found</h1>
      <p className="mt-4 max-w-xl text-sm text-zinc-600">
        The page you requested is not available, or it may have moved. You can return to the calculator directory or visit the homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="rounded-sm bg-zinc-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
          Home
        </Link>
        <Link href="/calculators" className="rounded-sm border border-zinc-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-900">
          Calculators
        </Link>
      </div>
    </div>
  );
}
