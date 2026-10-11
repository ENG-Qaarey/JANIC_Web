"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Link2,
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

interface ImageUploadChoiceProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  required?: boolean;
  source?: string;
}

export function ImageUploadChoice({
  label = "Hero Image",
  value,
  onChange,
  folder = "projects",
  placeholder = "https://images.unsplash.com/... or /uploads/...",
  required = false,
  source = "project",
}: ImageUploadChoiceProps) {
  // Determine initial mode: Default to Upload from Device unless an external http URL is provided
  const [mode, setMode] = useState<"url" | "upload">(
    value?.startsWith("http") ? "url" : "upload"
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP, SVG, etc.)");
      return;
    }

    // Validate size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("File size exceeds 15MB limit.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("alt", file.name);
      formData.append("source", source);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      const uploadedUrl = data.url || data.media?.url;
      if (!uploadedUrl) {
        throw new Error("No URL returned from server");
      }

      onChange(uploadedUrl);
      setImageError(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Error uploading file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    onChange("");
    setImageError(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-semibold text-foreground">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Two Choices Switcher */}
        <div className="inline-flex items-center p-0.5 bg-muted rounded-lg border border-border text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("upload");
              setUploadError(null);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition cursor-pointer ${
              mode === "upload"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload from Device
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("url");
              setUploadError(null);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition cursor-pointer ${
              mode === "url"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Paste Link
          </button>
        </div>
      </div>

      {/* Choice 1: Image URL Input */}
      {mode === "url" && (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setImageError(false);
            }}
            placeholder={placeholder}
            className="w-full pl-9 pr-9 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
              title="Clear image URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Choice 2: Upload File Drag & Drop Box */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
              dragActive
                ? "border-blue-500 bg-blue-50/60"
                : "border-slate-300 hover:border-blue-400 bg-muted/30 hover:bg-blue-50/20"
            } ${uploading ? "opacity-75 pointer-events-none" : ""}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">
                  Uploading image to server...
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Saving to /public/uploads
                </span>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    PNG, JPG, WebP, GIF, or SVG (max 15MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="p-0.5 hover:text-rose-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Success Banner */}
      {uploadSuccess && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Image uploaded and attached successfully!</span>
        </div>
      )}

      {/* Live Image Preview Card */}
      {value && (
        <div className="p-2.5 bg-muted/40 rounded-xl border border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center">
              {!imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt="Preview"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[9px] text-slate-400 font-bold flex flex-col items-center">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {value.startsWith("/uploads/") ? "Local Upload" : "Remote URL"}
                </span>
                {imageError && (
                  <span className="text-[10px] font-bold text-rose-600">
                    (Invalid preview)
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground truncate max-w-[260px] sm:max-w-xs">
                {value}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0 cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
