"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send, UserRound, Mail, Phone, FileText, MessageCircle, ArrowRight } from "lucide-react";
import styles from "./ContactForm.module.css";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export function ContactForm({ initialSubject }: { initialSubject?: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: initialSubject || "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = "Full name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com)";
    }

    // Phone validation (optional, but validated if provided)
    const trimmedPhone = formData.phone.trim();
    if (trimmedPhone) {
      const phoneDigits = trimmedPhone.replace(/[\s\-()]/g, "");
      if (phoneDigits.length < 6 || !/^\+?[0-9]{6,15}$/.test(phoneDigits)) {
        newErrors.phone = "Please enter a valid phone number (at least 6 digits)";
      }
    }

    // Subject validation
    const trimmedSubject = formData.subject.trim();
    if (!trimmedSubject) {
      newErrors.subject = "Subject is required";
    } else if (trimmedSubject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    // Message validation
    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      newErrors.message = "Message is required";
    } else if (trimmedMessage.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setError("Please fill out all required fields correctly before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to deliver message.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">Message Delivered</h3>
        <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
          Thank you for reaching out to the JANIC office. An advisor from our department will respond to your email shortly.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            setErrors({});
          }}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Your Full Name *", type: "text", placeholder: "Eng. Ahmed Mohamed", autoComplete: "name", icon: UserRound },
    { name: "email", label: "Email Address *", type: "email", placeholder: "ahmed@example.com", autoComplete: "email", icon: Mail },
    { name: "phone", label: "Phone Number (Optional)", type: "tel", placeholder: "+252 61...", autoComplete: "tel", icon: Phone },
    { name: "subject", label: "Subject *", type: "text", placeholder: "e.g. Training Inquiry, General Question", autoComplete: "off", icon: FileText },
  ] as const;

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {error && <div role="alert" className={styles.errorBanner}><AlertCircle size={18} aria-hidden="true" /><span>{error}</span></div>}
      <div className={styles.fields}>
        {fields.map(({ name, label, type, placeholder, autoComplete, icon: Icon }) => (
          <div key={name} className={styles.field}>
            <label htmlFor={`contact-${name}`}>{label}</label>
            <div className={styles.control}>
              <Icon className={styles.inputIcon} size={18} strokeWidth={1.7} aria-hidden="true" />
              <input
                id={`contact-${name}`}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={formData[name]}
                onChange={(e) => handleInputChange(name, e.target.value)}
                placeholder={placeholder}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
                className={errors[name] ? styles.invalid : undefined}
              />
            </div>
            {errors[name] && <p id={`contact-${name}-error`} className={styles.fieldError}><AlertCircle size={14} aria-hidden="true" /><span>{errors[name]}</span></p>}
          </div>
        ))}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Your Message *</label>
        <div className={styles.control}>
          <MessageCircle className={styles.messageIcon} size={19} strokeWidth={1.7} aria-hidden="true" />
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="How can JANIC assist you? Please write your query here..."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            className={errors.message ? styles.invalid : undefined}
          />
        </div>
        {errors.message && <p id="contact-message-error" className={styles.fieldError}><AlertCircle size={14} aria-hidden="true" /><span>{errors.message}</span></p>}
      </div>
      <button type="submit" disabled={loading} className={styles.sendButton}>
        {loading ? <><Loader2 size={19} className="animate-spin" aria-hidden="true" />Sending Message...</> : <><Send size={20} aria-hidden="true" />Send Message to JANIC<ArrowRight size={22} className={styles.sendArrow} aria-hidden="true" /></>}
      </button>
    </form>
  );
}