const path = require('path');
const { PrismaClient, PartnershipStatus } = require(path.join(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding partnership inquiries for JANIC...");

  const partnerships = [
    {
      organizationName: "Hormuud Tech Hub",
      organizationType: "SMEs & Startups",
      contactName: "Ahmed Jama",
      email: "ahmed@hormuudtech.so",
      phone: "+252 61 5001234",
      collaborationArea: "Fintech & Mobile Payments incubation",
      proposalDetails: "We are looking to collaborate with JANIC student startups to build secure mobile wallet integrations and API payment gateways for local merchants.",
      status: PartnershipStatus.NEW,
      adminNotes: "Promising startup network. High potential for incubation sponsorship."
    },
    {
      organizationName: "Banadir Women Artisans Coop",
      organizationType: "Women-Owned Businesses",
      contactName: "Fadumo Ali",
      email: "fadumo@banadirwomen.so",
      phone: "+252 61 5112233",
      collaborationArea: "E-commerce enablement & digital literacy",
      proposalDetails: "Seeking technical assistance from JANIC developers to set up an online marketplace platform connecting 150+ women-owned local crafts businesses with international buyers.",
      status: PartnershipStatus.IN_PROGRESS,
      adminNotes: "Assigned student team Alpha for initial platform prototype."
    },
    {
      organizationName: "Mogadishu University Faculty of Engineering",
      organizationType: "Universities & Education",
      contactName: "Prof. Ibrahim Sheikh",
      email: "i.sheikh@mu.edu.so",
      phone: "+252 61 5223344",
      collaborationArea: "Joint research & student exchange programs",
      proposalDetails: "Proposal to establish a collaborative IoT research lab focusing on smart agricultural sensors for drought monitoring in rural Somalia.",
      status: PartnershipStatus.CONTACTED,
      adminNotes: "Initial meeting scheduled for next Tuesday with Dean of IT."
    },
    {
      organizationName: "Somali Youth Development Coalition",
      organizationType: "NGOs & Development Organizations",
      contactName: "Mohamed Abdi",
      email: "mohamed@sydc.org",
      phone: "+252 61 5334455",
      collaborationArea: "Digital skills training for youth",
      proposalDetails: "Partnering on a nationwide coding bootcamp initiative targeting underprivileged youth across Benadir and Hirshabelle regions.",
      status: PartnershipStatus.NEW,
      adminNotes: "Reviewing curriculum alignment with JANIC training standards."
    },
    {
      organizationName: "Ministry of Communications & Technology",
      organizationType: "Government Institutions",
      contactName: "Eng. Hassan Farah",
      email: "hassan.farah@moct.gov.so",
      phone: "+252 61 5445566",
      collaborationArea: "National digital transformation policy & tech hubs",
      proposalDetails: "Collaboration framework for national hackathons, cybersecurity awareness workshops, and open government data initiatives.",
      status: PartnershipStatus.IN_PROGRESS,
      adminNotes: "Government MOU draft received. Legal review in progress."
    },
    {
      organizationName: "Dahabshiil Cloud Solutions",
      organizationType: "Technology Companies",
      contactName: "Abdikadir Osman",
      email: "a.osman@dahabshiilcloud.com",
      phone: "+252 61 5556677",
      collaborationArea: "Enterprise cloud infrastructure & API integrations",
      proposalDetails: "Offering cloud hosting credits, mentorship sessions, and enterprise software architecture masterclasses for JANIC incubator projects.",
      status: PartnershipStatus.CLOSED,
      adminNotes: "Partnership agreement signed. Cloud credits distributed to active projects."
    },
    {
      organizationName: "East Africa AI & Data Science Association",
      organizationType: "Researchers & Professionals",
      contactName: "Dr. Zahra Abukar",
      email: "zahra@eaidsa.org",
      phone: "+252 61 5667788",
      collaborationArea: "Machine learning research & open data initiatives",
      proposalDetails: "Proposing joint research papers on Natural Language Processing for Somali dialects and automated translation models.",
      status: PartnershipStatus.NEW,
      adminNotes: "Forwarded to AI Research Lab leads."
    }
  ];

  // Update existing or create new
  for (const p of partnerships) {
    await prisma.partnershipInquiry.upsert({
      where: { id: p.organizationName.toLowerCase().replace(/\s+/g, '-') },
      update: p,
      create: {
        id: p.organizationName.toLowerCase().replace(/\s+/g, '-'),
        ...p
      }
    });
  }

  // Also update any existing records with old organizationType "NGOs & Development Orgs"
  await prisma.partnershipInquiry.updateMany({
    where: { organizationType: "NGOs & Development Orgs" },
    data: { organizationType: "NGOs & Development Organizations" }
  });

  const finalCount = await prisma.partnershipInquiry.count();
  console.log(`Seeding & alignment complete. Total partnerships in database: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
