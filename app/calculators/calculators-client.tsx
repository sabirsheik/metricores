
"use client";

import CalculatorsDirectory from "@/components/CalculatorsDirectory";
import { useRouter } from "next/navigation";

export default function CalculatorsClient() {
  const router = useRouter();
  const handleSelectCalculator = (id: string) => {
    router.push(`/calculators/${id}`);
  };
  return <CalculatorsDirectory onNavigateToCalculator={handleSelectCalculator} />;
}
