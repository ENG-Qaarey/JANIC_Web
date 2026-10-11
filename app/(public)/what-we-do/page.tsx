import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import {
  Cpu,
  GraduationCap,
  Rocket,
  FlaskConical,
  Briefcase,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "What We Do",
  description:
    "Explore the 6 core pillars of JANIC: Software engineering, ICT certifications, student incubation, applied research, career readiness, and ecosystem outreach.",
};

export default function WhatWeDoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Core Functions"
        title="Comprehensive Tech Solutions"
        description="Explore how JANIC operates across 6 integrated pillars to empower students, engineers, and organizations in the Horn of Africa."
        breadcrumbs={[{ label: "What We Do" }]}
      />

      {/* 2. OVERVIEW HIGHLIGHT (ICE-BLUE BENTO BOX) - FADE RIGHT */}
      <section className="py-8 sm:py-12 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block">
                    Integrated Innovation Matrix
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#08245C] tracking-tight leading-tight">
                    From Foundational Code to Production Systems
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed max-w-xl">
                    JANIC bridges academic training and industrial execution. We function as a production software lab, advanced hardware sandbox, and certified training facility, creating verifiable career pipelines for university talent.
                  </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#08245C]">
                      6+
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      Specialized Pillars
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#08245C]">
                      100%
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      Hands-on Practical
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#08245C]">
                      18+
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      Active Projects
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-blue-100/80 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#08245C]">
                      7+
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      Industry Partners
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. SIX PILLARS BENTO GRID - BLUR IN */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in" duration={850}>
            <div className="mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1.5">
                FUNCTIONAL DISCIPLINES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] tracking-tight">
                Our Six Core Operations
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                Comprehensive technical verticals driving digital transformation.
              </p>
            </div>

            <div className="space-y-6">
              {/* Top Row: 1 Spotlight Wide Card + 1 Dark Navy Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 01: Platform Development (Spotlight 8 Cols) */}
                <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-2xl p-8 sm:p-10 border border-slate-200/90 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        01
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      SOFTWARE &amp; CLOUD SYSTEMS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#08245C] tracking-tight mb-3">
                      Technology &amp; Platform Development
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mb-6">
                      We design, architect, and deploy reliable digital platforms, cloud applications, and automated software workflows tailored for businesses, NGOs, and university infrastructure.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold">
                        Full Stack
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold">
                        Mobile App
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold">
                        Cloud Native
                      </span>
                    </div>

                    <ul className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                      <li className="flex items-start gap-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Modern Web and Cloud Applications (Next.js, React, Node.js, Python)</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>API Architecture &amp; Microservices Integration</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Institutional Database Engineering and Security Audits</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all group-hover:translate-x-1"
                    >
                      View Developed Systems <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* 02: Cybersecurity & Defense (Dark Navy 4 Cols) */}
                <div className="lg:col-span-4 bg-[#08245C] text-white rounded-2xl sm:rounded-2xl p-8 sm:p-10 shadow-md flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                        <Shield className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                        02
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block mb-2">
                      DEFENSE &amp; TRUST
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                      Cybersecurity Defense &amp; Audit
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                      Ensuring digital assets are protected through rigorous security protocols, vulnerability assessments, penetration testing, and auditing.
                    </p>

                    <ul className="space-y-2.5 pt-4 border-t border-white/10 mb-6">
                      <li className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                        <span>Network vulnerability assessment &amp; SOC operations</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                        <span>Identity &amp; access management protocols</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white transition group-hover:underline"
                    >
                      Request Security Audit →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Row: 4 Equal Bento Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 03: Training & Certification */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold mb-5">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      CERTIFICATION
                    </span>
                    <h3 className="text-base font-bold text-[#08245C] tracking-tight mb-2">
                      Training &amp; Certification
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Industry-grade IT training connecting computer science theory with recognized credentials.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-[#0875D1] hover:text-[#08245C] transition flex items-center gap-1"
                    >
                      Inquire About Courses →
                    </Link>
                  </div>
                </div>

                {/* 04: Innovation & Incubation */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold mb-5">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      INCUBATION
                    </span>
                    <h3 className="text-base font-bold text-[#08245C] tracking-tight mb-2">
                      Startup Incubator
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Dedicated maker workspace, rapid 3D prototyping benches, and seed funding pitch mentorship.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href="/innovation-hub"
                      className="text-xs font-bold text-[#0875D1] hover:text-[#08245C] transition flex items-center gap-1"
                    >
                      Explore Hub →
                    </Link>
                  </div>
                </div>

                {/* 05: Applied Research */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold mb-5">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      APPLIED SCIENCE
                    </span>
                    <h3 className="text-base font-bold text-[#08245C] tracking-tight mb-2">
                      Applied Research
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Peer-reviewed publications, open datasets, and edge artificial intelligence whitepapers.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href="/research"
                      className="text-xs font-bold text-[#0875D1] hover:text-[#08245C] transition flex items-center gap-1"
                    >
                      Read Papers →
                    </Link>
                  </div>
                </div>

                {/* 06: Career & Ecosystem */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold mb-5">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      CAREER LINKAGES
                    </span>
                    <h3 className="text-base font-bold text-[#08245C] tracking-tight mb-2">
                      Talent Placement
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Direct corporate hiring channels, technical portfolio reviews, and annual career hackathons.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href="/partnerships"
                      className="text-xs font-bold text-[#0875D1] hover:text-[#08245C] transition flex items-center gap-1"
                    >
                      Hire Talent →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. CALL TO ACTION (MATCHING HOME PAGE) - ZOOM IN */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white text-center overflow-hidden">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] tracking-tight leading-tight">
              Have an Idea? Let&apos;s Turn It Into Innovation.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-normal tracking-wide max-w-xl mx-auto">
              Join our vibrant ecosystem of developers, researchers, and visionaries.
            </p>
            <div className="pt-3">
              <Link
                href="/submit-innovation"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
