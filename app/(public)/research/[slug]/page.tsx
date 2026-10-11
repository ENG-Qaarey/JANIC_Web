import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ResearchService } from "@/services/research/research.service";
import { getCurrentUser } from "@/lib/auth/jwt";
import { SectionHero } from "@/components/layout/SectionHero";
import { ResearchEngagement } from "@/components/research/ResearchEngagement";
import {
  FileText,
  Calendar,
  User,
  Users,
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Sparkles,
  Download,
  BookOpen,
  Globe,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = await ResearchService.getPaperBySlug(slug);
  if (!paper) return { title: "Paper Not Found | JANIC" };

  return {
    title: `${paper.title} | JANIC`,
    description: paper.abstract,
  };
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [paper, currentUser] = await Promise.all([
    ResearchService.getPaperBySlug(slug),
    getCurrentUser(),
  ]);

  if (!paper || paper.status !== "PUBLISHED") {
    notFound();
  }

  const authors = (paper as any).authorsList || [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070d18]">
      <SectionHero
        badge={paper.category}
        title={paper.title}
        description={`Authored by ${paper.authors}`}
        breadcrumbs={[
          { label: "Research", href: "/research" },
          { label: paper.title },
        ]}
      />

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* MAIN ARTICLE CARD */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8">
            {/* Header metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-blue-400 uppercase tracking-wide">
                {paper.category}
              </span>
              {paper.publicationDate && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#0875D1] dark:text-blue-400" />
                  {formatDate(paper.publicationDate)}
                </span>
              )}
            </div>

            {/* Publication Source */}
            {paper.journalOrConference && (
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl text-xs text-blue-900 dark:text-blue-200 font-medium space-y-1">
                <div>
                  <strong>Publication Source:</strong> {paper.journalOrConference}
                </div>
                {paper.doi && (
                  <span className="block text-[11px] text-blue-700 dark:text-blue-300 font-mono">
                    DOI: {paper.doi}
                  </span>
                )}
              </div>
            )}

            {/* AUTHORS SECTION (PHOTOS, NAMES, AFFILIATIONS, LINKS) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0875D1] dark:text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                  Authors &amp; Research Investigators ({authors.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {authors.map((author: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center gap-3 hover:border-blue-300 dark:hover:border-blue-500 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
                        {author.avatar ? (
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-sm">
                            {author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#08245C] dark:text-white">
                          {author.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {author.affiliation || "Faculty of CS & IT, Jazeera University"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ABSTRACT */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-black text-[#08245C] dark:text-white">Abstract</h2>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed italic">
                &ldquo;{paper.abstract}&rdquo;
              </div>
            </div>

            {/* FULL CONTENT / METHODOLOGY */}
            {paper.content && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black text-[#08245C] dark:text-white">
                  Key Findings &amp; Discussion
                </h3>
                <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {paper.content}
                </div>
              </div>
            )}

            {/* PDF DOWNLOAD BANNER */}
            {paper.pdfUrl && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-rose-950/60 text-red-600 dark:text-rose-400 border border-red-200/50 dark:border-rose-900/40 flex items-center justify-center shrink-0 shadow-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="block text-sm font-bold text-[#08245C] dark:text-white">
                        Full Paper Manuscript (PDF)
                      </strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Peer-reviewed and archived in Jazeera University Digital Repository
                      </span>
                    </div>
                  </div>

                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md transition shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* RATINGS, REVIEWS & COMMENTS SECTION */}
          <ResearchEngagement
            paperId={paper.id}
            allowComments={(paper as any).allowComments ?? true}
            allowInteractions={(paper as any).allowInteractions ?? true}
            initialStats={(paper as any).stats}
            currentUser={currentUser}
          />

          {/* BACK LINK */}
          <div className="pt-2">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Research Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
