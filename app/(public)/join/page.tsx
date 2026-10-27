import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { GraduationCap, BookOpen, Building2, ArrowRight, CheckCircle2, Sparkles, Lightbulb, Users } from "lucide-react";

export const metadata = {
  title: "Join JANIC | Pathways for Students, Faculty & Partners",
  description:
    "Discover how students, faculty mentors, and external organizations can participate and innovate with JANIC at Jazeera University.",
};

const tracks = [
  {
    id: "students",
    title: "For Students",
    badge: "Aspiring Innovators",
    icon: GraduationCap,
    headline: "Turn Your Ideas into Practical Technology Solutions",
    intro:
      "Have an idea or want to build practical technology skills? Explore JANIC projects, specialized hubs, hands-on workshops, and challenge hackathons.",
    points: [
      "Access specialized hardware compute labs and IoT sensor testing kits",
      "Get matched with experienced faculty supervisors and industry mentors",
      "Develop and test prototypes following the 6-stage innovation lifecycle",
      "Showcase your verified work to regional companies and startup accelerators",
    ],
    ctaText: "Submit Your Project Idea →",
    ctaHref: "/submit-innovation",
    secondaryText: "Explore Active Projects",
    secondaryHref: "/projects",
  },
  {
    id: "faculty",
    title: "For Faculty & Mentors",
    badge: "Academic Leadership",
    icon: BookOpen,
    headline: "Guide Applied Research & Supervise Student Prototypes",
    intro:
      "Contribute by mentoring student teams, guiding applied research, leading specialized technical workshops, reviewing prototypes, and connecting academic learning to real-world market needs.",
    points: [
      "Lead applied research papers with student research assistants",
      "Facilitate technical bootcamps in AI, cybersecurity, and cloud engineering",
      "Evaluate student prototypes and serve as judges during Demo Days",
      "Connect academic curricula with commercial problem statements",
    ],
    ctaText: "Mentor a Team →",
    ctaHref: "/contact?subject=Faculty%20Mentorship%20Inquiry",
    secondaryText: "View Applied Research",
    secondaryHref: "/research",
  },
  {
    id: "partners",
    title: "For Industry Partners",
    badge: "Corporate & Public Sector",
    icon: Building2,
    headline: "Propose Challenges & Access Top University Talent",
    intro:
      "Organizations can propose real-world challenges, offer mentorship or internships, support activities, sponsor lab workstations, and collaborate on applied research or pilot projects.",
    points: [
      "Submit industry problem statements for student hackathon cohorts",
      "Host interns from top software engineering and IT graduating classes",
      "Support workshops with equipment, software licenses, or cloud credits",
      "Co-brand high-visibility technology showcases and community initiatives",
    ],
    ctaText: "Partner with JANIC →",
    ctaHref: "/partnerships",
    secondaryText: "Contact Inquiries",
    secondaryHref: "/contact?subject=Industry%20Partnership",
  },
];

export default function JoinPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <SectionHero
        badge="Engagement Pathways"
        title="Join JANIC"
        description="Whether you are a student, faculty member, or organization, there is a clear pathway to participate in the JANIC innovation ecosystem."
        breadcrumbs={[{ label: "Join JANIC" }]}
      />

      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00A3E0] bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1 rounded-full border border-sky-100 dark:border-sky-900">
            Participation Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B82] dark:text-sky-300 tracking-tight mt-3">
            Choose Your Innovation Track
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Select the track that represents your background to explore specific opportunities and application procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-[#00A3E0]/70 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-[#00A3E0]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                      {track.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {track.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#00A3E0] uppercase tracking-wider mb-3">
                    {track.headline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {track.intro}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {track.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <Link
                    href={track.ctaHref}
                    className="w-full py-2.5 px-4 bg-[#00A3E0] hover:bg-[#008ec4] text-white text-xs font-bold uppercase tracking-wider text-center block transition-colors shadow rounded-xl"
                  >
                    {track.ctaText}
                  </Link>
                  <Link
                    href={track.secondaryHref}
                    className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-center block transition-colors rounded-xl"
                  >
                    {track.secondaryText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice on Eligibility & Announcements */}
        <div className="mt-14 p-6 bg-slate-100 dark:bg-slate-900 border-l-4 border-[#00A3E0] rounded-2xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
          <strong className="text-slate-900 dark:text-white font-bold">Official Notice: </strong>
          Eligibility criteria, cohort schedules, and specific intake procedures for new incubators and training cohorts are announced through verified university notices and the JANIC Opportunities board.
        </div>
      </section>
    </div>
  );
}
