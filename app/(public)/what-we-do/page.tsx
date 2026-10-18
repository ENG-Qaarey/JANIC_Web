import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { JanicCta } from "@/components/public/JanicCta";
// Same design system as the About JANIC page.
import styles from "../about/AboutPage.module.css";
import local from "./WhatWeDoPage.module.css";
import {
  Cpu,
  GraduationCap,
  Rocket,
  FlaskConical,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "What We Do",
  description:
    "Explore the 6 core pillars of JANIC: Software engineering, ICT certifications, student incubation, applied research, career readiness, and ecosystem outreach.",
};

const stats = [
  { value: "6+", label: "Specialized Pillars" },
  { value: "100%", label: "Hands-on Practical" },
  { value: "18+", label: "Active Projects" },
  { value: "7+", label: "Industry Partners" },
];

const pillars = [
  {
    num: "03",
    label: "Certification",
    title: "Training & Certification",
    desc: "Industry-grade IT training connecting computer science theory with recognized credentials.",
    href: "/contact",
    cta: "Inquire About Courses",
    icon: GraduationCap,
  },
  {
    num: "04",
    label: "Incubation",
    title: "Startup Incubator",
    desc: "Dedicated maker workspace, rapid 3D prototyping benches, and seed funding pitch mentorship.",
    href: "/innovation-hub",
    cta: "Explore Hub",
    icon: Rocket,
  },
  {
    num: "05",
    label: "Applied Science",
    title: "Applied Research",
    desc: "Peer-reviewed publications, open datasets, and edge artificial intelligence whitepapers.",
    href: "/research",
    cta: "Read Papers",
    icon: FlaskConical,
  },
  {
    num: "06",
    label: "Career Linkages",
    title: "Talent Placement",
    desc: "Direct corporate hiring channels, technical portfolio reviews, and annual career hackathons.",
    href: "/partnerships",
    cta: "Hire Talent",
    icon: Briefcase,
  },
];

export default function WhatWeDoPage() {
  return (
    <div className={styles.page}>
      {/* 1. HERO */}
      <SectionHero
        badge="Core Functions"
        title="Comprehensive Tech Solutions"
        description="Explore how JANIC operates across 6 integrated pillars to empower students, engineers, and organizations in the Horn of Africa."
        breadcrumbs={[{ label: "What We Do" }]}
      />

      {/* 2. OVERVIEW — same band as About "Our History" */}
      <section className={styles.history} aria-labelledby="wwd-overview-title">
        <div className={`${styles.container} ${styles.historyGrid}`}>
          <ScrollReveal animation="fade-right" duration={850} className={styles.historyCopy}>
            <p className={styles.eyebrow}>Integrated Innovation Matrix</p>
            <h2 id="wwd-overview-title">From Foundational Code to Production Systems</h2>
            <p>JANIC bridges academic training and industrial execution. We function as a production software lab, advanced hardware sandbox, and certified training facility, creating verifiable career pipelines for university talent.</p>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" duration={850} delay={120} className={styles.historyVisual}>
            <dl className={local.statsGrid}>
              {stats.map((s) => (
                <div key={s.label} className={local.stat}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd><strong>{s.value}</strong><span aria-hidden="true">{s.label}</span></dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. SECTION HEADING — same as About "Our Core Values" heading */}
      <section className={styles.valuesSection} aria-labelledby="wwd-operations-title">
        <div className={styles.container}>
          <ScrollReveal animation="fade-up" duration={800} className={styles.valuesHeading}>
            <p className={styles.eyebrow}>Functional Disciplines</p>
            <h2 id="wwd-operations-title">Our Six Core Operations</h2>
            <p>Comprehensive technical verticals driving digital transformation.</p>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. PILLARS 01 & 02 — same cards as About Vision / Mission */}
      <section className={styles.purposeSection} aria-label="Platform development and cybersecurity">
        <div className={`${styles.container} ${styles.purposeGrid}`}>
          <ScrollReveal animation="fade-up" duration={800} className={styles.panelEntrance}>
            <article className={`${styles.purposeCard} ${styles.vision}`}>
              <span className={styles.purposeIcon}><Cpu size={27} strokeWidth={1.8} aria-hidden="true" /></span>
              <div className={local.cardBody}>
                <div className={local.cardHead}>
                  <p className={styles.eyebrow}>Software &amp; Cloud Systems</p>
                  <span className={local.number} aria-hidden="true">01</span>
                </div>
                <h2>Technology &amp; Platform Development</h2>
                <p className={local.cardText}>We design, architect, and deploy reliable digital platforms, cloud applications, and automated software workflows tailored for businesses, NGOs, and university infrastructure.</p>
                <ul className={local.tags} aria-label="Development specialties">
                  <li>Full Stack</li>
                  <li>Mobile App</li>
                  <li>Cloud Native</li>
                </ul>
                <ul className={local.checklist}>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span>Modern Web and Cloud Applications (Next.js, React, Node.js, Python)</span></li>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span>API Architecture &amp; Microservices Integration</span></li>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span>Institutional Database Engineering and Security Audits</span></li>
                </ul>
                <Link href="/projects" className={styles.button}>View Developed Systems <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
            </article>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={140} className={styles.panelEntrance}>
            <article className={`${styles.purposeCard} ${styles.mission}`}>
              <span className={styles.purposeIcon}><Shield size={27} strokeWidth={1.8} aria-hidden="true" /></span>
              <div className={local.cardBody}>
                <div className={local.cardHead}>
                  <p className={styles.eyebrow}>Defense &amp; Trust</p>
                  <span className={`${local.number} ${local.missionNumber}`} aria-hidden="true">02</span>
                </div>
                <h2>Cybersecurity Defense &amp; Audit</h2>
                <p className={local.missionText}>Ensuring digital assets are protected through rigorous security protocols, vulnerability assessments, penetration testing, and auditing.</p>
                <ul className={local.missionList}>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span>Network vulnerability assessment &amp; SOC operations</span></li>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span>Identity &amp; access management protocols</span></li>
                </ul>
                <Link href="/contact" className={local.lightLink}>Request Security Audit <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. PILLARS 03–06 — same cards as About "Core Values" */}
      <section className={styles.valuesSection} aria-label="Training, incubation, research and talent placement">
        <div className={styles.container}>
          <div className={`${styles.valuesGrid} ${local.valuesGrid4}`}>
            {pillars.map((p, index) => {
              const Icon = p.icon;
              return (
                <ScrollReveal key={p.title} animation="fade-up" duration={800} delay={(index % 4) * 110} className={styles.valueEntrance}>
                  <article className={`${styles.valueCard} ${local.valueCard}`}>
                    <span className={styles.valueIcon}><Icon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
                    <span className={local.valueLabel}>{p.num} · {p.label}</span>
                    <h3>{p.title}</h3>
                    <p className={local.valueDesc}>{p.desc}</p>
                    <Link href={p.href} className={local.valueLink}>{p.cta} <ArrowRight size={14} aria-hidden="true" /></Link>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION — shared Home "Get Involved" section */}
      <JanicCta />
    </div>
  );
}
