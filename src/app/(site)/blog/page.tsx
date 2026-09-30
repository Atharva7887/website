import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { emailFor, getSiteSettings } from "../../../../sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "IndiskaAI's blog: perspectives on antibody engineering, computational biology, and what we're learning as we build.",
};

export default async function BlogPage() {
  const settings = await getSiteSettings();
  const researchEmail = emailFor(settings, "Research");

  return (
    <main className="relative">
      <PageHeader
        crumbs={[{ label: "Research", href: "/research" }, { label: "Blog" }]}
        eyebrow="Blog"
        title={
          <>
            Notes we haven&apos;t{" "}
            <span className="italic text-navy">written yet.</span>
          </>
        }
        lede="Perspectives on antibody engineering, computational biology, and what we're learning as we build, published here as they're ready."
      />

      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="border border-black/10 rounded-2xl bg-cream-50 px-6 md:px-12 py-16 md:py-24 text-center max-w-3xl mx-auto">
            <div className="kicker mb-4">Blog</div>
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-tightest text-ink">
              No posts published{" "}
              <span className="italic text-navy">yet.</span>
            </h2>
            <p className="mt-6 text-ink-soft leading-[1.65] max-w-[52ch] mx-auto">
              We haven&apos;t written our first post yet. In the meantime, our
              internal benchmarks and technical reports live on the research
              page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="/research" className="cta">
                See our research
                <span className="cta-arrow">→</span>
              </a>
              <a href={`mailto:${researchEmail}`} className="cta cta-ghost">
                Email {researchEmail}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
