import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ResearchService } from "@/services/research/research.service";
import { ResearchCatalog } from "@/components/research/ResearchCatalog";

export const metadata = {
  title: "Applied Research & Publications | JANIC",
  description:
    "Peer-reviewed publications, student research papers, and technical whitepapers produced at JANIC, Faculty of CS & IT, Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const papers = await ResearchService.getPublishedPapers().catch(() => []);

  const categories = Array.from(
    new Set(papers.map((p) => p.category).filter(Boolean))
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070d18] overflow-x-clip">
      {/* 1. HERO SECTION */}
      <SectionHero
        badge="Applied Research"
        title="Research That Creates Impact"
        description="Connecting academic computer science research with practical technology development to resolve healthcare, urban infrastructure, and educational challenges in Somalia."
        breadcrumbs={[{ label: "Research" }]}
      />

      {/* 2. RESEARCH PUBLICATIONS BENTO CATALOG SECTION */}
      <section className="py-12 sm:py-16 min-h-[500px]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] dark:text-blue-400">
              Peer-Reviewed Publications
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#08245C] dark:text-white tracking-tight">
              Academic Papers &amp; Working Research
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Authored by faculty researchers, software fellows, and student engineering scholars.
            </p>
          </div>

          <ResearchCatalog papers={papers as any} categories={categories} />
        </div>
      </section>

      {/* 3. CALL TO ACTION */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white dark:bg-[#0b1324] text-center border-t border-slate-200/60 dark:border-slate-800">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
              Have a Research Idea? Let&apos;s Build Together.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal tracking-wide max-w-xl mx-auto">
              Join our research division, collaborate with mentors, and publish papers that address national challenges.
            </p>
            <div className="pt-3">
              <Link
                href="/submit-innovation"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
              >
                Submit Your Paper / Proposal
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
