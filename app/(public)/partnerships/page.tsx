import React from "react";
import Link from "next/link";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { PartnershipForm } from "@/components/forms/PartnershipForm";
import { Handshake, Building2, Globe2, Rocket, Award, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Partnerships & Collaboration",
  description:
    "Partner with JANIC at Jazeera University. Collaborative research, student incubators, hardware lab sponsorships, and IT certifications.",
};

export default function PartnershipsPage() {
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

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Strategic Alliances"
        title="Let's Build the Future Together"
        description="JANIC welcomes collaboration with universities, technology companies, government ministries, NGOs, and venture investors."
        breadcrumbs={[{ label: "Partnerships" }]}
      />

      {/* 2. TRUSTED BY SECTION - HORIZONTAL SCROLL SLIDER */}
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
          <div className="group relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent z-10 pointer-events-none"></div>

            <div className="overflow-hidden">
              <div className="flex w-max gap-4 sm:gap-5 animate-marquee group-hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, setIndex) => (
                  <div key={setIndex} className="flex gap-4 sm:gap-5 shrink-0">
                    {[
                      { title: "SMEs & Startups", desc: "Scaling with digital solutions & tech talent" },
                      { title: "Women-Owned Businesses", desc: "Empowering with technology & mentorship" },
                      { title: "Universities & Education", desc: "Research, curriculum & student programs" },
                      { title: "NGOs & Development Orgs", desc: "Digital transformation & community tech" },
                      { title: "Government Institutions", desc: "Digital governance & public innovation" },
                      { title: "Technology Companies", desc: "R&D, talent & co-development" },
                      { title: "Researchers & Professionals", desc: "Joint publications & applied research" },
                    ].map((org, orgIndex) => (
                      <div
                        key={`${setIndex}-${org.title}`}
                        className="shrink-0 w-[260px] sm:w-[280px] bg-white dark:bg-slate-900 p-5 rounded-2xl border border-blue-100/80 dark:border-slate-700/60 shadow-sm dark:shadow-slate-950/30 hover:shadow-lg hover:border-[#0875D1]/40 dark:hover:border-[#0875D1]/50 hover:-translate-y-1 transition-all duration-300 ease-out group/card"
                      >
                        <span className="text-2xl font-black text-blue-100 dark:text-slate-700 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-br group-hover/card:from-[#0875D1] group-hover/card:to-[#10B981] dark:group-hover/card:from-[#60a5fa] dark:group-hover/card:to-[#34d399] transition-all duration-300 select-none leading-none">
                          {String(orgIndex + 1).padStart(2, "0")}
                        </span>
                        <h4 className="text-sm font-bold text-[#08245C] dark:text-white tracking-tight mt-3.5">
                          {org.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">
                          {org.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. PARTNERSHIPS BENTO CANVAS - FADE LEFT */}
      <section className="py-8 sm:py-14 bg-white overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-left" duration={850}>
            <div className="bg-[#F0F6FE] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-14 border border-blue-100/70 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-6 space-y-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0875D1] block mb-1">
                      Collaboration Framework
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#08245C] tracking-tight leading-tight">
                      Why Partner with JANIC?
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2.5">
                      As the innovation arm of Faculty of Computer Science &amp; IT at Jazeera University, JANIC serves as the premier bridge between academic capability and regional market execution.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {benefits.map((b) => {
                      const Icon = b.icon;
                      return (
                        <div
                          key={b.title}
                          className="bg-white p-6 rounded-2xl border border-blue-100/80 flex items-start gap-4 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0875D1] flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#08245C] tracking-tight">
                              {b.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">
                              {b.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-7 rounded-2xl bg-[#0A224E] text-white space-y-2 border border-blue-900/60 shadow-lg">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" /> Institutional Integrity
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All partnerships are governed under formal Memorandums of Understanding (MoU) with the Senate and Dean of Faculty at Jazeera University.
                    </p>
                  </div>
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
