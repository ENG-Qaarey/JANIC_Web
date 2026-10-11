import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { TrainingService } from "@/services/training/training.service";
import { TrainingCatalog } from "@/components/training/TrainingCatalog";

export const metadata = {
  title: "Professional Training & Certifications | JANIC",
  description:
    "Hands-on ICT training, coding bootcamps, and internationally recognized professional certifications at JANIC, Faculty of CS & IT, Jazeera University.",
};

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const programs = await TrainingService.getPublishedPrograms();

  const categories = Array.from(
    new Set(programs.map((p) => p.category).filter(Boolean))
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070d18]">
      <SectionHero
        badge="Learn • Build • Certify"
        title="Professional ICT Training & Certifications"
        description="Equipping students, software engineers, and IT professionals with practical, industry-grade technical skills and globally recognized credentials."
        breadcrumbs={[{ label: "Training" }]}
      />

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <TrainingCatalog programs={programs as any} categories={categories} />
      </div>
    </div>
  );
}
