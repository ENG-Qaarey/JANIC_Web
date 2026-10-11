import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { MentorsLeadershipSection } from "@/components/public/MentorsLeadershipSection";
import { TeamRepository } from "@/repositories/team.repository";
import {
  CheckCircle2,
  Shield,
  Target,
  Compass,
  Award,
  Lightbulb,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "About JANIC",
  description:
    "Learn about the history, vision, mission, and leadership of Jazeera Nexus Innovation Center at Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const teamMembers = await TeamRepository.findActive();
  const founder = teamMembers.find((m: any) => m.isFounder) || null;
  const otherMembers = teamMembers.filter((m: any) => (founder ? m.id !== founder.id : !m.isFounder));

  const coreValues = [
    {
      title: "Excellence",
      desc: "We pursue uncompromising quality in research, software development, and technical education.",
      icon: Award,
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
      icon: Compass,
    },
    {
      title: "Continuous Learning",
      desc: "We promote lifelong curiosity, ongoing technical certification, and skill refinement.",
      icon: BookOpen,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (MATCHING HOME PAGE ROUNDED CARD) */}
      <SectionHero
        badge="About JANIC"
        title="Where Education Meets Innovation"
        description="Bridging the gap between academic theory, technological innovation, and real-world market needs in the Horn of Africa."
        breadcrumbs={[{ label: "About JANIC" }]}
      />

      {/* 2. HISTORY & ORIGIN (ICE-BLUE BENTO BOX) - FADE RIGHT */}
      <section className="py-8 sm:py-12 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-right" duration={850}>
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-blue-100/70 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Left Column: Narrative */}
                <div className="lg:col-span-7 space-y-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block">
                    Our History &amp; Origin
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#08245C] tracking-tight leading-tight">
                    Founded at Jazeera University in 2021
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                    Jazeera Nexus Innovation Center (JANIC), formerly known as Jazeera Innovation Technology (JIT), was founded on October 25, 2021, by the Faculty of Computer Science &amp; IT at Jazeera University in Mogadishu, Somalia.
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                    JANIC was established to resolve a persistent challenge in higher education: the disconnect between classroom curriculum and the practical, rapidly evolving demands of the technology market. Its operations combine software engineering, process automation, hands-on ICT training, applied scientific research, and startup incubation.
                  </p>
                  <div className="pt-3">
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0875D1] hover:bg-[#0660ac] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all group"
                    >
                      Explore Student Innovations
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Right Column: Visual with Overlapping Badge */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white aspect-[4/3] sm:aspect-[1.15/1]">
                    <Image
                      src="/images/janic-building-lobby.jpg"
                      alt="JANIC Innovation Center Atrium"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>

                  {/* Floating Oct 25 FOUNDED 2021 badge */}
                  <div className="absolute -bottom-6 -left-4 sm:-bottom-7 sm:-left-6 bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100/90 z-10 flex flex-col items-center min-w-[125px] text-center">
                    <div className="text-xl sm:text-2xl font-black text-[#08245C] leading-none">
                      Oct 25
                    </div>
                    <div className="text-[10px] font-bold text-[#0875D1] uppercase tracking-wider mt-1.5">
                      FOUNDED 2021
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. VISION & MISSION (DUAL BENTO BOXES) - ZOOM IN */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="zoom-in" duration={850}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              {/* Vision (Light Card) */}
              <div className="bg-[#F0F6FE] rounded-2xl sm:rounded-2xl p-8 sm:p-12 border border-blue-100/70 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#0875D1] flex items-center justify-center font-bold mb-6 shadow-sm">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-2">
                    Long-Term Ambition
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#08245C] mb-4 tracking-tight">
                    Our Vision
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    To be a premier technology innovation center and training hub in Africa and globally, delivering reliable, cutting-edge digital products, high-impact research, and world-class ICT certifications.
                  </p>
                </div>
              </div>

              {/* Mission (Dark Navy Card) */}
              <div className="bg-[#0A224E] text-white rounded-2xl sm:rounded-2xl p-8 sm:p-12 border border-blue-900/60 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-cyan-300 flex items-center justify-center font-bold mb-6">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block mb-2">
                    Institutional Mandate
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
                    Our Mission
                  </h3>
                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Transformative Solutions:</strong> Develop dynamic, high-quality digital platforms and automation services.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Capacity Building:</strong> Equip students and professionals with hands-on technical skills and recognized certifications.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">Global Collaboration:</strong> Build strategic partnerships, research exchanges, and international networks.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. CORE VALUES (BENTO GRID) - FADE LEFT */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-left" duration={850}>
            <div className="mb-10 sm:mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1.5">
                INSTITUTIONAL PRINCIPLES
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#08245C] tracking-tight">
                Our Core Values
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                The ethical framework and technological mindset guiding every project at JANIC.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#08245C] mb-2 tracking-tight group-hover:text-[#0875D1] transition">
                        {v.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
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
                          isFounder: Boolean((founder as any).isFounder),
                        }
                      : null
                  }
                  otherMembers={otherMembers.map((m: any) => ({
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

      {/* 6. CALL TO ACTION (MATCHING HOME PAGE) - ZOOM IN */}
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
