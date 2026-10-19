"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send, Sparkles } from "lucide-react";

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  prototypeUrl?: string;
  videoUrl?: string;
}

export function InnovationSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Platform",
    description: "",
    technologyStack: "",
    submitterName: "",
    submitterEmail: "",
    submitterPhone: "",
    studentId: "",
    teamMembers: "",
    prototypeUrl: "",
    videoUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Project Title
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Project title is required";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // 2. Project Description
    const trimmedDesc = formData.description.trim();
    if (!trimmedDesc) {
      newErrors.description = "Project description is required";
    } else if (trimmedDesc.length < 15) {
      newErrors.description = "Please describe your project (at least 15 characters)";
    }

    // 4. Submitter Name
    const trimmedName = formData.submitterName.trim();
    if (!trimmedName) {
      newErrors.submitterName = "Lead submitter name is required";
    } else if (trimmedName.length < 2) {
      newErrors.submitterName = "Submitter name must be at least 2 characters";
    }

    // 5. Submitter Email
    const trimmedEmail = formData.submitterEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.submitterEmail = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.submitterEmail = "Please enter a valid email address (e.g. student@jazeera.edu.so)";
    }

    // 6. Submitter Phone
    const trimmedPhone = formData.submitterPhone.trim();
    if (!trimmedPhone) {
      newErrors.submitterPhone = "Phone number is required";
    } else {
      const phoneDigits = trimmedPhone.replace(/[\s\-()]/g, "");
      if (phoneDigits.length < 6 || !/^\+?[0-9]{6,15}$/.test(phoneDigits)) {
        newErrors.submitterPhone = "Please enter a valid phone number (at least 6 digits)";
      }
    }

    // 7. URLs (optional, but validated if provided)
    const trimmedProto = formData.prototypeUrl.trim();
    if (trimmedProto && !isValidUrl(trimmedProto)) {
      newErrors.prototypeUrl = "Please provide a valid web URL (e.g. https://github.com/...)";
    }

    const trimmedVideo = formData.videoUrl.trim();
    if (trimmedVideo && !isValidUrl(trimmedVideo)) {
      newErrors.videoUrl = "Please provide a valid URL (e.g. https://youtube.com/...)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof FormErrors]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setError("Please correct the errors in the form before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit innovation proposal.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting proposal.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">Innovation Proposal Received!</h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-400 max-w-lg mx-auto leading-relaxed">
          Your project proposal has been successfully submitted to the JANIC Review Committee. Our faculty mentors review submissions weekly and will notify you by email for the interview and prototype demonstration stage.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              title: "",
              category: "Web Platform",
              description: "",
              technologyStack: "",
              submitterName: "",
              submitterEmail: "",
              submitterPhone: "",
              studentId: "",
              teamMembers: "",
              prototypeUrl: "",
              videoUrl: "",
            });
            setErrors({});
          }}
          className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition cursor-pointer"
        >
          Submit Another Proposal
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Part 1: Project Information */}
      <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-bold text-[#08245C] dark:text-sky-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0875D1] dark:text-sky-400" />
          1. Project Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Project / System Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. Robot Car Cleaner, Autonomous Solar Irrigation"
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
                errors.title
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Web Platform</option>
              <option>Robotics / Arduino</option>
              <option>IoT / Automation</option>
              <option>HealthTech / API</option>
              <option>AI / Machine Learning</option>
              <option>Information Systems</option>
              <option>Cybersecurity</option>
              <option>Branding & Design</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Project Description *
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your project, the problem it solves, and the technical solution or system architecture..."
            className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
              errors.description
                ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            }`}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Technologies & Tools Used (Optional)
          </label>
          <input
            type="text"
            value={formData.technologyStack}
            onChange={(e) => handleInputChange("technologyStack", e.target.value)}
            placeholder="e.g. Arduino Mega, Next.js, ESP32, Python, Ultrasonic Sensors"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Part 2: Submitter & Team Information */}
      <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-bold text-[#08245C] dark:text-sky-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0875D1] dark:text-sky-400" />
          2. Team & Submitter Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Lead Submitter Name *
            </label>
            <input
              type="text"
              value={formData.submitterName}
              onChange={(e) => handleInputChange("submitterName", e.target.value)}
              placeholder="Your Full Name"
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
                errors.submitterName
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.submitterName && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.submitterName}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.submitterEmail}
              onChange={(e) => handleInputChange("submitterEmail", e.target.value)}
              placeholder="student@jazeera.edu.so"
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
                errors.submitterEmail
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.submitterEmail && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.submitterEmail}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.submitterPhone}
              onChange={(e) => handleInputChange("submitterPhone", e.target.value)}
              placeholder="+252 61..."
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
                errors.submitterPhone
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.submitterPhone && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.submitterPhone}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Student ID / Registration No. (Optional)
          </label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => handleInputChange("studentId", e.target.value)}
            placeholder="e.g. JU/CS/2023/..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Team Members (Names & Roles, Optional)
          </label>
          <input
            type="text"
            value={formData.teamMembers}
            onChange={(e) => handleInputChange("teamMembers", e.target.value)}
            placeholder="e.g. Ahmed Ali (Hardware), Hafsa Omar (Firmware), Bilal Hassan (Software)"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Part 3: Links / Demos */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#08245C] dark:text-sky-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0875D1] dark:text-sky-400" />
          3. Demos & Repository Links (Optional)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Live Demo / GitHub Repository URL
            </label>
            <input
              type="url"
              value={formData.prototypeUrl}
              onChange={(e) => handleInputChange("prototypeUrl", e.target.value)}
              placeholder="https://github.com/..."
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
                errors.prototypeUrl
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.prototypeUrl && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.prototypeUrl}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Video Demonstration URL (YouTube / Google Drive)
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => handleInputChange("videoUrl", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={`w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition ${
                errors.videoUrl
                  ? "border border-red-500 focus:ring-2 focus:ring-red-400/30"
                  : "border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              }`}
            />
            {errors.videoUrl && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.videoUrl}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Transmitting Proposal to Review Board...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Innovation to JANIC Hub
          </>
        )}
      </button>
    </form>
  );
}
