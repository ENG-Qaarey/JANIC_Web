import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { MentorsLeadershipSection } from "@/components/public/MentorsLeadershipSection";
import { TeamRepository } from "@/repositories/team.repository";
import styles from "./AboutPage.module.css";
import {
  CheckCircle2,
  Shield,
  Target,
  Database,
  Trophy,
  Lightbulb,
  Users,
  BookOpen,
  ArrowRight,
  Eye,
  CalendarDays,
} from "lucide-react";

export const metadata = {
  title: "About JANIC",
  description:
    "Learn about the history, vision, mission, and leadership of Jazeera Nexus Innovation Center at Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const teamMembers = await TeamRepository.findActive();
  const founder = teamMembers.find((m) => m.isFounder) || null;
  const otherMembers = teamMembers.filter((m) => (founder ? m.id !== founder.id : !m.isFounder));

  const coreValues = [
    {
      title: "Excellence",
      desc: "We pursue uncompromising quality in research, software development, and technical education.",
      icon: Trophy,
    },
    {
      title: "Innovation & Agility",
      desc: "We continuously explore emerging technologies and adapt quickly to industry breakthroughs.",
      icon: Lightbulb,
    },
    {
      title: "Integrity & Professionalism",
      desc: "We operate with ethical rigor, transparency, and international institutional standards.",
      icon: Shield,
    },
    {
      title: "Teamwork & Collaboration",
      desc: "We believe transformative innovation is built through multidisciplinary teamwork.",
      icon: Users,
    },
    {
      title: "Localization of Knowledge",
      desc: "We adapt global technology to solve local infrastructure, health, and economic challenges.",
      icon: Database,
    },
    {
      title: "Continuous Learning",
      desc: "We promote lifelong curiosity, ongoing technical certification, and skill refinement.",
      icon: BookOpen,
    },
  ];

  return (
    <div className={styles.page}>
      {/* 1. HERO SECTION (MATCHING HOME PAGE ROUNDED CARD) */}
      <SectionHero
        badge="About JANIC"
        title="Where Education Meets Innovation"
        description="Bridging the gap between academic theory, technological innovation, and real-world market needs in the Horn of Africa."
        breadcrumbs={[{ label: "About JANIC" }]}
      />

      <section className={styles.history} aria-labelledby="about-history-title">
        <div className={`${styles.container} ${styles.historyGrid}`}>
          <ScrollReveal animation="fade-right" duration={850} className={styles.historyCopy}>
            <p className={styles.eyebrow}>Our History &amp; Origin</p>
            <h2 id="about-history-title">Founded at Jazeera University in 2021</h2>
            <p>Jazeera Nexus Innovation Center (JANIC), formerly known as Jazeera Innovation Technology (JIT), was founded on October 25, 2021, by the Faculty of Computer Science &amp; IT at Jazeera University in Mogadishu, Somalia.</p>
            <p>JANIC was established to resolve a persistent challenge in higher education: the disconnect between classroom curriculum and the practical, rapidly evolving demands of the technology market. Its operations combine software engineering, process automation, hands-on ICT training, applied scientific research, and startup incubation.</p>
            <Link href="/projects" className={styles.button}>Explore Student Innovations <ArrowRight size={17} aria-hidden="true" /></Link>
          </ScrollReveal>
          <ScrollReveal animation="fade-left" duration={850} delay={120} className={styles.historyVisual}>
            <div className={styles.imageFrame}>
              <Image src="/images/janic-building-lobby.jpg" alt="JANIC Innovation Center Atrium" fill className={styles.image} sizes="(max-width: 767px) 100vw, 45vw" />
            </div>
            <div className={styles.foundedBadge}>
              <CalendarDays size={25} strokeWidth={1.8} aria-hidden="true" />
              <div><strong>Oct 25</strong><span>Founded 2021</span></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.purposeSection} aria-label="Our vision and mission">
        <div className={`${styles.container} ${styles.purposeGrid}`}>
          <ScrollReveal animation="fade-up" duration={800} className={styles.panelEntrance}>
            <article className={`${styles.purposeCard} ${styles.vision}`}>
              <span className={styles.purposeIcon}><Eye size={27} strokeWidth={1.8} aria-hidden="true" /></span>
              <div>
                <p className={styles.eyebrow}>Long-Term Ambition</p>
                <h2>Our Vision</h2>
                <p className={styles.visionText}>To be a premier technology innovation center and training hub in Africa and globally, delivering reliable, cutting-edge digital products, high-impact research, and world-class ICT certifications.</p>
              </div>
            </article>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={140} className={styles.panelEntrance}>
            <article className={`${styles.purposeCard} ${styles.mission}`}>
              <span className={styles.purposeIcon}><Target size={27} strokeWidth={1.8} aria-hidden="true" /></span>
              <div>
                <p className={styles.eyebrow}>Institutional Mandate</p>
                <h2>Our Mission</h2>
                <ul>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span><strong>Transformative Solutions:</strong> Develop dynamic, high-quality digital platforms and automation services.</span></li>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span><strong>Capacity Building:</strong> Equip students and professionals with hands-on technical skills and recognized certifications.</span></li>
                  <li><CheckCircle2 size={16} aria-hidden="true" /><span><strong>Global Collaboration:</strong> Build strategic partnerships, research exchanges, and international networks.</span></li>
                </ul>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="about-values-title">
        <div className={styles.container}>
          <ScrollReveal animation="fade-up" duration={800} className={styles.valuesHeading}>
            <p className={styles.eyebrow}>Institutional Principles</p>
            <h2 id="about-values-title">Our Core Values</h2>
            <p>The ethical framework and technological mindset guiding every project at JANIC.</p>
          </ScrollReveal>
          <div className={styles.valuesGrid}>
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return <ScrollReveal key={value.title} animation="fade-up" duration={800} delay={(index % 3) * 120} className={styles.valueEntrance}>
                <article className={styles.valueCard}>
                  <span className={styles.valueIcon}><Icon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </article>
              </ScrollReveal>;
            })}
          </div>
        </div>
      </section>
      {/* 5. LEADERSHIP & FACULTY (BENTO CANVAS) - BLUR IN */}
      {teamMembers.length > 0 && (
        <section className="py-12 sm:py-16 bg-white dark:bg-slate-950 overflow-hidden">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="blur-in" duration={850}>
              <div className="bg-[#F0F6FE] dark:bg-slate-900/80 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 dark:border-slate-800 shadow-sm">
                <MentorsLeadershipSection
                  founder={
                    founder
                      ? {
                          id: String(founder.id),
                          name: founder.name,
                          role: founder.role,
                          department: founder.department,
                          bio: founder.bio,
                          avatar: founder.avatar,
                          isFounder: Boolean(founder.isFounder),
                        }
                      : null
                  }
                  otherMembers={otherMembers.map((m) => ({
                    id: String(m.id),
                    name: m.name,
                    role: m.role,
                    department: m.department,
                    bio: m.bio,
                    avatar: m.avatar,
                    isFounder: Boolean(m.isFounder),
                  }))}
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className={styles.cta} aria-labelledby="about-cta-title">
        <svg className={styles.waves} viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C320 60 360 400 740 400 C1040 400 1160 150 1440 80 L1440 400 L0 400Z" fill="currentColor" opacity=".4" />
          <path d="M0 180 C300 120 400 420 740 400 C1040 390 1150 250 1440 190 L1440 260 C1150 300 1060 410 740 400 C380 440 280 200 0 245Z" fill="currentColor" opacity=".5" />
        </svg>
        <ScrollReveal animation="fade-up" duration={800} className={styles.ctaCopy}>
          <h2 id="about-cta-title">Have an Idea? Let&apos;s Turn It Into<br /> Innovation.</h2>
          <p>Join our vibrant ecosystem of developers, researchers, and visionaries.</p>
          <Link href="/submit-innovation" className={styles.button}>Get Started Today <ArrowRight size={17} aria-hidden="true" /></Link>
        </ScrollReveal>
      </section>
    </div>
  );

}
