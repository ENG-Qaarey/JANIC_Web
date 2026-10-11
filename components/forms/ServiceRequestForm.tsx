"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { notify } from "@/lib/toast";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Building2,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceOption {
  id: string;
  name: string;
  description?: string | null;
}

interface ServiceCategory {
  id: string;
  name: string;
  description?: string | null;
  services: ServiceOption[];
}

type OrgType = "FOR_PROFIT" | "NONPROFIT";

interface ServiceRequestFormProps {
  categories: ServiceCategory[];
}

type FormErrors = Record<string, string | undefined>;

const ORG_CATEGORIES = [
  { value: "PRIVATE_COMPANY", label: "Private Company" },
  { value: "STARTUP_SMALL_BUSINESS", label: "Startup or Small Business" },
  { value: "NGO", label: "NGO" },
  { value: "COMMUNITY_BASED_ORGANIZATION", label: "Community-Based Organization" },
  { value: "EDUCATIONAL_INSTITUTION", label: "Educational Institution" },
  { value: "FOUNDATION_CHARITY", label: "Foundation or Charity" },
  { value: "YOUTH_ORGANIZATION", label: "Youth Organization" },
  { value: "OTHER", label: "Other" },
];

const FUNDING_STATUSES = [
  { value: "FUNDED", label: "Funded" },
  { value: "PARTIALLY_FUNDED", label: "Partially funded" },
  { value: "SEEKING_FUNDING", label: "Seeking funding" },
  { value: "NOT_YET_DETERMINED", label: "Not yet determined" },
];

const INITIAL_DATA = {
  organizationName: "",
  organizationType: "FOR_PROFIT" as OrgType,
  organizationCategory: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  country: "",
  city: "",
  address: "",
  serviceCategoryId: "",
  serviceId: "",
  requestTitle: "",
  description: "",
  expectedOutcomes: "",
  beneficiaries: "",
  startDate: "",
  preferredCompletionDate: "",
  budget: "",
  preferredContactMethod: "EMAIL",
  businessSector: "",
  businessOutcome: "",
  isExistingBusiness: "",
  commercialRequirements: "",
  organizationMission: "",
  socialProblem: "",
  targetBeneficiaries: "",
  socialImpact: "",
  fundingStatus: "",
  isExistingCommunityProject: "",
  additionalNotes: "",
  declaration: false,
};

const STEPS = [
  { id: 1, title: "Organization Information", hint: "Tell us about your organization" },
  { id: 2, title: "Requested Service", hint: "What you need from JANIC" },
  { id: 3, title: "Business Details", hint: "A few questions specific to your organization type" },
];

const SUCCESS_KEY = "janic_cs_request_submitted";
const EVENT_SUBMITTED = "janic:cs-submitted";
const EVENT_RESET = "janic:cs-reset";

const inputBase =
  "w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition";
const inputOk = "border border-slate-200 dark:border-slate-700 focus:border-[#0875D1] focus:ring-2 focus:ring-blue-500";
const inputErr = "border border-red-500 focus:ring-2 focus:ring-red-400/30";
const labelCls = "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1 animate-in fade-in duration-200">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      <ErrorText message={error} />
    </div>
  );
}

/**
 * Confirmation shown after a request is accepted. Rendered as a sticky bar pinned to the
 * top of the viewport so it stays visible no matter where the user scrolls, and survives
 * a reload. Only "Submit Another Request" clears it.
 */
