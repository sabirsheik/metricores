import type { Metadata } from "next";
import TermsClient from "./terms-client";

export const metadata: Metadata = {
  title: "Terms of Service | Metricores",
  description: "Read our terms of service to understand the rules and regulations for using our calculators.",
  keywords: ["terms of service", "terms of use", "legal"],
};

export default function TermsPage() {
  return <TermsClient />;
}

