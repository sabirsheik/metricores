import type { Metadata } from "next";
import FAQClient from "./faq-client";

export const metadata: Metadata = {
  title: "FAQ | Metricores",
  description: "Frequently asked questions about our calculators and services.",
  keywords: ["faq", "frequently asked questions", "calculator help"],
};

export default function FAQPage() {
  return <FAQClient />;
}

