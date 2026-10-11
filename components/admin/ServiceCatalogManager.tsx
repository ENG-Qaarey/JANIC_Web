"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Package,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notify, confirmDestructive } from "@/lib/toast";

interface ServiceItem {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  services: ServiceItem[];
}

type EditState =
  | { kind: "category"; id: string; name: string; description: string; order: number; isActive: boolean }
  | { kind: "service"; id: string; categoryId: string; name: string; description: string; order: number; isActive: boolean }
  | null;

export default function ServiceCatalogManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<EditState>(null);
  const [creatingServiceIn, setCreatingServiceIn] = useState<string | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [newCat, setNewCat] = useState({ name: "", description: "" });
  const [newSvc, setNewSvc] = useState({ name: "", description: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community-services/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
      else setError(data.error || "Failed to load catalog");
    } catch {
      setError("Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const run = async (fn: () => Promise<void>, okMessage: string) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      setNotice(okMessage);
      notify.success(okMessage);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      notify.error(e);
    } finally {
      setBusy(false);
    }
  };

  const createCategory = () =>
    run(async () => {
      const res = await fetch("/api/community-services/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create category");
      setCreatingCategory(false);
      setNewCat({ name: "", description: "" });
    }, "Category created");

  const updateCategory = () =>
    run(async () => {
      if (!editing || editing.kind !== "category") return;
      const res = await fetch(`/api/community-services/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          description: editing.description,
          order: editing.order,
          isActive: editing.isActive,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update category");
      setEditing(null);
    }, "Category updated");

  const deleteCategory = async (id: string, name: string, svcCount: number) => {
    const ok = await confirmDestructive({
      title: `Delete category "${name}"?`,
      description: svcCount
        ? `This will also remove its ${svcCount} service(s). This cannot be undone.`
        : "This cannot be undone.",
      confirmLabel: "Delete category",
    });
    if (!ok) return;
    await run(async () => {
      const res = await fetch(`/api/community-services/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete category");
    }, "Category deleted");
  };

  const createService = (categoryId: string) =>
    run(async () => {
      const res = await fetch("/api/community-services/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSvc, categoryId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create service");
      setCreatingServiceIn(null);
      setNewSvc({ name: "", description: "" });
      setExpanded((prev) => new Set(prev).add(categoryId));
    }, "Service created");

  const updateService = () =>
    run(async () => {
      if (!editing || editing.kind !== "service") return;
      const res = await fetch(`/api/community-services/services/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          description: editing.description,
          order: editing.order,
          isActive: editing.isActive,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update service");
      setEditing(null);
    }, "Service updated");

  const deleteService = async (id: string, name: string) => {
    const ok = await confirmDestructive({
      title: `Delete service "${name}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete service",
    });
    if (!ok) return;
    await run(async () => {
      const res = await fetch(`/api/community-services/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete service");
    }, "Service deleted");
  };

  const totalServices = categories.reduce((sum, c) => sum + c.services.length, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#08245C] dark:text-white">Service Catalog</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage the categories and services offered on the Community Services page
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {categories.length} categories · {totalServices} services
          </span>
          <button
            onClick={() => setCreatingCategory((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0875D1] hover:bg-[#065ea8] text-white text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Category
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs">
          <Check className="w-3.5 h-3.5 shrink-0" />
          {notice}
        </div>
      )}

      {creatingCategory && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="text-xs font-bold text-[#08245C] dark:text-white">New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              placeholder="Category name *"
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
            />
            <input
              value={newCat.description}
              onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
              placeholder="Short description"
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={createCategory}
              disabled={busy || !newCat.name.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0875D1] text-white text-xs font-bold hover:bg-[#065ea8] disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Create
            </button>
            <button
              onClick={() => setCreatingCategory(false)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-[#0875D1]" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Package className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No categories yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Create your first service category to get started</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const isOpen = expanded.has(cat.id);
            const isEditingCat = editing?.kind === "category" && editing.id === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="text-slate-400 hover:text-[#0875D1] transition shrink-0"
                    aria-label={isOpen ? "Collapse" : "Expand"}
                  >
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />

                  {isEditingCat ? (
                    <input
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#08245C] dark:text-white truncate">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{cat.description}</p>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                    {cat.services.length} svc
                  </span>

                  {!cat.isActive && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 shrink-0">
                      Hidden
                    </span>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {isEditingCat ? (
                      <>
                        <button
                          onClick={updateCategory}
                          disabled={busy}
                          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:opacity-80"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setEditing({
                              kind: "category",
                              id: cat.id,
                              name: cat.name,
                              description: cat.description || "",
                              order: cat.order,
                              isActive: cat.isActive,
                            })
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0875D1] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit category"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id, cat.name, cat.services.length)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 px-4 py-3 space-y-2">
                    {cat.services.map((svc) => {
                      const isEditingSvc = editing?.kind === "service" && editing.id === svc.id;
                      return (
                        <div
                          key={svc.id}
                          className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2"
                        >
                          <div className="flex-1 min-w-0">
                            {isEditingSvc ? (
                              <input
                                value={editing.name}
                                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                              />
                            ) : (
                              <p
                                className={cn(
                                  "text-xs font-semibold truncate",
                                  svc.isActive
                                    ? "text-slate-700 dark:text-slate-200"
                                    : "text-slate-400 dark:text-slate-500 line-through"
                                )}
                              >
                                {svc.name}
                              </p>
                            )}
                            {svc.description && !isEditingSvc && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{svc.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isEditingSvc ? (
                              <>
                                <button
                                  onClick={updateService}
                                  disabled={busy}
                                  className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditing(null)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    setEditing({
                                      kind: "service",
                                      id: svc.id,
                                      categoryId: cat.id,
                                      name: svc.name,
                                      description: svc.description || "",
                                      order: svc.order,
                                      isActive: svc.isActive,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0875D1] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                  title="Edit service"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteService(svc.id, svc.name)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                                  title="Delete service"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {creatingServiceIn === cat.id ? (
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            value={newSvc.name}
                            onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })}
                            placeholder="Service name *"
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                          />
                          <input
                            value={newSvc.description}
                            onChange={(e) => setNewSvc({ ...newSvc, description: e.target.value })}
                            placeholder="Short description"
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0875D1]/30"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => createService(cat.id)}
                            disabled={busy || !newSvc.name.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0875D1] text-white text-xs font-bold hover:bg-[#065ea8] disabled:opacity-50"
                          >
                            {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Add Service
                          </button>
                          <button
                            onClick={() => setCreatingServiceIn(null)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setCreatingServiceIn(cat.id);
                          setNewSvc({ name: "", description: "" });
                        }}
                        className="w-full py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-[#0875D1] hover:text-[#0875D1] transition"
                      >
                        <Plus className="w-3 h-3 inline mr-1" />
                        Add Service
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}