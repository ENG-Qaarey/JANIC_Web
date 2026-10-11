import React, { Suspense } from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ServiceRequestForm } from "@/components/forms/ServiceRequestForm";
import { CommunityServiceSuccessBanner } from "@/components/community/CommunityServiceSuccessBanner";
import { CommunityServiceRepository } from "@/lib/repositories/community-service.repository";
import {
  Building2,
  HeartHandshake,
  Code2,
  Globe2,
  LifeBuoy,
  Workflow,
  GraduationCap,
  FlaskConical,
  Heart,
  Handshake,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Community Services",
  description:
    "JANIC partners with organizations and communities to deliver technology, innovation, research, and practical digital solutions that create meaningful impact.",
};

export const dynamic = "force-dynamic";

const PROFIT_EXAMPLES = [
  "Private companies and SMEs",
  "Startups and entrepreneurs",
  "Technology companies",
  "Private educational institutions",
];

const PROFIT_SERVICES = [
  "Website & web application development",
  "Mobile application development",
  "IT consulting & technical support",
  "Digital transformation & automation",
  "Software solutions & system development",
  "Technology training & professional development",
  "Research & technical consultation",
  "Innovation & product development collaboration",
];

const NONPROFIT_EXAMPLES = [
  "Non-governmental organizations",
  "Community-based organizations",
  "Educational foundations",
  "Youth & humanitarian organizations",
];

const NONPROFIT_SERVICES = [
  "Educational technology solutions",
  "Community digital literacy training",
  "Website & information system development",
  "Research & impact assessment support",
  "Digital tools for community projects",
  "Technology awareness programs",
  "Innovation & youth development initiatives",
  "Technical consultation & project collaboration",
];

const SERVICE_HIGHLIGHTS = [
  {
    title: "Software & Application Development",
    desc: "Custom software, web platforms, and mobile applications built around your workflows.",
    icon: Code2,
  },
  {
    title: "Website & Digital Platforms",
    desc: "Modern, responsive websites and information systems for organizations and communities.",
    icon: Globe2,
  },
  {
    title: "IT Consulting & Technical Support",
    desc: "Expert guidance, infrastructure advice, and ongoing technical assistance.",
    icon: LifeBuoy,
  },
  {
    title: "Digital Transformation & Automation",
    desc: "Streamline manual processes and adopt sustainable digital workflows.",
    icon: Workflow,
  },
  {
    title: "Training & Capacity Building",
    desc: "Professional development and digital literacy programs for teams and communities.",
    icon: GraduationCap,
  },
  {
    title: "Research & Innovation",
    desc: "Collaborative research, impact assessment, and product development support.",
    icon: FlaskConical,
  },
  {
    title: "Community Technology Programs",
    desc: "Technology initiatives designed around community needs and constraints.",
    icon: Heart,
  },
  {
    title: "Project Collaboration",
    desc: "Joint projects and long-term technical partnerships with JANIC.",
    icon: Handshake,
  },
];

const STEPS = [
  {
    title: "Submit a Request",
    desc: "Complete the online form and explain your organization's needs.",
  },
  {
    title: "JANIC Review",
    desc: "The authorized team reviews the request and checks its requirements.",
  },
  {
    title: "Consultation & Planning",
    desc: "JANIC contacts your organization to discuss feasibility, scope, timeline, and costs.",
  },
  {
    title: "Service Delivery",
    desc: "Approved requests proceed according to the agreed plan.",
  },
];

function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
      </div>
      <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
      <div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
    </div>
  );
}

