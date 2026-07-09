
import type { Metadata } from "next";
import CalculatorsClient from "./calculators-client";

export const metadata: Metadata = {
  title: "Calculators Directory | Metricores",
  description: "Browse all available calculators from financial to scientific.",
  keywords: ["calculators", "financial", "scientific", "math tools"],
};

export default function CalculatorsPage() {
  return <CalculatorsClient />;
}
