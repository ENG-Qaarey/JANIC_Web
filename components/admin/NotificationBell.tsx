"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Mail,
  Handshake,
  Lightbulb,
  CheckCheck,
  ArrowRight,
  Loader2,
  Inbox,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ContactMessageNotif {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
}

interface PartnershipNotif {
  id: string;
  organizationName: string;
  contactName: string;
  collaborationArea: string;
  createdAt: string;
}

interface SubmissionNotif {
  id: string;
  title: string;
  submitterName: string;
  category: string;
  createdAt: string;
}

interface NotificationBellProps {
  initialCount?: number;
  basePath?: "/admin" | "/staff";
}

function formatTimeAgo(dateString: string | Date): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function NotificationBell({
  initialCount = 0,
  basePath = "/admin",
}: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [messages, setMessages] = useState<ContactMessageNotif[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipNotif[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionNotif[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // Sync initialCount prop when SSR changes
  useEffect(() => {
    setUnreadCount(initialCount);
  }, [initialCount]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setUnreadCount(data.unreadCount ?? 0);
        setUnreadMessagesCount(data.unreadMessagesCount ?? 0);
        setMessages(data.messages ?? []);
        setPartnerships(data.partnerships ?? []);
        setSubmissions(data.submissions ?? []);
      }
    } catch {
      // ignore network errors
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for new notifications periodically (every 30s)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchNotifications();
    }
  };

  const handleMessageClick = async (m: ContactMessageNotif) => {
    setOpen(false);

    // Optimistically mark as read
    if (m.status === "UNREAD") {
      setMessages((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, status: "READ" } : item))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      setUnreadMessagesCount((c) => Math.max(0, c - 1));

      // Call API
      fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id }),
      }).catch(() => {});
    }

    router.push(`${basePath}/messages`);
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unreadMessagesCount <= 0 || markingAll) return;

    setMarkingAll(true);
    // Optimistically update
    setMessages((prev) => prev.map((m) => ({ ...m, status: "READ" })));
    setUnreadCount((c) => Math.max(0, c - unreadMessagesCount));
    setUnreadMessagesCount(0);

    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch {
      // rollback if needed
    } finally {
      setMarkingAll(false);
    }
  };

  const totalItems = messages.length + partnerships.length + submissions.length;

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-200">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[400px] p-0 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0875D1]/10 dark:bg-[#0875D1]/20 text-[#0875D1] dark:text-sky-400 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {unreadMessagesCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0875D1] hover:text-[#065b9e] dark:text-sky-400 dark:hover:text-sky-300 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {markingAll ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Content list */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading && totalItems === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0875D1]" />
              <p className="text-xs">Loading notifications...</p>
            </div>
          ) : totalItems === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                <Inbox className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                All caught up!
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[200px] mx-auto">
                No unread contact messages or pending requests at this time.
              </p>
            </div>
          ) : (
            <>
              {/* Contact Messages Section */}
              {messages.map((m) => {
                const isUnread = m.status === "UNREAD";
                return (
                  <div
                    key={`msg-${m.id}`}
                    onClick={() => handleMessageClick(m)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 text-left transition-colors cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50",
                      isUnread && "bg-blue-50/40 dark:bg-blue-950/20"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        isUnread
                          ? "bg-[#0875D1]/15 text-[#0875D1] dark:bg-sky-500/20 dark:text-sky-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      )}
                    >
                      <Mail className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={cn(
                            "text-xs truncate",
                            isUnread
                              ? "font-bold text-slate-900 dark:text-slate-100"
                              : "font-semibold text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {m.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                          {formatTimeAgo(m.createdAt)}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-xs truncate",
                          isUnread
                            ? "font-medium text-slate-800 dark:text-slate-200"
                            : "text-slate-600 dark:text-slate-400"
                        )}
                      >
                        {m.subject}
                      </p>

                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                        {m.message}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-100/70 dark:bg-blue-900/50 text-[#0875D1] dark:text-sky-300">
                          Contact Message
                        </span>
                        {isUnread && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                            <Circle className="w-1.5 h-1.5 fill-current" />
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Partnership Inquiries Section */}
              {partnerships.map((p) => (
                <div
                  key={`part-${p.id}`}
                  onClick={() => {
                    setOpen(false);
                    router.push(`${basePath}/partnerships`);
                  }}
                  className="flex items-start gap-3 p-3.5 text-left bg-emerald-50/30 dark:bg-emerald-950/15 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Handshake className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {p.organizationName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                        {formatTimeAgo(p.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                      {p.collaborationArea}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-100/70 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        Partnership Inquiry
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        Pending Review
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Innovation Submissions Section */}
              {submissions.map((s) => (
                <div
                  key={`sub-${s.id}`}
                  onClick={() => {
                    setOpen(false);
                    router.push(`${basePath}/submissions`);
                  }}
                  className="flex items-start gap-3 p-3.5 text-left bg-amber-50/30 dark:bg-amber-950/15 hover:bg-amber-50/70 dark:hover:bg-amber-950/30 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {s.title}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                        {formatTimeAgo(s.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                      Submitted by {s.submitterName}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100/70 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                        Innovation Submission
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(`${basePath}/messages`);
            }}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#0875D1] dark:text-sky-400 hover:bg-[#0875D1]/10 dark:hover:bg-sky-500/10 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View all contact messages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
