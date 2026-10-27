import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import {
  Lightbulb,
  Sparkles,
  Cpu,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Cloud,
  FlaskConical,
  Rocket,
  Building2,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { HubRepository } from "@/repositories/hub.repository";

export const metadata = {
  title: "Hubs & Programmes | JANIC",
  description:
    "Explore the 12 specialized innovation hubs and programmes at Jazeera Nexus Innovation Center.",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Sparkles,
  Cpu,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Cloud,
  FlaskConical,
  Rocket,
  Building2,
  Users,
  Layers,
};

interface HubItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "Active" | "Upcoming";
  link?: string;
  tags: string[];
}

const defaultHubs: HubItem[] = [
  {
    id: "innovation-hub",
    name: "JANIC Innovation Hub",
    category: "Prototyping & Challenges",
    description:
      "Student projects, design thinking, rapid prototyping, and university-wide innovation challenges.",
    icon: Lightbulb,
    status: "Active",
    link: "/innovation-hub",
    tags: ["Design Thinking", "Prototyping", "Hackathons"],
  },
  {
    id: "ict-girls-hub",
    name: "Jazeera ICT Girls Hub",
    category: "Women in Tech",
    description:
      "Digital skills, technical mentorship, leadership development, and innovation opportunities empowering women and girls.",
    icon: Sparkles,
    status: "Active",
    link: "https://juictgirls.org/",
    tags: ["Mentorship", "Coding", "Leadership"],
  },
  {
    id: "ai-hub",
    name: "JANIC AI Hub",
    category: "Artificial Intelligence",
    description:
      "Artificial intelligence, applied machine learning, localized AI applications, and ethical, responsible AI practices.",
    icon: Cpu,
    status: "Upcoming",
    tags: ["Machine Learning", "NLP", "Responsible AI"],
  },
  {
    id: "cybersecurity-hub",
    name: "JANIC Cybersecurity Hub",
    category: "Security & Resilience",
    description:
      "Cyber awareness, secure software development lifecycle, hands-on security labs, and institutional digital resilience.",
    icon: ShieldCheck,
    status: "Upcoming",
    tags: ["SecOps", "Penetration Testing", "Digital Defense"],
  },
  {
    id: "software-lab",
    name: "JANIC Software & App Lab",
    category: "Application Engineering",
    description:
      "Modern web, native mobile, cross-platform desktop, and institutional enterprise software application development.",
    icon: Smartphone,
    status: "Active",
    tags: ["Next.js", "Mobile Apps", "Full Stack"],
  },
  {
    id: "data-science-hub",
    name: "JANIC Data Science Hub",
    category: "Analytics & Insights",
    description:
      "Data analysis, interactive visualization, predictive modeling, and evidence-based problem-solving for Somali socio-economics.",
    icon: BarChart3,
    status: "Upcoming",
    tags: ["Data Analytics", "BI Dashboards", "Big Data"],
  },
  {
    id: "cloud-emerging-hub",
    name: "JANIC Cloud & Emerging Technology Hub",
    category: "Next-Gen Tech",
    description:
      "Cloud native infrastructure, distributed systems, blockchain exploration, Internet of Things (IoT), and smart devices.",
    icon: Cloud,
    status: "Upcoming",
    tags: ["Cloud Computing", "IoT Hardware", "Smart Sensors"],
  },
  {
    id: "research-solutions-hub",
    name: "JANIC Research & Digital Solutions Hub",
    category: "Applied Research",
    description:
      "Faculty and student applied research papers, experimental research prototypes, and technology-supported solutions.",
    icon: FlaskConical,
    status: "Active",
    link: "/research",
    tags: ["Peer-Reviewed Papers", "Prototypes", "Publications"],
  },
  {
    id: "startup-hub",
    name: "JANIC Entrepreneurship & Startup Hub",
    category: "Commercialization",
    description:
      "Business model design, lean canvas validation, pitch deck coaching, venture readiness, and incubation support.",
    icon: Rocket,
    status: "Upcoming",
    tags: ["Business Modeling", "Pitching", "Incubation"],
  },
  {
    id: "industry-partnerships-hub",
    name: "JANIC Industry & Partnerships Hub",
    category: "Ecosystem Engagement",
    description:
      "Industry engagement, corporate problem statements, professional executive mentorship, student internships, and collaborative pilots.",
    icon: Building2,
    status: "Active",
    link: "/partnerships",
    tags: ["Internships", "Corporate Pilots", "Sponsorships"],
  },
  {
    id: "community-tech-hub",
    name: "JANIC Community Technology Hub",
    category: "Civic Impact",
    description:
      "Grassroots technology initiatives, civic tech tools, and digital solutions addressing community and regional municipal needs.",
    icon: Users,
    status: "Active",
    link: "/community-services",
    tags: ["Civic Tech", "Public Sector", "Community Services"],
  },
  {
    id: "digital-transformation-hub",
    name: "JANIC Digital Transformation Hub",
    category: "Institutional Innovation",
    description:
      "Digital public services, institutional process automation, university digitization, and modernization solutions.",
    icon: Layers,
    status: "Upcoming",
    tags: ["Process Automation", "Digitization", "Enterprise Solutions"],
  },
];

