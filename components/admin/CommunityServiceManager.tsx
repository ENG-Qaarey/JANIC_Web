"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Building2,
  Heart,
  CheckCircle2,
  RefreshCw,
  ArrowUpDown,
  Mail,
  Phone,
  Globe,
  MapPin,
  CalendarDays,
  Wallet,
  MessageSquare,
  History,
  PanelRightClose,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/toast";

interface ServiceRequestRow {
  id: string;
  requestNumber: string;
  organizationName: string;
  organizationType: string;
  organizationCategory: string;
  contactPerson: string;
  email: string;
  phone: string;
  requestTitle: string;
  status: string;
  priority: string;
  createdAt: string;
  serviceRef?: { id: string; name: string };
  serviceCategoryRef?: { id: string; name: string };
  assignedToId: string | null;
}

interface Stats {
  total: number;
  statusCounts: Record<string, number>;
  orgTypeCounts: Record<string, number>;
}

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  SUBMITTED: {
    label: "Submitted",
    cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
    dot: "bg-blue-500",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
    dot: "bg-amber-500",
  },
  ADDITIONAL_INFO_REQUIRED: {
    label: "Needs Info",
    cls: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-900",
    dot: "bg-orange-500",
  },
  APPROVED: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
    dot: "bg-emerald-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-900",
    dot: "bg-violet-500",
  },
  COMPLETED: {
    label: "Completed",
    cls: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900",
    dot: "bg-teal-500",
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
    dot: "bg-rose-500",
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
  },
};

