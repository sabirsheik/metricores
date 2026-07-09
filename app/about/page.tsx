import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About | Metricores",
  description: "Learn more about Metricores and our mission to provide free, accurate calculators.",
  keywords: ["about us", "about metricores", "calculator mission"],
};

export default function AboutPage() {
  return <AboutClient />;
}

