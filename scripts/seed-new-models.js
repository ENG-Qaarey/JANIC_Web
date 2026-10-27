const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const initialHubs = [
  {
    name: "JANIC Innovation Hub",
    slug: "innovation-hub",
    category: "Prototyping & Challenges",
    description: "Student projects, design thinking, rapid prototyping, and university-wide innovation challenges.",
    icon: "Lightbulb",
    status: "Active",
    link: "/innovation-hub",
    tags: "Design Thinking, Prototyping, Hackathons",
    order: 1,
    isActive: true,
  },
  {
    name: "Jazeera ICT Girls Hub",
    slug: "ict-girls-hub",
    category: "Women in Tech",
    description: "Digital skills, technical mentorship, leadership development, and innovation opportunities empowering women and girls.",
    icon: "Sparkles",
    status: "Active",
    link: "https://juictgirls.org/",
    tags: "Mentorship, Coding, Leadership",
    order: 2,
    isActive: true,
  },
  {
    name: "JANIC AI Hub",
    slug: "ai-hub",
    category: "Artificial Intelligence",
    description: "Artificial intelligence, applied machine learning, localized AI applications, and ethical, responsible AI practices.",
    icon: "Cpu",
    status: "Upcoming",
    link: null,
    tags: "Machine Learning, NLP, Responsible AI",
    order: 3,
    isActive: true,
  },
  {
    name: "JANIC Cybersecurity Hub",
    slug: "cybersecurity-hub",
    category: "Security & Resilience",
    description: "Cyber awareness, secure software development lifecycle, hands-on security labs, and institutional digital resilience.",
    icon: "ShieldCheck",
    status: "Upcoming",
    link: null,
    tags: "SecOps, Penetration Testing, Digital Defense",
    order: 4,
    isActive: true,
  },
  {
    name: "JANIC Software & App Lab",
    slug: "software-lab",
    category: "Application Engineering",
    description: "Modern web, native mobile, cross-platform desktop, and institutional enterprise software application development.",
    icon: "Smartphone",
    status: "Active",
    link: null,
    tags: "Next.js, Mobile Apps, Full Stack",
    order: 5,
    isActive: true,
  },
  {
    name: "JANIC Data Science Hub",
    slug: "data-science-hub",
    category: "Analytics & Insights",
    description: "Data analysis, interactive visualization, predictive modeling, and evidence-based problem-solving for Somali socio-economics.",
    icon: "BarChart3",
    status: "Upcoming",
    link: null,
    tags: "Data Analytics, BI Dashboards, Big Data",
    order: 6,
    isActive: true,
  },
  {
    name: "JANIC Cloud & Emerging Technology Hub",
    slug: "cloud-emerging-hub",
    category: "Next-Gen Tech",
    description: "Cloud native infrastructure, distributed systems, blockchain exploration, Internet of Things (IoT), and smart devices.",
    icon: "Cloud",
    status: "Upcoming",
    link: null,
    tags: "Cloud Computing, IoT Hardware, Smart Sensors",
    order: 7,
    isActive: true,
  },
  {
    name: "JANIC Research & Digital Solutions Hub",
    slug: "research-solutions-hub",
    category: "Applied Research",
    description: "Faculty and student applied research papers, experimental research prototypes, and technology-supported solutions.",
    icon: "FlaskConical",
    status: "Active",
    link: "/research",
    tags: "Peer-Reviewed Papers, Prototypes, Publications",
    order: 8,
    isActive: true,
  },
  {
    name: "JANIC Entrepreneurship & Startup Hub",
    slug: "startup-hub",
    category: "Commercialization",
    description: "Business model design, lean canvas validation, pitch deck coaching, venture readiness, and incubation support.",
    icon: "Rocket",
    status: "Upcoming",
    link: null,
    tags: "Business Modeling, Pitching, Incubation",
    order: 9,
    isActive: true,
  },
  {
    name: "JANIC Industry & Partnerships Hub",
    slug: "industry-partnerships-hub",
    category: "Ecosystem Engagement",
    description: "Industry engagement, corporate problem statements, professional executive mentorship, student internships, and collaborative pilots.",
    icon: "Building2",
    status: "Active",
    link: "/partnerships",
    tags: "Internships, Corporate Pilots, Sponsorships",
    order: 10,
    isActive: true,
  },
  {
    name: "JANIC Community Technology Hub",
    slug: "community-tech-hub",
    category: "Civic Impact",
    description: "Grassroots technology initiatives, civic tech tools, and digital solutions addressing community and regional municipal needs.",
    icon: "Users",
    status: "Active",
    link: "/community-services",
    tags: "Civic Tech, Public Sector, Community Services",
    order: 11,
    isActive: true,
  },
  {
    name: "JANIC Digital Transformation Hub",
    slug: "digital-transformation-hub",
    category: "Institutional Innovation",
    description: "Digital public services, institutional process automation, university digitization, and modernization solutions.",
    icon: "Layers",
    status: "Upcoming",
    link: null,
    tags: "Process Automation, Digitization, Enterprise Solutions",
    order: 12,
    isActive: true,
  },
];