const PRIORITY_META: Record<string, { cls: string; label: string }> = {
  LOW: { cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400", label: "Low" },
  MEDIUM: { cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", label: "Medium" },
  HIGH: { cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300", label: "High" },
  URGENT: { cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300", label: "Urgent" },
};

const ALL_STATUSES = Object.keys(STATUS_META);

const TRANSITIONS: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW", "ADDITIONAL_INFO_REQUIRED", "REJECTED", "CANCELLED"],
  UNDER_REVIEW: ["APPROVED", "ADDITIONAL_INFO_REQUIRED", "REJECTED", "CANCELLED"],
  ADDITIONAL_INFO_REQUIRED: ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  APPROVED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
};

const ACTION_LABEL: Record<string, string> = {
  UNDER_REVIEW: "Start Review",
  ADDITIONAL_INFO_REQUIRED: "Request Info",
  APPROVED: "Approve",
  IN_PROGRESS: "Start Progress",
  COMPLETED: "Mark Complete",
  REJECTED: "Reject",
  CANCELLED: "Cancel",
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    dot: "bg-slate-400",
  };
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

function PriorityBadge({ priority }: { priority: string }) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.MEDIUM;
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", meta.cls)}>
      {meta.label}
    </span>
  );
}

function OrgTypeTag({ type }: { type: string }) {
  const profit = type === "FOR_PROFIT";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
        profit
          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
      )}
    >
      {profit ? <Building2 className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
      {profit ? "For-Profit" : "Nonprofit"}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CommunityServiceManager() {
  const [requests, setRequests] = useState<ServiceRequestRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orgTypeFilter, setOrgTypeFilter] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (orgTypeFilter) params.set("organizationType", orgTypeFilter);

      const res = await fetch(`/api/community-services?${params}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data.requests);
        setTotalPages(data.data.totalPages);
        setTotal(data.data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, orgTypeFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/community-services/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch {
      /* stats are non-critical */
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const openDetail = async (row: ServiceRequestRow) => {
    setDrawerOpen(true);
    setDetailLoading(true);
    setDetail(null);
    setRejectOpen(false);
    setNoteOpen(false);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/community-services/${row.id}`);
      const data = await res.json();
      if (data.success) setDetail(data.data);
    } catch {
      setActionError("Could not load request details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = async (action: string, body?: Record<string, unknown>) => {
    if (!detail) return;
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/community-services/${detail.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Action failed");

      setActionSuccess(`${ACTION_LABEL[data.data?.status] ?? "Update"} applied`);
      notify.success(`${ACTION_LABEL[data.data?.status] ?? "Request updated"} — ${detail.requestNumber}`);
      setRejectOpen(false);
      setNoteOpen(false);
      setRejectReason("");
      setNoteContent("");

      const refreshed = await fetch(`/api/community-services/${detail.id}`).then((r) => r.json());
      if (refreshed.success) setDetail(refreshed.data);

      fetchRequests();
      fetchStats();
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Action failed");
      notify.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const allowed = detail ? TRANSITIONS[detail.status] ?? [] : [];

  const kpis = stats
    ? [
        { label: "Total Requests", value: stats.total, tone: "text-[#0875D1]" },
        { label: "Awaiting Review", value: stats.statusCounts.SUBMITTED || 0, tone: "text-blue-600" },
        { label: "Under Review", value: stats.statusCounts.UNDER_REVIEW || 0, tone: "text-amber-600" },
        { label: "In Progress", value: stats.statusCounts.IN_PROGRESS || 0, tone: "text-violet-600" },
        { label: "Completed", value: stats.statusCounts.COMPLETED || 0, tone: "text-emerald-600" },
      ]
    : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#08245C] dark:text-white">Service Requests</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review and manage incoming community service requests
          </p>
        </div>
        <button
          onClick={() => {
            fetchRequests();
            fetchStats();
          }}
          className="inline-flex items-center gap-1.5 self-start px-3.5 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* KPI strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {kpis.map((k) => (
            <div key={k.label} className="bg-card rounded-xl border border-border px-4 py-3">
              <p className={cn("text-2xl font-black leading-none", k.tone)}>{k.value}</p>
              <p className="text-[11px] text-muted-foreground font-medium mt-1.5">{k.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search organization, contact, title, or request number"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 rounded-lg border border-border bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
        <select
          value={orgTypeFilter}
          onChange={(e) => {
            setOrgTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2.5 rounded-lg border border-border bg-card text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All types</option>
          <option value="FOR_PROFIT">For-Profit</option>
          <option value="NONPROFIT">Nonprofit</option>
        </select>
      </div>

      {actionSuccess && (
        <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          {actionSuccess}
        </div>
      )}
      {actionError && !drawerOpen && (
        <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold">
          {actionError}
        </div>
      )}

      {/* Table — desktop */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Request</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-muted-foreground">
                    No service requests match your filters.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => openDetail(r)}
                    className="hover:bg-muted/50 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 max-w-[240px]">
                      <p className="font-mono font-bold text-[#0875D1] text-[11px]">{r.requestNumber}</p>
                      <p className="font-semibold text-foreground truncate">{r.requestTitle}</p>
                    </td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <p className="font-medium text-foreground truncate">{r.organizationName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{r.contactPerson}</p>
                    </td>
                    <td className="py-3 px-4">
                      <OrgTypeTag type={r.organizationType} />
                    </td>
                    <td className="py-3 px-4 max-w-[180px]">
                      <p className="text-slate-600 dark:text-slate-400 truncate">{r.serviceRef?.name ?? "—"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">{formatDate(r.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(r);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </button>
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
        {loading ? (
          <div className="py-14 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-14 text-center text-muted-foreground text-xs bg-card rounded-xl border border-border">
            No service requests match your filters.
          </div>
        ) : (
          requests.map((r) => (
            <button
              key={r.id}
              onClick={() => openDetail(r)}
              className="w-full text-left bg-card rounded-xl border border-border p-4 space-y-2.5 active:scale-[0.99] transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono font-bold text-[#0875D1] text-[10px]">{r.requestNumber}</p>
                  <p className="text-sm font-bold text-foreground truncate mt-0.5">{r.requestTitle}</p>
                </div>
                <PriorityBadge priority={r.priority} />
              </div>

              <p className="text-xs text-muted-foreground truncate">{r.organizationName}</p>

              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge status={r.status} />
                <OrgTypeTag type={r.organizationType} />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-[11px] text-muted-foreground truncate">{r.serviceRef?.name}</span>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap ml-2">
                  {formatDate(r.createdAt)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-muted-foreground">
            Page <span className="font-bold text-foreground">{page}</span> of {totalPages} · {total} requests
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-accent disabled:opacity-40 transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <RequestDrawer
        open={drawerOpen}
        detail={detail}
        loading={detailLoading}
        allowed={allowed}
        actionLoading={actionLoading}
        actionError={actionError}
        actionSuccess={actionSuccess}
        rejectOpen={rejectOpen}
        setRejectOpen={setRejectOpen}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        noteOpen={noteOpen}
        setNoteOpen={setNoteOpen}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        onClose={() => setDrawerOpen(false)}
        onAction={handleAction}
      />
    </div>
  );
}

function RequestDrawer({
  open,
  detail,
  loading,
  allowed,
  actionLoading,
  actionError,
  actionSuccess,
  rejectOpen,
  setRejectOpen,
  rejectReason,
  setRejectReason,
  noteOpen,
  setNoteOpen,
  noteContent,
  setNoteContent,
  onClose,
  onAction,
}: any) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Service request details"
        className="relative w-full sm:w-[520px] lg:w-[600px] max-w-full bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 sm:px-6 py-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {loading ? (
              <div className="h-5 w-40 rounded bg-muted animate-pulse" />
            ) : detail ? (
              <>
                <p className="font-mono text-[11px] font-bold text-[#0875D1]">{detail.requestNumber}</p>
                <h2 className="text-sm sm:text-base font-bold text-foreground truncate mt-0.5">
                  {detail.requestTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <StatusBadge status={detail.status} />
                  <OrgTypeTag type={detail.organizationType} />
                  <PriorityBadge priority={detail.priority} />
                </div>
              </>
            ) : (
              <h2 className="text-base font-bold text-foreground">Request details</h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-muted-foreground hover:bg-accent transition"
            aria-label="Close drawer"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : !detail ? (
            <p className="text-xs text-muted-foreground text-center py-10">Could not load this request.</p>
          ) : (
            <>
              {actionError && (
                <div className="px-3 py-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {actionError}
                </div>
              )}
              {actionSuccess && (
                <div className="px-3 py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  {actionSuccess}
                </div>
              )}

              {/* Contact */}
              <DrawerSection title="Organization" icon={Building2}>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Organization" value={detail.organizationName} />
                  <InfoItem label="Category" value={detail.organizationCategory?.replace(/_/g, " ")} />
                  <InfoItem label="Contact" value={detail.contactPerson} />
                  <InfoItem label="Preferred contact" value={detail.preferredContactMethod?.replace(/_/g, " ")} />
                </div>
                <div className="mt-3 space-y-1.5">
                  <a
                    href={`mailto:${detail.email}`}
                    className="flex items-center gap-2 text-xs text-foreground hover:text-[#0875D1] transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {detail.email}
                  </a>
                  <p className="flex items-center gap-2 text-xs text-foreground">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {detail.phone}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-foreground">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {[detail.city, detail.country].filter(Boolean).join(", ")}
                  </p>
                  {detail.website && (
                    <p className="flex items-center gap-2 text-xs text-foreground">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {detail.website}
                    </p>
                  )}
                </div>
              </DrawerSection>

              {/* Service */}
              <DrawerSection title="Requested Service" icon={ArrowUpDown}>
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem label="Category" value={detail.serviceCategoryRef?.name} />
                  <InfoItem label="Service" value={detail.serviceRef?.name} />
                </div>
                {detail.startDate && (
                  <p className="flex items-center gap-2 text-xs text-foreground mt-3">
                    <CalendarDays className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {formatDate(detail.startDate)}
                    {detail.preferredCompletionDate && ` → ${formatDate(detail.preferredCompletionDate)}`}
                  </p>
                )}
                {detail.budget && (
                  <p className="flex items-center gap-2 text-xs text-foreground mt-1.5">
                    <Wallet className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {detail.budget}
                  </p>
                )}
              </DrawerSection>

              {/* Description */}
              <DrawerSection title="Description" icon={MessageSquare}>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {detail.description}
                </p>
                {detail.expectedOutcomes && (
                  <>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-4 mb-1">
                      Expected outcomes
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {detail.expectedOutcomes}
                    </p>
                  </>
                )}
              </DrawerSection>

              {/* Type-specific */}
              {detail.organizationType === "FOR_PROFIT" ? (
                <DrawerSection title="Business details" icon={Building2}>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem label="Sector" value={detail.businessSector} />
                    <InfoItem
                      label="Business type"
                      value={detail.isExistingBusiness === null ? null : detail.isExistingBusiness ? "Existing" : "New venture"}
                    />
                  </div>
                  {detail.businessOutcome && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3">{detail.businessOutcome}</p>
                  )}
                </DrawerSection>
              ) : (
                <DrawerSection title="Organization details" icon={Heart}>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoItem label="Funding status" value={detail.fundingStatus?.replace(/_/g, " ")} />
                    <InfoItem
                      label="Existing project"
                      value={
                        detail.isExistingCommunityProject === null
                          ? null
                          : detail.isExistingCommunityProject
                            ? "Yes"
                            : "No"
                      }
                    />
                  </div>
                  {detail.organizationMission && (
                    <>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-3 mb-1">
                        Mission
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {detail.organizationMission}
                      </p>
                    </>
                  )}
                </DrawerSection>
              )}

              {/* Notes */}
              <DrawerSection title={`Internal notes (${detail.notes?.length || 0})`} icon={MessageSquare}>
                {detail.notes?.length ? (
                  <div className="space-y-2">
                    {detail.notes.map((n: any) => (
                      <div key={n.id} className="p-3 rounded-lg bg-muted/60 border border-border">
                        <p className="text-xs text-foreground whitespace-pre-wrap">{n.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-1.5">{formatDate(n.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No internal notes yet.</p>
                )}
              </DrawerSection>

              {/* History */}
              <DrawerSection title="History" icon={History}>
                {detail.history?.length ? (
                  <ol className="space-y-2.5">
                    {detail.history.map((h: any) => (
                      <li key={h.id} className="flex gap-2.5">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground">{h.action.replace(/_/g, " ")}</p>
                          {h.fromStatus && h.toStatus && (
                            <p className="text-[11px] text-muted-foreground">
                              {h.fromStatus.replace(/_/g, " ")} → {h.toStatus.replace(/_/g, " ")}
                            </p>
                          )}
                          {h.notes && <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{h.notes}</p>}
                          <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(h.createdAt)}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-xs text-muted-foreground">No history recorded.</p>
                )}
              </DrawerSection>
            </>
          )}
        </div>

        {/* Footer actions */}
        {!loading && detail && (
          <div className="shrink-0 border-t border-border px-4 sm:px-6 py-3.5 bg-card space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {allowed.length === 0 ? (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  This request is in a terminal state — no further actions available.
                </p>
              ) : (
                allowed.map((next: string) =>
                  next === "REJECTED" ? (
                    <button
                      key={next}
                      onClick={() => setRejectOpen(true)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition disabled:opacity-50"
                    >
                      {ACTION_LABEL[next]}
                    </button>
                  ) : (
                    <button
                      key={next}
                      onClick={() => onAction("status", { status: next })}
                      disabled={actionLoading}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50",
                        next === "APPROVED"
                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                          : next === "COMPLETED"
                            ? "bg-teal-50 hover:bg-teal-100 text-teal-700"
                            : next === "IN_PROGRESS"
                              ? "bg-violet-50 hover:bg-violet-100 text-violet-700"
                              : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                      )}
                    >
                      {actionLoading ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : null}
                      {ACTION_LABEL[next]}
                    </button>
                  )
                )
              )}
              <button
                onClick={() => setNoteOpen((v: boolean) => !v)}
                className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold transition"
              >
                Add Note
              </button>
            </div>

            {rejectOpen && (
              <div className="space-y-2 p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                  placeholder="Reason for rejection (required)"
                  className="w-full px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900 bg-card text-xs focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onAction("reject", { reason: rejectReason })}
                    disabled={actionLoading || !rejectReason.trim()}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 transition"
                  >
                    Confirm rejection
                  </button>
                  <button
                    onClick={() => setRejectOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {noteOpen && (
              <div className="space-y-2 p-3 rounded-lg bg-muted/60 border border-border">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={2}
                  placeholder="Internal note — not visible to the requester"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onAction("note", { content: noteContent })}
                    disabled={actionLoading || !noteContent.trim()}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50 transition"
                  >
                    Save note
                  </button>
                  <button
                    onClick={() => setNoteOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
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