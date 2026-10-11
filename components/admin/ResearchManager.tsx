"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  Calendar,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Star,
  MessageCircle,
  Heart,
  UploadCloud,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { FileUploadChoice } from "./FileUploadChoice";
import { AvatarUploadChoice } from "./AvatarUploadChoice";
import { formatDate } from "@/lib/utils";

export const DEFAULT_RESEARCH_DOMAINS = [
  "Strategic Research",
  "Student Research",
  "Applied Research",
  "Technology Innovation",
  "Artificial Intelligence & Data Science",
  "Cybersecurity & Digital Forensics",
  "Health Informatics",
  "FinTech & Digital Economy",
  "Software & Systems Engineering",
  "IoT & Smart Infrastructure",
];

export interface AuthorFormItem {
  id?: string;
  name: string;
  avatar?: string;
  affiliation?: string;
  link?: string;
}

export interface ResearchPaperAdmin {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content?: string | null;
  authors: string;
  authorsData?: string | null;
  authorsList?: AuthorFormItem[];
  category: string;
  journalOrConference?: string | null;
  doi?: string | null;
  pdfUrl?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  publicationDate?: string | Date | null;
  allowComments?: boolean;
  allowInteractions?: boolean;
  stats?: {
    commentsCount: number;
    likesCount: number;
    ratingsCount: number;
    avgRating: number;
  };
  updatedAt: string | Date;
}

export type EngagementMode = "ALL" | "COMMENTS_ONLY" | "INTERACTIONS_ONLY" | "NONE";

const TABLE_PAGE_SIZE = 10;

