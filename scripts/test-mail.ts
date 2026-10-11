import {
  notifyNewContactMessage,
  notifyNewPartnershipInquiry,
  notifyNewServiceRequest,
  notifyServiceRequestStatusChange,
  verifyMailTransport,
} from "../lib/mailer";

async function main() {
  const v = await verifyMailTransport();
  console.log("verify:", v.ok ? "OK" : "FAIL", "-", v.message);
  if (!v.ok) process.exit(1);

  const contact = await notifyNewContactMessage({
    id: "test-1",
    name: "Test Contact",
    email: "contact@example.com",
    phone: "+252 61 000 1111",
    subject: "SMTP smoke test",
    message: "This verifies the contact notification template renders and delivers.",
  });
  console.log("contact message:", contact);

  const partnership = await notifyNewPartnershipInquiry({
    id: "test-2",
    organizationName: "Acme Tech Ltd",
    organizationType: "Tech Company / Industry",
    contactName: "Amina Yusuf",
    email: "amina@acme.example",
    phone: "+252 61 222 3333",
    collaborationArea: "Student Incubation & Mentorship",
    proposalDetails: "We would like to explore a joint incubation programme with JANIC students.",
  });
  console.log("partnership inquiry:", partnership);

  const service = await notifyNewServiceRequest({
    id: "test-3",
    requestNumber: "JANIC-CS-2026-9999",
    organizationName: "HornAfrik Foundation",
    organizationType: "NONPROFIT",
    organizationCategory: "FOUNDATION_CHARITY",
    contactPerson: "Mohamed Ali",
    email: "mohamed@hornafrik.example",
    phone: "+252 61 444 5555",
    country: "Somalia",
    city: "Mogadishu",
    serviceCategoryName: "Technology Training and Capacity Building",
    serviceName: "Digital Literacy Training",
    requestTitle: "Digital literacy bootcamp for youth group",
    description:
      "We run a youth centre and would like a structured digital literacy programme for 40 young adults.",
    budget: "$3,000",
  });
  console.log("service request:", service);

  const status = await notifyServiceRequestStatusChange({
    requestNumber: "JANIC-CS-2026-9999",
    toStatus: "UNDER_REVIEW",
    toEmail: "mohamed@hornafrik.example",
    notes: "Thank you — our team is reviewing your request.",
  });
  console.log("status change:", status);
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});