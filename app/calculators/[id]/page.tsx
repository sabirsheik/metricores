import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CalculatorClient from "./calculator-client";
import { calculatorsData, getCalculatorBySlug } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return Object.values(calculatorsData).map((calculator) => ({
    id: calculator.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const calculator = getCalculatorBySlug(id);

  if (!calculator) {
    return {
      title: "Calculator Not Found | Metricores",
      description: "The requested calculator could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildMetadata({
    title: calculator.seoTitle ?? calculator.name,
    description: calculator.seoDescription ?? calculator.shortDescription,
    path: `/calculators/${calculator.slug}`,
    keywords: calculator.keywords ?? [calculator.name, "calculator"],
    openGraphTitle: calculator.seoTitle ?? calculator.name,
    openGraphDescription: calculator.seoDescription ?? calculator.shortDescription,
  });
}

export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const calculator = getCalculatorBySlug(id);

  if (!calculator) {
    notFound();
  }

  return <CalculatorClient />;
}

