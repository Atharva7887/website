import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import FounderSpotlight from "@/components/FounderSpotlight";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "IndiskaAI's leadership and the vision behind AI-assisted antibody discovery.",
};

export default function AboutPage() {
  return (
    <main className="relative">
      <PageHeader
        eyebrow="About IndiskaAI"
        title={
          <>
            Built by people who have done{" "}
            <span className="italic text-navy">the bench and the bits.</span>
          </>
        }
        lede="IndiskaAI is a biotechnology company advancing antibody engineering, discovery, and next-generation therapeutic research."
      />

      <FounderSpotlight />
    </main>
  );
}
