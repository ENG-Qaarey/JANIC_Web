import React from "react";
import Link from "next/link";
import { MapPin, Mail, Lock } from "lucide-react";
import { getSettingsMap } from "@/lib/settings";

export async function InstitutionalTopBar() {
  const settings = await getSettingsMap();
  const institutionName = (settings["institution_name"] || "JAZEERA UNIVERSITY").toUpperCase();
  const facultyName = settings["faculty_name"] || "Faculty of Computer Science & IT";
  const address = settings["campus_address"] || "KM4, Mogadishu, Somalia";
  const email = settings["contact_email"] || "info@janic.edu.so";

  return (
    <div className="bg-[#051532] text-slate-300 text-xs border-b border-blue-900/40 relative z-30">
      {/* Institutional emerald accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-400" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {institutionName}
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            {facultyName}
          </span>
        </div>

        <div className="flex items-center gap-5 text-[11px] text-slate-300">
          <div className="hidden lg:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{address}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <a href={`mailto:${email}`} className="hover:text-white transition">
              {email}
            </a>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/70 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-800/60 transition"
          >
            <Lock className="w-3 h-3 text-blue-400" />
            Staff CMS
          </Link>
        </div>
      </div>
    </div>
  );
}
