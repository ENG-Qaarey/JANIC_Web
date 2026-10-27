import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import Link from "next/link";

export const metadata = {
  title: "Website Terms | JANIC",
  description: "Terms of use and institutional policies for the JANIC online portal.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <SectionHero
        badge="Legal & Institutional"
        title="Website Terms of Use"
        description="Standard terms and institutional conditions governing use of the JANIC digital platform."
        breadcrumbs={[{ label: "Terms of Use" }]}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full prose dark:prose-invert">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">1. Acceptance of Terms</h2>
          <p>
            By accessing and utilizing the JANIC portal, visitors, students, and institutional partners agree to abide by these Terms of Use and the educational policies of Jazeera University.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">2. Permitted Use</h2>
          <p>
            This website is provided for educational, informational, and innovation showcase purposes. Users may review project profiles, register for confirmed events, and submit collaboration proposals in good faith.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">3. Project Submissions & Conduct</h2>
          <p>
            Submissions made through the portal must represent original academic work or authorized team contributions. Submitting misleading information, malicious payloads, or infringing content is strictly prohibited.
          </p>

          <h2 className="text-xl font-bold text-[#0B3B82] dark:text-sky-400">4. Modifications & Governance</h2>
          <p>
            JANIC and the Faculty of Computer Science & IT reserve the right to update these terms to align with university administration standards and applicable educational regulations in Somalia.
          </p>
        </div>
      </section>
    </div>
  );
}
