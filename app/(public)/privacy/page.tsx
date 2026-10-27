import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import Link from "next/link";

export const metadata = {
  title: "Privacy Notice | JANIC",
  description: "Official Privacy Notice and data protection policies for JANIC at Jazeera University.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <SectionHero
        badge="Legal & Institutional"
        title="Privacy Notice"
        description="Our commitment to safeguarding student, faculty, and partner information."
        breadcrumbs={[{ label: "Privacy Notice" }]}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full prose dark:prose-invert">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">1. Information We Collect</h2>
          <p>
            Jazeera Nexus Innovation Center (JANIC), operating under the Faculty of Computer Science & IT at Jazeera University, collects contact information, project proposals, and feedback submitted through our official web forms and registration channels.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">2. How Information is Used</h2>
          <p>
            Submitted information is strictly utilized to evaluate student project ideas, organize academic training sessions, coordinate industry partnerships, and facilitate communications regarding university innovation activities.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">3. Student & Partner Intellectual Property</h2>
          <p>
            JANIC respects the intellectual property and privacy of student innovators, faculty researchers, and collaborating institutions. We do not publish sensitive technical details, passwords, source code, or private datasets without explicit written consent.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">4. Contact & Inquiries</h2>
          <p>
            For any questions regarding data handling or privacy practices, please contact us at{" "}
            <a href="mailto:janic@jazeerauniversity.edu.so" className="text-[#00A3E0] font-semibold underline">
              janic@jazeerauniversity.edu.so
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
}
