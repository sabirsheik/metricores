import type { Metadata } from "next";
import { Suspense } from "react";
import GuidesClient from "./guides-client";

export const metadata: Metadata = {
  title: "Guides | Metricores",
  description: "Learn how to use our calculators and understand key financial and mathematical concepts.",
  keywords: ["calculator guides", "financial guides", "math guides"],
};

export default function GuidesPage() {
  return (
    <Suspense>
      <GuidesClient />
    </Suspense>
  );
}

