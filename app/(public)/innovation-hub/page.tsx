import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { InnovationPipelineNodes } from "@/components/public/InnovationPipelineNodes";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { JanicCta } from "@/components/public/JanicCta";
import { Sparkles, Wrench, Laptop, Layers } from "lucide-react";

export const metadata = {
  title: "Innovation Hub",
  description:
    "The 6-stage lifecycle at JANIC Innovation Hub: Idea, Design, Build, Test, Showcase, and Scale.",
};

const steps = [
  {
    num: "01",
    title: "Idea",
    headline: "Identify a real-world problem.",
    desc: "Students investigate community and industrial pain points in health, agriculture, logistics, education, or government automation.",
  },
  {
    num: "02",
    title: "Design",
    headline: "Develop concept & architecture.",
    desc: "Creating wireframes, user personas, system workflows, database schemas, and hardware electrical schematics.",
  },
  {
    num: "03",
    title: "Build",
    headline: "Create functional prototype.",
    desc: "Engineering hardware sensors, writing production code, assembling Arduino/ESP32 chassis, and deploying backend APIs.",
  },
  {
    num: "04",
    title: "Test",
    headline: "Evaluate & iterate in lab.",
    desc: "Stress testing in university laboratories, gathering end-user feedback, and resolving security or mechanical vulnerabilities.",
  },
  {
    num: "05",
    title: "Showcase",
    headline: "Present at Demo Days.",
    desc: "Demonstrating live systems to faculty deans, technology leaders, media representatives, and industry investors.",
  },
  {
    num: "06",
    title: "Scale",
    headline: "Commercial incubation & scale.",
    desc: "Spinning out startups, acquiring intellectual property guidance, and securing pilot contracts with regional organizations.",
  },
];

const facilities = [
  {
    icon: Laptop,
    title: "High-Performance Compute & Cloud Workstations",
    desc: "Dedicated development machines configured for machine learning model training and container builds.",
  },
  {
    icon: Wrench,
    title: "Robotics & Embedded Electronics Workbench",
    desc: "Arduino Mega, ESP32 microcontrollers, ultrasonic, infrared, conductivity sensors, oscilloscopes, and soldering stations.",
  },
  {
    icon: Layers,
    title: "Collaborative Co-Working & Demo Pitch Hall",
    desc: "Flexible modular desks, smart screens, and presentation stages for investor meetings.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[#0075ff] dark:text-[#80c2ff] text-xs font-bold uppercase tracking-[0.08em]">
      <span className="w-8 h-0.5 bg-current" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function InnovationHubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 overflow-x-clip">
      {/* 1. HERO */}
      <SectionHero
        badge="JANIC Innovation Hub"
        title="From Whiteboard Spark to Market Launch."
        description="The JANIC Innovation Hub supports student founders from the initial whiteboard spark through working prototype to commercial deployment."
        breadcrumbs={[{ label: "Innovation Hub" }]}
      >
        <div className="pt-2">
          <Link
            href="/submit-innovation"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#08245C] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-[#0875D1]" />
            Submit Your Innovation Proposal →
          </Link>
        </div>
      </SectionHero>

      {/* 2. INNOVATION PIPELINE — same open timeline used on the home page */}
      <InnovationPipelineNodes />

      {/* 3. SIX-STAGE METHODOLOGY — open editorial grid, no cards */}
      <section className="py-16 sm:py-20 bg-[#f0f6fe] dark:bg-[#081225] text-[#08245C] dark:text-slate-100 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
          <ScrollReveal animation="fade-up" duration={850}>
            <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 sm:mb-16">
              <div className="lg:col-span-7">
                <Eyebrow>The 6-Phase Methodology</Eyebrow>
                <h2 className="mt-4 text-[30px] sm:text-4xl lg:text-[52px] font-extrabold leading-[1.1] tracking-[-0.04em]">
                  Rigorous <span className="text-[#0765ff] dark:text-[#80c2ff]">Engineering Stages</span>
                </h2>
              </div>
              <p className="lg:col-span-5 text-[#6b7fa6] dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Our structured approach ensures idea viability, execution rigor, and regional impact.
              </p>
            </header>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 sm:gap-y-14">
            {steps.map((s, i) => (
              <ScrollReveal key={s.num} animation="fade-up" duration={800} delay={(i % 3) * 120}>
                <article className="group relative pt-6 border-t border-[#0075ff]/20 dark:border-slate-700/80">
                  <span
                    className="absolute -top-px left-0 h-0.5 w-12 bg-[#0075ff] transition-all duration-500 group-hover:w-full"
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl sm:text-6xl font-extrabold tracking-[-0.05em] text-[#cfe3ff] dark:text-slate-700 transition-colors duration-500 group-hover:text-[#0075ff]">
                      {s.num}
                    </span>
                    <h3 className="text-2xl font-bold tracking-[-0.03em]">{s.title}</h3>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[#0075ff] dark:text-[#80c2ff]">{s.headline}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6279a1] dark:text-slate-400">{s.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LAB FACILITIES — open two-column layout */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 text-[#08245C] dark:text-slate-100 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <ScrollReveal animation="fade-right" duration={850} className="lg:col-span-5">
            <div>
              <Eyebrow>Physical Infrastructure</Eyebrow>
              <h2 className="mt-4 text-[30px] sm:text-4xl lg:text-[48px] font-extrabold leading-[1.1] tracking-[-0.04em]">
                World-Class <span className="text-[#0765ff] dark:text-[#80c2ff]">Prototyping Laboratory</span>
              </h2>
              <p className="mt-5 text-[#6b7fa6] dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                Located on the main campus of Jazeera University, the JANIC Innovation Hub provides student engineering teams with direct access to hardware tools, testing benches, and compute workstations.
              </p>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-7 divide-y divide-slate-200/80 dark:divide-slate-800">
            {facilities.map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal key={title} animation="fade-up" duration={800} delay={i * 120}>
                <article className="group flex items-start gap-5 sm:gap-7 py-8">
                  <span className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full text-[#0075ff] dark:text-[#80c2ff] bg-gradient-to-br from-[#eff8ff] to-[#dceeff] dark:from-[#1b385a] dark:to-[#122a48] transition-transform duration-500 group-hover:scale-110">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-[22px] font-bold leading-snug tracking-[-0.02em] transition-colors group-hover:text-[#0075ff] dark:group-hover:text-[#80c2ff]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[15px] sm:text-base leading-relaxed text-[#6279a1] dark:text-slate-400">{desc}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION — shared Home "Get Involved" section */}
      <JanicCta
        eyebrow="Incubation Admissions"
        description="Any enrolled student or multidisciplinary team at Jazeera University can submit an innovation idea. Shortlisted projects receive dedicated lab workspace, electronics components, and faculty mentorship."
        primary={{ href: "/submit-innovation", label: "Submit Proposal Now" }}
      />
    </div>
  );
}
