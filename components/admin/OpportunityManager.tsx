"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  GraduationCap,
} from "lucide-react";

export interface OpportunityItem {
  id: string;
  title: string;
  type: string;
  deadline: string;
  department: string;
  description: string;
  eligibility: string;
  actionUrl: string;
  actionLabel: string;
  status: string;
  order: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const TYPES = [
  "All Types",
  "Student Innovation",
  "Incubation",
  "Hackathon",
  "Fellowship",
  "Internship",
  "Research Grant",
];

export function OpportunityManager({
  initialOpportunities,
}: {
  initialOpportunities: OpportunityItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<OpportunityItem[]>(initialOpportunities);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OpportunityItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "Student Innovation",
    deadline: "Rolling Applications",
    department: "Faculty of Computer Science & IT",
    description: "",
    eligibility: "Open to all enrolled Jazeera University students.",
    actionUrl: "/submit-innovation",
    actionLabel: "Apply Now",
    status: "Active",
    order: 0,
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      type: "Student Innovation",
      deadline: "Rolling Applications",
      department: "Faculty of Computer Science & IT",
      description: "",
      eligibility: "Open to all enrolled Jazeera University students.",
      actionUrl: "/submit-innovation",
      actionLabel: "Apply Now",
      status: "Active",
      order: items.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: OpportunityItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      deadline: item.deadline,
      department: item.department,
      description: item.description,
      eligibility: item.eligibility,
      actionUrl: item.actionUrl,
      actionLabel: item.actionLabel,
      status: item.status,
      order: item.order,
      isActive: item.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingItem
        ? `/api/admin/opportunities/${editingItem.id}`
        : "/api/admin/opportunities";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setModalOpen(false);
      router.refresh();

      if (editingItem) {
        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item))
        );
      } else {
        setItems((prev) => [...prev, data.item]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving opportunity");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this opportunity call?")) return;
    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((m) => m.id !== id));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch {
      alert("Error deleting opportunity");
    }
  };

  const handleToggleActive = async (item: OpportunityItem) => {
    try {
      const newStatus = !item.isActive;
      const res = await fetch(`/api/admin/opportunities/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: newStatus }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isActive: newStatus } : i))
        );
        router.refresh();
      }
    } catch {
      alert("Failed to toggle status");
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.eligibility.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedType === "All Types" || item.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search grants, calls, eligibility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30 transition"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0875D1] hover:bg-[#065b9e] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Opportunity
        </button>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-card rounded-2xl border p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative ${
              item.isActive ? "border-border/80" : "border-amber-300/60 bg-amber-500/5 opacity-80"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#0875D1] border border-blue-100 dark:border-blue-900/50">
                  <Briefcase className="w-3.5 h-3.5" />
                  {item.type}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(item)}
                    title={item.isActive ? "Click to deactivate" : "Click to activate"}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer ${
                      item.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> Inactive
                      </>
                    )}
                  </button>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                    #{item.order}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-foreground mt-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 pt-3 border-t border-border/70 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-medium text-foreground truncate">Deadline: {item.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0875D1] shrink-0" />
                  <span className="truncate">{item.department}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
              <Link
                href="/resources/opportunities"
                target="_blank"
                className="text-muted-foreground hover:text-[#0875D1] flex items-center gap-1 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Portal
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#0875D1] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-foreground">No opportunities found</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search criteria or add a new call for applications.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-1">
              {editingItem ? "Edit Opportunity Call" : "Post New Opportunity"}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Enter program criteria, eligibility, deadlines, and application links.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Student Innovation Challenge 2026"
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  >
                    <option value="Student Innovation">Student Innovation</option>
                    <option value="Incubation">Incubation</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Internship">Internship</option>
                    <option value="Research Grant">Research Grant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Deadline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="e.g. December 15, 2026 or Rolling"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Department / Host Faculty *
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Faculty of Computer Science & IT"
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what this opportunity provides..."
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Eligibility Criteria *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  placeholder="Who is eligible to apply..."
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Action URL
                  </label>
                  <input
                    type="text"
                    value={formData.actionUrl}
                    onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                    placeholder="/submit-innovation"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Action Label
                  </label>
                  <input
                    type="text"
                    value={formData.actionLabel}
                    onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })}
                    placeholder="Apply Now"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="oppIsActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0875D1] focus:ring-[#0875D1]"
                  />
                  <label htmlFor="oppIsActive" className="text-xs font-medium text-foreground cursor-pointer">
                    Visible publicly
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#0875D1] hover:bg-[#065b9e] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingItem ? "Update Opportunity" : "Create Opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
