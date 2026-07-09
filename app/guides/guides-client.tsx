"use client";

import GuidesView from "@/components/GuidesView";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GuidesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  // Function to get active guide id from hash
  const getActiveGuideFromHash = () => {
    const hash = window.location.hash.slice(1);
    return hash || null;
  };

  // Update activeGuideId when hash changes or component mounts
  useEffect(() => {
    setActiveGuideId(getActiveGuideFromHash());

    const handleHashChange = () => {
      setActiveGuideId(getActiveGuideFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname, searchParams]);

  const handleSelectGuide = (id: string | null) => {
    if (id) {
      router.push(`/guides#${id}`);
    } else {
      router.push("/guides");
    }
  };

  const handleSelectCalculator = (id: string) => {
    router.push(`/calculators/${id}`);
  };

  return (
    <GuidesView
      activeGuideId={activeGuideId}
      onSelectGuide={handleSelectGuide}
      onNavigateToCalculator={handleSelectCalculator}
    />
  );
}
