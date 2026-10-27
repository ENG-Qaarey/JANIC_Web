import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { FileText, Download, ArrowRight, ShieldCheck, FileSpreadsheet } from "lucide-react";

export const metadata = {
  title: "Downloads & Forms | JANIC Resources",
  description:
    "Official application forms, proposal templates, and guidelines for students, faculty, and industry partners.",
};

const documents = [
  {
    title: "JANIC Innovation Project Proposal Template",
    category: "Student Projects",
    format: "PDF / DOCX",
    size: "420 KB",
    description:
      "Standard concept note and technical architecture proposal document for student teams applying to enter the JANIC prototyping pipeline.",
  },
  {
    title: "Faculty Applied Research Mentorship Guidelines",
    category: "Faculty & Mentorship",
    format: "PDF",
    size: "680 KB",
    description:
      "Policy guidelines, ethics protocols, and mentorship expectations for academic supervisors guiding student technical innovations.",
  },
  {
    title: "Industry Partnership Collaboration Charter",
    category: "Partnerships",
    format: "PDF",
    size: "850 KB",
    description:
      "Framework defining intellectual property, student internship terms, workplace visits, and co-development commitments with corporate entities.",
  },
  {
    title: "Lab Equipment & Workstation Access Policy",
    category: "Hub Governance",
    format: "PDF",
    size: "310 KB",
    description:
      "Guidelines for using compute stations, hardware toolkits, soldering benches, and IoT testing kits in the JANIC labs.",
  },
  {
    title: "Student Demo Day Presentation Checklist & Rubric",
    category: "Events & Evaluation",
    format: "PDF",
    size: "240 KB",
    description:
      "Evaluation criteria used by judges and faculty deans during semester-end prototype showcase events.",
  },
];

export default function DownloadsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <SectionHero
        badge="Official Resources"
        title="Downloads & Forms"
        description="Access verified application documents, research templates, and project guidelines approved by JANIC leadership."
        breadcrumbs={[
          { label: "Resources", href: "/training" },
          { label: "Downloads & Forms" },
        ]}
      />

      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0B3B82] dark:text-sky-400">
              Approved Documentation & Templates
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Download standard documents required for project submissions, research grants, and partnership agreements.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> FOCOSIT Verified
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.title}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#00A3E0]/60 hover:shadow-md transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A3E0] px-2.5 py-0.5 bg-sky-50 dark:bg-sky-950/60 rounded-full">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {doc.format} • {doc.size}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {doc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A3E0] hover:text-[#008ec4] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Request / Download File</span>
                </Link>
                <span className="text-[11px] text-slate-400">Official Release</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h4 className="text-base font-bold text-[#0B3B82] dark:text-sky-300">
              Need a Customized Agreement or Custom Intake Form?
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Reach out directly to the JANIC administrative secretariat for tailored corporate challenge documentation or academic credits validation.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-[#00A3E0] hover:bg-[#008ec4] text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors rounded-xl shadow"
          >
            Contact Secretariat →
          </Link>
        </div>
      </section>
    </div>
  );
}
