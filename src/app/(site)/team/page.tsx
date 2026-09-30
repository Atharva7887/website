import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import FounderSpotlight from "@/components/FounderSpotlight";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Leadership team and the data scientists, bioinformaticians, and engineers behind IndiskaAI.",
};

export default function TeamPage() {
  return (
    <main className="relative">
      <PageHeader
        eyebrow="The team"
        title={
          <>
            Scientists, engineers,{" "}
            <span className="italic text-navy">first-principles thinkers.</span>
          </>
        }
        lede="A small team of data scientists, bioinformaticians, and engineers holding ambitious ground. We're growing, and most of the people who will shape this company haven't joined yet."
      />

      <section className="py-10 md:py-14">
        <FounderSpotlight />
      </section>

      {/* Team photo — sits right under Leadership, text alongside it. No
          crop container on the photo: its own soft vignette edge is the
          border, so boxing it in a rounded-rect would just re-introduce a
          hard edge. */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="kicker mb-3">The team</div>
              <h2 className="font-display text-[1.9rem] md:text-[2.3rem] leading-[1.05] tracking-tightest text-ink">
                The people behind the{" "}
                <span className="italic text-navy">pipeline.</span>
              </h2>
              <p className="mt-6 text-ink-soft text-[1.02rem] leading-[1.65] max-w-[46ch]">
                Data scientists, bioinformaticians, and engineers working
                across antibody discovery, structural biology, and platform
                engineering. Everyone here works close to the science, not
                removed from it.
              </p>
              <a href="/careers" className="cta cta-ghost mt-8">
                See open roles
                <span className="cta-arrow">→</span>
              </a>
            </div>

            <div className="lg:col-span-7">
              <Image
                src="/team/indiskaai-team.webp"
                alt="The IndiskaAI team"
                width={1448}
                height={1086}
                sizes="(max-width: 1024px) 90vw, 700px"
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
