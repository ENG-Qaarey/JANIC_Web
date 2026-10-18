"use client";

import React from "react";
import { Hourglass } from "lucide-react";

interface ComingSoonCohortProps {
  year?: string;
}

export function ComingSoonCohort({ year }: ComingSoonCohortProps) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center">
      {/* Simple Animated Waiting Icon */}
      <div className="relative grid place-items-center w-20 h-20 rounded-full text-white bg-gradient-to-br from-[#40b4ff] via-[#0069ff] to-[#0347a8] border border-[#7ad4ff] shadow-[0_12px_28px_rgb(0_105_235/28%)]">
        <span className="absolute -inset-3 rounded-full border border-dashed border-[#8ccaff] dark:border-[#4777a7]" aria-hidden="true" />
        <Hourglass className="w-8 h-8 animate-pulse" />
      </div>

      {year && (
        <p className="mt-8 flex items-center gap-3 text-[#0075ff] dark:text-[#80c2ff] text-xs font-bold uppercase tracking-[0.08em]">
          <span className="w-8 h-0.5 bg-current" aria-hidden="true" />
          Cohort {year}
          <span className="w-8 h-0.5 bg-current" aria-hidden="true" />
        </p>
      )}

      {/* Coming Soon Text Only */}
      <h3 className={`${year ? "mt-3" : "mt-8"} text-3xl sm:text-4xl font-extrabold tracking-[-0.04em] text-[#08245C] dark:text-slate-100`}>
        Coming <span className="text-[#0765ff] dark:text-[#80c2ff]">Soon</span>
      </h3>
    </div>
  );
}
