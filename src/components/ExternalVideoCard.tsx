"use client";

import { useState } from "react";

export type ExternalVideo = {
  /** YouTube video id of an embeddable video on its original channel. */
  youtubeId: string;
  title: string;
  /** Channel or institution that published it — always shown. */
  credit: string;
  /** Canonical link to the original video. */
  sourceUrl: string;
  duration?: string;
};

/**
 * Embeds third-party video without re-hosting it. Nothing loads from YouTube
 * until the visitor presses play (a poster-only facade), the embed uses the
 * privacy-enhanced domain, and the credit + source link stay visible so the
 * footage is never mistaken for IndiskaAI's own. Only add videos whose owner
 * allows embedding — a public video is not a licence to download or edit it.
 */
export default function ExternalVideoCard({ video }: { video: ExternalVideo }) {
  const [active, setActive] = useState(false);
  const poster = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <figure className="overflow-hidden rounded-2xl border border-black/5 bg-cream-50">
      <div className="relative aspect-video bg-ink">
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${video.title} (${video.credit}, YouTube)`}
            className="group absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100/95 text-ink shadow-lg transition-transform group-hover:scale-105">
                <svg viewBox="0 0 12 12" className="ml-0.5 h-4 w-4" aria-hidden="true"><path d="M3 1.5 L10.5 6 L3 10.5 Z" fill="currentColor" /></svg>
              </span>
            </span>
            {video.duration && (
              <span className="absolute bottom-3 right-3 rounded bg-ink/80 px-1.5 py-0.5 text-[0.7rem] tabular-nums text-cream-100">
                {video.duration}
              </span>
            )}
          </button>
        )}
      </div>
      <figcaption className="px-4 py-3.5">
        <div className="text-[0.92rem] font-medium text-ink">{video.title}</div>
        <div className="mt-1 text-[0.74rem] text-ink-muted">
          Source: {video.credit} · YouTube ·{" "}
          <a href={video.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-black/20 underline-offset-2 hover:text-navy">
            View original
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
