import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Rocket,
  MapPin,
  CheckCircle2,
  Shield,
  Cloud,
  Binary,
  Code2,
  ArrowUpRight,
  Sparkles,
  Users,
  Zap,
  Award,
  Target,
} from "lucide-react";
import { ResearchService } from "@/services/research/research.service";
import { EventService } from "@/services/events/event.service";
import { ProjectService } from "@/services/projects/project.service";
import { InnovationPipelineNodes } from "@/components/public/InnovationPipelineNodes";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ProjectMediaCover } from "@/components/public/ProjectMediaCover";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [researchPapers, upcomingEvents, featuredProjects] = await Promise.all([
    ResearchService.getFeaturedPapers(3),
    EventService.getUpcomingEvents(3),
    ProjectService.getFeaturedProjects(8),
  ]);

  const heroTitle = await getSetting("hero_title", "Innovating Technology. Empowering the Future.");
  const heroSubtitle = await getSetting("hero_subtitle", "The leading institutional hub for technological transformation, advanced research, and digital excellence.");
  const heroImage = await getSetting("hero_image", "/images/janic-hero-lab.jpg");
  const heroBadgeValue = await getSetting("hero_badge_value", "18+");
  const heroBadgeLabel = await getSetting("hero_badge_label", "STUDENT INNOVATION PROJECTS");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-x-clip">
      {/* 1. HERO SECTION (MATCHING DESIGN MOCKUP) - FADE DOWN ENTRANCE */}
      <section className="bg-white dark:bg-slate-950 pt-6 pb-10 sm:pt-8 sm:pb-12 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-down" duration={850} rootMargin="0px">
            {/* Main Hero Card with Futuristic Lab Backdrop */}
            <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[580px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-2xl">
              {/* Background Image */}
              <Image
                src={heroImage}
                alt="JANIC Innovation Lab"
                fill
                className="object-cover object-center"
                priority
                quality={95}
              />

              {/* Glowing Tech Blue Overlays matching mock */}
              <div className="absolute inset-0 bg-[#06509e]/65 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#031d4e]/95 via-[#06428a]/80 to-[#0256a4]/60 pointer-events-none" />
              <div className="absolute inset-0 bg-blue-600/20 backdrop-brightness-[0.92] pointer-events-none" />

              {/* Top Row: Floating Glassmorphism Badge at Top-Right */}
              <div className="flex justify-end relative z-10">
                <div className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#09224f]/60 backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#0875D1] text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white leading-tight">{heroBadgeValue}</div>
                    <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                      {heroBadgeLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Two-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10 pt-10 sm:pt-16">
                {/* Left Column: Main Typography */}
                <div className="lg:col-span-7 space-y-5">
                  <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-black text-white tracking-tight leading-[1.08] whitespace-pre-line">
                    {heroTitle}
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-xl">
                    {heroSubtitle}
                  </p>
                </div>

                {/* Right Column: Floating White Innovation Hub Card */}
                <div className="lg:col-span-5 flex justify-start lg:justify-end">
                  <div className="w-full max-w-md bg-white dark:bg-slate-900/95 rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-100/90 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-1 bg-[#0875D1] rounded-full inline-block" />
                      <span className="text-xs font-black tracking-wider uppercase text-[#0875D1] dark:text-sky-400">
                        Innovation Hub
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white tracking-tight leading-snug">
                      Ideas <span className="text-[#0875D1] mx-1">→</span> Prototypes <span className="text-[#0875D1] mx-1">→</span> Solutions
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                      Bridging the gap between academic theory and real-world industrial impact through cutting-edge technology development.
                    </p>
                    <Link
                      href="/innovation-hub"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#08245C] dark:text-slate-200 hover:text-[#0875D1] dark:hover:text-sky-400 transition-colors mt-5 group"
                    >
                      <span>Explore the Hub</span>
                      <ArrowRight className="w-4 h-4 text-[#0875D1] transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 2. IMPACT STATS BAR (MATCHING MOCKUP STRIP) - ZOOM IN ENTRANCE */}
          <ScrollReveal animation="zoom-in" duration={750} delay={150}>
            <div className="mt-10 sm:mt-14 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-y-6 max-w-6xl mx-auto px-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C] dark:text-white">2021</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">FOUNDED</span>
                </div>
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C] dark:text-white">18+</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">PROJECTS</span>
                </div>
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C] dark:text-white">6</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">FUNCTIONS</span>
                </div>
                <div className="flex-1 min-w-[140px] flex items-baseline justify-center gap-2.5 px-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#08245C] dark:text-white">2</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">HUB</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. ABOUT THE CENTER (MATCHING DESIGN MOCKUP) - FADE RIGHT ENTRANCE */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Content (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-bold text-[#0875D1] dark:text-[#38BDF8] uppercase tracking-wider block">
                  ABOUT THE CENTER
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08245C] dark:text-white tracking-tight leading-[1.15]">
                  Empowering Digital <br />
                  Evolution in the Region
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                  Jazeera Nexus Innovation Center (JANIC) is at the forefront of technological advancement, dedicated to fostering a culture of innovation and excellence. We serve as a catalyst for growth, providing the tools and environment needed for students and researchers to thrive.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0875D1] dark:bg-blue-950/60 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#08245C] dark:text-slate-100">
                        Applied Research Excellence
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Solving complex problems through targeted technical research.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0875D1] dark:bg-blue-950/60 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#08245C] dark:text-slate-100">
                        Skill Transformation
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Bridging the gap between education and industrial requirements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/about"
                    className="px-8 py-3.5 rounded-full bg-[#08245C] hover:bg-[#051532] text-white dark:bg-[#0875D1] dark:hover:bg-[#0660ab] font-semibold text-xs tracking-wide shadow-sm hover:shadow transition inline-block cursor-pointer"
                  >
                    Discover Our Story
                  </Link>
                </div>
              </div>

              {/* Right Visual Image (5 cols) */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 aspect-[4/3] sm:aspect-[1.15/1]">
                  <Image
                    src="/images/janic-building-lobby.jpg"
                    alt="JANIC Innovation Center Atrium"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>

                {/* Floating Oct 25 FOUNDED 2021 badge overlapping bottom left */}
                <div className="absolute -bottom-6 -left-4 sm:-bottom-7 sm:-left-6 bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100/90 dark:border-slate-800 z-10 flex flex-col items-center min-w-[125px] text-center">
                  <div className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white leading-none">
                    Oct 25
                  </div>
                  <div className="text-[10px] font-bold text-[#0875D1] dark:text-sky-400 uppercase tracking-wider mt-1.5">
                    FOUNDED 2021
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. OUR FUNCTIONS — COMPREHENSIVE TECH SOLUTIONS (MATCHING DESIGN MOCKUP) - BLUR IN ENTRANCE */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in" duration={850}>
            {/* Light ice-blue outer canvas card with rounded-[2.5rem] */}
            <div className="bg-[#F0F6FE] dark:bg-slate-900/80 dark:border dark:border-slate-800 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16">
              {/* Header: Title on Left, Subtext on Right */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
                <div>
                  <span className="text-xs font-bold text-[#0875D1] dark:text-[#38BDF8] uppercase tracking-wider block mb-2">
                    OUR FUNCTIONS
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08245C] dark:text-white tracking-tight">
                    Comprehensive Tech Solutions
                  </h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
                  We provide a full spectrum of services from fundamental development to advanced AI implementations.
                </p>
              </div>

              {/* Asymmetrical Grid: Top Row (2 Cards), Bottom Row (3 Cards) */}
              <div className="space-y-6">
                {/* Top Row: 1 Wide White Card + 1 Dark Navy Card */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* 01 Technology & Platform Development */}
                  <div className="lg:col-span-8 bg-white dark:bg-slate-950 rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100/80 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#0875D1] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-100/90 dark:text-slate-800 select-none">
                        01
                      </span>
                    </div>

                    <div className="space-y-3 mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#08245C] dark:text-white tracking-tight">
                        Technology & Platform Development
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                        Building scalable web applications, mobile platforms, and enterprise software solutions tailored for local and international markets.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-sky-300 text-xs font-bold">
                        Full Stack
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-sky-300 text-xs font-bold">
                        Mobile App
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-sky-300 text-xs font-bold">
                        Cloud Native
                      </span>
                    </div>
                  </div>

                  {/* Cybersecurity & Trust (Dark Navy Card) */}
                  <div className="lg:col-span-4 bg-[#08245C] dark:bg-blue-950/70 dark:border dark:border-blue-800/40 text-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col justify-between relative overflow-hidden group">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-8">
                      <Shield className="w-6 h-6" />
                    </div>

                    <div className="space-y-3 mb-8">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        Cybersecurity & Trust
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        Ensuring digital assets are protected through rigorous security protocols and auditing.
                      </p>
                    </div>

                    <div>
                      <Link
                        href="/what-we-do"
                        className="text-xs font-bold text-white hover:text-blue-300 transition inline-flex items-center gap-1 group-hover:underline"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: 3 Equal White Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cloud Infrastructure */}
                  <div className="bg-white dark:bg-slate-950 rounded-3xl p-7 sm:p-8 shadow-sm border border-slate-100/80 dark:border-slate-800 flex flex-col justify-between group">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-sky-300 flex items-center justify-center mb-5">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white mb-2 tracking-tight">
                        Cloud Infrastructure
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        Optimizing deployments for scalability and performance across multi-cloud environments.
                      </p>
                    </div>
                  </div>

                  {/* AI & Machine Learning */}
                  <div className="bg-white dark:bg-slate-950 rounded-3xl p-7 sm:p-8 shadow-sm border border-slate-100/80 dark:border-slate-800 flex flex-col justify-between group">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-sky-300 flex items-center justify-center mb-5">
                        <Binary className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white mb-2 tracking-tight">
                        AI & Machine Learning
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        Implementing intelligent automation and predictive analytics to drive business insights.
                      </p>
                    </div>
                  </div>

                  {/* Embedded Systems */}
                  <div className="bg-white dark:bg-slate-950 rounded-3xl p-7 sm:p-8 shadow-sm border border-slate-100/80 dark:border-slate-800 flex flex-col justify-between group">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0875D1] dark:text-sky-300 flex items-center justify-center mb-5">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white mb-2 tracking-tight">
                        Embedded Systems
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        Developing hardware-software integrations for smart city and IoT applications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. INNOVATION HUB WORKFLOW PIPELINE - TILT UP ENTRANCE */}
      <section className="py-16 sm:py-24 bg-[#051329] text-white relative overflow-hidden border-b border-blue-900/60">
        {/* Subtle architectural backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="tilt-up" duration={850}>
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-[#38bdf8] text-xs font-bold uppercase tracking-wider">
                Innovation Lifecycle
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Ideas. Prototypes. Possibilities.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                The JANIC Innovation Hub is where radical ideas meet rigorous engineering. We provide a sandbox for student-led innovation and industrial prototyping.
              </p>
            </div>

            {/* Connected Pipeline Component */}
            <InnovationPipelineNodes />
          </ScrollReveal>
        </div>
      </section>

      {/* 6. PROJECT SHOWCASES: ASYMMETRIC BENTO LAYOUT — TILT UP ENTRANCE */}
      <section className="py-16 sm:py-24 lg:py-28 section-portfolio-bg border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden relative isolate">
        {/* Decorative soft blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0875D1]/[0.05] dark:bg-[#0875D1]/[0.15] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-[#08245C]/[0.05] dark:bg-sky-500/[0.1] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[60%] left-10 w-[260px] h-[260px] bg-emerald-400/[0.03] dark:bg-emerald-400/[0.08] rounded-full blur-3xl pointer-events-none" />
        {/* Fine grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(8, 117, 209, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(8, 36, 92, 0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
          }}
        />

        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal animation="fade-up" duration={850}>
            {/* Section Header matching Screenshot 3 */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <p className="text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#0875D1] dark:text-[#38BDF8] mb-2">
                  PROJECTS PORTFOLIO
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-[#08245C] dark:text-white tracking-tight leading-[1.1]">
                  Innovation in Action
                </h2>
              </div>

              <Link
                href="/projects"
                className="group shrink-0 inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border-2 border-[#08245C]/10 hover:border-[#08245C] text-[#08245C] hover:bg-[#08245C] hover:text-white dark:border-slate-700 dark:text-slate-100 dark:hover:bg-white dark:hover:text-[#08245C] dark:hover:border-white text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_1px_2px_rgba(8,36,92,0.04),0_12px_32px_-16px_rgba(8,36,92,0.2)] dark:shadow-none hover:shadow-[0_2px_4px_rgba(8,36,92,0.06),0_20px_40px_-12px_rgba(8,36,92,0.35)] hover:-translate-y-0.5"
              >
                View Full Portfolio
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 2x2 PROJECT SHOWCASE GRID & BOTTOM SPOTLIGHT */}
          {(() => {
            const fallbackGrid: {
              title: string;
              summary: string;
              category: string;
              heroImage: string;
              slug: string;
              videoUrl?: string | null;
            }[] = [
                {
                  title: "MAAL HUB",
                  summary: "Integrated financial management system for micro enterprises.",
                  category: "FINTECH",
                  heroImage: "/images/maal-hub.jpg",
                  slug: "maal-hub",
                  videoUrl: null,
                },
                {
                  title: "Robot Car Cleaner",
                  summary: "Autonomous cleaning solutions for urban environments.",
                  category: "ROBOTICS",
                  heroImage: "/images/robot-car-cleaner.jpg",
                  slug: "robot-car-cleaner",
                  videoUrl: null,
                },
                {
                  title: "SAHAL SACCO",
                  summary: "Automating credit and savings operations.",
                  category: "SAAS",
                  heroImage: "/images/sahal-sacco.jpg",
                  slug: "sahal-sacco",
                  videoUrl: null,
                },
                {
                  title: "BADBAADO Platform",
                  summary: "Digital coordination for emergency health services.",
                  category: "SAFETY TECH",
                  heroImage: "/images/badbaado-safety.jpg",
                  slug: "badbaado",
                  videoUrl: null,
                },
              ];

            const defaultSpotlight = {
              title: "BADBAADO Healthcare Coordination Platform",
              summary:
                "A revolutionary platform designed to synchronize medical emergency responses and healthcare data across regional clinics. It streamlines patient data transfer and reduces critical response times by 35%.",
              heroImage: "/images/badbaado-healthcare.jpg",
              slug: "badbaado",
              stats: [
                { value: "35%", label: "Faster Response Time" },
                { value: "12k+", label: "Patients Managed" },
              ],
            };

            const allProjects = featuredProjects || [];

            // Match stored DB projects
            const findProject = (matchSlug: string, matchTitle: string) =>
              allProjects.find(
                (p) =>
                  p.slug.toLowerCase().includes(matchSlug) ||
                  p.title.toLowerCase().includes(matchTitle)
              );

            const p1 = findProject("maal", "maal") || allProjects[0] || fallbackGrid[0];
            const p2 = findProject("robot", "robot") || allProjects[1] || fallbackGrid[1];
            const p3 = findProject("sahal", "sahal") || allProjects[2] || fallbackGrid[2];
            const p4 =
              allProjects.find(
                (p) =>
                  p.id !== p1?.id &&
                  p.id !== p2?.id &&
                  p.id !== p3?.id
              ) || fallbackGrid[3];

            const gridCards = [
              {
                title: p1?.title || fallbackGrid[0].title,
                summary: p1?.summary || fallbackGrid[0].summary,
                category: p1?.category || fallbackGrid[0].category,
                heroImage: p1?.heroImage || fallbackGrid[0].heroImage,
                videoUrl: p1?.videoUrl || null,
                slug: p1?.slug || fallbackGrid[0].slug,
              },
              {
                title: p2?.title || fallbackGrid[1].title,
                summary: p2?.summary || fallbackGrid[1].summary,
                category: p2?.category || fallbackGrid[1].category,
                heroImage: p2?.heroImage || fallbackGrid[1].heroImage,
                videoUrl: p2?.videoUrl || null,
                slug: p2?.slug || fallbackGrid[1].slug,
              },
              {
                title: p3?.title || fallbackGrid[2].title,
                summary: p3?.summary || fallbackGrid[2].summary,
                category: p3?.category || fallbackGrid[2].category,
                heroImage: p3?.heroImage || fallbackGrid[2].heroImage,
                videoUrl: p3?.videoUrl || null,
                slug: p3?.slug || fallbackGrid[2].slug,
              },
              {
                title: p4?.title || fallbackGrid[3].title,
                summary: p4?.summary || fallbackGrid[3].summary,
                category: p4?.category || fallbackGrid[3].category,
                heroImage: p4?.heroImage || fallbackGrid[3].heroImage,
                videoUrl: p4?.videoUrl || null,
                slug: p4?.slug || fallbackGrid[3].slug,
              },
            ];

            const dbSpotlight =
              allProjects.find(
                (p) =>
                  p.slug.toLowerCase().includes("badbaado") ||
                  p.title.toLowerCase().includes("badbaado") ||
                  p.title.toLowerCase().includes("healthcare")
              ) || allProjects.find((p) => p.isFeatured) || allProjects[4];

            const spotlight = {
              title:
                dbSpotlight?.title && dbSpotlight.title.toLowerCase().includes("healthcare")
                  ? dbSpotlight.title
                  : (dbSpotlight?.title
                    ? `${dbSpotlight.title} Healthcare Coordination Platform`
                    : defaultSpotlight.title),
              summary: dbSpotlight?.summary || defaultSpotlight.summary,
              heroImage:
                dbSpotlight?.heroImage && !dbSpotlight.heroImage.includes("unsplash")
                  ? dbSpotlight.heroImage
                  : defaultSpotlight.heroImage,
              videoUrl: dbSpotlight?.videoUrl || null,
              slug: dbSpotlight?.slug || defaultSpotlight.slug,
              stats: defaultSpotlight.stats,
            };

            return (
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                {/* 1. TOP 2x2 GRID OF 4 PROJECTS (MATCHING SCREENSHOT 3) */}
                <ScrollReveal animation="tilt-up" duration={900} delay={60}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
                    {gridCards.map((card, idx) => (
                      <Link
                        key={card.slug || idx}
                        href={`/projects/${card.slug}`}
                        className="group relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/10] bg-slate-900 shadow-[0_4px_24px_-10px_rgba(8,36,92,0.18)] hover:shadow-[0_24px_48px_-12px_rgba(8,36,92,0.32)] transition-all duration-500 hover:-translate-y-1 block ring-1 ring-black/5"
                      >
                        {/* Media Cover (Autoplay Video Takes Priority, Hero Image Fallback) */}
                        <ProjectMediaCover
                          videoUrl={card.videoUrl}
                          imageUrl={card.heroImage}
                          alt={card.title}
                          className="object-cover object-center group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        />

                        {/* Gradient Vignette matching Screenshot 3 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/45" />

                        {/* Top Category Badge */}
                        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
                          <span className="inline-block px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#08245C] dark:text-sky-300 shadow-sm border border-slate-200/60 dark:border-slate-800">
                            {card.category}
                          </span>
                        </div>

                        {/* Bottom Title & Summary */}
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-10 flex flex-col justify-end">
                          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-1.5 transition-colors group-hover:text-cyan-300">
                            {card.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed">
                            {card.summary}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollReveal>

                {/* 2. BOTTOM FEATURED SPOTLIGHT CARD (MATCHING SCREENSHOT 3) */}
                <ScrollReveal animation="zoom-out" duration={900} delay={100}>
                  <div className="bg-white dark:bg-slate-900/90 dark:backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 ring-1 ring-slate-900/[0.04] dark:ring-white/[0.05]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                      {/* Left: Project Media (Video Priority or Hero Image) */}
                      <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-slate-950 border border-transparent dark:border-slate-800">
                        <ProjectMediaCover
                          videoUrl={spotlight.videoUrl}
                          imageUrl={spotlight.heroImage}
                          alt={spotlight.title}
                          className="object-cover object-center hover:scale-[1.03] transition-transform duration-700"
                        />
                      </div>

                      {/* Right: Content & Stats */}
                      <div className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6">
                        <div>
                          <span className="inline-block text-xs font-black text-[#0875D1] dark:text-[#38BDF8] uppercase tracking-[0.18em] mb-2.5">
                            FEATURED PROJECT
                          </span>
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
                            {spotlight.title}
                          </h3>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                          {spotlight.summary}
                        </p>

                        {/* Stats Row matching Screenshot 3 */}
                        <div className="flex items-center gap-10 sm:gap-14 pt-1">
                          {spotlight.stats.map((stat, idx) => (
                            <div key={idx}>
                              <div className="text-3xl sm:text-4xl font-black text-[#08245C] dark:text-white tracking-tight leading-none mb-1">
                                {stat.value}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Blue Pill CTA Button matching Screenshot 3 */}
                        <div className="pt-2">
                          <Link
                            href={`/projects/${spotlight.slug}`}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0663B3] text-white font-bold text-sm shadow-md shadow-[#0875D1]/25 dark:shadow-sky-500/20 hover:shadow-lg hover:shadow-[#0875D1]/35 transition-all hover:gap-3"
                          >
                            View Case Study
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 8. SCIENTIFIC INQUIRY ("Research & Insights") - FADE RIGHT ENTRANCE */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            {/* Dark Navy Rounded Box */}
            <div className="bg-[#0A224E] dark:bg-[#061739] text-white rounded-2xl sm:rounded-2xl p-8 sm:p-12 lg:p-14 shadow-xl border border-blue-900/40 dark:border-slate-800 relative overflow-hidden">
              {/* Header: Scientific Inquiry / Research & Insights / View Publications */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div>
                  <span className="text-xs font-bold text-[#00B4D8] tracking-wider uppercase block mb-2">
                    SCIENTIFIC INQUIRY
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    Research &amp; Insights
                  </h2>
                </div>

                <Link
                  href="/research"
                  className="px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 text-[#0A224E] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold shadow-sm transition self-start sm:self-auto shrink-0"
                >
                  View Publications
                </Link>
              </div>

              {/* 3 Dark Blue Cards Grid — Dynamic from DB */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {researchPapers && researchPapers.length > 0 ? (
                  researchPapers.slice(0, 3).map((paper) => (
                    <Link
                      key={paper.id}
                      href={`/research/${paper.slug}`}
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">
                          {paper.title}
                        </h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">
                          {paper.abstract}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">
                        Explore →
                      </div>
                    </Link>
                  ))
                ) : (
                  <>
                    <Link
                      href="/research/applied-technology"
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">Applied Technological Research</h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">Focusing on practical solutions for immediate industrial challenges in the local market.</p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">Explore →</div>
                    </Link>
                    <Link
                      href="/research/student-innovations"
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">Student-Led Innovations</h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">Empowering the next generation of researchers to push academic boundaries into the real world.</p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">Explore →</div>
                    </Link>
                    <Link
                      href="/research/digital-transformation"
                      className="bg-[#122B5D]/85 hover:bg-[#163470] border border-blue-400/15 rounded-2xl sm:rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight leading-snug">Digital Future Transformation</h3>
                        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">Strategic research into AI, Blockchain, and the impact of the 4th Industrial Revolution.</p>
                      </div>
                      <div className="text-xs font-bold text-white/90 group-hover:text-white transition flex items-center gap-1.5">Explore →</div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. COMMUNITY HUB ("Upcoming Events") - FADE UP ENTRANCE */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
              <div>
                <span className="text-xs font-bold text-[#0875D1] dark:text-[#38BDF8] tracking-wider uppercase block mb-1.5">
                  COMMUNITY HUB
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#08245C] dark:text-white tracking-tight">
                  Upcoming Events
                </h2>
              </div>

              <Link
                href="/events"
                className="text-xs sm:text-sm font-bold text-[#0875D1] dark:text-[#38BDF8] hover:underline underline-offset-4 transition shrink-0"
              >
                See All Events
              </Link>
            </div>

            {/* 3 Events Grid — Dynamic from DB */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event) => {
                  const d = new Date(event.eventDate);
                  const day = d.getDate();
                  const month = d.toLocaleString("en", { month: "short" }).toUpperCase();
                  const fallbackImages = ["/images/event-summit.jpg", "/images/event-cyber.jpg", "/images/event-workshop.jpg"];
                  const coverImg =
                    event.coverImage && event.coverImage.startsWith("/")
                      ? event.coverImage
                      : event.coverImage && event.coverImage.startsWith("http")
                        ? event.coverImage
                        : null;
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="group block"
                    >
                      <div className="relative rounded-2xl sm:rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800">
                        {coverImg ? (
                          <Image
                            src={coverImg}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Image
                            src={fallbackImages[upcomingEvents.indexOf(event) % 3]}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        {/* Date Badge */}
                        <div className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 dark:border-slate-700 min-w-[46px]">
                          <div className="text-base sm:text-lg font-black text-[#08245C] dark:text-white leading-none">
                            {day}
                          </div>
                          <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                            {month}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white tracking-tight mb-2 group-hover:text-[#0875D1] dark:group-hover:text-sky-400 transition">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <span className="text-xs font-bold text-[#08245C] dark:text-sky-400 group-hover:text-[#0875D1] dark:group-hover:text-sky-300 transition-colors inline-flex items-center gap-1">
                          Read More →
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link href="/events/janic-innovation-summit-2024" className="group block">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800">
                      <Image src="/images/event-summit.jpg" alt="JANIC Innovation Summit 2024" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 dark:border-slate-700 min-w-[46px]">
                        <div className="text-base font-black text-[#08245C] dark:text-white leading-none">18</div>
                        <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">OCT</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white tracking-tight mb-2 group-hover:text-[#0875D1] dark:group-hover:text-sky-400 transition">JANIC Innovation Summit 2024</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-3"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>Main Campus Auditorium</span></div>
                      <span className="text-xs font-bold text-[#08245C] dark:text-sky-400 group-hover:text-[#0875D1] dark:group-hover:text-sky-300 transition-colors inline-flex items-center gap-1">Read More →</span>
                    </div>
                  </Link>
                  <Link href="/events/cybersecurity-challenge-4" className="group block">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800">
                      <Image src="/images/event-cyber.jpg" alt="Cybersecurity Challenge 4.0" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 dark:border-slate-700 min-w-[46px]">
                        <div className="text-base font-black text-[#08245C] dark:text-white leading-none">04</div>
                        <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">NOV</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white tracking-tight mb-2 group-hover:text-[#0875D1] dark:group-hover:text-sky-400 transition">Cybersecurity Challenge 4.0</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-3"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>Tech Lab B-02</span></div>
                      <span className="text-xs font-bold text-[#08245C] dark:text-sky-400 group-hover:text-[#0875D1] dark:group-hover:text-sky-300 transition-colors inline-flex items-center gap-1">Read More →</span>
                    </div>
                  </Link>
                  <Link href="/events/ai-workshop-for-developers" className="group block">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/11] mb-4 shadow-sm bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800">
                      <Image src="/images/event-workshop.jpg" alt="AI Workshop for Developers" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/60 dark:border-slate-700 min-w-[46px]">
                        <div className="text-base font-black text-[#08245C] dark:text-white leading-none">15</div>
                        <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">DEC</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] dark:text-white tracking-tight mb-2 group-hover:text-[#0875D1] dark:group-hover:text-sky-400 transition">AI Workshop for Developers</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mb-3"><MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" /><span>Hybrid / Online</span></div>
                      <span className="text-xs font-bold text-[#08245C] dark:text-sky-400 group-hover:text-[#0875D1] dark:group-hover:text-sky-300 transition-colors inline-flex items-center gap-1">Read More →</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. PARTNERSHIPS ("Let's Build the Future Together") - BLUR IN ENTRANCE */}
      <section className="py-12 sm:py-16 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="blur-in" duration={850}>
            {/* Light Blue Outer Container */}
            <div className="bg-[#E9F3FD] dark:bg-slate-900/80 rounded-2xl sm:rounded-2xl lg:rounded-2xl p-8 sm:p-12 lg:p-14 border border-blue-100/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Side: Content & Actions */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
                    Let&apos;s Build the Future Together
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
                    We believe in the power of collaboration. Partner with JANIC to drive technological advancement and impact.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/partnerships"
                      className="px-7 py-3.5 rounded-full bg-[#0A224E] hover:bg-[#071938] text-white dark:bg-[#0875D1] dark:hover:bg-[#0660ab] font-bold text-xs sm:text-sm shadow-md transition"
                    >
                      Partner With Us
                    </Link>
                    <Link
                      href="/partnerships#partners"
                      className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0A224E] border border-slate-200/80 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm shadow-sm transition"
                    >
                      View Our Partners
                    </Link>
                  </div>
                </div>

                {/* Right Side: Network Graph Visual */}
                <div className="lg:col-span-6">
                  <div className="relative rounded-2xl sm:rounded-2xl overflow-hidden aspect-[16/10] w-full shadow-lg border-2 border-white/80 dark:border-slate-700">
                    <Image
                      src="/images/partnership-network.jpg"
                      alt="Network Nodes Collaboration"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 11. CALL TO ACTION (MATCHING DESIGN MOCKUP) - ZOOM IN ENTRANCE */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white dark:bg-slate-950 text-center overflow-hidden">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
              Have an Idea? Let&apos;s Turn It Into Innovation.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal tracking-wide max-w-xl mx-auto">
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