export default async function CommunityServicesPage() {
  const categories = await CommunityServiceRepository.listCategories();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-x-clip">
      {/* 1. HERO SECTION */}
      <SectionHero
        badge="Community Services"
        title="Community Services"
        description="JANIC partners with organizations and communities to deliver technology, innovation, research, and practical digital solutions that create meaningful impact."
        breadcrumbs={[{ label: "Community Services" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="#service-request-form"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
          >
            Request a Service
            <Send className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="#available-services"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#08245C]/15 dark:border-slate-700 text-[#08245C] dark:text-slate-200 hover:bg-[#08245C]/5 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition-all"
          >
            Explore Our Services
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </SectionHero>

      {/* Confirmation banner — stays visible until "Submit Another Request" is clicked */}
      <CommunityServiceSuccessBanner />

      {/* 2. INTRODUCTION */}
      <section className="py-10 sm:py-14 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0875D1] bg-blue-50 dark:bg-[#0875D1]/15 dark:text-blue-300 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0875D1] dark:bg-blue-300" />
                Who We Serve
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight mt-4">
                Turning Community Needs into Digital Solutions
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mt-4">
                Jazeera Nexus Innovation Center connects academic expertise, technology, and innovation to help
                organizations address real-world challenges. Through community partnerships, technical services, research,
                and training, JANIC supports organizations seeking practical and sustainable solutions.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. ORGANIZATION CATEGORIES */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-white via-[#F8FBFF] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
                Choose Your Organization Type
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mt-3">
                Select the category that matches your organization to see the relevant services and start a request.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <ScrollReveal animation="fade-left" duration={850}>
              <div className="h-full bg-white dark:bg-slate-900 rounded-2xl border border-blue-100/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-[#0875D1]/40 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-1 w-full bg-gradient-to-r from-[#0875D1] to-[#0aa5e8]" />
                <div className="p-7 sm:p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center mb-5">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white tracking-tight">
                    For-Profit Organizations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                    For organizations whose primary purpose includes generating revenue or profit.
                  </p>

                  <div className="mt-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0875D1]">
                      Examples of eligible organizations
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PROFIT_EXAMPLES.map((ex) => (
                        <span
                          key={ex}
                          className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0875D1]">
                      Relevant services
                    </span>
                    <ul className="mt-2.5 space-y-2">
                      {PROFIT_SERVICES.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0875D1] shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/community-services?type=FOR_PROFIT#service-request-form"
                    className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
                  >
                    Request Business Services
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right" duration={850}>
              <div className="h-full bg-white dark:bg-slate-900 rounded-2xl border border-blue-100/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="p-7 sm:p-8 flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 flex items-center justify-center mb-5">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#08245C] dark:text-white tracking-tight">
                    Nonprofit Organizations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                    For organizations whose primary purpose is a social, educational, humanitarian, or community mission
                    rather than distributing profits.
                  </p>

                  <div className="mt-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Examples of eligible organizations
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {NONPROFIT_EXAMPLES.map((ex) => (
                        <span
                          key={ex}
                          className="px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Relevant services
                    </span>
                    <ul className="mt-2.5 space-y-2">
                      {NONPROFIT_SERVICES.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

<Link
                    href="/community-services?type=NONPROFIT#service-request-form"
                    className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all"
                  >
                    Request Community Support
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. AVAILABLE SERVICES */}
      <section id="available-services" className="py-10 sm:py-14 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0875D1] bg-blue-50 dark:bg-[#0875D1]/15 dark:text-blue-300 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0875D1] dark:bg-blue-300" />
                Service Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight mt-4">
                Available Services
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mt-3">
                Technology, training, and research services delivered by JANIC teams and faculty.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {SERVICE_HIGHLIGHTS.map((s, i) => {
              const Icon = s.icon;
              return (
                <ScrollReveal key={s.title} animation="fade-up" duration={600 + i * 80} delay={i * 60}>
                  <div className="group h-full bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-blue-100/70 dark:border-slate-800 p-5 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#0875D1]/15 text-[#0875D1] dark:text-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#08245C] dark:text-white tracking-tight mt-3.5 leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">{s.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {categories.length > 0 && (
            <ScrollReveal animation="fade-up" duration={800}>
              <div className="mt-10 bg-[#F0F6FE] dark:bg-slate-900/60 rounded-[2rem] border border-blue-100/70 dark:border-slate-800 p-6 sm:p-8">
                <h3 className="text-sm font-black text-[#08245C] dark:text-white tracking-tight mb-1">
                  Full service catalog
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Specific services available for selection when submitting a request.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <p className="text-[11px] font-bold text-[#0875D1] uppercase tracking-wider">{cat.name}</p>
                      <ul className="mt-1.5 space-y-1">
                        {cat.services.map((svc) => (
                          <li key={svc.id} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#0875D1] dark:bg-blue-400 shrink-0 mt-1.5" />
                            {svc.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-white via-[#F8FBFF] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
                How It Works
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mt-3">
                A simple four-step process from submission to service delivery.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.title} animation="fade-up" duration={650 + i * 120} delay={i * 100}>
                <div className="relative h-full bg-white dark:bg-slate-900 rounded-2xl border border-blue-100/80 dark:border-slate-800 p-6 hover:shadow-md transition-all duration-300">
                  <span className="text-3xl font-black text-blue-100 dark:text-slate-700 leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-bold text-[#08245C] dark:text-white tracking-tight mt-3.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <span className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-blue-100 dark:bg-slate-700" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade-up" duration={800}>
            <div className="mt-8 flex items-start gap-3 max-w-3xl mx-auto p-5 rounded-2xl bg-white dark:bg-slate-900 border border-blue-100/80 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-[#0875D1] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submitting a request does not guarantee acceptance or immediate service delivery. All requests are reviewed
                by the authorized JANIC team, and scope, timeline, and any applicable costs are agreed before work begins.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. SERVICE REQUEST FORM */}
      <section id="service-request-form" className="py-10 sm:py-16 bg-white dark:bg-slate-950 overflow-hidden scroll-mt-24">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0F6FE] dark:bg-slate-900/50 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-blue-100/70 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-4 space-y-6">
                <ScrollReveal animation="fade-left" duration={850}>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                    Request Submission
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
                    Submit a Service Request
                  </h2>
<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5">
                  Complete the form and tell us about your organization&apos;s needs. The more detail you provide, the
                  better we can assess feasibility.
                </p>
                <p className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  Sign in required to submit
                </p>
                </ScrollReveal>

                <ScrollReveal animation="fade-left" duration={850}>
                  <div className="p-6 rounded-2xl bg-[#0A224E] text-white space-y-2 border border-blue-900/60 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" /> What Happens Next
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Our team reviews your submission and contacts your organization to discuss scope, timeline, and any
                      applicable costs before any work begins.
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-blue-100/80 dark:border-slate-800 shadow-md">
                <Suspense fallback={<FormSkeleton />}>
                  <ServiceRequestForm categories={categories} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-white dark:bg-slate-950 text-center overflow-hidden">
        <ScrollReveal animation="zoom-in" duration={800}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight">
              Let&apos;s Build Something Meaningful Together
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal tracking-wide max-w-xl mx-auto">
              Whether you are a business seeking a digital solution or a nonprofit organization working to improve your
              community, JANIC welcomes opportunities to collaborate.
            </p>
            <div className="pt-3">
              <Link
                href="#service-request-form"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30 hover:shadow-lg transition-all"
              >
                Submit a Service Request
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}