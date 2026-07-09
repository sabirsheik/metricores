import type { Metadata, ResolvingMetadata } from "next";
import CalculatorClient from "./calculator-client";
import { calculatorsData } from "@/data/calculators";
import type { CalculatorId } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const calculator = calculatorsData[id as CalculatorId];
  if (!calculator) {
    return {
      title: "Calculator Not Found | Metricores",
      description: "The requested calculator could not be found.",
    };
  }
  return {
    title: `${calculator.name} | Metricores`,
    description: calculator.shortDescription,
    keywords: [calculator.name.toLowerCase(), "calculator"],
  };
}

export default function CalculatorPage() {
  return <CalculatorClient />;
}

