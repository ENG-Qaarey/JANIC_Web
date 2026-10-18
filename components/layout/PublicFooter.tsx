import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getSettingsMap } from "@/lib/settings";

export async function PublicFooter() {
  const settings = await getSettingsMap();
  const tagline = settings["footer_tagline"] || "Technology • Innovation • Research • Training";
  const founded = settings["founded_date"] || "October 25, 2021";
  const address = settings["campus_address"] || "Jazeera University Main Campus, KM4, Mogadishu, Somalia";
  const email = settings["contact_email"] || "info@janic.edu.so";
  const phone = settings["contact_phone"] || "+252 61 555 1234";
  const siteName = settings["site_name"] || "Jazeera Nexus Innovation Center (JANIC)";
  const accreditation = settings["accreditation_badge"] || "Accredited Academic Innovation Lab";

  return (
    <footer className="bg-[#051532] text-slate-300 border-t border-blue-900/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative w-48 h-12 transition-transform group-hover:scale-[1.02]">
                <Image
                  src="/images/janic-new-with-jazeera-white.png"
                  alt="JANIC Logo"
                  fill
                  className="object-contain object-left"
                  sizes="192px"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-300 font-medium">{tagline}</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A technology and innovation initiative of the Faculty of Computer Science & IT, Jazeera University in Mogadishu, Somalia. Founded {founded}.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{accreditation}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition">About JANIC</Link>
              </li>
              <li>
                <Link href="/what-we-do" className="text-slate-400 hover:text-white transition">What We Do</Link>
              </li>
              <li>
                <Link href="/innovation-hub" className="text-slate-400 hover:text-white transition">Innovation Hub</Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-white transition">Student Projects</Link>
              </li>
              <li>
                <Link href="/project-members" className="text-slate-400 hover:text-white transition">Project Members & Teams</Link>
              </li>
              <li>
                <Link href="/training" className="text-slate-400 hover:text-white transition">Training & Certifications</Link>
              </li>
              <li>
                <Link href="/research" className="text-slate-400 hover:text-white transition">Applied Research</Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-400 hover:text-white transition">Events & Hackathons</Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition">Our Team</Link>
              </li>
              <li>
                <Link href="/posts" className="hover:text-white transition">Posts</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">FAQ</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">Search</Link>
              </li>
              <li>
                <a href="https://juictgirls.org/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                  JU ICT Girls<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Engagement */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Engagement
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/submit-innovation" className="hover:text-blue-300 transition text-blue-400 font-semibold">
                  Submit Your Idea →
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-slate-400 hover:text-white transition">Partnerships</Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-white transition">Staff Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition">
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{phone}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Designed for University & Technological Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
