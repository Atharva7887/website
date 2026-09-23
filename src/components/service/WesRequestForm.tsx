"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";

export const SELECT_TEST_EVENT = "wes:select-test";

const ROLES = ["Clinician", "Hospital or diagnostic laboratory", "Biotech or pharmaceutical company", "Research group", "Other"];
const DATA = ["FASTQ", "BAM / CRAM", "VCF", "Not yet sequenced", "Not sure"];

const input =
  "w-full bg-cream-100 border border-black/10 rounded-lg px-4 py-3 text-[16px] text-ink placeholder-ink-muted/60 outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:border-navy/60 transition-colors";

/** Sends the chosen test name into the request form and scrolls to it. */
export function SelectTestButton({ test }: { test: string }) {
  return (
    <a
      href="#request"
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_TEST_EVENT, { detail: test }))}
      className="cta cta-ghost mt-6 self-start !py-2.5 !px-4 text-[0.86rem]"
    >
      Request this analysis
      <span className="cta-arrow">→</span>
    </a>
  );
}

function Label({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block kicker mb-2.5 text-ink-muted">
      {children}
      {required && <span className="text-navy" aria-hidden> *</span>}
    </label>
  );
}

function Choice({ name, options, legend, required }: { name: string; options: string[]; legend: string; required?: boolean }) {
  return (
    <fieldset>
      <legend className="kicker mb-2.5 text-ink-muted">
        {legend}
        {required && <span className="text-navy" aria-hidden> *</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="radio" name={name} value={o} required={required} className="peer sr-only" />
            <span className="inline-block rounded-full border border-black/10 bg-cream-100 px-4 py-2 text-[0.85rem] text-ink-soft transition-colors peer-checked:border-navy peer-checked:bg-navy peer-checked:text-cream-100 peer-focus-visible:ring-2 peer-focus-visible:ring-navy peer-focus-visible:ring-offset-2">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function WesRequestForm({ defaultAnalysis }: { defaultAnalysis: string }) {
  const [analysis, setAnalysis] = useState(defaultAnalysis);
  const [stage, setStage] = useState<"idle" | "submitting" | "success">("idle");
  const id = useId();

  useEffect(() => {
    const onSelect = (e: Event) => setAnalysis((e as CustomEvent<string>).detail);
    window.addEventListener(SELECT_TEST_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_TEST_EVENT, onSelect);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStage("submitting");
    // Placeholder, like the Partner form: no submission backend exists yet.
    setTimeout(() => setStage("success"), 900);
  }

  if (stage === "success") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status" className="rounded-2xl border border-black/10 bg-cream-50 p-10 text-center">
        <div className="kicker text-navy mb-3">Received</div>
        <h3 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.05] tracking-tightest text-ink">
          Thank you. Our genomics team will be in touch.
        </h3>
      </motion.div>
    );
  }

  const f = (n: string) => `${id}-${n}`;

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-black/10 bg-cream-50 p-6 md:p-9 space-y-6" aria-describedby={f("privacy")}>
      <div>
        <Label htmlFor={f("analysis")} required>Analysis required</Label>
        <input id={f("analysis")} name="analysis" required value={analysis} onChange={(e) => setAnalysis(e.target.value)} className={input} />
      </div>

      <Choice name="role" legend="I am a" options={ROLES} required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div><Label htmlFor={f("name")} required>Full name</Label><input id={f("name")} name="name" required autoComplete="name" className={input} /></div>
        <div><Label htmlFor={f("org")} required>Organisation or hospital</Label><input id={f("org")} name="organisation" required autoComplete="organization" className={input} /></div>
        <div><Label htmlFor={f("email")} required>Email</Label><input id={f("email")} name="email" type="email" required autoComplete="email" spellCheck={false} className={input} /></div>
        <div><Label htmlFor={f("phone")}>Contact number</Label><input id={f("phone")} name="phone" type="tel" autoComplete="tel" className={input} /></div>
        <div><Label htmlFor={f("city")}>City</Label><input id={f("city")} name="city" autoComplete="address-level2" className={input} /></div>
        <div><Label htmlFor={f("samples")}>Number of samples</Label><input id={f("samples")} name="samples" type="number" min={1} inputMode="numeric" className={input} /></div>
      </div>

      <Choice name="data" legend="Data available" options={DATA} />

      <div>
        <Label htmlFor={f("message")}>How can we help you?</Label>
        <textarea id={f("message")} name="message" rows={4} className={`${input} resize-y`} />
        <p id={f("privacy")} className="mt-2 flex items-start gap-2 text-[0.8rem] leading-[1.5] text-ink-soft">
          <span aria-hidden className="mt-[3px] inline-block h-2 w-2 shrink-0 rounded-full bg-gold" />
          Please do not include patient identifiers or clinical records in this form.
        </p>
      </div>

      <label className="flex items-start gap-3 text-[0.88rem] leading-[1.5] text-ink">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-[#1E5BA8]" />
        <span>I accept the Terms and Conditions and Privacy Policy<span className="text-navy" aria-hidden> *</span></span>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] pt-5">
        <p className="text-[0.8rem] text-ink-muted max-w-[40ch]">
          New clients can request a pilot analysis on a small number of samples before a larger engagement.
        </p>
        <button type="submit" disabled={stage === "submitting"} className="cta disabled:opacity-60">
          {stage === "submitting" ? "Sending…" : "Request analysis"}
          <span className="cta-arrow">→</span>
        </button>
      </div>
    </form>
  );
}
