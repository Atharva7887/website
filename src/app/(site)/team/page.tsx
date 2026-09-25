import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import FounderSpotlight from "@/components/FounderSpotlight";
import { getTeamMembers, type TeamMemberDoc } from "../../../../sanity/lib/fetch";
import { urlForImage } from "../../../../sanity/lib/image";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Leadership team and the scientists, engineers, and operators behind IndiskaAI.",
};

function initialsFor(name: string): string {
  if (!name || name.trim() === "—") return "·";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/**
 * Group classification — case-insensitive so both new ("Leadership"/"Science & Engineering")
 * and legacy ("leadership"/"team") values land in the right bucket without a data migration.
 */
function isLeadership(m: TeamMemberDoc): boolean {
  return (m.group ?? "").toLowerCase() === "leadership";
}

function PersonCard({ p }: { p: TeamMemberDoc }) {
  const accent: "navy" | "gold" = p.accent ?? "navy";
  const initialBg =
    accent === "navy" ? "bg-navy text-cream-100" : "bg-gold text-ink";
  const imageUrl = p.image
    ? urlForImage(p.image)?.width(640).height(800).fit("crop").url()
    : null;

  // The article is the visual card. Inner classes use `team-card-*` utilities
  // defined in globals.css so the hover-only fade/scale only fires on devices
  // that actually have hover (i.e. mouse, not touch).
  const card = (
    <article className="group relative bg-cream-50 border border-black/5 rounded-2xl overflow-hidden transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(30,91,168,0.45)] h-full">
      {/* Photo area — large 4:5 portrait. Image scales subtly on hover. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover team-card-image"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full ${initialBg} font-display text-[2rem] md:text-[2.4rem] tracking-tightest team-card-image`}
            >
              {initialsFor(p.name)}
            </span>
          </div>
        )}
        {/* Soft bottom gradient inside the photo for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          style={{
            background:
              "linear-gradient(180deg, rgba(253,251,245,0) 0%, rgba(253,251,245,0.7) 100%)",
          }}
        />
      </div>

      {/* Name + role + bio. team-card-text fades out only on hover-capable devices. */}
      <div className="relative p-5 md:p-6 team-card-text">
        <div className="font-display text-[1.15rem] md:text-[1.3rem] leading-[1.1] tracking-tightest text-ink">
          {p.name}
        </div>
        <div className="text-[0.7rem] tracking-[0.16em] uppercase text-ink-muted mt-1.5">
          {p.role}
        </div>
        {p.bio && (
          <p className="mt-3 text-ink-soft text-[0.88rem] leading-[1.5]">
            {p.bio}
          </p>
        )}

        {/* Subtle LinkedIn affordance when a profile is linked */}
        {p.linkedinUrl && (
          <span
            aria-hidden
            className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.16em] uppercase text-ink-muted"
          >
            LinkedIn <span aria-hidden>↗</span>
          </span>
        )}
      </div>
    </article>
  );

  if (p.linkedinUrl) {
    return (
      <a
        href={p.linkedinUrl}
        target="_blank"
        rel="noreferrer"
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 rounded-2xl"
        aria-label={`${p.name}: LinkedIn (opens in a new tab)`}
      >
        {card}
      </a>
    );
  }
  return card;
}

function TeamGrid({
  members,
  emptyHint,
}: {
  members: TeamMemberDoc[];
  emptyHint: string;
}) {
  if (members.length === 0) {
    return (
      <div className="border border-dashed border-black/10 rounded-2xl px-6 py-10 text-ink-muted text-sm">
        {emptyHint}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
      {members.map((p) => (
        <PersonCard key={p._id ?? p.name + p.role} p={p} />
      ))}
    </div>
  );
}

export default async function TeamPage() {
  const all = await getTeamMembers();
  const scientists = all.filter((m) => !isLeadership(m));

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
        lede="A small team holding ambitious ground. We're growing, and most of the people who will shape this company haven't joined yet."
      />

      <section className="py-10 md:py-14">
        <FounderSpotlight />
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="kicker mb-8 md:mb-10">Scientists &amp; Engineers</div>
          <TeamGrid
            members={scientists}
            emptyHint="No team entries yet. Add one in /studio under Team Member with Group = Science & Engineering."
          />

          <div className="mt-16 border-t border-black/10 pt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="text-ink-soft max-w-[44ch] leading-[1.6]">
              These open seats are real. If you recognise yourself in one of
              them, write to us. We read every application personally.
            </p>
            <a href="/careers" className="cta">
              See open roles
              <span className="cta-arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
