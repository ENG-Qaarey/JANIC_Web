const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../node_modules/@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding exact 7 registered core partners...");

  const exactPartners = [
    {
      organizationName: "SMEs & Startups",
      organizationType: "SMEs & Startups",
      contactName: "JANIC SME Alliance Desk",
      email: "smes@janic.so",
      phone: "+252 61 5001234",
      collaborationArea: "Fintech & Mobile Payments incubation",
      proposalDetails: "Core registered partnership alliance providing student startups with mobile wallet integrations and API payment gateways.",
      status: "CLOSED",
      adminNotes: "Official Registered Partner #1"
    },
    {
      organizationName: "Women-Owned Businesses",
      organizationType: "Women-Owned Businesses",
      contactName: "JANIC Women Entrepreneurship Desk",
      email: "women@janic.so",
      phone: "+252 61 5112233",
      collaborationArea: "E-commerce enablement & digital literacy",
      proposalDetails: "Core registered partnership alliance empowering women-owned local crafts businesses with digital marketplace platforms.",
      status: "CLOSED",
      adminNotes: "Official Registered Partner #2"
    },
    {
      organizationName: "Universities & Education",
      organizationType: "Universities & Education",
      contactName: "JANIC Academic Affairs Desk",
      email: "academic@janic.so",
      phone: "+252 61 5223344",
      collaborationArea: "Joint research & student exchange programs",
      proposalDetails: "Core registered academic alliance establishing collaborative IoT research labs and student exchange curricula.",
      status: "CLOSED",
      adminNotes: "Official Registered Partner #3"
    },
    {
      organizationName: "NGOs & Development Organizations",
      organizationType: "NGOs & Development Organizations",
      contactName: "JANIC Development Coalition Desk",
      email: "ngo@janic.so",
      phone: "+252 61 5334455",
      collaborationArea: "Digital skills training for youth",
      proposalDetails: "Core registered development alliance executing nationwide coding bootcamps for underprivileged youth.",
      status: "CLOSED",
      adminNotes: "Official Registered Partner #4"
    },
    {
      organizationName: "Government Institutions",
      organizationType: "Government Institutions",
      contactName: "JANIC Public Policy Desk",
      email: "gov@janic.so",
      phone: "+252 61 5445566",
      collaborationArea: "National digital transformation policy & tech hubs",
      proposalDetails: "Core registered institutional alliance partnering on national hackathons and open government data initiatives.",
      status: "CLOSED",
      adminNotes: "Official Registered Partner #5"
    },
    {
      organizationName: "Technology Companies",
      organizationType: "Technology Companies",
      contactName: "JANIC Industry Alliance Desk",
      email: "tech@janic.so",
      phone: "+252 61 5556677",
      collaborationArea: "Enterprise cloud infrastructure & API integrations",
      proposalDetails: "Core registered corporate alliance offering cloud hosting credits and enterprise software architecture masterclasses.",
      status: "CLOSED",
      adminNotes: "Official Registered Partner #6"
    },
    {
      organizationName: "Researchers & Professionals",
      organizationType: "Researchers & Professionals",
      contactName: "JANIC Research Fellowship Desk",
      email: "research@janic.so",
      phone: "+252 61 5667788",
      collaborationArea: "Machine learning research & open data initiatives",
      proposalDetails: "Core registered professional alliance publishing joint research papers on AI and Natural Language Processing.",
      status: "CLOSED",
      adminNotes: "Official Registered Partner #7"
    }
  ];

  const coreNames = exactPartners.map(p => p.organizationName);
  for (const name of coreNames) {
    await prisma.partnershipInquiry.deleteMany({
      where: { organizationName: name }
    });
  }

  for (const p of exactPartners) {
    await prisma.partnershipInquiry.create({ data: p });
    console.log(`Created registered partner: ${p.organizationName}`);
  }

  const finalCount = await prisma.partnershipInquiry.count();
  console.log(`Setup complete. Total partnerships in database: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
