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
  FileText,
  Download,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export interface ResourceDocumentItem {
  id: string;
  title: string;
  category: string;
  format: string;
  size: string;
  description: string;
  fileUrl?: string | null;
  order: number;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const CATEGORIES = [
  "All Categories",
  "Policy & Governance",
  "Forms & Applications",
  "Toolkits & Guides",
  "Reports & Publications",
];

const FORMATS = ["PDF", "DOCX", "ZIP", "XLSX"];

export function DownloadManager({
  initialDocuments,
}: {
  initialDocuments: ResourceDocumentItem[];
}) {
  const router = useRouter();
  const [documents, setDocuments] = useState<ResourceDocumentItem[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ResourceDocumentItem | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Policy & Governance",
    format: "PDF",
    size: "500 KB",
    description: "",
    fileUrl: "",
    order: 0,
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFormData({
      title: "",
      category: "Policy & Governance",
      format: "PDF",
      size: "500 KB",
      description: "",
      fileUrl: "",
      order: documents.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ResourceDocumentItem) => {
    setEditingDoc(item);
    setFormData({
      title: item.title,
      category: item.category,
      format: item.format,
      size: item.size,
      description: item.description,
      fileUrl: item.fileUrl || "",
      order: item.order,
      isActive: item.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingDoc
        ? `/api/admin/downloads/${editingDoc.id}`
        : "/api/admin/downloads";
      const method = editingDoc ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setModalOpen(false);
      router.refresh();

      if (editingDoc) {
        setDocuments((prev) =>
          prev.map((item) => (item.id === editingDoc.id ? { ...item, ...formData } : item))
        );
      } else {
        setDocuments((prev) => [...prev, data.item]);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving document");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await fetch(`/api/admin/downloads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments((prev) => prev.filter((m) => m.id !== id));
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch {
      alert("Error deleting document");
    }
  };

  const handleToggleActive = async (item: ResourceDocumentItem) => {
    try {
      const newStatus = !item.isActive;
      const res = await fetch(`/api/admin/downloads/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: newStatus }),
      });
      if (res.ok) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, isActive: newStatus } : d))
        );
        router.refresh();
      }
    } catch {
      alert("Failed to toggle status");
    }
  };

  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase()) ||
      doc.format.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "All Categories" || doc.category === selectedCategory;
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
              placeholder="Search downloads, policy forms, guidelines..."
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
            {CATEGORIES.map((cat) => (
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
          Add Resource Document
        </button>
      </div>

      {/* Grid of Documents */}
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
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0875D1] border border-blue-100 dark:border-blue-900/50">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border uppercase">
                    {item.format} • {item.size}
                  </span>
                </div>

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

              <span className="text-[10px] font-bold text-[#0875D1] tracking-wider uppercase">
                {item.category}
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#0875D1] flex items-center gap-1 font-medium"
                >
                  <Download className="w-3.5 h-3.5" /> Direct File
                </a>
              ) : (
                <Link
                  href="/resources/downloads"
                  target="_blank"
                  className="text-muted-foreground hover:text-[#0875D1] flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Portal
                </Link>
              )}

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
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-foreground">No documents found</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search criteria or add a new download resource.
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
              {editingDoc ? "Edit Resource Document" : "Add Resource Document"}
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Manage downloadable PDF forms, toolkits, templates, and policy guidelines.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Intellectual Property & Commercialization Policy"
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  >
                    <option value="Policy & Governance">Policy & Governance</option>
                    <option value="Forms & Applications">Forms & Applications</option>
                    <option value="Toolkits & Guides">Toolkits & Guides</option>
                    <option value="Reports & Publications">Reports & Publications</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    File Format *
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  >
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    File Size Estimate *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 450 KB or 1.2 MB"
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    File URL (or Download Link)
                  </label>
                  <input
                    type="text"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="/downloads/sample.pdf or https://..."
                    className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                  />
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
                  placeholder="Summary of document purpose, guidelines, and who should read it..."
                  className="w-full px-3 py-2 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30 resize-none"
                />
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
                    id="docIsActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0875D1] focus:ring-[#0875D1]"
                  />
                  <label htmlFor="docIsActive" className="text-xs font-medium text-foreground cursor-pointer">
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
                  {editingDoc ? "Update Document" : "Save Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
