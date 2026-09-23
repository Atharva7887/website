import Link from "next/link";

const PAGES = [
  { href: "/services/genomics", label: "Whole Exome Sequencing" },
  { href: "/services/genomics/oncology-somatic-variant-analysis", label: "Oncology: Somatic Variants" },
];

/** Switcher between the genomics service pages. */
export default function GenomicsNav({ current }: { current: string }) {
  return (
    <nav aria-label="Genomics services" className="mx-auto max-w-[1400px] px-6 md:px-10 -mt-8 md:-mt-12 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="kicker mr-1">Genomics</span>
        {PAGES.map((p) => {
          const active = p.href === current;
          return (
            <Link
              key={p.href}
              href={p.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-[0.84rem] transition-colors ${
                active ? "border-ink bg-ink text-cream-100" : "border-black/10 bg-cream-50 text-ink hover:border-navy/30 hover:text-navy"
              }`}
            >
              {p.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
