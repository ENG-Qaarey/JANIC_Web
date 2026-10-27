import React from "react";
import { PostsBrowser } from "@/components/public/PostsBrowser";
import { SectionHero } from "@/components/layout/SectionHero";
import { MediaRepository } from "@/repositories/media.repository";

export const metadata = {
  title: "Posts | JANIC",
  description:
    "Explore photos, videos, hackathon highlights, workshops, and innovation showcases from Jazeera University's JANIC tech hub.",
};

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const media = await MediaRepository.findAll().catch(() => []);
  const items = media.filter(
    (m) =>
      m.source === "post" &&
      (!m.mimeType ||
        m.mimeType.startsWith("image") ||
        m.mimeType.startsWith("video"))
  );

  const tracks = [
    "Innovation Showcases",
    "Robotics & Hardware Labs",
    "Hackathon Competitions",
    "Software & Web Bootcamps",
    "Applied Research Sessions",
    "Student Founders Pitch",
    "Industry Symposia",
    "Campus Tech Life",
  ];

  return (
    <div>
      {/* Hero Section */}
      <SectionHero
        badge="Posts • Moments • Highlights"
        title="JANIC Posts & Media Archive"
        description="A visual chronicle of groundbreaking student prototypes, hackathon challenges, hands-on lab sessions, robotics demonstrations, and campus moments at Jazeera University."
        breadcrumbs={[{ label: "Posts" }]}
      />

      {/* Focus Disciplines / Highlights Bar (Like Training Page) */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Core Media Collections & Archives
          </p>
          <div className="flex flex-wrap gap-2">
            {tracks.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-blue-50 hover:text-[#0875D1] dark:hover:bg-slate-700 dark:hover:text-sky-400 transition cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Catalog Section (Like Training Page Course Catalog) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1]">
              Documented Moments
            </span>
            <h2 className="text-3xl font-extrabold text-[#08245C] dark:text-white">
              Innovation & Campus Highlights
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              High-resolution photography and streaming video recordings captured live at Jazeera Nexus Innovation Center.
            </p>
          </div>

          {/* Browser Catalog with Training-Style Cards */}
          <PostsBrowser items={items} />
        </div>
      </section>
    </div>
  );
}
