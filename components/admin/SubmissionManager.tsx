"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Trash2,
  ExternalLink,
  PanelRightClose,
  Loader2,
  MessageSquare,
  Users,
  Cpu,
  Link2,
  UserCircle,
  GraduationCap,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { notify, confirmDestructive } from "@/lib/toast";

interface Submission {
  id: string;
  title: string;
  category: string;
  description: string;
  technologyStack?: string | null;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  studentId?: string | null;
  teamMembers?: string | null;
  prototypeUrl?: string | null;
  videoUrl?: string | null;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  reviewNotes?: string | null;
  createdAt: string | Date;
}

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
    dot: "bg-amber-500",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
    dot: "bg-blue-500",
  },
  APPROVED: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
    dot: "bg-rose-500",
  },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold",
        meta.cls
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function SubmissionManager({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusInput, setStatusInput] = useState<Submission["status"]>("PENDING");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedSub) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSub(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedSub]);

  const handleOpenReview = (s: Submission) => {
    setSelectedSub(s);
    setReviewNotes(s.reviewNotes || "");
    setStatusInput(s.status);
  };

  const handleSaveReview = async () => {
    if (!selectedSub) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/submissions/${selectedSub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusInput, reviewNotes }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === selectedSub.id ? { ...item, status: statusInput, reviewNotes } : item
        )
      );
      notify.success(`Review saved for "${selectedSub.title}"`);
      setSelectedSub(null);
      router.refresh();
    } catch (err: unknown) {
      notify.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirmDestructive({
      title: "Delete this submission?",
      description: `"${title}" will be permanently removed.`,
      confirmLabel: "Delete submission",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        notify.success("Submission deleted");
        router.refresh();
      }
    } catch (err: unknown) {
      notify.error(err);
    }
  };

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      s.title.toLowerCase().includes(q) ||
      s.submitterName.toLowerCase().includes(q) ||
      s.submitterEmail.toLowerCase().includes(q);

    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search proposals by title or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs font-semibold text-foreground"
        >
          <option value="all">All Review States</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Project Title</th>
                <th className="py-2.5 px-4">Student Submitter</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Submitted</th>
                <th className="py-2.5 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => handleOpenReview(s)}
                    className="hover:bg-muted/50 transition cursor-pointer"
                  >
                    <td className="py-2.5 px-4 font-bold text-foreground max-w-xs truncate">{s.title}</td>
                    <td className="py-2.5 px-4 text-foreground font-medium">
                      {s.submitterName}
                      <span className="block text-[11px] text-muted-foreground font-mono">
                        {s.submitterEmail}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{s.category}</td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReview(s);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(s.id, s.title);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          aria-label="Delete submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs bg-card rounded-xl border border-border">
            No submissions found.
          </div>
        ) : (
          filtered.map((s) => (
            <div key={s.id} className="bg-card rounded-xl border border-border p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-foreground min-w-0">{s.title}</p>
                <button
                  onClick={() => handleDelete(s.id, s.title)}
                  className="p-1.5 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50 transition shrink-0"
                  aria-label="Delete submission"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                {s.submitterName} · <span className="font-mono">{s.submitterEmail}</span>
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge status={s.status} />
                <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                  {s.category}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
                <span className="text-[11px] text-muted-foreground">{formatDate(s.createdAt)}</span>
                <button
                  onClick={() => handleOpenReview(s)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review drawer */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setSelectedSub(null)}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Submission review"
            className="relative w-full sm:w-[540px] lg:w-[620px] max-w-full bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="shrink-0 border-b border-border px-4 sm:px-6 py-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#0875D1]">
                  {selectedSub.category}
                </p>
                <h2 className="text-sm sm:text-base font-bold text-foreground mt-1 leading-snug">
                  {selectedSub.title}
                </h2>
                <div className="flex items-center gap-1.5 mt-2">
                  <StatusBadge status={selectedSub.status} />
                </div>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="shrink-0 p-2 rounded-lg text-muted-foreground hover:bg-accent transition"
                aria-label="Close drawer"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
              <DrawerSection title="Submitter" icon={UserCircle}>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Name" value={selectedSub.submitterName} />
                  <InfoItem label="Phone" value={selectedSub.submitterPhone} />
                  <InfoItem label="Student ID" value={selectedSub.studentId} />
                </div>
                <a
                  href={`mailto:${selectedSub.submitterEmail}`}
                  className="mt-3 block text-xs font-medium text-[#0875D1] hover:underline break-all"
                >
                  {selectedSub.submitterEmail}
                </a>
              </DrawerSection>

              <DrawerSection title="Project Description" icon={MessageSquare}>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedSub.description}
                </p>
              </DrawerSection>

              {selectedSub.technologyStack && (
                <DrawerSection title="Tech Stack" icon={Cpu}>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedSub.technologyStack}
                  </p>
                </DrawerSection>
              )}

              {selectedSub.teamMembers && (
                <DrawerSection title="Team Members" icon={Users}>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedSub.teamMembers}
                  </p>
                </DrawerSection>
              )}

              {(selectedSub.prototypeUrl || selectedSub.videoUrl) && (
                <DrawerSection title="Links" icon={Link2}>
                  <div className="flex flex-wrap gap-2">
                    {selectedSub.prototypeUrl && (
                      <a
                        href={selectedSub.prototypeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition"
                      >
                        Prototype URL
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {selectedSub.videoUrl && (
                      <a
                        href={selectedSub.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition"
                      >
                        Video Demo
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </DrawerSection>
              )}

              {selectedSub.reviewNotes && (
                <DrawerSection title="Previous Review Notes" icon={GraduationCap}>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedSub.reviewNotes}
                  </p>
                </DrawerSection>
              )}
            </div>

            {/* Footer — review decision */}
            <div className="shrink-0 border-t border-border px-4 sm:px-6 py-4 bg-card space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Faculty Review Decision
              </label>

              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as Submission["status"])}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="PENDING">PENDING</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="APPROVED">APPROVED (Admit to Hub)</option>
                <option value="REJECTED">REJECTED</option>
              </select>

              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Notes on laboratory requirements, mentors assigned, or reasons for rejection..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-accent transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReview}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold shadow-md transition cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {saving ? "Saving..." : "Save Review Decision"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function DrawerSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h3>
      <div className="p-3.5 rounded-xl bg-muted/40 border border-border">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-xs font-semibold text-foreground truncate mt-0.5">{value || "—"}</p>
    </div>
  );
}