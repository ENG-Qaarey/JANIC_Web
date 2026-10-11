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
  Clock,
  Award,
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
import { ImageUploadChoice } from "./ImageUploadChoice";
import { AvatarUploadChoice } from "./AvatarUploadChoice";
import { formatDate, calculateDuration } from "@/lib/utils";

export const DEFAULT_TRAINING_CATEGORIES = [
  "Software Engineering",
  "Artificial Intelligence & Data Science",
  "Cloud Computing & DevOps",
  "Cybersecurity & Networks",
  "Mobile App Development",
  "UI/UX Design & Product",
  "Database & Big Data",
  "Emerging Technologies",
  "FinTech & Digital Business",
  "Health Informatics",
];

export interface TrainerFormItem {
  id?: string;
  name: string;
  bio?: string;
  avatar?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface TrainingProgramAdmin {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  level: string;
  duration: string;
  schedule: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  mode: string;
  certification?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  allowComments?: boolean;
  allowInteractions?: boolean;
  coverImage?: string | null;
  maxSeats?: number | null;
  syllabus?: string | null;
  trainers?: string | null;
  trainersList?: TrainerFormItem[];
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

export function TrainingManager({
  initialPrograms,
}: {
  initialPrograms: TrainingProgramAdmin[];
}) {
  const router = useRouter();
  const [programs, setPrograms] = useState<TrainingProgramAdmin[]>(initialPrograms);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [tablePage, setTablePage] = useState(1);

  // Drawer / Slide-over state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgramAdmin | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Software Engineering",
    summary: "",
    description: "",
    level: "Intermediate", // dropdown -> Beginner, Intermediate, Advanced
    duration: "10 Weeks",
    schedule: "Mon & Wed, 4:00 PM - 7:00 PM",
    startDate: "",
    endDate: "",
    mode: "On-Campus",
    certification: "JANIC Certified Practitioner",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    isFeatured: false,
    allowComments: true,
    allowInteractions: true,
    coverImage: "",
    maxSeats: 30,
    syllabus: "",
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

  const [trainersList, setTrainersList] = useState<TrainerFormItem[]>([]);
  const [customCategoryMode, setCustomCategoryMode] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  // Unique categories for filtering & dropdown (combining defaults + active)
  const allCategories = useMemo(() => {
    const set = new Set([
      ...DEFAULT_TRAINING_CATEGORIES,
      ...programs.map((p) => p.category).filter(Boolean),
    ]);
    return Array.from(set);
  }, [programs]);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
      if (filterLevel !== "ALL" && p.level.toLowerCase() !== filterLevel.toLowerCase())
        return false;
      if (filterCategory !== "ALL" && p.category !== filterCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat) return false;
      }
      return true;
    });
  }, [programs, filterStatus, filterLevel, filterCategory, search]);

  // Pagination for table
  const totalPages = Math.ceil(filteredPrograms.length / TABLE_PAGE_SIZE);
  const paginatedPrograms = useMemo(() => {
    const start = (tablePage - 1) * TABLE_PAGE_SIZE;
    return filteredPrograms.slice(start, start + TABLE_PAGE_SIZE);
  }, [filteredPrograms, tablePage]);

  // Open Add Drawer
  const handleOpenAdd = () => {
    setEditingProgram(null);
    setCustomCategoryMode(false);
    setCustomCategoryInput("");
    setEngagementMode("ALL");
    setFormData({
      title: "",
      category: "Software Engineering",
      summary: "",
      description: "",
      level: "Intermediate",
      duration: "10 Weeks",
      schedule: "Mon & Wed, 4:00 PM - 7:00 PM",
      startDate: "",
      endDate: "",
      mode: "On-Campus",
      certification: "JANIC Certified Practitioner",
      status: "DRAFT",
      isFeatured: false,
      allowComments: true,
      allowInteractions: true,
      coverImage: "",
      maxSeats: 30,
      syllabus: "",
    });
    setTrainersList([
      {
        name: "",
        bio: "",
        avatar: "",
        socials: { linkedin: "", twitter: "", github: "", website: "" },
      },
    ]);
    setDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (p: TrainingProgramAdmin) => {
    setEditingProgram(p);

    const allowC = p.allowComments !== undefined ? Boolean(p.allowComments) : true;
    const allowI = p.allowInteractions !== undefined ? Boolean(p.allowInteractions) : true;
    let mode: EngagementMode = "ALL";
    if (allowC && allowI) mode = "ALL";
    else if (allowC && !allowI) mode = "COMMENTS_ONLY";
    else if (!allowC && allowI) mode = "INTERACTIONS_ONLY";
    else mode = "NONE";

    setEngagementMode(mode);

    const isCustomCat = !DEFAULT_TRAINING_CATEGORIES.includes(p.category);
    setCustomCategoryMode(isCustomCat);
    setCustomCategoryInput(isCustomCat ? p.category : "");

    let parsedTrainers: TrainerFormItem[] = [];
    if (p.trainersList && p.trainersList.length > 0) {
      parsedTrainers = p.trainersList;
    } else if (p.trainers) {
      try {
        parsedTrainers = typeof p.trainers === "string" ? JSON.parse(p.trainers) : p.trainers;
      } catch {
        parsedTrainers = [];
      }
    }

    if (parsedTrainers.length === 0) {
      parsedTrainers = [
        {
          name: "",
          bio: "",
          avatar: "",
          socials: { linkedin: "", twitter: "", github: "", website: "" },
        },
      ];
    }

    const fmtDateInput = (d: any) => {
      if (!d) return "";
      try {
        const dateObj = new Date(d);
        return dateObj.toISOString().slice(0, 16);
      } catch {
        return "";
      }
    };

    setFormData({
      title: p.title,
      category: p.category,
      summary: p.summary || "",
      description: p.description,
      level: p.level || "Intermediate",
      duration: p.duration || "",
      schedule: p.schedule || "",
      startDate: fmtDateInput(p.startDate),
      endDate: fmtDateInput(p.endDate),
      mode: p.mode || "On-Campus",
      certification: p.certification || "",
      status: p.status,
      isFeatured: p.isFeatured,
      allowComments: allowC,
      allowInteractions: allowI,
      coverImage: p.coverImage || "",
      maxSeats: p.maxSeats || 30,
      syllabus: p.syllabus || "",
    });

    setTrainersList(parsedTrainers);
    setDrawerOpen(true);
  };

  // Add / Remove Trainer Handlers
  const handleAddTrainer = () => {
    setTrainersList((prev) => [
      ...prev,
      {
        name: "",
        bio: "",
        avatar: "",
        socials: { linkedin: "", twitter: "", github: "", website: "" },
      },
    ]);
  };

  const handleRemoveTrainer = (idx: number) => {
    setTrainersList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTrainerChange = (idx: number, field: string, val: string) => {
    setTrainersList((prev) => {
      const copy = [...prev];
      if (field.startsWith("socials.")) {
        const socialKey = field.split(".")[1] as keyof NonNullable<TrainerFormItem["socials"]>;
        copy[idx] = {
          ...copy[idx],
          socials: {
            ...copy[idx].socials,
            [socialKey]: val,
          },
        };
      } else {
        copy[idx] = {
          ...copy[idx],
          [field]: val,
        };
      }
      return copy;
    });
  };

  // Auto-format schedule string when dates change if empty
  const handleDateChange = (field: "startDate" | "endDate", val: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (next.startDate && next.endDate && !prev.schedule) {
        try {
          const s = new Date(next.startDate).toLocaleDateString();
          const e = new Date(next.endDate).toLocaleDateString();
          next.schedule = `${s} – ${e}`;
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out blank trainers
      const validTrainers = trainersList.filter((t) => t.name.trim() !== "");
      const computedDuration = calculateDuration(formData.startDate, formData.endDate);
      const finalCategory = (customCategoryMode ? customCategoryInput.trim() : formData.category) || "Software Engineering";

      const payload = {
        ...formData,
        category: finalCategory,
        duration: computedDuration,
        trainers: validTrainers,
      };

      const url = editingProgram ? `/api/training/${editingProgram.id}` : "/api/training";
      const method = editingProgram ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setDrawerOpen(false);
      router.refresh();

      if (editingProgram) {
        setPrograms((prev) =>
          prev.map((item) =>
            item.id === editingProgram.id
              ? ({
                  ...item,
                  ...payload,
                  ...data.item,
                  stats: item.stats,
                  trainersList: validTrainers,
                  updatedAt: new Date(),
                } as any)
              : item
          )
        );
      } else {
        setPrograms((prev) => [
          {
            ...data.item,
            category: finalCategory,
            duration: computedDuration,
            trainersList: validTrainers,
            stats: { commentsCount: 0, likesCount: 0, ratingsCount: 0, avgRating: 0 },
          },
          ...prev,
        ]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving training program");
    } finally {
      setLoading(false);
    }
  };


  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this training program?")) return;
    try {
      const res = await fetch(`/api/training/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } catch {
      alert("Error deleting program");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#08245C] dark:text-white">
            Training Programs &amp; Certifications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage course curriculum, instructor assignments, cohort schedules, and enrollments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Training Program
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search title, category..."
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

          {/* Level Filter */}
          <div>
            <select
              value={filterLevel}
              onChange={(e) => {
                setFilterLevel(e.target.value);
                setTablePage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
            >
              <option value="ALL">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
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
              <option value="ALL">All Categories</option>
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
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredPrograms.length}</strong> filtered programs (Total:{" "}
            {programs.length})
          </span>
          {(search || filterStatus !== "ALL" || filterLevel !== "ALL" || filterCategory !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterStatus("ALL");
                setFilterLevel("ALL");
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
                <th className="py-3.5 px-4 min-w-[280px]">Program &amp; Cover</th>
                <th className="py-3.5 px-4 min-w-[170px] whitespace-nowrap">Category</th>
                <th className="py-3.5 px-4 min-w-[110px] whitespace-nowrap">Level</th>
                <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">Duration &amp; Schedule</th>
                <th className="py-3.5 px-4 min-w-[160px] whitespace-nowrap">Instructors</th>
                <th className="py-3.5 px-4 min-w-[130px] whitespace-nowrap">Ratings &amp; Stats</th>
                <th className="py-3.5 px-4 min-w-[100px] whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 min-w-[100px] whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedPrograms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    No training programs match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedPrograms.map((p) => {
                  const trainers =
                    p.trainersList ||
                    (p.trainers ? JSON.parse(p.trainers) : []);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                      {/* Program & Cover */}
                      <td className="py-3.5 px-4 min-w-[280px] max-w-[340px]">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            {p.coverImage ? (
                              <Image
                                src={p.coverImage}
                                alt={p.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                <Award className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 block text-xs hover:text-[#0875D1] transition-colors">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 min-w-[170px] whitespace-nowrap">
                        <span className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 shadow-2xs">
                          {p.category}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-4 min-w-[110px] whitespace-nowrap">
                        <span
                          className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.level.toLowerCase().includes("beginner")
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                              : p.level.toLowerCase().includes("advanced")
                              ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                              : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {p.level}
                        </span>
                      </td>

                      {/* Duration & Schedule */}
                      <td className="py-3.5 px-4 min-w-[160px] whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <span className="font-semibold block">{p.duration}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate max-w-[180px]">
                          {p.schedule}
                        </span>
                      </td>

                      {/* Instructors */}
                      <td className="py-3.5 px-4 min-w-[160px]">
                        {trainers.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                              {trainers.slice(0, 3).map((t: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="relative w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 overflow-hidden bg-slate-200 dark:bg-slate-700"
                                >
                                  {t.avatar ? (
                                    <Image
                                      src={t.avatar}
                                      alt={t.name}
                                      fill
                                      sizes="24px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-[10px]">
                                      {t.name?.charAt(0) || "T"}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]" title={trainers.map((t: any) => t.name).join(", ")}>
                              {trainers.map((t: any) => t.name).join(", ")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-[11px]">No trainers</span>
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
                          className={`inline-flex items-center whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                            href={`/training/${p.slug}`}
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
                            title="Edit Program"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition"
                            title="Delete Program"
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
          <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Showing {(tablePage - 1) * TABLE_PAGE_SIZE + 1}–
              {Math.min(tablePage * TABLE_PAGE_SIZE, filteredPrograms.length)} of{" "}
              {filteredPrograms.length} items
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTablePage(Math.max(1, tablePage - 1))}
                disabled={tablePage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                      ? "bg-[#08245C] text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setTablePage(Math.min(totalPages, tablePage + 1))}
                disabled={tablePage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADVANCED SLIDE-OVER DRAWER FOR TRAINING CREATION / EDITING */}
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
                  {editingProgram ? "Update Program" : "New Program"}
                </span>
                <h2 className="text-xl font-black text-[#08245C] dark:text-white">
                  {editingProgram ? "Edit Training Program" : "Create Training Program"}
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
              {/* SECTION 1: PROGRAM INFORMATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4 text-[#0875D1]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                    1. Program Essentials
                  </h3>
                </div>

                {/* Program Title * */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Program Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full-Stack Web Development Bootcamp"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category * */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomCategoryMode(!customCategoryMode);
                          if (!customCategoryMode) {
                            setCustomCategoryInput(formData.category);
                          }
                        }}
                        className="text-[10px] font-bold text-[#0875D1] hover:underline"
                      >
                        {customCategoryMode ? "← Standard List" : "+ Custom"}
                      </button>
                    </div>

                    {customCategoryMode ? (
                      <input
                        type="text"
                        required
                        value={customCategoryInput}
                        onChange={(e) => {
                          setCustomCategoryInput(e.target.value);
                          setFormData({ ...formData, category: e.target.value });
                        }}
                        placeholder="Type custom category name..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-[#0875D1] text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                      />
                    ) : (
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          if (e.target.value === "__CUSTOM__") {
                            setCustomCategoryMode(true);
                            setCustomCategoryInput("");
                          } else {
                            setFormData({ ...formData, category: e.target.value });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                      >
                        {allCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="__CUSTOM__" className="text-[#0875D1] font-bold">
                          + Custom Category...
                        </option>
                      </select>
                    )}
                  </div>

                  {/* Level dropdown -> beginner, advanced, intermediate */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Auto-Calculated Duration (No manual input needed) */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-[#0875D1] shrink-0" />
                    <div>
                      <span className="font-bold text-[#08245C] dark:text-white">Auto-Calculated Duration:</span>{" "}
                      <span className="font-extrabold text-[#0875D1] dark:text-blue-400">
                        {calculateDuration(formData.startDate, formData.endDate)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Automatically computed from cohort start &amp; end dates
                  </span>
                </div>
              </div>


              {/* SECTION 2: SCHEDULE & DATES */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Calendar className="w-4 h-4 text-[#0875D1]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                    2. Schedule &amp; Cohort Dates
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date & Time Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Start Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => handleDateChange("startDate", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>

                  {/* End Date & Time Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      End Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => handleDateChange("endDate", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                    />
                  </div>
                </div>

                {/* Schedule Text Summary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Schedule Description / Days &amp; Hours
                  </label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="e.g. Mon & Wed, 4:00 PM - 7:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* SECTION 3: SUMMARY & DESCRIPTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-[#0875D1]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                    3. Overview &amp; Curriculum Content
                  </h3>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Summary (Short pitch for cards)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Brief 2-line summary to be displayed on training catalog cards..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800 resize-none"
                  />
                </div>

                {/* Full Description * */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive overview, prerequisites, target audience, and detailed objectives..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>

                {/* Syllabus Modules */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Syllabus / Modules Breakdown (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.syllabus}
                    onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                    placeholder="Week 1-3: Fundamentals&#10;Week 4-6: Advanced Topics&#10;Week 7-10: Capstone Project"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1] focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              {/* SECTION 4: COVER IMAGE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <UploadCloud className="w-4 h-4 text-[#0875D1]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                    4. Cover Image
                  </h3>
                </div>

                <ImageUploadChoice
                  label="Program Cover Image"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  folder="training"
                  placeholder="Paste cover image URL or upload directly..."
                />
              </div>

              {/* SECTION 5: INSTRUCTORS & TRAINERS (DYNAMIC ARRAY) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0875D1]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#08245C] dark:text-white">
                      5. Trainers &amp; Instructors ({trainersList.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTrainer}
                    className="text-xs font-bold text-[#0875D1] hover:text-[#065ea8] flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Trainer
                  </button>
                </div>

                <div className="space-y-4">
                  {trainersList.map((trainer, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#08245C] dark:text-white">
                          Trainer #{idx + 1}
                        </span>
                        {trainersList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTrainer(idx)}
                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 text-xs flex items-center gap-1 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Trainer Name & Bio */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Trainer Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={trainer.name}
                            onChange={(e) => handleTrainerChange(idx, "name", e.target.value)}
                            placeholder="e.g. Dr. Abdullahi Nur"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Small Description / Bio
                          </label>
                          <input
                            type="text"
                            value={trainer.bio || ""}
                            onChange={(e) => handleTrainerChange(idx, "bio", e.target.value)}
                            placeholder="e.g. Lead Cloud Architect, 10+ yrs exp."
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                          />
                        </div>
                      </div>

                      {/* Trainer Avatar Upload from Device or Link */}
                      <AvatarUploadChoice
                        label="Trainer Avatar / Photo"
                        value={trainer.avatar || ""}
                        onChange={(url) => handleTrainerChange(idx, "avatar", url)}
                        folder="trainers"
                        placeholder="Paste image URL or upload directly from device..."
                      />

                      {/* Socials */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Trainer Social Links
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={trainer.socials?.linkedin || ""}
                            onChange={(e) =>
                              handleTrainerChange(idx, "socials.linkedin", e.target.value)
                            }
                            placeholder="LinkedIn URL"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                          <input
                            type="text"
                            value={trainer.socials?.twitter || ""}
                            onChange={(e) =>
                              handleTrainerChange(idx, "socials.twitter", e.target.value)
                            }
                            placeholder="Twitter / X URL"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                          <input
                            type="text"
                            value={trainer.socials?.github || ""}
                            onChange={(e) =>
                              handleTrainerChange(idx, "socials.github", e.target.value)
                            }
                            placeholder="GitHub URL"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                          <input
                            type="text"
                            value={trainer.socials?.website || ""}
                            onChange={(e) =>
                              handleTrainerChange(idx, "socials.website", e.target.value)
                            }
                            placeholder="Portfolio / Personal Website"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: SETTINGS & PUBLISHING */}
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Delivery Mode
                    </label>
                    <input
                      type="text"
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      placeholder="e.g. On-Campus or Hybrid"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Certification Name
                    </label>
                    <input
                      type="text"
                      value={formData.certification}
                      onChange={(e) =>
                        setFormData({ ...formData, certification: e.target.value })
                      }
                      placeholder="e.g. JANIC Certified"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#0875D1] focus:ring-[#0875D1]"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Highlight as Featured Program on Homepage
                  </label>
                </div>
              </div>

              {/* DRAWER FOOTER / SUBMIT BUTTON */}
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
                  {editingProgram ? "Update Program" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