export default async function HubsPage() {
  let displayHubs: HubItem[] = defaultHubs;
  try {
    const dbHubs = await HubRepository.findActive();
    if (dbHubs && dbHubs.length > 0) {
      displayHubs = dbHubs.map((h: any) => ({
        id: h.slug || h.id,
        name: h.name,
        category: h.category,
        description: h.description,
        icon: (h.icon && ICON_MAP[h.icon]) ? ICON_MAP[h.icon] : Layers,
        status: (h.status === "Upcoming" ? "Upcoming" : "Active") as "Active" | "Upcoming",
        link: h.link || undefined,
        tags: h.tags ? h.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      }));
    }
  } catch (err) {
    console.error("Error loading hubs from db:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <SectionHero
        badge="Centres of Excellence"
        title="Hubs & Programmes"
        description="Twelve specialized multidisciplinary innovation centres connecting students, researchers, faculty, and industry partners to solve real-world challenges."
        breadcrumbs={[{ label: "Hubs & Programmes" }]}
      />

      {/* Main Directory */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B82] dark:text-sky-400">
              Specialized Innovation Hubs
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Each hub offers focused technical environments, mentorship, and equipment to foster practical innovation across critical digital domains.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200 dark:border-sky-800 rounded-full">
              <Clock className="w-3.5 h-3.5" /> Upcoming / In Prep
            </span>
          </div>
        </div>

        {/* 12 Hubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {displayHubs.map((hub) => {
            const Icon = hub.icon;
            const isExternal = hub.link?.startsWith("http");

            const CardContent = (
              <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:shadow-lg hover:border-[#00A3E0]/50 group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-[#00A3E0] group-hover:bg-[#00A3E0] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        hub.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }`}
                    >
                      {hub.status}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#00A3E0] mb-1">
                    {hub.category}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00A3E0] transition-colors mb-3">
                    {hub.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {hub.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {hub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#00A3E0] group-hover:translate-x-1 transition-transform">
                    <span>{hub.link ? "Explore Hub" : "Enquire With JANIC"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );

            if (hub.link) {
              if (isExternal) {
                return (
                  <a
                    key={hub.id}
                    href={hub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {CardContent}
                  </a>
                );
              }
              return (
                <Link key={hub.id} href={hub.link} className="block">
                  {CardContent}
                </Link>
              );
            }

            return (
              <Link key={hub.id} href="/contact" className="block">
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* Callout */}
        <div className="mt-16 bg-gradient-to-r from-[#072757] to-[#0B3B82] text-white p-8 sm:p-10 rounded-2xl border border-[#00A3E0]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Have an Idea for a New Challenge or Programme?
            </h3>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              JANIC is an open ecosystem. Faculty researchers, student teams, and industry sponsors are invited to propose projects, mentor cohorts, or lead applied tech challenges.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/submit-innovation"
              className="px-5 py-2.5 bg-[#00A3E0] hover:bg-[#008ec4] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow rounded-xl"
            >
              Submit Idea →
            </Link>
            <Link
              href="/partnerships"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors rounded-xl"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
