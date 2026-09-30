import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { emailFor, getSiteSettings } from "../../../../sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Latest Updates",
  description:
    "Product releases, program milestones, and other news from IndiskaAI.",
};

export default async function UpdatesPage() {
  const settings = await getSiteSettings();
  const researchEmail = emailFor(settings, "Research");

  return (
    <main className="relative">
      <PageHeader
        crumbs={[{ label: "Research", href: "/research" }, { label: "Latest Updates" }]}
        eyebrow="Latest updates"
        title={
          <>
            What&apos;s new at{" "}
            <span className="italic text-navy">IndiskaAI.</span>
          </>
        }
        lede="Product releases, program milestones, and other news, posted here as it happens."
      />

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="border border-black/10 rounded-2xl bg-cream-50 px-6 md:px-12 py-16 md:py-24 text-center max-w-3xl mx-auto">
            <div className="kicker mb-4">Updates</div>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-tightest text-ink">
              Nothing posted{" "}
              <span className="italic text-navy">yet.</span>
            </h2>
            <p className="mt-6 text-ink-soft leading-[1.65] max-w-[52ch] mx-auto">
              We&apos;ll post here as soon as there&apos;s real news to share.
              Want to hear about it first?
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${researchEmail}`} className="cta">
                Email {researchEmail}
                <span className="cta-arrow">→</span>
              </a>
              <a href="/research" className="cta cta-ghost">
                See our research
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