const initialOpportunities = [
  {
    title: "Call for Student Innovation Prototypes (Cohort 2026/27)",
    type: "Call for Projects",
    deadline: "Open Enrollment",
    department: "All FOCOSIT Departments",
    description: "Submit your software or hardware innovation concept for incubation at JANIC. Selected teams receive lab workspace, compute access, faculty supervisor matching, and Demo Day presentation slots.",
    eligibility: "Active Jazeera University undergraduate and postgraduate IT students.",
    actionUrl: "/submit-innovation",
    actionLabel: "Submit Innovation Proposal",
    status: "Active",
    order: 1,
    isActive: true,
  },
  {
    title: "Tech Internship & Apprenticeship Placement Program",
    type: "Industry Internship",
    deadline: "Rolling Admissions",
    department: "Software & App Lab / Cybersecurity",
    description: "Partner organizations across Mogadishu offer 3-month to 6-month hands-on internships for qualified JANIC student innovators with demonstrated portfolio projects.",
    eligibility: "Final-year students and top performers across JANIC project cohorts.",
    actionUrl: "/contact",
    actionLabel: "Apply for Placement",
    status: "Active",
    order: 2,
    isActive: true,
  },
  {
    title: "Annual Jazeera University Hackathon & Innovation Cup",
    type: "Competition",
    deadline: "Announced Annually",
    department: "JANIC Innovation Hub & JU ICT Girls",
    description: "A 48-hour intensive hackathon tackling regional digital health, micro-finance, civic automation, and logistics challenges with prize grants and incubation support.",
    eligibility: "Multi-disciplinary teams of 3 to 5 students from any faculty.",
    actionUrl: "/events",
    actionLabel: "View Hackathon Details",
    status: "Upcoming",
    order: 3,
    isActive: true,
  },
  {
    title: "Faculty Research & Prototype Seed Grant Collaboration",
    type: "Research Call",
    deadline: "Semester Deadlines",
    department: "Research & Digital Solutions Hub",
    description: "Support for academic faculty members co-developing functional software or embedded prototypes alongside student research assistants for peer-reviewed publication.",
    eligibility: "Faculty of Computer Science & IT academic staff.",
    actionUrl: "/contact",
    actionLabel: "Connect with Research Hub",
    status: "Active",
    order: 4,
    isActive: true,
  },
];

const initialDocuments = [
  {
    title: "JANIC Innovation Project Proposal Template",
    category: "Student Projects",
    format: "PDF / DOCX",
    size: "420 KB",
    description: "Standard concept note and technical architecture proposal document for student teams applying to enter the JANIC prototyping pipeline.",
    fileUrl: null,
    order: 1,
    isActive: true,
  },
  {
    title: "Faculty Applied Research Mentorship Guidelines",
    category: "Faculty & Mentorship",
    format: "PDF",
    size: "680 KB",
    description: "Policy guidelines, ethics protocols, and mentorship expectations for academic supervisors guiding student technical innovations.",
    fileUrl: null,
    order: 2,
    isActive: true,
  },
  {
    title: "Industry Partnership Collaboration Charter",
    category: "Partnerships",
    format: "PDF",
    size: "850 KB",
    description: "Framework defining intellectual property, student internship terms, workplace visits, and co-development commitments with corporate entities.",
    fileUrl: null,
    order: 3,
    isActive: true,
  },
  {
    title: "Lab Equipment & Workstation Access Policy",
    category: "Hub Governance",
    format: "PDF",
    size: "310 KB",
    description: "Guidelines for using compute stations, hardware toolkits, soldering benches, and IoT testing kits in the JANIC labs.",
    fileUrl: null,
    order: 4,
    isActive: true,
  },
  {
    title: "Student Demo Day Presentation Checklist & Rubric",
    category: "Events & Evaluation",
    format: "PDF",
    size: "240 KB",
    description: "Evaluation criteria used by judges and faculty deans during semester-end prototype showcase events.",
    fileUrl: null,
    order: 5,
    isActive: true,
  },
];

async function main() {
  console.log("Seeding Hubs...");
  for (const hub of initialHubs) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO Hub (id, name, slug, category, description, icon, status, link, tags, \`order\`, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), category = VALUES(category), status = VALUES(status), tags = VALUES(tags)`,
      `hub_${hub.slug}`,
      hub.name,
      hub.slug,
      hub.category,
      hub.description,
      hub.icon,
      hub.status,
      hub.link,
      hub.tags,
      hub.order,
      hub.isActive ? 1 : 0
    );
  }

  console.log("Seeding Opportunities...");
  for (let i = 0; i < initialOpportunities.length; i++) {
    const opp = initialOpportunities[i];
    await prisma.$executeRawUnsafe(
      `INSERT INTO Opportunity (id, title, type, deadline, department, description, eligibility, actionUrl, actionLabel, status, \`order\`, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
      `opp_${i + 1}`,
      opp.title,
      opp.type,
      opp.deadline,
      opp.department,
      opp.description,
      opp.eligibility,
      opp.actionUrl,
      opp.actionLabel,
      opp.status,
      opp.order,
      opp.isActive ? 1 : 0
    );
  }

  console.log("Seeding Resource Documents...");
  for (let i = 0; i < initialDocuments.length; i++) {
    const doc = initialDocuments[i];
    await prisma.$executeRawUnsafe(
      `INSERT INTO ResourceDocument (id, title, category, format, size, description, fileUrl, \`order\`, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description)`,
      `doc_${i + 1}`,
      doc.title,
      doc.category,
      doc.format,
      doc.size,
      doc.description,
      doc.fileUrl,
      doc.order,
      doc.isActive ? 1 : 0
    );
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
