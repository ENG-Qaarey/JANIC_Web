import React from "react";
import styles from "./CollaborationFramework.module.css";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { JanicCta } from "@/components/public/JanicCta";
import { PartnershipForm } from "@/components/forms/PartnershipForm";
import { Building2, Globe2, Rocket, Award, ShieldCheck, Users, GraduationCap, HeartHandshake, Landmark, Cpu, Microscope } from "lucide-react";

export const metadata = {
  title: "Partnerships & Collaboration",
  description:
    "Partner with JANIC at Jazeera University. Collaborative research, student incubators, hardware lab sponsorships, and IT certifications.",
};

export const dynamic = "force-dynamic";

export default async function PartnershipsPage() {
  const benefits = [
    {
      title: "Direct Access to Top Tech Talent",
      desc: "Connect directly with graduating software engineers, robotics developers, and cybersecurity practitioners.",
      icon: Rocket,
    },
    {
      title: "Custom Prototyping & R&D",
      desc: "Leverage our university hardware lab and faculty expertise to prototype custom digital solutions.",
      icon: Building2,
    },
    {
      title: "High-Impact Regional CSR & Branding",
      desc: "Co-brand student hackathons, technology summits, and community digital literacy bootcamps.",
      icon: Award,
    },
    {
      title: "Institutional Research Exchanges",
      desc: "Joint peer-reviewed papers, faculty fellowships, and international academic credit transfers.",
      icon: Globe2,
    },
  ];

  const coreSectors = [
    { title: "SMEs & Startups", desc: "Scaling with digital solutions & tech talent", icon: Rocket },
    { title: "Women-Owned Businesses", desc: "Empowering with technology & mentorship", icon: Users },
    { title: "Universities & Education", desc: "Research, curriculum & student programs", icon: GraduationCap },
    { title: "NGOs & Development Organizations", desc: "Digital transformation & community tech", icon: HeartHandshake },
    { title: "Government Institutions", desc: "Digital governance & public innovation", icon: Landmark },
    { title: "Technology Companies", desc: "R&D, talent & co-development", icon: Cpu },
    { title: "Researchers & Professionals", desc: "Joint publications & applied research", icon: Microscope },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION */}
      <SectionHero
        badge="Strategic Alliances"
        title="Let's Build the Future Together"
        description="JANIC welcomes collaboration with universities, technology companies, government ministries, NGOs, and venture investors."
        breadcrumbs={[{ label: "Partnerships" }]}
      />

      {/* 2. TRUSTED BY SECTION - HORIZONTAL SCROLL SLIDER (EXACT 7 SECTORS ONLY) */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-white via-[#F8FBFF] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
        <div className="relative max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-down" duration={850}>
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0875D1] bg-blue-50 dark:bg-[#0875D1]/15 dark:text-blue-300 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0875D1] dark:bg-blue-300"></span>
                Our Network
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#08245C] dark:text-white tracking-tight leading-tight mt-4">
                Trusted by the Organizations We Work With
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl mx-auto">
                We Partner With A Wide Range Of Organizations Across Sectors, Helping Them Grow, Innovate, And Reach Their Goals.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="fade-up" duration={800} delay={200}>
          <div className={styles.networkTrack + " group relative"}>
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10 pointer-events-none"></div>

            <div className="overflow-hidden">
              <div className="flex w-max gap-4 sm:gap-5 animate-marquee group-hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, setIndex) => (
                  <div key={setIndex} className="flex gap-4 sm:gap-5 shrink-0" aria-hidden={setIndex === 1 ? true : undefined}>
                    {coreSectors.map((org, orgIndex) => {
                      const Icon = org.icon;
                      return (
                        <article key={org.title} className={styles.networkCard}>
                          <div className={styles.networkCardTop}>
                            <span className={styles.networkIcon}><Icon size={27} strokeWidth={1.7} aria-hidden="true" /></span>
                            <span className={styles.networkNumber} aria-hidden="true">{String(orgIndex + 1).padStart(2, "0")}</span>
                          </div>
                          <h3>{org.title}</h3>
                          <p>{org.desc}</p>
                        </article>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. FULL-WIDTH COLLABORATION FRAMEWORK */}
      <section className="w-full py-10 sm:py-14 bg-[#F0F6FE] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-left" duration={850}>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className={`${styles.framework} lg:col-span-6`}>
                  <header className={styles.heading}>
                    <span className={styles.eyebrow}>Collaboration Framework</span>
                    <h2>Why Partner with JANIC?</h2>
                    <p>As the innovation arm of Faculty of Computer Science &amp; IT at Jazeera University, JANIC serves as the premier bridge between academic capability and regional market execution.</p>
                  </header>
                  <div className={styles.benefits}>
                    {benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <ScrollReveal key={benefit.title} animation="fade-up" duration={700} delay={index * 90} className={styles.cardEntrance}>
                          <article className={styles.benefitCard}>
                            <span className={styles.icon}><Icon size={26} strokeWidth={1.8} aria-hidden="true" /></span>
                            <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.desc}</p>
                          </article>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                  <aside className={styles.integrity} aria-labelledby="partnership-integrity-title">
                    <span className={styles.integrityIcon}><ShieldCheck size={26} aria-hidden="true" /></span>
                    <div>
                      <h3 id="partnership-integrity-title">Institutional Integrity</h3>
                      <p>All partnerships are governed under formal Memorandums of Understanding (MoU) with the Senate and Dean of Faculty at Jazeera University.</p>
                    </div>
                  </aside>
                </div>

                <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-2xl border border-blue-100/80 shadow-md space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                      Partnership Inquiries
                    </span>
                    <h3 className="text-2xl font-bold text-[#08245C] tracking-tight">
                      Start a Collaboration
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Tell us about your organization and how we can work together.
                    </p>
                  </div>

                  <PartnershipForm />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CALL TO ACTION — shared Home "Get Involved" section */}
      <JanicCta />
    </div>
  );
}
