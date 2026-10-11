const { PrismaClient, ContentStatus } = require("@prisma/client");
const prisma = new PrismaClient();

const sampleTrainers = [
  {
    name: "Dr. Abdullahi Nur",
    bio: "Lead Cloud Architect & AI Researcher at Jazeera University. 12+ years experience in distributed systems and cloud security.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      website: "https://janic.edu.so",
    },
  },
  {
    name: "Eng. Fadumo Ali Hassan",
    bio: "Senior Full-Stack Engineer and Tech Educator specializing in React, Next.js, and scalable microservices architectures.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Mohamed Warsame",
    bio: "Cybersecurity Analyst & Certified Ethical Hacker. Advises regional financial institutions on enterprise threat mitigation.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      github: "https://github.com",
    },
  },
];

const programs = [
  {
    title: "Full-Stack Web Development Bootcamp",
    slug: "full-stack-web-development-bootcamp",
    category: "Software Engineering",
    level: "Intermediate",
    duration: "12 Weeks",
    schedule: "Mon & Wed, 4:00 PM - 7:00 PM",
    startDate: new Date("2026-11-01T16:00:00Z"),
    endDate: new Date("2027-01-24T19:00:00Z"),
    mode: "Hybrid (Campus Labs & Online)",
    certification: "JANIC Certified Full-Stack Engineer",
    summary: "Master modern full-stack web applications with Next.js 16, React 19, TypeScript, PostgreSQL, and scalable cloud deployments.",
    description: `This intensive 12-week program equips aspiring software developers with industry-standard web engineering capabilities. 
    
Participants build real-world production systems including multi-tenant web applications, RESTful and GraphQL APIs, authentication flows, and automated CI/CD pipelines.

Topics Covered:
• Modern JavaScript & TypeScript Deep Dive
• React 19 Architecture, Server Components & Hooks
• Next.js App Router, Server Actions & Edge Middleware
• Relational Databases with Prisma ORM & PostgreSQL
• API Design, Authentication (OAuth, JWT), and Security best practices
• Containerization with Docker & Cloud Deployment on Vercel and AWS`,
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    maxSeats: 30,
    syllabus: `Week 1-3: Modern Frontend with React 19 & Tailwind CSS
Week 4-6: App Router & Server Components in Next.js
Week 7-9: Database Architecture, Prisma ORM & REST APIs
Week 10-12: Capstone Project, Security Hardening & Production Deployment`,
    trainers: JSON.stringify([sampleTrainers[1], sampleTrainers[0]]),
  },
  {
    title: "Python for Data Science & Machine Learning",
    slug: "python-data-science-machine-learning",
    category: "Data & AI",
    level: "Beginner",
    duration: "8 Weeks",
    schedule: "Tue & Thu, 5:00 PM - 7:30 PM",
    startDate: new Date("2026-11-10T17:00:00Z"),
    endDate: new Date("2027-01-05T19:30:00Z"),
    mode: "On-Campus",
    certification: "JANIC Applied Data Practitioner",
    summary: "Transform raw data into predictive insights using Python, Pandas, NumPy, Scikit-Learn, and modern data visualization libraries.",
    description: `A hands-on journey from basic programming fundamentals to deploying predictive machine learning models. Designed for university students, analysts, and engineers wanting to leverage data intelligence in fintech, healthtech, and civic domains.`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    maxSeats: 25,
    syllabus: `Module 1: Python Fundamentals & Data Structures
Module 2: Exploratory Data Analysis with Pandas & Seaborn
Module 3: Supervised & Unsupervised Machine Learning
Module 4: Real-world Predictive Modeling Project`,
    trainers: JSON.stringify([sampleTrainers[0]]),
  },
  {
    title: "Advanced Cybersecurity & Ethical Hacking",
    slug: "advanced-cybersecurity-ethical-hacking",
    category: "Cybersecurity",
    level: "Advanced",
    duration: "10 Weeks",
    schedule: "Fri & Sat, 9:00 AM - 1:00 PM",
    startDate: new Date("2026-11-15T09:00:00Z"),
    endDate: new Date("2027-01-20T13:00:00Z"),
    mode: "On-Campus Security Lab",
    certification: "Certified Defensive Security Associate (CDSA)",
    summary: "Hands-on penetration testing, network vulnerability assessments, and defensive countermeasures in isolated lab environments.",
    description: `Gain battle-tested skills in vulnerability identification, offensive exploitation, packet analysis, and security incident management. Students work in controlled sandbox environments executing realistic Capture-The-Flag (CTF) security drills.`,
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    maxSeats: 20,
    syllabus: `Phase 1: Network Reconnaissance & Threat Modeling
Phase 2: Web Application Security (OWASP Top 10)
Phase 3: Cryptography & Wireless Auditing
Phase 4: Incident Response & Defensive Hardening`,
    trainers: JSON.stringify([sampleTrainers[2]]),
  },
  {
    title: "Cloud Infrastructure & DevOps with AWS",
    slug: "cloud-infrastructure-devops-aws",
    category: "Cloud Computing",
    level: "Intermediate",
    duration: "8 Weeks",
    schedule: "Tue & Sat, 3:00 PM - 6:00 PM",
    startDate: new Date("2026-11-20T15:00:00Z"),
    endDate: new Date("2027-01-15T18:00:00Z"),
    mode: "Hybrid",
    certification: "AWS Cloud Practitioner Prep",
    summary: "Architect highly scalable, resilient cloud systems using Amazon Web Services, Docker containers, and GitHub Actions CI/CD pipelines.",
    description: `Master cloud-native architecture patterns. Learn VPC networking, EC2 and ECS provisioning, automated database replication, serverless Lambdas, and Infrastructure as Code with Terraform.`,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: false,
    maxSeats: 25,
    trainers: JSON.stringify([sampleTrainers[0]]),
  },
  {
    title: "Mobile App Development with Flutter",
    slug: "mobile-app-development-flutter",
    category: "Mobile Engineering",
    level: "Beginner",
    duration: "10 Weeks",
    schedule: "Mon & Thu, 5:00 PM - 7:30 PM",
    startDate: new Date("2026-12-01T17:00:00Z"),
    endDate: new Date("2027-02-10T19:30:00Z"),
    mode: "On-Campus",
    certification: "JANIC Certified Mobile Developer",
    summary: "Build high-performance, cross-platform Android and iOS applications with single codebase using Google Flutter and Dart.",
    description: `From basic Dart syntax to building full-featured mobile experiences with state management, offline local storage, camera integration, and RESTful API backend synchronizations.`,
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: false,
    maxSeats: 28,
    trainers: JSON.stringify([sampleTrainers[1]]),
  },
  {
    title: "UI/UX Design & Product Prototyping",
    slug: "ui-ux-design-product-prototyping",
    category: "Digital Design",
    level: "Beginner",
    duration: "6 Weeks",
    schedule: "Wed & Sat, 2:00 PM - 5:00 PM",
    startDate: new Date("2026-12-05T14:00:00Z"),
    endDate: new Date("2027-01-16T17:00:00Z"),
    mode: "On-Campus Design Studio",
    certification: "JANIC Certified Product Designer",
    summary: "Learn human-centered design thinking, user research, wireframing, interactive prototyping, and design systems in Figma.",
    description: `Transform product concepts into intuitive digital interfaces. Learn accessibility guidelines, color psychology, typography systems, and hand-off techniques for engineering teams.`,
    coverImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: false,
    maxSeats: 22,
    trainers: JSON.stringify([sampleTrainers[1]]),
  },
  {
    title: "Enterprise Database Administration & SQL Tuning",
    slug: "enterprise-database-sql-tuning",
    category: "Database Technology",
    level: "Advanced",
    duration: "8 Weeks",
    schedule: "Sun & Tue, 4:00 PM - 7:00 PM",
    startDate: new Date("2026-12-10T16:00:00Z"),
    endDate: new Date("2027-02-04T19:00:00Z"),
    mode: "On-Campus",
    certification: "JANIC Database Specialist",
    summary: "Optimize query throughput, configure high availability replication clusters, and maintain mission-critical relational database systems.",
    description: `Designed for backend developers and system administrators responsible for high-load transactional databases. Covers query execution plans, indexing strategies, connection pooling, and sharding.`,
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: false,
    maxSeats: 20,
    trainers: JSON.stringify([sampleTrainers[0]]),
  },
  {
    title: "IoT Systems & Hardware Embedded Development",
    slug: "iot-systems-embedded-development",
    category: "Emerging Technologies",
    level: "Intermediate",
    duration: "10 Weeks",
    schedule: "Fri & Sat, 2:00 PM - 6:00 PM",
    startDate: new Date("2026-12-15T14:00:00Z"),
    endDate: new Date("2027-02-20T18:00:00Z"),
    mode: "Hardware Lab, Jazeera University",
    certification: "JANIC Embedded Systems Certification",
    summary: "Develop smart connected sensors and IoT telemetry systems using ESP32, Arduino, Raspberry Pi, MQTT, and cloud dashboards.",
    description: `Bridge digital software and physical hardware. Build automated sensor networks, solar monitoring hubs, and smart agriculture hardware prototypes directly applicable to the Somali context.`,
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    status: ContentStatus.PUBLISHED,
    isFeatured: true,
    maxSeats: 18,
    trainers: JSON.stringify([sampleTrainers[0], sampleTrainers[2]]),
  },
];

