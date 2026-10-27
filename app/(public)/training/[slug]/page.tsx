import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrainingService } from "@/services/training/training.service";
import { getCurrentUser } from "@/lib/auth/jwt";
import { SectionHero } from "@/components/layout/SectionHero";
import { TrainingEngagement } from "@/components/training/TrainingEngagement";
import {
  Clock,
  Calendar,
  MapPin,
  Award,
  ArrowRight,
  ArrowLeft,
  Users,
  Globe,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { LinkedInIcon, TwitterIcon, GitHubIcon } from "@/components/ui/social-icons";


export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await TrainingService.getProgramBySlug(slug).catch(() => null);
  if (!program) return { title: "Training Program Not Found | JANIC" };

  return {
    title: `${program.title} | JANIC`,
    description: program.summary,
  };
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [program, currentUser] = await Promise.all([
    TrainingService.getProgramBySlug(slug).catch(() => null),
    getCurrentUser().catch(() => null),
  ]);

  if (!program || program.status !== "PUBLISHED") {
    notFound();
  }

  const trainers = (program as any).trainersList || [];

  const getLevelBadgeColor = (lvl: string) => {
    const l = lvl.toLowerCase();
    if (l.includes("beginner"))
      return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    if (l.includes("advanced"))
      return "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#070d18]">
      <SectionHero
        image={program.coverImage}
        badge={program.category}
        title={program.title}
        description={program.summary}
        breadcrumbs={[
          { label: "Training", href: "/training" },
          { label: program.title },
        ]}
      />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* MAIN CONTENT (8 COLS) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Cover Image */}
              {program.coverImage && (
                <div className="aspect-[16/9] relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={program.coverImage}
                    alt={program.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 text-white">
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getLevelBadgeColor(
                        program.level
                      )}`}
                    >
                      {program.level}
                    </span>
                    {program.duration && (
                      <span className="text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {program.duration}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Program Overview */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#08245C] dark:text-blue-400">
                  <Sparkles className="w-5 h-5 text-[#0875D1] dark:text-blue-400" />
                  <h2 className="text-2xl font-black text-[#08245C] dark:text-white">
                    Program Overview &amp; Curriculum Objectives
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {program.description}
                </div>
              </div>

              {/* Syllabus / Modules */}
              {program.syllabus && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <h2 className="text-2xl font-black text-[#08245C] dark:text-white">
                    Curriculum &amp; Learning Modules
                  </h2>
                  <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    {program.syllabus}
                  </div>
                </div>
              )}

              {/* TRAINERS SECTION */}
              {trainers.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-[#0875D1] dark:text-blue-400" />
                    <h2 className="text-2xl font-black text-[#08245C] dark:text-white">
                      Course Instructors &amp; Mentors ({trainers.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trainers.map((trainer: any, idx: number) => {
                      const socials = trainer.socials || {};
                      return (
                        <div
                          key={idx}
                          className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-500 transition"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
                              <Image
                                src={
                                  trainer.avatar ||
                                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                                }
                                alt={trainer.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-black text-[#08245C] dark:text-white">
                                {trainer.name}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                {trainer.bio || "Lead Technical Trainer at JANIC, Jazeera University."}
                              </p>
                            </div>
                          </div>

                          {/* Trainer Social Links */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                            {socials.linkedin && (
                              <a
                                href={socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition"
                                title="LinkedIn Profile"
                              >
                                <LinkedInIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {socials.twitter && (
                              <a
                                href={socials.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-500 transition"
                                title="Twitter / X Profile"
                              >
                                <TwitterIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {socials.github && (
                              <a
                                href={socials.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition"
                                title="GitHub Profile"
                              >
                                <GitHubIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {socials.website && (
                              <a
                                href={socials.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-[#0875D1] dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition"
                                title="Portfolio / Website"
                              >
                                <Globe className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RATINGS, REVIEWS & COMMENTS INTERACTION */}
              <TrainingEngagement
                trainingId={program.id}
                allowComments={(program as any).allowComments ?? true}
                allowInteractions={(program as any).allowInteractions ?? true}
                initialStats={(program as any).stats}
                currentUser={currentUser}
              />
            </div>

            {/* SIDEBAR (4 COLS) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0875D1] dark:text-blue-400 block mb-1">
                    ENROLLMENT DETAILS
                  </span>
                  <h3 className="text-xl font-black text-[#08245C] dark:text-white">
                    Cohort Registration
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700">
                    <Clock className="w-4 h-4 text-[#0875D1] dark:text-blue-400 shrink-0" />
                    <div>
                      <strong className="block text-slate-800 dark:text-slate-200">Duration</strong>
                      <span>{program.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700">
                    <Calendar className="w-4 h-4 text-[#0875D1] dark:text-blue-400 shrink-0" />
                    <div>
                      <strong className="block text-slate-800 dark:text-slate-200">Schedule &amp; Timing</strong>
                      <span>{program.schedule}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700">
                    <MapPin className="w-4 h-4 text-[#0875D1] dark:text-blue-400 shrink-0" />
                    <div>
                      <strong className="block text-slate-800 dark:text-slate-200">Delivery Mode</strong>
                      <span>{program.mode}</span>
                    </div>
                  </div>

                  {program.certification && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                      <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <strong className="block text-emerald-900 dark:text-emerald-200">Credential Awarded</strong>
                        <span>{program.certification}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/contact?subject=Enrollment%20Inquiry:%20${encodeURIComponent(
                      program.title
                    )}`}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
                  >
                    Inquire / Register for Cohort
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <Link
                href="/training"
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
