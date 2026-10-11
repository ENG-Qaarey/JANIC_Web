"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SuccessNotice } from "@/components/forms/ServiceRequestForm";

const SUCCESS_KEY = "janic_cs_request_submitted";
const EVENT_SUBMITTED = "janic:cs-submitted";
const EVENT_RESET = "janic:cs-reset";

/**
 * Page-level confirmation banner. Sits directly under the hero so the "Service Request
 * Received" message stays on screen for the whole page, not only while the visitor is
 * scrolled down to the form. Stays until "Submit Another Request" is clicked.
 */
export function CommunityServiceSuccessBanner() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState<{ requestNumber: string | null } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SUCCESS_KEY);
      if (raw) setSubmitted(JSON.parse(raw));
    } catch {
      /* ignore */
    }

    const onSubmitted = (e: Event) => {
      setSubmitted((e as CustomEvent).detail ?? { requestNumber: null });
    };
    const onReset = () => setSubmitted(null);

    window.addEventListener(EVENT_SUBMITTED, onSubmitted);
    window.addEventListener(EVENT_RESET, onReset);
    return () => {
      window.removeEventListener(EVENT_SUBMITTED, onSubmitted);
      window.removeEventListener(EVENT_RESET, onReset);
    };
  }, []);

  if (!submitted) return null;

  const handleReset = () => {
    try {
      sessionStorage.removeItem(SUCCESS_KEY);
    } catch {
      /* ignore */
    }
    setSubmitted(null);
    window.dispatchEvent(new Event(EVENT_RESET));
    router.push("/community-services#service-request-form");
  };

  return (
    <div className="bg-white dark:bg-slate-950 pb-2">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <SuccessNotice requestNumber={submitted.requestNumber} onReset={handleReset} />
      </div>
    </div>
  );
}

export { SUCCESS_KEY, EVENT_SUBMITTED, EVENT_RESET };