async function seed() {
  console.log("Seeding training programs...");
  for (const prog of programs) {
    const existing = await prisma.trainingProgram.findUnique({ where: { slug: prog.slug } });
    if (!existing) {
      const created = await prisma.trainingProgram.create({ data: prog });
      console.log(`Created: ${created.title}`);

      // Add a couple of initial reviews & ratings
      await prisma.trainingRating.createMany({
        data: [
          { trainingId: created.id, userId: "seed_u1", stars: 5, feedback: "Exceptional course with practical lab exercises!" },
          { trainingId: created.id, userId: "seed_u2", stars: 5, feedback: "Trainers are very experienced and supportive." },
          { trainingId: created.id, userId: "seed_u3", stars: 4, feedback: "Great curriculum." },
        ],
      });

      // Add initial likes
      await prisma.trainingLike.createMany({
        data: [
          { trainingId: created.id, userId: "seed_u1" },
          { trainingId: created.id, userId: "seed_u2" },
          { trainingId: created.id, userId: "seed_u3" },
        ],
      });

      // Add initial comment
      await prisma.trainingComment.create({
        data: {
          trainingId: created.id,
          userId: "seed_u1",
          userName: "Ahmed Hassan",
          message: "Looking forward to this cohort! Are prerequisites available?",
        },
      });
    } else {
      console.log(`Already exists: ${prog.title}`);
    }
  }

  // Also enrich Research Papers with authorsData and sample ratings if missing
  const papers = await prisma.researchPaper.findMany();
  for (const paper of papers) {
    if (!paper.authorsData) {
      const authors = paper.authors.split(",").map((name, idx) => ({
        name: name.trim(),
        avatar: [
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        ][idx % 3],
        affiliation: paper.journalOrConference || "Faculty of CS & IT, Jazeera University",
        link: "https://janic.edu.so",
      }));

      await prisma.researchPaper.update({
        where: { id: paper.id },
        data: { authorsData: JSON.stringify(authors) },
      });
    }

    const ratingsCount = await prisma.researchRating.count({ where: { paperId: paper.id } });
    if (ratingsCount === 0) {
      await prisma.researchRating.createMany({
        data: [
          { paperId: paper.id, userId: "seed_r1", stars: 5 },
          { paperId: paper.id, userId: "seed_r2", stars: 5 },
          { paperId: paper.id, userId: "seed_r3", stars: 4 },
        ],
      });
      await prisma.researchLike.createMany({
        data: [
          { paperId: paper.id, userId: "seed_r1" },
          { paperId: paper.id, userId: "seed_r2" },
        ],
      });
      await prisma.researchComment.create({
        data: {
          paperId: paper.id,
          userId: "seed_r1",
          userName: "Dr. Mohamed",
          message: "Excellent research contribution with clear local applicability.",
        },
      });
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
