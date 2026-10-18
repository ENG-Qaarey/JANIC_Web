import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectService } from "@/services/projects/project.service";
import { TeamRepository } from "@/repositories/team.repository";
import { SectionHero } from "@/components/layout/SectionHero";
import { ProjectMemberRepository } from "@/repositories/project-member.repository";
import { ProjectTeamGrid, ProjectTeamGridMember } from "@/components/public/ProjectTeamGrid";
import {
  ExternalLink,
  Code2,
  Video,
  Users,
  CheckCircle2,
  Cpu,
  Sparkles,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/jwt";
import { ProjectMediaCover } from "@/components/public/ProjectMediaCover";
import { ProjectSidebarGallery } from "@/components/public/ProjectSidebarGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await ProjectService.getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} | JANIC`,
      description: project.summary,
      images: project.heroImage ? [project.heroImage] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await ProjectService.getProjectBySlug(slug);

  const currentUser = await getCurrentUser();
  const isAdminOrEditor =
    currentUser?.role === "ADMIN" || currentUser?.role === "EDITOR";

  if (!project || (project.status !== "PUBLISHED" && !isAdminOrEditor)) {
    notFound();
  }

  const techList = project.technology.split(",").map((t) => t.trim());

  // Resolve rich student members for this project
  const rawMembers = ((project as any).members || []) as any[];
  let projectTeam: ProjectTeamGridMember[] = [];

  if (rawMembers.length > 0) {
    projectTeam = rawMembers.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role || "Innovator",
      department: m.department || "Faculty of Computer Science & IT",
      bio: m.bio || null,
      avatar: m.avatar || null,
      email: m.email || null,
      phone: m.phone || null,
      linkedin: m.linkedin || null,
      github: m.github || null,
      facebook: m.facebook || null,
      twitter: m.twitter || null,
      website: m.website || null,
      tags: m.tags || null,
    }));
  } else {
    const allStudentMembers = await ProjectMemberRepository.findAll();
    const matchedByProj = allStudentMembers.filter(
      (m) => m.projectId === project.id || (m.project && m.project.slug === project.slug)
    );

    if (matchedByProj.length > 0) {
      projectTeam = matchedByProj.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role || "Innovator",
        department: m.department || "Faculty of Computer Science & IT",
        bio: m.bio || null,
        avatar: m.avatar || null,
        email: m.email || null,
        phone: m.phone || null,
        linkedin: m.linkedin || null,
        github: m.github || null,
        facebook: m.facebook || null,
        twitter: m.twitter || null,
        website: m.website || null,
        tags: m.tags || null,
      }));
    } else if (project.teamMembers) {
      const names = project.teamMembers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      projectTeam = names.map((entry) => {
        const match = entry.match(/^(.+?)\s*(?:\((.+?)\))?$/);
        const parsedName = match ? match[1].trim() : entry;
        const parsedRole = match && match[2] ? match[2].trim() : null;

        const student = allStudentMembers.find(
          (s) =>
            s.name.toLowerCase().trim() === parsedName.toLowerCase().trim() ||
            s.name.toLowerCase().includes(parsedName.toLowerCase().trim()) ||
            parsedName.toLowerCase().includes(s.name.toLowerCase().trim())
        );

        if (student) {
          return {
            id: student.id,
            name: student.name,
            role: student.role || parsedRole || "Innovator",
            department: student.department || "Faculty of Computer Science & IT",
            bio: student.bio || null,
            avatar: student.avatar || null,
            email: student.email || null,
            phone: student.phone || null,
            linkedin: student.linkedin || null,
            github: student.github || null,
            facebook: student.facebook || null,
            twitter: student.twitter || null,
            website: student.website || null,
            tags: student.tags || null,
          };
        }

        return {
          name: parsedName,
          role: parsedRole || "Team Member",
          department: "Faculty of Computer Science & IT",
          bio: null,
          avatar: null,
        };
      });
    }
  }

  return (
    <div>
      {project.status !== "PUBLISHED" && (
        <div className="bg-amber-500 text-white text-xs font-bold py-2.5 px-4 text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2">
          <span>⚠️ Preview Mode: This project is currently saved as {project.status} (Visible only to Admin/Editor staff)</span>
        </div>
      )}
      <SectionHero
        image={project.heroImage}
        badge={project.category}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.demoUrl && project.demoUrl.trim().length > 0 && !project.demoUrl.includes("example.com") && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0875D1] hover:bg-[#065ea8] text-white font-semibold text-xs shadow-md shadow-[#0875D1]/20 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo / Website
            </a>
          )}
          {project.videoUrl && project.videoUrl.trim().length > 0 && (
            <a
              href={project.videoUrl.startsWith("http") ? project.videoUrl : "#video-player"}
              target={project.videoUrl.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#08245C] dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white font-semibold text-xs border border-slate-300 dark:border-slate-700 shadow-xs transition"
            >
              <Video className="w-3.5 h-3.5 text-[#0875D1]" />
              Watch Video Demo
            </a>
          )}
          {project.githubUrl && project.githubUrl.trim().length > 0 && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs border border-slate-900 shadow-md shadow-slate-900/15 transition"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              GitHub Repository
            </a>
          )}
        </div>
      </SectionHero>

      <div className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Hero Media (Video with Voice Volume Control & Timeline Scroll, Hero Image as Fallback) */}
              {(project.videoUrl || project.heroImage) && (
                <div id="video-player" className="aspect-[16/9] relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-950">
                  <ProjectMediaCover
                    videoUrl={project.videoUrl}
                    imageUrl={project.heroImage}
                    alt={project.title}
                    priority
                    showControls={true}
                  />
                </div>
              )}

              {/* The Problem */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
                  The Problem
                </div>
                <h2 className="text-2xl font-extrabold text-[#08245C]">
                  Challenge & Context
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* The Solution */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  The Solution
                </div>
                <h2 className="text-2xl font-extrabold text-[#08245C]">
                  Engineered Approach & Architecture
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {project.solution}
                </p>
              </div>

              {/* Key Innovation */}
              {project.innovation && (
                <div className="bg-[#08245C] text-white p-8 rounded-2xl border border-blue-900 shadow-xl space-y-3 relative overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Key Innovation
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    What Makes This Unique
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {project.innovation}
                  </p>
                </div>
              )}

              {/* Outcomes & Impact */}
              {project.outcomes && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0875D1] text-xs font-bold uppercase tracking-wider">
                    Outcomes & Validation
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#08245C]">
                    Results & Testing Performance
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {project.outcomes}
                  </p>
                </div>
              )}

              {/* Student Innovators & Engineering Team */}
              {projectTeam.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0875D1] dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5" />
                        Student Innovators & Engineering Team
                      </div>
                      <h2 className="text-2xl font-black text-[#08245C] dark:text-white mt-2.5">
                        Built by {projectTeam.length}{" "}
                        {projectTeam.length === 1 ? "Student Innovator" : "Student Innovators"}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Meet the student inventors, developers, and researchers behind this prototype.
                      </p>
                    </div>
                  </div>

                  <ProjectTeamGrid members={projectTeam} />
                </div>
              )}

            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Technology Stack Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Cpu className="w-4 h-4 text-[#0875D1]" />
                  Technologies Used
                </div>
                <div className="flex flex-wrap gap-2">
                  {techList.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0875D1] font-semibold text-xs border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Student Team Card */}
              {projectTeam.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Engineering Team
                  </div>
                  <p className="text-5xl font-black text-[#08245C] dark:text-white leading-none">
                    {projectTeam.length}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {projectTeam.length === 1 ? "engineer" : "engineers"} built this project
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium pt-1">
                    {project.teamMembers}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                    Faculty of Computer Science & IT, Jazeera University
                  </p>
                </div>
              )}

              {/* Project Meta */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs text-slate-500">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Category</span>
                  <span className="font-semibold text-slate-800">{project.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Published Date</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(project.publishedAt || project.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Incubation Status</span>
                  <span className="font-semibold text-emerald-600">Active Lab Prototype</span>
                </div>
              </div>

              {/* Back to list button */}
              <Link
                href="/projects"
                className="w-full py-3 px-4 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Projects
              </Link>

              {/* Project Gallery in the Sidebar Empty Space */}
              {project.gallery && project.gallery.length > 0 && (
                <ProjectSidebarGallery
                  gallery={project.gallery as any}
                  projectTitle={project.title}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
