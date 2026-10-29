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
  Layers,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";

export interface HubItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  icon?: string | null;
  status: string;
  link?: string | null;
  tags?: string | null;
  order: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/** Only used before any hub exists; otherwise categories come from the hubs themselves. */
const FALLBACK_CATEGORIES = [
  "Technology & Development",
  "Incubation & Startup Support",
  "Research & Academic Innovation",
  "Community & Social Impact",
];

export function HubManager({ initialHubs }: { initialHubs: HubItem[] }) {
  const router = useRouter();
  const [hubs, setHubs] = useState<HubItem[]>(initialHubs);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHub, setEditingHub] = useState<HubItem | null>(null);
  const [loading, setLoading] = useState(false);
  /** Hub cards only render a link when one is switched on. */
  const [hasLink, setHasLink] = useState(false);

  // Categories are data-driven so editing a hub never overwrites its real category.
  const existingCategories = Array.from(
    new Set(hubs.map((h) => h.category).filter(Boolean))
  ).sort();
  const categoryOptions =
    existingCategories.length > 0 ? existingCategories : FALLBACK_CATEGORIES;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Technology & Development",
    description: "",
    icon: "Layers",
    status: "Active",
    link: "",
    tags: "",
    order: 0,
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingHub(null);
    setHasLink(false);
    setFormData({
      name: "",
      slug: "",
      category: categoryOptions[0],
      description: "",
      icon: "Layers",
      status: "Active",
      link: "",
      tags: "",
      order: hubs.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: HubItem) => {
    setEditingHub(item);
    setHasLink(Boolean(item.link));
    setFormData({
      name: item.name,
      slug: item.slug,
      category: item.category,
      description: item.description,
      icon: item.icon || "Layers",
      status: item.status || "Active",
      link: item.link || "",
      tags: item.tags || "",
      order: item.order,
      isActive: item.isActive,
    });
    setModalOpen(true);
  };

  // Helper to generate slug from name
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingHub
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingHub ? `/api/admin/hubs/${editingHub.id}` : "/api/admin/hubs";
      const method = editingHub ? "PUT" : "POST";

      // A blank link is stored as null so the public hub card stays unlinked.
      const payload = {
        ...formData,
        link: hasLink ? formData.link.trim() || null : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setModalOpen(false);
      router.refresh();

      if (editingHub) {
        setHubs((prev) =>
          prev.map((item) => (item.id === editingHub.id ? { ...item, ...payload } : item))
        );
      } else {
        setHubs((prev) => [...prev, data.item]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving hub");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hub? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/hubs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHubs((prev) => prev.filter((m) => m.id !== id));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch {
      alert("Error deleting hub");
    }
  };

  const handleToggleActive = async (item: HubItem) => {
    try {
      const newStatus = !item.isActive;
      const res = await fetch(`/api/admin/hubs/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: newStatus }),
      });
      if (res.ok) {
        setHubs((prev) =>
          prev.map((h) => (h.id === item.id ? { ...h, isActive: newStatus } : h))
        );
        router.refresh();
      }
    } catch {
      alert("Failed to toggle status");
    }
  };

  const filtered = hubs.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.description.toLowerCase().includes(search.toLowerCase()) ||
      (h.tags && h.tags.toLowerCase().includes(search.toLowerCase()));
    const matchesCat =
      selectedCategory === "All Categories" || h.category === selectedCategory;
    return matchesSearch && matchesCat;
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
              placeholder="Search hubs, tags, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30 transition"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
          >
            {["All Categories", ...categoryOptions].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0875D1] hover:bg-[#065b9e] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Innovation Hub
        </button>
      </div>

      {/* Grid of Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-card rounded-2xl border p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative ${
              item.isActive ? "border-border/80" : "border-amber-300/60 bg-amber-500/5 opacity-80"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0875D1] border border-blue-100 dark:border-blue-900/50">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(item)}
                    title={item.isActive ? "Click to disable" : "Click to activate"}
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

              <span className="text-[10px] font-bold text-[#0875D1] tracking-wider uppercase">
                {item.category}
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              {item.tags && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.tags.split(",").map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
              <Link
                href={`/hubs#${item.slug}`}
                target="_blank"
                className="text-muted-foreground hover:text-[#0875D1] flex items-center gap-1 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview
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
            <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-foreground">No hubs found</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search criteria or add a new hub.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close drawer"
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
          />

          <div className="relative h-full w-full max-w-md bg-card border-l border-border shadow-2xl overflow-y-auto animate-[drawer-slide-in_0.22s_ease-out]">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-card border-b border-border px-5 sm:px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {editingHub ? "Edit Innovation Hub" : "Create New Innovation Hub"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure hub details, category, focus tags, and display visibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 px-5 sm:px-6 py-5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Hub Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. AI & Intelligent Systems Hub"
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ai-hub"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    list="hub-category-options"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                  <datalist id="hub-category-options">
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe what this hub researches, develops, or incubates..."
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. Machine Learning, NLP, Somali Speech Tech"
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                />
              </div>

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

              <div className="rounded-xl border border-border bg-muted/30 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      External / Detail Link
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {hasLink
                        ? "The hub card links visitors to this address."
                        : "No link — the hub card shows “Enquire With JANIC” instead."}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={hasLink}
                    aria-label="Toggle hub link"
                    onClick={() => {
                      const next = !hasLink;
                      if (!next) setFormData((prev) => ({ ...prev, link: "" }));
                      setHasLink(next);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                      hasLink ? "bg-[#0875D1]" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        hasLink ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {hasLink && (
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/hubs or https://..."
                    className="mt-3 w-full px-3 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hubIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0875D1] focus:ring-[#0875D1]"
                />
                <label htmlFor="hubIsActive" className="text-xs font-medium text-foreground cursor-pointer">
                  Hub is Active & Visible publicly
                </label>
              </div>

              <div className="sticky bottom-0 -mx-5 sm:-mx-6 mt-2 px-5 sm:px-6 py-4 bg-card border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#0875D1] hover:bg-[#065b9e] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingHub ? "Update Hub" : "Create Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
