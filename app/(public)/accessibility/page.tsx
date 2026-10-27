import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import Link from "next/link";

export const metadata = {
  title: "Accessibility | JANIC",
  description: "Accessibility commitment and inclusive digital experience at JANIC.",
};

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <SectionHero
        badge="Accessibility & Inclusion"
        title="Digital Accessibility Statement"
        description="Our ongoing dedication to ensuring an inclusive, accessible web experience for all students and visitors."
        breadcrumbs={[{ label: "Accessibility" }]}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full prose dark:prose-invert">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">Our Commitment</h2>
          <p>
            Jazeera Nexus Innovation Center is committed to digital accessibility and ensuring that our website is usable by everyone, including people with diverse abilities and those using assistive technologies.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">Accessibility Standards</h2>
          <p>
            We strive to adhere to the Web Content Accessibility Guidelines (WCAG 2.1) Level AA standards through semantic HTML structure, sufficient color contrast ratios, responsive mobile layouts, keyboard navigation support, and descriptive alt text for media.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">Feedback & Support</h2>
          <p>
            If you encounter any accessibility barrier or have difficulty accessing any part of this portal, please let us know so we can improve. Reach our team at{" "}
            <a href="mailto:janic@jazeerauniversity.edu.so" className="text-[#00A3E0] font-semibold underline">
              janic@jazeerauniversity.edu.so
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
}
