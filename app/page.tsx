import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Metricores - Advanced Calculators for Finance, Math, and More",
  description:
    "Free online calculators for mortgage, loan, tax, interest, and more. Calculate with precision using our advanced scientific and graphing calculators.",
  keywords: [
    "calculator",
    "mortgage calculator",
    "loan calculator",
    "scientific calculator",
    "graphing calculator",
    "finance calculator",
  ],
};

export default function Home() {
  return <HomeClient />;
}
