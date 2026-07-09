import type { Metadata } from "next";
import PrivacyClient from "./privacy-client";

export const metadata: Metadata = {
  title: "Privacy Policy | Metricores",
  description: "Read our privacy policy to understand how we collect, use, and protect your data.",
  keywords: ["privacy policy", "data protection", "cookies"],
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}

