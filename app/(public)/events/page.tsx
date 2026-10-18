import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { JanicCta } from "@/components/public/JanicCta";
import { EventService } from "@/services/events/event.service";
import { EventsDirectory } from "@/components/public/EventsDirectory";
import { CalendarCheck } from "lucide-react";

export const metadata = {
  title: "Events Hosted by JANIC | Innovation, Hackathons & Tech Summits",
  description:
    "Explore past breakthrough showcases and upcoming hackathons, robotics bootcamps, and tech summits hosted by JANIC at Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await EventService.getPublishedEvents();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 overflow-x-clip transition-colors">
      {/* 1. HERO SECTION */}
      <SectionHero
        badge="Innovation in Action"
        title="Events Hosted by JANIC"
        description="Explore the milestones, student demo showcases, 48-hour competitive hackathons, robotics bootcamps, and summits hosted by the Jazeera Nexus Innovation Center."
        breadcrumbs={[{ label: "Events" }]}
      />

      {/* 2. MAIN DIRECTORY WITH INTERACTIVE FILTER */}
      <section className="py-8 sm:py-14 min-h-[600px] overflow-hidden">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={700}>
            <EventsDirectory events={events as any} />
          </ScrollReveal>
        </div>
      </section>

      {/* 3. CALL TO ACTION — shared Home "Get Involved" section */}
      <JanicCta
        eyebrow="Collaborate With JANIC"
        description="Join our vibrant ecosystem of developers, researchers, and visionaries at Jazeera University. Propose a project or partner on our next major hackathon."
        primary={{ href: "/submit-innovation", label: "Submit Innovation" }}
        secondary={{ href: "/about", label: "Learn About JANIC" }}
      />
    </div>
  );
}
