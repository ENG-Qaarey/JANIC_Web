import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { JanicCta } from "@/components/public/JanicCta";
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

  const objectives = [
    {
      title: "Student Technology Projects",
      desc: "Provide students with opportunities to design, develop, test, and present practical technology projects.",
      icon: Target,
    },
    {
      title: "Practical Skills & Teamwork",
      desc: "Strengthen practical digital skills, teamwork, creativity, communication, and real-world problem-solving.",
      icon: Trophy,
    },
    {
      title: "Applied Research & Prototypes",
      desc: "Support applied academic research and rapid prototype development addressing local challenges.",
      icon: Database,
    },
    {
      title: "Responsible Technology",
      desc: "Promote secure, ethical, inclusive, and responsible technology across all student and faculty initiatives.",
      icon: Shield,
    },
    {
      title: "Industry & Community Needs",
      desc: "Connect students and faculty directly with industry demands, public services, and grassroots community needs.",
      icon: Users,
    },
    {
      title: "Entrepreneurship & Startups",
      desc: "Encourage entrepreneurship, venture validation, and the commercial development of promising projects.",
      icon: Lightbulb,
    },
  ];

  return (
    <div className={styles.page}>
      {/* 1. HERO SECTION */}
      <SectionHero
        badge="About JANIC"
        title="Where Ideas Become Practical Solutions"
        description="Jazeera Nexus Innovation Center under the Faculty of Computer Science & IT at Jazeera University, Mogadishu, Somalia."
        breadcrumbs={[{ label: "About JANIC" }]}
      />

      <section className={styles.history} aria-labelledby="about-history-title">
        <div className={`${styles.container} ${styles.historyGrid}`}>
          <ScrollReveal animation="fade-right" duration={850} className={styles.historyCopy}>
            <p className={styles.eyebrow}>Who We Are</p>
            <h2 id="about-history-title">Faculty of Computer Science & IT Innovation Center</h2>
            <p>Jazeera Nexus Innovation Center (JANIC) is an innovation and technology initiative under the Faculty of Computer Science & IT at Jazeera University, Mogadishu, Somalia.</p>
            <p>JANIC provides a coordinated environment where students and faculty can explore ideas, build prototypes, conduct applied research, and collaborate with external partners on practical digital solutions.</p>
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
                <p className={styles.eyebrow}>Our Vision</p>
                <h2>Vision</h2>
                <p className={styles.visionText}>To become a leading university-based innovation ecosystem that empowers talent and advances technology-driven solutions for Somalia and beyond.</p>
              </div>
            </article>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={140} className={styles.panelEntrance}>
            <article className={`${styles.purposeCard} ${styles.mission}`}>
              <span className={styles.purposeIcon}><Target size={27} strokeWidth={1.8} aria-hidden="true" /></span>
              <div>
                <p className={styles.eyebrow}>Our Mission</p>
                <h2>Mission</h2>
                <p className={styles.visionText}>To connect education, research, innovation, and partnership through practical projects, mentorship, responsible technology development, and opportunities for students to transform ideas into solutions.</p>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="about-objectives-title">
        <div className={styles.container}>
          <ScrollReveal animation="fade-up" duration={800} className={styles.valuesHeading}>
            <p className={styles.eyebrow}>Strategic Mandate</p>
            <h2 id="about-objectives-title">Key Objectives</h2>
            <p>Six core objectives driving student empowerment, research advancement, and practical technology delivery at JANIC.</p>
          </ScrollReveal>
          <div className={styles.valuesGrid}>
            {objectives.map((obj, index) => {
              const Icon = obj.icon;
              return <ScrollReveal key={obj.title} animation="fade-up" duration={800} delay={(index % 3) * 120} className={styles.valueEntrance}>
                <article className={styles.valueCard}>
                  <span className={styles.valueIcon}><Icon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3>{obj.title}</h3>
                  <p>{obj.desc}</p>
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

      {/* CALL TO ACTION — shared Home "Get Involved" section */}
      <JanicCta />
    </div>
  );

}
