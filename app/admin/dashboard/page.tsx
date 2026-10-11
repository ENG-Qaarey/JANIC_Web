import React from "react";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import {
  Download,
  ArrowUpRight,
  Plus,
  FolderGit2,
  GraduationCap,
  Calendar,
  Lightbulb,
  FlaskConical,
  Handshake,
  MessageSquare,
  Users,
  TrendingUp,
  Bell,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ContentTrendChart } from "@/components/admin/charts/ContentTrendChart";
import { ProgressGaugeChart } from "@/components/admin/charts/ProgressGaugeChart";
import { ContentSliceChart } from "@/components/admin/charts/ContentSliceChart";
import { Sparkline } from "@/components/admin/charts/Sparkline";
import { ProjectActivity } from "@/components/admin/charts/ProjectActivity";

export const dynamic = "force-dynamic";

function monthBuckets<T extends { createdAt: Date }>(items: T[], n: number): number[] {
  const now = new Date();
  const out: number[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(
      items.filter(
        (x) =>
          new Date(x.createdAt).getMonth() === d.getMonth() &&
          new Date(x.createdAt).getFullYear() === d.getFullYear()
      ).length
    );
  }
  return out;
}

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    archivedProjects,
    totalTraining,
    publishedTraining,
    totalResearch,
    publishedResearch,
    totalEvents,
    upcomingEvents,
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    totalPartnerships,
    newPartnerships,
    totalMessages,
    unreadMessages,
    team,
    recentProjects,
    recentSubmissions,
    recentMessages,
    recentResearchRows,
    recentPartnerships,
    projectsAll,
    submissionsAll,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.project.count({ where: { status: "ARCHIVED" } }),
    prisma.trainingProgram.count(),
    prisma.trainingProgram.count({ where: { status: "PUBLISHED" } }),
    prisma.researchPaper.count(),
    prisma.researchPaper.count({ where: { status: "PUBLISHED" } }),
    prisma.event.count(),
    prisma.event.findMany({
      where: { eventDate: { gte: new Date() } },
      take: 5,
      orderBy: { eventDate: "asc" },
    }),
    prisma.innovationSubmission.count(),
    prisma.innovationSubmission.count({ where: { status: "PENDING" } }),
    prisma.innovationSubmission.count({ where: { status: "APPROVED" } }),
    prisma.innovationSubmission.count({ where: { status: "REJECTED" } }),
    prisma.partnershipInquiry.count(),
    prisma.partnershipInquiry.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.teamMember.findMany({ take: 4, orderBy: { order: "asc" } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, category: true, status: true, updatedAt: true, teamMembers: true },
    }),
    prisma.innovationSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, submitterName: true, status: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, subject: true, status: true, createdAt: true },
    }),
    prisma.researchPaper.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, category: true, status: true, createdAt: true },
    }),
    prisma.partnershipInquiry.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      select: { id: true, organizationName: true, contactName: true, status: true, createdAt: true },
    }),
    prisma.project.findMany({ select: { createdAt: true, status: true } }),
    prisma.innovationSubmission.findMany({ select: { createdAt: true } }),
  ]);

  const now = new Date();
  const daily: { name: string; created: number; published: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    daily.push({
      name: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      created: projectsAll.filter(
        (p) => new Date(p.createdAt).toDateString() === d.toDateString()
      ).length,
      published: projectsAll.filter(
        (p) =>
          p.status === "PUBLISHED" &&
          new Date(p.createdAt).toDateString() === d.toDateString()
      ).length,
    });
  }

  const monthly: { name: string; created: number; published: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthly.push({
      name: d.toLocaleString("en", { month: "short" }),
      created: projectsAll.filter(
        (p) =>
          new Date(p.createdAt).getMonth() === d.getMonth() &&
          new Date(p.createdAt).getFullYear() === d.getFullYear()
      ).length,
      published: projectsAll.filter(
        (p) =>
          p.status === "PUBLISHED" &&
          new Date(p.createdAt).getMonth() === d.getMonth() &&
          new Date(p.createdAt).getFullYear() === d.getFullYear()
      ).length,
    });
  }

  const publishRate = totalProjects > 0 ? Math.round((publishedProjects / totalProjects) * 100) : 0;
  const approvalRate = totalSubmissions > 0 ? Math.round((approvedSubmissions / totalSubmissions) * 100) : 0;
  const trainingRate = totalTraining > 0 ? Math.round((publishedTraining / totalTraining) * 100) : 0;

  const kpis = [
    { title: "Total Projects", value: totalProjects, sub: `${publishedProjects} active • ${archivedProjects} archived`, icon: FolderGit2, color: "text-blue-600 bg-blue-500/10", spark: monthBuckets(projectsAll, 8) },
    { title: "Student Submissions", value: totalSubmissions, sub: `${pendingSubmissions} pending review`, icon: Lightbulb, color: "text-amber-600 bg-amber-500/10", spark: monthBuckets(submissionsAll, 8) },
    { title: "Research Papers", value: totalResearch, sub: `${publishedResearch} published`, icon: FlaskConical, color: "text-purple-600 bg-purple-500/10", spark: monthBuckets(recentResearchRows.map((r) => ({ createdAt: r.createdAt })), 8) },
    { title: "Training Programs", value: totalTraining, sub: `${publishedTraining} published tracks`, icon: GraduationCap, color: "text-emerald-600 bg-emerald-500/10", spark: monthBuckets(recentResearchRows.map((r) => ({ createdAt: r.createdAt })), 8) },
    { title: "Upcoming Events", value: upcomingEvents.length, sub: "scheduled ahead", icon: Calendar, color: "text-indigo-600 bg-indigo-500/10", spark: monthBuckets(upcomingEvents, 8) },
    { title: "Partnerships", value: totalPartnerships, sub: `${newPartnerships} new inquiries`, icon: Handshake, color: "text-rose-600 bg-rose-500/10", spark: monthBuckets(recentPartnerships.map((p) => ({ createdAt: p.createdAt })), 8) },
  ];

  const quickActions = [
    { title: "New Project", href: "/admin/projects", icon: Plus },
    { title: "Add Training", href: "/admin/training", icon: GraduationCap },
    { title: "Publish Research", href: "/admin/research", icon: FlaskConical },
    { title: "Create Event", href: "/admin/events", icon: Calendar },
    { title: "Review Submission", href: "/admin/submissions", icon: CheckCircle2 },
    { title: "Add Team Member", href: "/admin/team", icon: Users },
  ];

  const contentSlices = [
    { name: "Projects", value: totalProjects },
    { name: "Training", value: totalTraining },
    { name: "Research", value: totalResearch },
    { name: "Events", value: totalEvents },
  ];

  const activity = [
    ...recentProjects.map((p) => ({ id: p.id, text: `Project "${p.title}" updated`, date: p.updatedAt, icon: FolderGit2 })),
    ...recentSubmissions.map((s) => ({ id: s.id, text: `${s.submitterName} submitted "${s.title}"`, date: s.createdAt, icon: Lightbulb })),
    ...recentMessages.map((m) => ({ id: m.id, text: `Message from ${m.name}: ${m.subject}`, date: m.createdAt, icon: MessageSquare })),
    ...recentPartnerships.map((p) => ({ id: p.id, text: `Partnership inquiry from ${p.organizationName}`, date: p.createdAt, icon: Handshake })),
    ...recentResearchRows.map((r) => ({ id: r.id, text: `Research "${r.title}" added`, date: r.createdAt, icon: FlaskConical })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const notifCount = unreadMessages + pendingSubmissions + newPartnerships;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Good morning, JANIC</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Here is what is happening across your innovation ecosystem today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="gap-1.5 h-8">
            <Link href="/admin/projects">
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-1.5 h-8">
            <Link href="/admin/events">
              <Calendar className="w-4 h-4" />
              Announcement
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-8">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.title} className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {k.title}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${k.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-foreground">{k.value}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{k.sub}</div>
                <div className="mt-2">
                  <Sparkline data={k.spark} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickActions.map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.title} href={q.href}>
                <Card className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                  <CardContent className="p-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground">{q.title}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Project Activity</CardTitle>
            <CardDescription className="text-xs">
              Project creation and publication activity over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ProjectActivity daily={daily} monthly={monthly} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Content Overview</CardTitle>
            <CardDescription className="text-xs">Distribution of published content.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ContentSliceChart data={contentSlices} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="pb-2 p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recently Updated Projects</CardTitle>
                <CardDescription className="text-xs mt-0.5">Student innovations and lab prototypes.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                <Link href="/admin/projects">
                  View All <ArrowUpRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2 font-medium">Project</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Updated</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2 text-sm font-medium text-foreground">{p.title}</td>
                      <td className="py-2 text-xs text-muted-foreground">{p.category}</td>
                      <td className="py-2 text-xs text-muted-foreground">{formatDate(p.updatedAt)}</td>
                      <td className="py-2">
                        <Badge
                          variant={
                            p.status === "PUBLISHED" ? "success" : p.status === "DRAFT" ? "warning" : "secondary"
                          }
                        >
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentProjects.length === 0 && (
                <p className="py-8 text-center text-xs text-muted-foreground">No projects yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              {upcomingEvents.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-primary uppercase">
                      {new Date(e.eventDate).toLocaleString("en", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold text-primary leading-none">
                      {new Date(e.eventDate).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{e.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{e.location}</p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-xs text-muted-foreground py-6 text-center">No upcoming events.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Student Submissions</CardTitle>
            <CardDescription className="text-xs">Approval pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-foreground">{totalSubmissions}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {pendingSubmissions} pending • {approvedSubmissions} approved • {rejectedSubmissions} rejected
            </p>
            <div className="mt-3">
              <ProgressGaugeChart value={approvalRate} />
            </div>
            <div className="mt-2">
              <Link href="/admin/submissions" className="text-xs font-medium text-primary hover:underline">
                Review submissions →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Training Programs</CardTitle>
            <CardDescription className="text-xs">Certification track health.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-foreground">{publishedTraining}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">published of {totalTraining} programs</p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${trainingRate}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">{trainingRate}% completion of track catalog</p>
            <div className="mt-2">
              <Link href="/admin/training" className="text-xs font-medium text-primary hover:underline">
                View training →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Research Insights</CardTitle>
            <CardDescription className="text-xs">Publication status.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-foreground">{publishedResearch}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">published of {totalResearch} papers</p>
            <div className="mt-3">
              <ProgressGaugeChart value={totalResearch > 0 ? Math.round((publishedResearch / totalResearch) * 100) : 0} />
            </div>
            <div className="mt-2">
              <Link href="/admin/research" className="text-xs font-medium text-primary hover:underline">
                View research →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              {activity.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground leading-snug">{a.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(a.date)}</p>
                    </div>
                  </div>
                );
              })}
              {activity.length === 0 && (
                <p className="text-xs text-muted-foreground py-6 text-center">No activity yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              {team.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{m.role}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${m.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>
              ))}
              {team.length === 0 && (
                <p className="text-xs text-muted-foreground py-6 text-center">No team members yet.</p>
              )}
            </div>
            <div className="mt-3">
              <Link href="/admin/team" className="text-xs font-medium text-primary hover:underline">
                View Team →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-sm font-semibold">Partnerships</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold text-foreground">{totalPartnerships}</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xl font-bold text-foreground">{newPartnerships}</p>
                <p className="text-[10px] text-muted-foreground">New</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {recentPartnerships.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <p className="text-xs text-foreground truncate">{p.organizationName}</p>
                  <Badge variant={p.status === "NEW" ? "info" : "secondary"}>{p.status}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link href="/admin/partnerships" className="text-xs font-medium text-primary hover:underline">
                View Partnerships →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}