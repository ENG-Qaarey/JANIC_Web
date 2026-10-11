"use client";

import React, { useState, useRef } from "react";
import {
  Link2,
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";

export type AllowedFileType = "image" | "video" | "pdf" | "any";

interface FileUploadChoiceProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  fileType?: AllowedFileType;
  folder?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  source?: string;
}

export function FileUploadChoice({
  label,
  value,
  onChange,
  fileType = "image",
  folder = "general",
  placeholder,
  required = false,
  helperText,
  source = "project",
}: FileUploadChoiceProps) {
  // Default mode to upload from device unless an external http URL is provided
  const [mode, setMode] = useState<"url" | "upload">(
    value?.startsWith("http") ? "url" : "upload"
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration per file type
  const typeConfig = {
    image: {
      accept: "image/*",
      maxSizeMb: 20,
      linkText: "Image Link / URL",
      uploadText: "Upload Image",
      defaultPlaceholder: "https://images.unsplash.com/... or /uploads/...",
      dropText: "PNG, JPG, WebP, GIF, or SVG (max 20MB)",
      icon: ImageIcon,
    },
    video: {
      accept: "video/*,.mp4,.webm,.mov,.ogg,.mkv",
      maxSizeMb: 100,
      linkText: "Video Link (YouTube, Vimeo, etc.)",
      uploadText: "Upload Video File",
      defaultPlaceholder: "https://youtube.com/... or /uploads/...",
      dropText: "MP4, WebM, MOV, or OGG video (max 100MB)",
      icon: Video,
    },
    pdf: {
      accept: "application/pdf,.pdf",
      maxSizeMb: 40,
      linkText: "PDF Link / URL",
      uploadText: "Upload PDF File",
      defaultPlaceholder: "https://example.com/paper.pdf or /uploads/...",
      dropText: "PDF document (max 40MB)",
      icon: FileText,
    },
    any: {
      accept: "*/*",
      maxSizeMb: 50,
      linkText: "File Link / URL",
      uploadText: "Upload File",
      defaultPlaceholder: "https://... or /uploads/...",
      dropText: "Any file up to 50MB",
      icon: UploadCloud,
    },
  }[fileType];

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Type validation
    if (fileType === "image" && !file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP, SVG)");
      return;
    }
    if (fileType === "video" && !file.type.startsWith("video/") && !/\.(mp4|webm|mov|ogg|mkv)$/i.test(file.name)) {
      setUploadError("Please select a valid video file (MP4, WebM, MOV, OGG)");
      return;
    }
    if (fileType === "pdf" && file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setUploadError("Please select a valid PDF file (.pdf)");
      return;
    }

    // Size validation
    if (file.size > typeConfig.maxSizeMb * 1024 * 1024) {
      setUploadError(`File size exceeds ${typeConfig.maxSizeMb}MB limit.`);
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
        throw new Error(data.error || "Failed to upload file");
      }

      const uploadedUrl = data.url || data.media?.url;
      if (!uploadedUrl) {
        throw new Error("No URL returned from server");
      }

      onChange(uploadedUrl);
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
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper check for video type
  const isDirectVideo =
    value?.startsWith("/uploads/") ||
    /\.(mp4|webm|ogg|mov)$/i.test(value || "");

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-semibold text-foreground">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {helperText && (
            <p className="text-[11px] text-muted-foreground">{helperText}</p>
          )}
        </div>

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
                ? "bg-white text-blue-700 shadow-xs font-bold dark:bg-slate-800 dark:text-blue-300"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UploadCloud className="w-3 h-3" />
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
                ? "bg-white text-blue-700 shadow-xs font-bold dark:bg-slate-800 dark:text-blue-300"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Link2 className="w-3 h-3" />
            Paste URL
          </button>
        </div>
      </div>

      {/* Choice 1: URL Input */}
      {mode === "url" && (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || typeConfig.defaultPlaceholder}
            className="w-full pl-9 pr-9 py-2 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition cursor-pointer"
              title="Clear URL"
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
            accept={typeConfig.accept}
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
                ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30"
                : "border-slate-300 hover:border-blue-400 bg-muted/30 hover:bg-blue-50/20 dark:border-slate-700"
            } ${uploading ? "opacity-75 pointer-events-none" : ""}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-1.5 py-1">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">
                  Uploading {fileType} file to server...
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Saving to /public/uploads
                </span>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Click to browse or drag & drop {fileType} file
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {typeConfig.dropText}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
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
        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>File uploaded and attached successfully!</span>
        </div>
      )}

      {/* Live Preview / Attachment Card */}
      {value && (
        <div className="p-3 bg-muted/40 rounded-xl border border-border flex flex-col gap-2">
          {/* Header of Preview */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shrink-0">
                <typeConfig.icon className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {value.startsWith("/uploads/") ? "Uploaded File" : "Remote Link"}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground truncate max-w-[260px] sm:max-w-md">
                  {value}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Type-Specific Preview Display */}
          {fileType === "image" && (
            <div className="relative w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {fileType === "video" && isDirectVideo && (
            <div className="w-full rounded-lg overflow-hidden border border-slate-200 bg-black dark:border-slate-800">
              <video
                src={value}
                controls
                className="w-full max-h-48 rounded-lg"
              />
            </div>
          )}

          {fileType === "pdf" && (
            <div className="p-2.5 rounded-lg bg-red-50/80 border border-red-200 dark:bg-red-950/20 dark:border-red-900/40 flex items-center justify-between text-xs text-red-700 dark:text-red-400">
              <span className="font-semibold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-red-600" />
                PDF Document Ready
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline hover:text-red-900 text-[11px]"
              >
                View PDF File
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
