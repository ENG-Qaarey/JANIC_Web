"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  Calendar,
  Award,
  Star,
  MessageCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Users,
  X,
  Layers,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface TrainingProgramItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: string;
  schedule: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  mode?: string;
  certification?: string | null;
  summary: string;
  description: string;
  coverImage?: string | null;
  maxSeats?: number | null;
  trainersList?: Array<{
    name: string;
    bio?: string;
    avatar?: string;
    socials?: Record<string, string>;
  }>;
  stats?: {
    commentsCount: number;
    likesCount: number;
    ratingsCount: number;
    avgRating: number;
  };
}

interface TrainingCatalogProps {
  programs: TrainingProgramItem[];
  categories: string[];
}

const PAGE_SIZE = 6; // 2 rows of 3 cards on desktop

export function TrainingCatalog({ programs, categories }: TrainingCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const levels = ["ALL", "Beginner", "Intermediate", "Advanced"];

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      // Category filter
      if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== "ALL") {
        if (p.level.toLowerCase() !== selectedLevel.toLowerCase()) {
          return false;
        }
      }
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSummary = p.summary.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesTrainer = (p.trainersList || []).some((t) =>
          t.name.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesSummary && !matchesCategory && !matchesTrainer) {
          return false;
        }
      }
      return true;
    });
  }, [programs, selectedCategory, selectedLevel, search]);

  // Pagination
  const totalPages = Math.ceil(filteredPrograms.length / PAGE_SIZE);
  const currentPrograms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPrograms.slice(start, start + PAGE_SIZE);
  }, [filteredPrograms, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const catalogElement = document.getElementById("training-catalog-section");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setSelectedLevel("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" || selectedCategory !== "ALL" || selectedLevel !== "ALL";

  const getLevelBadgeColor = (lvl: string) => {
    const l = lvl.toLowerCase();
    if (l.includes("beginner")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (l.includes("advanced")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  return (
    <div id="training-catalog-section" className="space-y-10">
      {/* FILTER CONTROLS BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Search & Level Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box (7 cols) */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by program title, topic, or trainer..."
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

          {/* Level Dropdown (5 cols) */}
          <div className="md:col-span-5 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap hidden sm:inline">
              Level:
            </span>
            <div className="flex flex-wrap gap-1.5 w-full">
              {levels.map((lvl) => {
                const isActive = selectedLevel.toLowerCase() === lvl.toLowerCase();
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                      isActive
                        ? "bg-[#0875D1] text-white border-[#0875D1] shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {lvl === "ALL" ? "All Levels" : lvl}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Browse by Category
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#0875D1] hover:text-[#065ea8] flex items-center gap-1 transition"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters ({filteredPrograms.length} Results)
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
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Categories ({programs.length})
            </button>
            {categories.map((cat) => {
              const count = programs.filter((p) => p.category === cat).length;
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
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
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
            {filteredPrograms.length === 0
              ? 0
              : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filteredPrograms.length
                )}`}
          </strong>{" "}
          of <strong className="text-slate-800 dark:text-slate-200">{filteredPrograms.length}</strong> programs
        </span>
        {totalPages > 1 && (
          <span>
            Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of{" "}
            <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* CARDS GRID */}
      {currentPrograms.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-[#08245C] dark:text-white">No Training Programs Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            We couldn&apos;t find any programs matching your selected filters. Try broadening your
            search terms or reset the filters.
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
          {currentPrograms.map((program) => {
            const avgStars = program.stats?.avgRating ?? 0;
            const totalRatings = program.stats?.ratingsCount ?? 0;
            const commentsCount = program.stats?.commentsCount ?? 0;
            const likesCount = program.stats?.likesCount ?? 0;
            const trainers = program.trainersList || [];

            return (
              <Link
                key={program.id}
                href={`/training/${program.slug}`}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                <div>
                  {/* COVER IMAGE */}
                  <div className="aspect-[16/10] relative bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={
                        program.coverImage ||
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-sm backdrop-blur-md ${getLevelBadgeColor(
                          program.level
                        )}`}
                      >
                        {program.level}
                      </span>
                      {program.duration && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                          <Clock className="w-3 h-3 text-blue-400" />
                          {program.duration}
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay in image */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                      <span className="font-semibold text-blue-200 uppercase tracking-wider text-[10px]">
                        {program.category}
                      </span>
                      {program.mode && (
                        <span className="text-[11px] font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          {program.mode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-extrabold text-[#08245C] dark:text-white group-hover:text-[#0875D1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                      {program.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {program.summary}
                    </p>

                    {/* Schedule / Cohort Details */}
                    <div className="space-y-1.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#0875D1] shrink-0" />
                        <span className="truncate">
                          <strong className="text-slate-700 dark:text-slate-300">Schedule:</strong> {program.schedule}
                        </span>
                      </div>
                      {program.certification && (
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                          <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{program.certification}</span>
                        </div>
                      )}
                    </div>

                    {/* Trainers preview */}
                    {trainers.length > 0 && (
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex -space-x-2 overflow-hidden">
                          {trainers.slice(0, 3).map((t, idx) => (
                            <div
                              key={idx}
                              className="relative w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-700"
                            >
                              <Image
                                src={
                                  t.avatar ||
                                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                                }
                                alt={t.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          <span className="text-slate-400 font-normal">Trainer: </span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {trainers.map((t) => t.name).join(", ")}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SOCIAL PROOF & ENGAGEMENT METRICS BAR */}
                <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{avgStars > 0 ? avgStars.toFixed(1) : "5.0"}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      ({totalRatings > 0 ? totalRatings : 0})
                    </span>
                  </div>

                  {/* Comments & Likes */}
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                    <div className="flex items-center gap-1 hover:text-[#0875D1] transition">
                      <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{commentsCount}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-red-500 transition">
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
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
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
                    ? "bg-[#0875D1] text-white shadow-md shadow-blue-500/20"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
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
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