export function SuccessNotice({
  requestNumber,
  onReset,
}: {
  requestNumber?: string | null;
  onReset: () => void;
}) {
  return (
    <div className="sticky top-20 z-30">
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-900/5 p-5 sm:p-6 space-y-3"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-emerald-900 dark:text-emerald-200">
              Service Request Received
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 mt-1 leading-relaxed">
              Thank you for reaching out. The JANIC Community Services team will review your request and contact you to
              discuss feasibility, scope, and next steps.
            </p>
            {requestNumber && (
              <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-300">
                Your reference number is{" "}
                <span className="font-mono font-bold">{requestNumber}</span>. Please keep it for any follow-up.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );
}

export function ServiceRequestForm({ categories }: ServiceRequestFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);
  // Errors surface via notify() toasts; field-level errors live in `errors`.
  const formRef = useRef<HTMLFormElement>(null);

  // Restore the submitted state after a reload so the confirmation never vanishes.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SUCCESS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSuccess(true);
        setRequestNumber(parsed.requestNumber ?? null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const markSuccess = (num: string | null, orgType: OrgType) => {
    try {
      sessionStorage.setItem(SUCCESS_KEY, JSON.stringify({ requestNumber: num }));
    } catch {
      /* ignore */
    }
    setRequestNumber(num);
    notify.success("Service request received. Keep your reference number for follow-up.");
    setSuccess(true);
    window.dispatchEvent(new CustomEvent(EVENT_SUBMITTED, { detail: { requestNumber: num } }));
    // Keep the submitted state addressable so a refresh shows the same page.
    router.replace(`/community-services?type=${orgType}#available-services`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSuccess = () => {
    try {
      sessionStorage.removeItem(SUCCESS_KEY);
    } catch {
      /* ignore */
    }
    setSuccess(false);
    setRequestNumber(null);
    setFormData(INITIAL_DATA);
    setErrors({});
    setStep(1);
    window.dispatchEvent(new Event(EVENT_RESET));
    router.replace("/community-services#service-request-form", { scroll: false });
  };

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "FOR_PROFIT" || type === "NONPROFIT") {
      setFormData((prev) => ({ ...prev, organizationType: type }));
    }
  }, [searchParams]);

  const selectedCategory = categories.find((c) => c.id === formData.serviceCategoryId);
  const availableServices = selectedCategory?.services ?? [];
  const isProfit = formData.organizationType === "FOR_PROFIT";

  const set = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.organizationName.trim()) e.organizationName = "Organization name is required";
    if (!formData.organizationCategory) e.organizationCategory = "Please select an organization category";
    if (formData.contactPerson.trim().length < 2) e.contactPerson = "Contact person name is required";

    const email = formData.email.trim();
    if (!email) e.email = "Official email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address";

    const digits = formData.phone.trim().replace(/[\s\-()]/g, "");
    if (!digits) e.phone = "Phone number is required";
    else if (digits.length < 7 || !/^\+?[0-9]{7,15}$/.test(digits)) {
      e.phone = "Please enter a valid phone number including country code";
    }

    if (formData.website.trim() && !/^https?:\/\/.+\..+/.test(formData.website.trim())) {
      e.website = "Please enter a valid URL starting with http:// or https://";
    }

    if (!formData.country.trim()) e.country = "Country is required";
    if (!formData.city.trim()) e.city = "City is required";
    return e;
  };

  const validateStep2 = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.serviceCategoryId) e.serviceCategoryId = "Please select a service category";
    if (!formData.serviceId) e.serviceId = "Please select a specific service";
    if (formData.requestTitle.trim().length < 3) e.requestTitle = "Request title is required";
    if (formData.description.trim().length < 20) {
      e.description = "Please describe your needs in at least 20 characters";
    }
    if (formData.startDate && formData.preferredCompletionDate) {
      if (new Date(formData.preferredCompletionDate) < new Date(formData.startDate)) {
        e.preferredCompletionDate = "Completion date must be after the start date";
      }
    }
    return e;
  };

  const validateStep3 = (): FormErrors => {
    const e: FormErrors = {};
    if (isProfit) {
      if (!formData.businessSector.trim()) e.businessSector = "Business or industry sector is required";
    } else {
      if (!formData.organizationMission.trim()) e.organizationMission = "Organization mission is required";
    }
    if (!formData.declaration) e.declaration = "You must confirm this declaration to submit";
    return e;
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const stepErrors = step === 1 ? validateStep1() : validateStep2();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      notify.warning("Please resolve the highlighted fields before continuing.");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
    scrollToFormTop();
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep((s) => Math.max(1, s - 1));
    scrollToFormTop();
  };

  /** Scrolls only the form's top edge into view — never the whole document. */
  const scrollToFormTop = () => {
    requestAnimationFrame(() => {
      const el = formRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.min(Math.max(top, 0), max), behavior: "smooth" });
    });
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    // Enter inside a field triggers implicit submission. Only the final step may submit;
    // otherwise advance the wizard like Continue does.
    if (step < 3) {
      handleNext(ev as unknown as React.MouseEvent<HTMLButtonElement>);
      return;
    }

    const stepErrors = validateStep3();
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      notify.warning("Please resolve the highlighted fields before submitting.");
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, unknown> = { ...formData };
      delete payload.declaration;

      if (formData.startDate) payload.startDate = new Date(formData.startDate).toISOString();
      if (formData.preferredCompletionDate) {
        payload.preferredCompletionDate = new Date(formData.preferredCompletionDate).toISOString();
      }
      if (formData.isExistingBusiness) payload.isExistingBusiness = formData.isExistingBusiness === "true";
      if (formData.isExistingCommunityProject) {
        payload.isExistingCommunityProject = formData.isExistingCommunityProject === "true";
      }

      const res = await fetch("/api/community-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.status === 401) {
        setNeedsAuth(true);
        return;
      }
      if (!res.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "Failed to submit service request.");
      }

      markSuccess(data.data?.requestNumber ?? null, formData.organizationType);
    } catch (err: unknown) {
      notify.error(err);
      notify.info("Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <SuccessNotice requestNumber={requestNumber} onReset={clearSuccess} />
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      {needsAuth && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Sign in to submit your request</p>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                Service requests are limited to signed-in JANIC members. Sign in or create an account — your progress
                stays on this page.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-full border border-amber-600 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {STEPS.map((s, i) => {
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={cn(
                    "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black transition-colors",
                    isDone
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "bg-[#0875D1] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </span>
                <span
                  className={cn(
                    "hidden sm:block text-[11px] font-bold truncate",
                    isActive
                      ? "text-[#08245C] dark:text-white"
                      : isDone
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                  )}
                >
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "flex-1 h-px min-w-4 transition-colors",
                    isDone ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5">
        <span className="text-xs font-black uppercase tracking-wider text-[#0875D1]">
          Step {step} of 3
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">· {STEPS[step - 1].hint}</span>
      </div>

      {/* STEP 1 — ORGANIZATION INFORMATION */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                {
                  type: "FOR_PROFIT" as OrgType,
                  label: "For-Profit Organization",
                  icon: Building2,
                  sub: "Business or commercial entity",
                },
                {
                  type: "NONPROFIT" as OrgType,
                  label: "Nonprofit Organization",
                  icon: HeartHandshake,
                  sub: "NGO, charity or community group",
                },
              ]
            ).map((opt) => {
              const Icon = opt.icon;
              const active = formData.organizationType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => set("organizationType", opt.type)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border text-left transition",
                    active
                      ? "border-[#0875D1] bg-blue-50/70 dark:bg-[#0875D1]/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-[#0875D1]/40"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", active ? "text-[#0875D1]" : "text-slate-400")} />
                  <span>
                    <span
                      className={cn(
                        "block text-xs font-bold",
                        active ? "text-[#0875D1]" : "text-[#08245C] dark:text-white"
                      )}
                    >
                      {opt.label}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Organization Name" required error={errors.organizationName}>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => set("organizationName", e.target.value)}
                placeholder="e.g. Hormuud Telecom, HornAfrik"
                className={cn(inputBase, errors.organizationName ? inputErr : inputOk)}
              />
            </Field>

            <Field label="Organization Category" required error={errors.organizationCategory}>
              <select
                value={formData.organizationCategory}
                onChange={(e) => set("organizationCategory", e.target.value)}
                className={cn(inputBase, errors.organizationCategory ? inputErr : inputOk)}
              >
                <option value="">Select a category</option>
                {ORG_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Contact Person's Full Name" required error={errors.contactPerson}>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => set("contactPerson", e.target.value)}
                placeholder="Full Name & Title"
                className={cn(inputBase, errors.contactPerson ? inputErr : inputOk)}
              />
            </Field>

            <Field label="Official Email Address" required error={errors.email}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="contact@organization.org"
                className={cn(inputBase, errors.email ? inputErr : inputOk)}
              />
            </Field>

            <Field label="Phone Number (with country code)" required error={errors.phone}>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+252 61..."
                className={cn(inputBase, errors.phone ? inputErr : inputOk)}
              />
            </Field>

            <Field label="Organization Website" error={errors.website}>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://example.org"
                className={cn(inputBase, errors.website ? inputErr : inputOk)}
              />
            </Field>

            <Field label="Country" required error={errors.country}>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder="Somalia"
                className={cn(inputBase, errors.country ? inputErr : inputOk)}
              />
            </Field>

            <Field label="City" required error={errors.city}>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Mogadishu"
                className={cn(inputBase, errors.city ? inputErr : inputOk)}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Organization Address">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Street, district, postal code"
                  className={cn(inputBase, inputOk)}
                />
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — REQUESTED SERVICE */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Service Category" required error={errors.serviceCategoryId}>
              <select
                value={formData.serviceCategoryId}
                onChange={(e) => {
                  set("serviceCategoryId", e.target.value);
                  set("serviceId", "");
                }}
                className={cn(inputBase, errors.serviceCategoryId ? inputErr : inputOk)}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Specific Service" required error={errors.serviceId}>
              <select
                value={formData.serviceId}
                onChange={(e) => set("serviceId", e.target.value)}
                disabled={!formData.serviceCategoryId}
                className={cn(
                  inputBase,
                  errors.serviceId ? inputErr : inputOk,
                  !formData.serviceCategoryId && "disabled:opacity-60"
                )}
              >
                <option value="">
                  {formData.serviceCategoryId ? "Select a service" : "Select a category first"}
                </option>
                {availableServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Request Title" required error={errors.requestTitle}>
                <input
                  type="text"
                  value={formData.requestTitle}
                  onChange={(e) => set("requestTitle", e.target.value)}
                  placeholder="Short summary of what you need"
                  className={cn(inputBase, errors.requestTitle ? inputErr : inputOk)}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Detailed Description of the Problem or Need" required error={errors.description}>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe your organization's current situation, the challenge you face, and what a good outcome looks like..."
                  className={cn(inputBase, errors.description ? inputErr : inputOk)}
                />
              </Field>
            </div>

            <Field label="Expected Outcomes">
              <textarea
                rows={3}
                value={formData.expectedOutcomes}
                onChange={(e) => set("expectedOutcomes", e.target.value)}
                placeholder="What would success look like?"
                className={cn(inputBase, inputOk)}
              />
            </Field>

            <Field label="Intended Beneficiaries / Target Audience">
              <textarea
                rows={3}
                value={formData.beneficiaries}
                onChange={(e) => set("beneficiaries", e.target.value)}
                placeholder="Who will benefit from this service?"
                className={cn(inputBase, inputOk)}
              />
            </Field>

            <Field label="Project Start Date">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className={cn(inputBase, inputOk)}
              />
            </Field>

            <Field label="Preferred Completion Date" error={errors.preferredCompletionDate}>
              <input
                type="date"
                value={formData.preferredCompletionDate}
                onChange={(e) => set("preferredCompletionDate", e.target.value)}
                className={cn(inputBase, errors.preferredCompletionDate ? inputErr : inputOk)}
              />
            </Field>

            <Field label="Estimated Budget">
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => set("budget", e.target.value)}
                placeholder="e.g. $5,000"
                className={cn(inputBase, inputOk)}
              />
            </Field>

            <Field label="Preferred Contact Method">
              <select
                value={formData.preferredContactMethod}
                onChange={(e) => set("preferredContactMethod", e.target.value)}
                className={cn(inputBase, inputOk)}
              >
                <option value="EMAIL">Email</option>
                <option value="PHONE">Phone</option>
                <option value="IN_PERSON">In-person meeting</option>
              </select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Additional Notes">
                <textarea
                  rows={2}
                  value={formData.additionalNotes}
                  onChange={(e) => set("additionalNotes", e.target.value)}
                  placeholder="Any additional information that would help us understand your request"
                  className={cn(inputBase, inputOk)}
                />
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — BUSINESS DETAILS */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {isProfit ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Business or Industry Sector" required error={errors.businessSector}>
                <input
                  type="text"
                  value={formData.businessSector}
                  onChange={(e) => set("businessSector", e.target.value)}
                  placeholder="e.g. Healthcare, Fintech, Education"
                  className={cn(inputBase, errors.businessSector ? inputErr : inputOk)}
                />
              </Field>

              <Field label="Intended Business Outcome">
                <input
                  type="text"
                  value={formData.businessOutcome}
                  onChange={(e) => set("businessOutcome", e.target.value)}
                  placeholder="What business goal does this support?"
                  className={cn(inputBase, inputOk)}
                />
              </Field>

              <Field label="Existing Business or New Venture?">
                <select
                  value={formData.isExistingBusiness}
                  onChange={(e) => set("isExistingBusiness", e.target.value)}
                  className={cn(inputBase, inputOk)}
                >
                  <option value="">Select</option>
                  <option value="true">Existing business</option>
                  <option value="false">New venture</option>
                </select>
              </Field>

              <Field label="Commercial Requirements or Constraints">
                <textarea
                  rows={2}
                  value={formData.commercialRequirements}
                  onChange={(e) => set("commercialRequirements", e.target.value)}
                  placeholder="Deadlines, compliance, or integration constraints"
                  className={cn(inputBase, inputOk)}
                />
              </Field>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Organization's Mission" required error={errors.organizationMission}>
                  <textarea
                    rows={2}
                    value={formData.organizationMission}
                    onChange={(e) => set("organizationMission", e.target.value)}
                    placeholder="Briefly describe the purpose and mission of your organization"
                    className={cn(inputBase, errors.organizationMission ? inputErr : inputOk)}
                  />
                </Field>
              </div>

              <Field label="Community or Social Problem Being Addressed">
                <textarea
                  rows={2}
                  value={formData.socialProblem}
                  onChange={(e) => set("socialProblem", e.target.value)}
                  placeholder="Describe the problem your project aims to address"
                  className={cn(inputBase, inputOk)}
                />
              </Field>

              <Field label="Target Beneficiaries">
                <textarea
                  rows={2}
                  value={formData.targetBeneficiaries}
                  onChange={(e) => set("targetBeneficiaries", e.target.value)}
                  placeholder="Who are the intended beneficiaries?"
                  className={cn(inputBase, inputOk)}
                />
              </Field>

              <Field label="Expected Social or Educational Impact">
                <textarea
                  rows={2}
                  value={formData.socialImpact}
                  onChange={(e) => set("socialImpact", e.target.value)}
                  placeholder="Describe the change you hope to create"
                  className={cn(inputBase, inputOk)}
                />
              </Field>

              <Field label="Project Funding Status">
                <select
                  value={formData.fundingStatus}
                  onChange={(e) => set("fundingStatus", e.target.value)}
                  className={cn(inputBase, inputOk)}
                >
                  <option value="">Select status</option>
                  {FUNDING_STATUSES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Part of an Existing Community Project?">
                <select
                  value={formData.isExistingCommunityProject}
                  onChange={(e) => set("isExistingCommunityProject", e.target.value)}
                  className={cn(inputBase, inputOk)}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </Field>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.declaration}
                  onChange={(e) => set("declaration", e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0875D1] focus:ring-[#0875D1]"
                />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  I confirm that the information provided is accurate and that I am authorized to submit this request on
                  behalf of the organization.
                </span>
              </label>
              <div className="ml-7">
                <ErrorText message={errors.declaration} />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Submitting a request does not guarantee acceptance or immediate service delivery. Your information will be
              used only to process this request.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-[#08245C] dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
          >
            Continue
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Submit Service Request
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}