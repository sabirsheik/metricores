import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { guidesData, getGuideBySlug } from '@/data/guides';
import Link from 'next/link';

export async function generateStaticParams() {
  return guidesData.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | Metricores',
      description: 'The requested guide could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: guide.seoTitle ?? guide.title,
    description: guide.seoDescription ?? guide.excerpt,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    keywords: guide.keywords ?? [guide.title],
    openGraph: {
      title: guide.seoTitle ?? guide.title,
      description: guide.seoDescription ?? guide.excerpt,
      url: `/guides/${guide.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.seoTitle ?? guide.title,
      description: guide.seoDescription ?? guide.excerpt,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 md:px-8 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
        <Link href="/" className="hover:text-zinc-900">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-zinc-900">Guides</Link>
        <span>/</span>
        <span className="text-zinc-900">{guide.title}</span>
      </nav>

      <header className="mb-8 space-y-4 border-b border-zinc-200 pb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{guide.category}</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-5xl">{guide.title}</h1>
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
          <span>{guide.readTime}</span>
          <span>•</span>
          <span>{guide.publishedDate}</span>
        </div>
      </header>

      <div className="prose prose-zinc max-w-none text-[15px] leading-8 text-zinc-700">
        {guide.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('###')) {
            return <h2 key={index} className="mt-10 text-2xl font-bold text-zinc-950">{paragraph.replace('###', '').trim()}</h2>;
          }
          if (paragraph.startsWith('-')) {
            return (
              <ul key={index} className="my-4 list-disc space-y-2 pl-6">
                {paragraph.split('\n').map((item, idx) => <li key={idx}>{item.replace('-', '').trim()}</li>)}
              </ul>
            );
          }
          if (paragraph.match(/^(\d+\.)/)) {
            return (
              <ol key={index} className="my-4 list-decimal space-y-2 pl-6">
                {paragraph.split('\n').map((item, idx) => <li key={idx}>{item.replace(/^\d+\.\s*/, '').trim()}</li>)}
              </ol>
            );
          }
          return <p key={index} className="my-4">{paragraph}</p>;
        })}
      </div>
    </article>
  );
}
