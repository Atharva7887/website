"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Stage = "idle" | "submitting" | "success" | "error";

const interests = [
  "Target engagement",
  "Generative program",
  "Embedded research",
  "Just exploring",
];

const stages = [
  "Discovery",
  "Lead optimization",
  "Preclinical",
  "Clinical",
  "Other",
];

export default function PartnerForm({
  contactEmail = "hello@indiskaai.com",
}: {
  contactEmail?: string;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [interest, setInterest] = useState(interests[0]);
  const [pipelineStage, setPipelineStage] = useState(stages[0]);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStage("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "We could not send your request.");
      setStage("success");
      form.reset();
    } catch (submissionError) {
      setStage("error");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your request."
      );
    }
  }

  if (stage === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-black/10 bg-cream-50 rounded-xl p-10 md:p-14 text-center"
      >
        <div className="kicker text-navy mb-4">Received</div>
        <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] tracking-tightest text-ink">
          Thank you. We&apos;ll be in touch{" "}
          <span className="italic text-navy">shortly.</span>
        </h2>
        <p className="mt-6 text-ink-soft max-w-[42ch] mx-auto leading-[1.6]">
          Our partnerships team replies within two business days. In the meantime
          you can reach us directly at{" "}
          <a href={`mailto:${contactEmail}`} className="underline">
            {contactEmail}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-black/10 bg-cream-50 rounded-xl p-7 md:p-10 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field id="name" label="Your name" required />
        <Field id="company" label="Company" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field id="email" label="Work email" type="email" required />
        <Field id="role" label="Your role" />
      </div>

      <div>
        <Label>What are you interested in?</Label>
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setInterest(i)}
              className={`px-4 py-2 rounded-full text-[0.85rem] border transition-colors ${
                interest === i
                  ? "bg-ink text-cream-100 border-ink"
                  : "bg-cream-100 text-ink-soft border-black/10 hover:border-ink/30"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <input type="hidden" name="interest" value={interest} />
      </div>

      <div>
        <Label>Where is your program today?</Label>
        <div className="flex flex-wrap gap-2">
          {stages.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setPipelineStage(s)}
              className={`px-4 py-2 rounded-full text-[0.85rem] border transition-colors ${
                pipelineStage === s
                  ? "bg-navy text-cream-100 border-navy"
                  : "bg-cream-100 text-ink-soft border-black/10 hover:border-navy/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input type="hidden" name="stage" value={pipelineStage} />
      </div>

      <div>
        <Label htmlFor="message">A few sentences about what you&apos;re working on</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={5000}
          className="w-full bg-cream-100 border border-black/10 rounded-lg px-4 py-3 text-ink placeholder-ink-muted/60 outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:border-navy/60 transition-colors resize-none"
          placeholder="Target, modality, timeline, or anything else you want us to know."
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-ink-muted max-w-[40ch]">
          We&apos;ll only use this to respond. Nothing is added to a marketing list.
        </p>
        <button
          type="submit"
          disabled={stage === "submitting"}
          className="cta disabled:opacity-60"
        >
          {stage === "submitting" ? "Sending…" : "Send request"}
          <span className="cta-arrow">→</span>
        </button>
      </div>

      {stage === "error" && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error} You can also email <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a> directly.
        </p>
      )}
    </form>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block kicker mb-3 text-ink-muted"
    >
      {children}
    </label>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}{required && <span className="text-navy"> *</span>}</Label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        maxLength={160}
        className="w-full bg-cream-100 border border-black/10 rounded-lg px-4 py-3 text-ink placeholder-ink-muted/60 outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:border-navy/60 transition-colors"
      />
    </div>
  );
}
