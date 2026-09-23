"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Soft navigations leave `document.referrer` untouched, and
 * `window.history.length` counts entries from before this site was ever
 * opened — so neither one answers "would going back land on a page of
 * ours?". We count the route changes this tab has actually made instead:
 * module scope survives client-side navigation, and sessionStorage carries
 * the count across a hard reload. A pasted link or a cold external hit
 * starts at zero, and the button stays hidden rather than throwing the
 * visitor off the site.
 */
const DEPTH_KEY = "indiskaai:nav-depth";

let lastPath: string | null = null;

function readDepth(): number {
  try {
    return Number(window.sessionStorage.getItem(DEPTH_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeDepth(value: number) {
  try {
    window.sessionStorage.setItem(DEPTH_KEY, String(value));
  } catch {
    /* Blocked or private-mode storage — Back simply stays hidden. */
  }
}

/**
 * Mounted once in the site layout, ahead of the page content, so its effect
 * runs before any BackButton below it reads the count.
 */
export function NavHistoryTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (lastPath === pathname) return;
    const isEntryPage = lastPath === null;
    lastPath = pathname;
    if (isEntryPage) return;
    writeDepth(readDepth() + 1);
  }, [pathname]);

  return null;
}

/** `/services/molecular-docking` → `/services`; `/services` → `/`. */
function parentOf(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  parts.pop();
  return `/${parts.join("/")}`;
}

/**
 * With in-site history, Back is a real history step. Without it (a pasted
 * link, a search result) it becomes a link to the parent route, so the
 * visitor still moves up the site rather than off it.
 */
export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(readDepth() > 0 && window.history.length > 1);
  }, [pathname]);

  if (pathname === "/") return null;

  const cls = `group inline-flex items-center gap-2 text-[0.85rem] text-ink-muted transition-colors duration-300 hover:text-navy ${className}`;

  if (!canGoBack) {
    return (
      <Link href={parentOf(pathname)} className={cls}>
        <span aria-hidden className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        Back
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cls}
    >
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
      >
        ←
      </span>
      Back
    </button>
  );
}
