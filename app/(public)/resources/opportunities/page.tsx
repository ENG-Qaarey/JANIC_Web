import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { Briefcase, Trophy, Sparkles, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Opportunities | JANIC Resources",
  description:
    "Explore internships, innovation challenges, student competitions, and funding calls at JANIC.",
};

const opportunities = [
  {
    title: "Call for Student Innovation Prototypes (Cohort 2026/27)",
    type: "Call for Projects",
    deadline: "Open Enrollment",
    department: "All FOCOSIT Departments",
    description:
      "Submit your software or hardware innovation concept for incubation at JANIC. Selected teams receive lab workspace, compute access, faculty supervisor matching, and Demo Day presentation slots.",
    eligibility: "Active Jazeera University undergraduate and postgraduate IT students.",
    actionUrl: "/submit-innovation",
    actionLabel: "Submit Innovation Proposal",
    status: "Active",
  },
  {
    title: "Tech Internship & Apprenticeship Placement Program",
    type: "Industry Internship",
    deadline: "Rolling Admissions",
    department: "Software & App Lab / Cybersecurity",
    description:
      "Partner organizations across Mogadishu offer 3-month to 6-month hands-on internships for qualified JANIC student innovators with demonstrated portfolio projects.",
    eligibility: "Final-year students and top performers across JANIC project cohorts.",
    actionUrl: "/contact",
    actionLabel: "Apply for Placement",
    status: "Active",
  },
  {
    title: "Annual Jazeera University Hackathon & Innovation Cup",
    type: "Competition",
    deadline: "Announced Annually",
    department: "JANIC Innovation Hub & JU ICT Girls",
    description:
      "A 48-hour intensive hackathon tackling regional digital health, micro-finance, civic automation, and logistics challenges with prize grants and incubation support.",
    eligibility: "Multi-disciplinary teams of 3 to 5 students from any faculty.",
    actionUrl: "/events",
    actionLabel: "View Hackathon Details",
    status: "Upcoming",
  },
  {
    title: "Faculty Research & Prototype Seed Grant Collaboration",
    type: "Research Call",
    deadline: "Semester Deadlines",
    department: "Research & Digital Solutions Hub",
    description:
      "Support for academic faculty members co-developing functional software or embedded prototypes alongside student research assistants for peer-reviewed publication.",
    eligibility: "Faculty of Computer Science & IT academic staff.",
    actionUrl: "/contact",
    actionLabel: "Connect with Research Hub",
    status: "Active",
  },
];

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <SectionHero
        badge="Career & Incubation"
        title="Opportunities"
        description="Discover student project calls, corporate internships, hackathon challenges, and applied research opportunities."
        breadcrumbs={[
          { label: "Resources", href: "/training" },
          { label: "Opportunities" },
        ]}
      />

      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0B3B82] dark:text-sky-400">
              Verified Open Calls & Programmes
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Every opportunity listed here is vetted by JANIC leadership and university academic administration.
            </p>
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Real-world Industry Impact
          </div>
        </div>

        <div className="space-y-6">
          {opportunities.map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#00A3E0]/60 hover:shadow-md transition-all shadow-sm"
            >
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A3E0] px-2.5 py-0.5 bg-sky-50 dark:bg-sky-950/60 rounded-full">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {item.deadline}
                  </span>
                  <span className="text-[11px] text-slate-400">• {item.department}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold">Eligibility: </strong>
                  {item.eligibility}
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                <Link
                  href={item.actionUrl}
                  className="px-5 py-2.5 bg-[#00A3E0] hover:bg-[#008ec4] text-white text-xs font-bold uppercase tracking-wider text-center transition-colors inline-flex items-center justify-center gap-1.5 shadow rounded-xl"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-center transition-colors rounded-xl"
                >
                  Enquire Further
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