export function ResearchManager({
  initialPapers,
}: {
  initialPapers: ResearchPaperAdmin[];
}) {
  const router = useRouter();
  const [papers, setPapers] = useState<ResearchPaperAdmin[]>(initialPapers);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [tablePage, setTablePage] = useState(1);

  // Drawer / Slide-over state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<ResearchPaperAdmin | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Applied Research",
    abstract: "",
    content: "",
    journalOrConference: "",
    doi: "",
    pdfUrl: "",
    publicationDate: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    isFeatured: false,
    allowComments: true,
    allowInteractions: true,
  });

  const [engagementMode, setEngagementMode] = useState<EngagementMode>("ALL");

  const handleEngagementModeChange = (mode: EngagementMode) => {
    setEngagementMode(mode);
    setFormData((prev) => ({
      ...prev,
      allowComments: mode === "ALL" || mode === "COMMENTS_ONLY",
      allowInteractions: mode === "ALL" || mode === "INTERACTIONS_ONLY",
    }));
  };

  const [authorsList, setAuthorsList] = useState<AuthorFormItem[]>([]);
  const [customDomainMode, setCustomDomainMode] = useState(false);

  // Unique categories for filtering
  const allCategories = useMemo(() => {
    const set = new Set([...DEFAULT_RESEARCH_DOMAINS, ...papers.map((p) => p.category).filter(Boolean)]);
    return Array.from(set);
  }, [papers]);

  // Combined predefined & active research domains for dropdown
  const domainOptions = useMemo(() => {
    return Array.from(new Set([...DEFAULT_RESEARCH_DOMAINS, ...allCategories]));
  }, [allCategories]);

  // Filtered Papers
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
      if (filterCategory !== "ALL" && p.category !== filterCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesAuthors = p.authors.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesJournal = (p.journalOrConference || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthors && !matchesCategory && !matchesJournal) {
          return false;
        }
      }
      return true;
    });
  }, [papers, filterStatus, filterCategory, search]);

  // Pagination for table
  const totalPages = Math.ceil(filteredPapers.length / TABLE_PAGE_SIZE);
  const paginatedPapers = useMemo(() => {
    const start = (tablePage - 1) * TABLE_PAGE_SIZE;
    return filteredPapers.slice(start, start + TABLE_PAGE_SIZE);
  }, [filteredPapers, tablePage]);

  // Open Add Drawer
  const handleOpenAdd = () => {
    setEditingPaper(null);
    setCustomDomainMode(false);
    setEngagementMode("ALL");
    setFormData({
      title: "",
      category: "Strategic Research",
      abstract: "",
      content: "",
      journalOrConference: "",
      doi: "",
      pdfUrl: "",
      publicationDate: new Date().toISOString().slice(0, 10),
      status: "DRAFT",
      isFeatured: false,
      allowComments: true,
      allowInteractions: true,
    });
    setAuthorsList([
      {
        name: "",
        avatar: "",
        affiliation: "Faculty of CS & IT, Jazeera University",
        link: "",
      },
    ]);
    setDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (p: ResearchPaperAdmin) => {
    setEditingPaper(p);

    const allowC = p.allowComments !== undefined ? Boolean(p.allowComments) : true;
    const allowI = p.allowInteractions !== undefined ? Boolean(p.allowInteractions) : true;
    let mode: EngagementMode = "ALL";
    if (allowC && allowI) mode = "ALL";
    else if (allowC && !allowI) mode = "COMMENTS_ONLY";
    else if (!allowC && allowI) mode = "INTERACTIONS_ONLY";
    else mode = "NONE";

    setEngagementMode(mode);

    let parsedAuthors: AuthorFormItem[] = [];
    if (p.authorsList && p.authorsList.length > 0) {
      parsedAuthors = p.authorsList;
    } else if (p.authorsData) {
      try {
        parsedAuthors = typeof p.authorsData === "string" ? JSON.parse(p.authorsData) : p.authorsData;
      } catch {
        parsedAuthors = [];
      }
    }

    if (parsedAuthors.length === 0 && p.authors) {
      const names = p.authors.split(",").map((s) => s.trim()).filter(Boolean);
      parsedAuthors = names.map((name) => ({
        name,
        avatar: "",
        affiliation: p.journalOrConference || "Faculty of CS & IT, Jazeera University",
        link: "",
      }));
    }

    if (parsedAuthors.length === 0) {
      parsedAuthors = [
        {
          name: "",
          avatar: "",
          affiliation: "Faculty of CS & IT, Jazeera University",
          link: "",
        },
      ];
    }

    const fmtDateInput = (d: any) => {
      if (!d) return "";
      try {
        return new Date(d).toISOString().slice(0, 10);
      } catch {
        return "";
      }
    };

    setFormData({
      title: p.title,
      category: p.category,
      abstract: p.abstract,
      content: p.content || "",
      journalOrConference: p.journalOrConference || "",
      doi: p.doi || "",
      pdfUrl: p.pdfUrl || "",
      publicationDate: fmtDateInput(p.publicationDate),
      status: p.status,
      isFeatured: p.isFeatured,
      allowComments: allowC,
      allowInteractions: allowI,
    });

    setCustomDomainMode(!domainOptions.includes(p.category));
    setAuthorsList(parsedAuthors);
    setDrawerOpen(true);
  };

  // Add / Remove Author
  const handleAddAuthor = () => {
    setAuthorsList((prev) => [
      ...prev,
      {
        name: "",
        avatar: "",
        affiliation: "Faculty of CS & IT, Jazeera University",
        link: "",
      },
    ]);
  };

  const handleRemoveAuthor = (idx: number) => {
    setAuthorsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAuthorChange = (idx: number, field: keyof AuthorFormItem, val: string) => {
    setAuthorsList((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        [field]: val,
      };
      return copy;
    });
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validAuthors = authorsList.filter((a) => a.name.trim() !== "");
      const authorsSummary = validAuthors.map((a) => a.name).join(", ");

      const payload = {
        ...formData,
        authors: authorsSummary || "JANIC Researcher",
        authorsData: validAuthors,
      };

      const url = editingPaper ? `/api/research/${editingPaper.id}` : "/api/research";
      const method = editingPaper ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setDrawerOpen(false);
      router.refresh();

      if (editingPaper) {
        setPapers((prev) =>
          prev.map((item) =>
            item.id === editingPaper.id
              ? ({
                  ...item,
                  ...payload,
                  ...data.item,
                  stats: item.stats,
                  authorsList: validAuthors,
                  updatedAt: new Date(),
                } as any)
              : item
          )
        );
      } else {
        setPapers((prev) => [
          {
            ...data.item,
            authorsList: validAuthors,
            stats: { commentsCount: 0, likesCount: 0, ratingsCount: 0, avgRating: 0 },
          },
          ...prev,
        ]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving research paper");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research paper?")) return;
    try {
      const res = await fetch(`/api/research/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPapers((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting paper");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08245C] dark:text-white">
            Research Papers &amp; Academic Publications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage peer-reviewed articles, author profiles, conference proceedings, and PDF manuscripts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Research Paper
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search title, authors, journal..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setTablePage(1);
              }}
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800 transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setTablePage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setTablePage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
            >
              <option value="ALL">All Domains &amp; Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredPapers.length}</strong> filtered papers (Total:{" "}
            {papers.length})
          </span>
          {(search || filterStatus !== "ALL" || filterCategory !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterStatus("ALL");
                setFilterCategory("ALL");
                setTablePage(1);
              }}
              className="text-[#0875D1] hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[280px]">Title &amp; DOI</th>
                <th className="py-3.5 px-4 min-w-[190px] whitespace-nowrap">Authors</th>
                <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">Domain</th>
                <th className="py-3.5 px-4 min-w-[180px] whitespace-nowrap">Journal / Conference</th>
                <th className="py-3.5 px-4 min-w-[110px] whitespace-nowrap">PDF Document</th>
                <th className="py-3.5 px-4 min-w-[130px] whitespace-nowrap">Ratings &amp; Stats</th>
                <th className="py-3.5 px-4 min-w-[100px] whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 min-w-[100px] whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedPapers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No research papers match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedPapers.map((p) => {
                  const authors =
                    p.authorsList ||
                    (p.authorsData ? JSON.parse(p.authorsData) : []);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                      {/* Title & DOI */}
                      <td className="py-3.5 px-4 min-w-[280px] max-w-[360px]">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 block text-xs leading-snug hover:text-[#0875D1] dark:hover:text-sky-400 transition-colors">
                          {p.title}
                        </span>
                        {p.doi && (
                          <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70">
                            <span className="font-semibold text-slate-400 dark:text-slate-500">DOI:</span>
                            <span className="truncate max-w-[220px]">{p.doi}</span>
                          </div>
                        )}
                      </td>

                      {/* Authors */}
                      <td className="py-3.5 px-4 min-w-[190px]">
                        {authors.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                              {authors.slice(0, 3).map((a: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="relative w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-2xs"
                                >
                                  {a.avatar ? (
                                    <Image
                                      src={a.avatar}
                                      alt={a.name}
                                      fill
                                      sizes="24px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-[10px]">
                                      {a.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-[140px]" title={authors.map((a: any) => a.name).join(", ")}>
                              {authors.map((a: any) => a.name).join(", ")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate block max-w-[140px]" title={p.authors}>
                            {p.authors}
                          </span>
                        )}
                      </td>

                      {/* Category / Domain */}
                      <td className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">
                        <span className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 shadow-2xs">
                          {p.category}
                        </span>
                      </td>

                      {/* Journal / Conference */}
                      <td className="py-3.5 px-4 min-w-[180px] max-w-[220px] text-slate-600 dark:text-slate-400">
                        <span className="truncate block" title={p.journalOrConference || undefined}>
                          {p.journalOrConference || "—"}
                        </span>
                      </td>

                      {/* PDF */}
                      <td className="py-3.5 px-4 min-w-[110px] whitespace-nowrap">
                        {p.pdfUrl ? (
                          <a
                            href={p.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            PDF File
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-[11px]">No PDF</span>
                        )}
                      </td>

                      {/* Stats */}
                      <td className="py-3.5 px-4 min-w-[130px] whitespace-nowrap">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {p.stats?.avgRating ? p.stats.avgRating.toFixed(1) : "—"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-slate-400" />
                            {p.stats?.commentsCount ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-500" />
                            {p.stats?.likesCount ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 min-w-[100px] whitespace-nowrap">
                        <span
                          className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                            p.status === "PUBLISHED"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                              : p.status === "DRAFT"
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 min-w-[100px] whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/research/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                            title="Preview public page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0875D1] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit Paper"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition"
                            title="Delete Paper"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* NUMBERED PAGINATION (10 ROWS PER PAGE) */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/80 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Showing {(tablePage - 1) * TABLE_PAGE_SIZE + 1}–
              {Math.min(tablePage * TABLE_PAGE_SIZE, filteredPapers.length)} of{" "}
              {filteredPapers.length} items
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTablePage(Math.max(1, tablePage - 1))}
                disabled={tablePage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setTablePage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                    tablePage === pageNum
                      ? "bg-[#0875D1] text-white shadow-sm"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setTablePage(Math.min(totalPages, tablePage + 1))}
                disabled={tablePage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADVANCED SLIDE-OVER DRAWER FOR RESEARCH CREATION / EDITING */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-300">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => !loading && setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0875D1] block">
                  {editingPaper ? "Update Manuscript" : "New Manuscript"}
                </span>
                <h2 className="text-xl font-black text-[#08245C] dark:text-white">
                  {editingPaper ? "Edit Research Paper" : "Create Research Paper"}
                </h2>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable Form) */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
              {/* SECTION 1: MANUSCRIPT BASICS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4 text-[#0875D1]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                    1. Paper Information
                  </h3>
                </div>

                {/* Title * */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Manuscript Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Distributed Consensus in Low-Bandwidth Infrastructure"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Research Domain Dropdown * */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Research Domain <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (customDomainMode) {
                            setCustomDomainMode(false);
                            setFormData({
                              ...formData,
                              category: domainOptions[0] || "Strategic Research",
                            });
                          } else {
                            setCustomDomainMode(true);
                            setFormData({ ...formData, category: "" });
                          }
                        }}
                        className="text-[11px] font-semibold text-[#0875D1] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {customDomainMode ? "← Choose from standard domains" : "+ Custom Domain"}
                      </button>
                    </div>

                    {!customDomainMode ? (
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "__CUSTOM__") {
                            setCustomDomainMode(true);
                            setFormData({ ...formData, category: "" });
                          } else {
                            setFormData({ ...formData, category: val });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800 font-medium cursor-pointer"
                      >
                        <option value="" disabled>
                          Select Research Domain
                        </option>
                        {domainOptions.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                        ))}
                        <option value="__CUSTOM__">+ Other / Custom Domain...</option>
                      </select>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          required
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                          }
                          placeholder="Type custom research domain name..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800 font-medium"
                        />
                        <p className="text-[10px] text-slate-400">
                          Custom domain will be saved and can be filtered across the research catalog.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Publication Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      value={formData.publicationDate}
                      onChange={(e) =>
                        setFormData({ ...formData, publicationDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Journal / Conference */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Journal / Conference
                    </label>
                    <input
                      type="text"
                      value={formData.journalOrConference}
                      onChange={(e) =>
                        setFormData({ ...formData, journalOrConference: e.target.value })
                      }
                      placeholder="e.g. IEEE Access / JANIC Tech 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>

                  {/* DOI Identifier */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      DOI Identifier
                    </label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                      placeholder="e.g. 10.1109/ACCESS.2025.123456"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: AUTHORS (DYNAMIC ARRAY WITH PICTURES & LINKS) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0875D1]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                      2. Authors &amp; Researchers ({authorsList.length}) <span className="text-red-500">*</span>
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAuthor}
                    className="text-xs font-bold text-[#0875D1] hover:text-[#065ea8] flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Author
                  </button>
                </div>

                <div className="space-y-4">
                  {authorsList.map((author, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#08245C] dark:text-white">
                          Author #{idx + 1}
                        </span>
                        {authorsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthor(idx)}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 text-xs flex items-center gap-1 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Author Name & Affiliation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Author Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={author.name}
                            onChange={(e) => handleAuthorChange(idx, "name", e.target.value)}
                            placeholder="e.g. Dr. Hassan Ali"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Affiliation / Department
                          </label>
                          <input
                            type="text"
                            value={author.affiliation || ""}
                            onChange={(e) =>
                              handleAuthorChange(idx, "affiliation", e.target.value)
                            }
                            placeholder="e.g. Faculty of CS & IT, Jazeera University"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                          />
                        </div>
                      </div>

                      {/* Author Picture Upload from Device or Link */}
                      <AvatarUploadChoice
                        label="Author Photo / Headshot"
                        value={author.avatar || ""}
                        onChange={(url) => handleAuthorChange(idx, "avatar", url)}
                        folder="authors"
                        placeholder="Paste image URL or upload directly from device..."
                      />

                      {/* Author Profile Link */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Author Profile / Scholar Link (Optional)
                        </label>
                        <input
                          type="text"
                          value={author.link || ""}
                          onChange={(e) => handleAuthorChange(idx, "link", e.target.value)}
                          placeholder="e.g. https://scholar.google.com/... or LinkedIn"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: ABSTRACT & FINDINGS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-[#0875D1]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                    3. Abstract &amp; Content
                  </h3>
                </div>

                {/* Abstract * */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Abstract <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    placeholder="Comprehensive abstract summarizing background, methodology, results, and significance..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800 resize-none"
                  />
                </div>

                {/* Full Content / Key Findings */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Key Findings / Extended Content (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Detailed sections, discussion, methodology formulas, and conclusion..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* SECTION 4: PDF DOCUMENT UPLOAD OR URL */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <FileText className="w-4 h-4 text-[#0875D1]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                    4. PDF Document Manuscript
                  </h3>
                </div>

                <FileUploadChoice
                  label="Research Manuscript PDF"
                  fileType="pdf"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                  folder="research"
                  placeholder="Paste PDF URL (e.g. https://.../paper.pdf) or upload document directly..."
                  helperText="Upload official PDF file of the manuscript. Max file size: 50MB."
                />
              </div>

              {/* SECTION 5: PUBLICATION & ENGAGEMENT SETTINGS */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Comments &amp; Interaction Permissions
                    </label>
                    <select
                      value={engagementMode}
                      onChange={(e) => handleEngagementModeChange(e.target.value as EngagementMode)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    >
                      <option value="ALL">Allow Both (Comments &amp; Interactions)</option>
                      <option value="COMMENTS_ONLY">Allow Comments Only</option>
                      <option value="INTERACTIONS_ONLY">Allow Interactions Only (Ratings &amp; Likes)</option>
                      <option value="NONE">Disallow Both (Read-Only)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeaturedPaper"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0875D1] focus:ring-[#0875D1]"
                  />
                  <label
                    htmlFor="isFeaturedPaper"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Highlight as Featured Publication
                  </label>
                </div>
              </div>

              {/* DRAWER FOOTER */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 py-4 -mb-6 sm:-mb-8 px-6 sm:px-8 -mx-6 sm:-mx-8">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#08245C] hover:bg-[#061B40] text-white text-xs font-bold flex items-center gap-2 transition shadow-md disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingPaper ? "Update Paper" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
