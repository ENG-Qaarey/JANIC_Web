"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Link2,
  X,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadChoiceProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  folder?: string;
}

export function AvatarUploadChoice({
  label,
  value,
  onChange,
  placeholder = "https://images.unsplash.com/... or /uploads/...",
  folder = "avatars",
}: AvatarUploadChoiceProps) {
  const [mode, setMode] = useState<"upload" | "url">(
    value?.startsWith("/uploads/") ? "upload" : "upload"
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP, SVG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      toast.success("Picture uploaded successfully from device!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error uploading picture");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 ${
              mode === "upload"
                ? "bg-white dark:bg-slate-700 text-[#0875D1] dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <UploadCloud className="w-3 h-3" />
            Upload from Device
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 ${
              mode === "url"
                ? "bg-white dark:bg-slate-700 text-[#0875D1] dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Link2 className="w-3 h-3" />
            Paste Link
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Avatar Preview */}
        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shrink-0 shadow-sm">
          {value ? (
            <Image src={value} alt="Preview" fill sizes="44px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Input / Upload Button */}
        <div className="flex-1">
          {mode === "upload" ? (
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`avatar-file-${label.replace(/\s+/g, "-")}`}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0875D1]" />
                    <span>Uploading picture...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-[#0875D1] dark:text-blue-400" />
                    <span>
                      {value ? "Choose different picture from device" : "Upload picture from device"}
                    </span>
                  </>
                )}
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  title="Remove picture"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0875D1]"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition"
                  title="Clear link"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
