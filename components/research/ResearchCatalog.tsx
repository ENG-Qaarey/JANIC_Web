"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  FileText,
  Star,
  MessageCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
  Users,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface ResearchAuthorItem {
  id?: string;
  name: string;
  avatar?: string;
  affiliation?: string;
  link?: string;
}

export interface ResearchPaperItem {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content?: string | null;
  authors: string;
  authorsList?: ResearchAuthorItem[];
  category: string;
  publicationDate?: string | Date | null;
  journalOrConference?: string | null;
  doi?: string | null;
  pdfUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  stats?: {
    commentsCount: number;
    likesCount: number;
    ratingsCount: number;
    avgRating: number;
  };
}

interface ResearchCatalogProps {
  papers: ResearchPaperItem[];
  categories: string[];
}

const PAGE_SIZE = 6; // 2 rows of 3 cards on desktop

export function ResearchCatalog({ papers, categories }: ResearchCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter papers
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      // Category filter
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesAbstract = p.abstract.toLowerCase().includes(q);
        const matchesAuthors = p.authors.toLowerCase().includes(q);
        const matchesJournal = (p.journalOrConference || "").toLowerCase().includes(q);
        const matchesAuthorList = (p.authorsList || []).some((a) =>
          a.name.toLowerCase().includes(q)
        );
        if (
          !matchesTitle &&
          !matchesAbstract &&
          !matchesAuthors &&
          !matchesJournal &&
          !matchesAuthorList
        ) {
          return false;
        }
      }
      return true;
    });
  }, [papers, selectedCategory, search]);

  // Pagination
  const totalPages = Math.ceil(filteredPapers.length / PAGE_SIZE);
  const currentPapers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPapers.slice(start, start + PAGE_SIZE);
  }, [filteredPapers, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const catalogElement = document.getElementById("research-catalog-section");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "ALL";

  return (
    <div id="research-catalog-section" className="space-y-10">
      {/* FILTER CONTROLS BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-blue-100/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Search Row */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search papers by title, abstract keyword, author, or publication journal..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800 transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Filter by Research Domain
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#0875D1] dark:text-blue-400 hover:text-[#065ea8] flex items-center gap-1 transition"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters ({filteredPapers.length} Results)
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("ALL");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
                selectedCategory === "ALL"
                  ? "bg-[#0875D1] text-white border-[#0875D1] shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Domains ({papers.length})
            </button>
            {categories.map((cat) => {
              const count = papers.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
                    isActive
                      ? "bg-[#0875D1] text-white border-[#0875D1] shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span>
          Showing{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            {filteredPapers.length === 0
              ? 0
              : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filteredPapers.length
                )}`}
          </strong>{" "}
          of <strong className="text-slate-800 dark:text-slate-200">{filteredPapers.length}</strong> research papers
        </span>
        {totalPages > 1 && (
          <span>
            Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of{" "}
            <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* CARDS GRID */}
      {currentPapers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-[#08245C] dark:text-white">No Research Papers Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No manuscripts match your selected search criteria. Try different keywords or reset
            the filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-xl bg-[#0875D1] text-white font-bold text-xs hover:bg-[#065ea8] transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {currentPapers.map((paper) => {
            const avgStars = paper.stats?.avgRating ?? 0;
            const totalRatings = paper.stats?.ratingsCount ?? 0;
            const commentsCount = paper.stats?.commentsCount ?? 0;
            const likesCount = paper.stats?.likesCount ?? 0;
            const authors = paper.authorsList || [];

            return (
              <Link
                key={paper.id}
                href={`/research/${paper.slug}`}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-blue-100/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                <div className="p-7 space-y-5">
                  {/* Category & Date Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                      {paper.category}
                    </span>
                    {paper.publicationDate && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0875D1] dark:text-blue-400" />
                        {formatDate(paper.publicationDate)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-[#08245C] dark:text-white group-hover:text-[#0875D1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                    {paper.title}
                  </h3>

                  {/* Authors Section with Photos/Avatars & Names */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {authors.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden">
                            {authors.slice(0, 3).map((author, idx) => (
                              <div
                                key={idx}
                                className="relative w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-700"
                              >
                                {author.avatar ? (
                                  <Image
                                    src={author.avatar}
                                    alt={author.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-[10px]">
                                    {author.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <span className="truncate max-w-[180px] font-bold text-[#08245C] dark:text-slate-200">
                            {authors.map((a) => a.name).join(", ")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <User className="w-3.5 h-3.5 text-[#0875D1] dark:text-blue-400" />
                          <span>{paper.authors}</span>
                        </div>
                      )}
                    </div>

                    {paper.journalOrConference && (
                      <p className="text-[11px] italic text-slate-500 dark:text-slate-400 line-clamp-1">
                        Published in: <strong>{paper.journalOrConference}</strong>
                      </p>
                    )}
                  </div>

                  {/* Abstract Snippet */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>

                  {/* Badges row: DOI & PDF indicator */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    {paper.doi && (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                        DOI: {paper.doi}
                      </span>
                    )}
                    {paper.pdfUrl && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-[10px] border border-red-100 dark:border-red-900/50">
                        <FileText className="w-3 h-3" />
                        PDF Manuscript
                      </span>
                    )}
                  </div>
                </div>

                {/* SOCIAL PROOF & ENGAGEMENT METRICS BAR */}
                <div className="px-7 py-4 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{avgStars > 0 ? avgStars.toFixed(1) : "5.0"}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                      ({totalRatings > 0 ? totalRatings : 0})
                    </span>
                  </div>

                  {/* Comments & Likes */}
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                    <div className="flex items-center gap-1 hover:text-[#0875D1] dark:hover:text-blue-400 transition">
                      <MessageCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{commentsCount}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-red-500 dark:hover:text-rose-400 transition">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                      <span>{likesCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* NUMBERED PAGINATION */}
      {totalPages > 1 && (
        <div className="pt-8 flex flex-wrap items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-[#08245C] dark:bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition shadow-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
