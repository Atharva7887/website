import SmoothScroll from "@/components/SmoothScroll";
import { NavHistoryTracker } from "@/components/BackButton";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { getSiteSettings } from "../../../sanity/lib/fetch";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="grain flex flex-col min-h-screen">
      <SmoothScroll>
        {/* Ahead of the page content so the route-change count is written
            before any BackButton below reads it. */}
        <NavHistoryTracker />
        <Nav careersStatus={settings.careersStatus} />
        <PageTransition>{children}</PageTransition>
        <Footer settings={settings} />
      </SmoothScroll>
    </div>
  );
}
