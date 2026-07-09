"use client";

import HomeView from "@/components/HomeView";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const router = useRouter();
  const handleTabChange = (newTab: string) => {
    if (newTab === "calculators") {
      router.push("/");
    } else {
      router.push(`/${newTab}`);
    }
  };
  const handleSelectCalculator = (id: string) => {
    router.push(`/calculators/${id}`);
  };
  const handleSelectGuide = (id: string | null) => {
    if (id) {
      router.push(`/guides#${id}`);
    } else {
      router.push("/guides");
    }
  };

  return (
    <HomeView
      onNavigateToTab={handleTabChange}
      onNavigateToCalculator={handleSelectCalculator}
      onNavigateToGuide={handleSelectGuide}
    />
  );
}
