"use client";

import CalculatorView from "@/components/CalculatorView";
import GraphingView from "@/components/GraphingView";
import { calculatorsData } from "@/data/calculators";
import { useParams, useRouter as useNextRouter } from "next/navigation";
import type { CalculatorId } from "@/types";

export default function CalculatorClient() {
  const params = useParams();
  const router = useNextRouter();
  const id = params.id as CalculatorId;

  const handleBack = () => {
    router.push("/");
  };

  const handleSelectCalculator = (calculatorId: string) => {
    router.push(`/calculators/${calculatorId}`);
  };

  if (id === "graphing") {
    return <GraphingView />;
  }

  const calculator = calculatorsData[id];
  if (!calculator) {
    return <div>Calculator not found</div>;
  }

  return (
    <CalculatorView
      calculator={calculator}
      onBack={handleBack}
      onNavigateToCalculator={handleSelectCalculator}
    />
  );
}
