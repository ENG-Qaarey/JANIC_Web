import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapPin, Mail, Phone, Clock, ShieldCheck } from "lucide-react";
import { getSettingsMap } from "@/lib/settings";
import styles from "./ContactSection.module.css";

export const metadata = {
  title: "Contact JANIC",
  description:
    "Get in touch with the Jazeera Nexus Innovation Center at Jazeera University in Mogadishu, Somalia.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialSubject = resolvedParams.subject || "";

  const settings = await getSettingsMap();

  const institutionName = settings["institution_name"] || "Jazeera University";
  const facultyName = settings["faculty_name"] || "Faculty of Computer Science & IT";
  const campusTitle = settings["campus_title"] || `${institutionName} Main Campus`;
  const campusWing = settings["campus_wing"] || `${facultyName}, 2nd Floor Innovation Wing`;
  const campusAddress = settings["campus_address"] || "Faculty of Computer Science & IT (FOCOSIT), Jazeera University, Mogadishu, Somalia";
  const contactEmail = settings["contact_email"] || "janic@jazeerauniversity.edu.so";
  const contactPhone = settings["contact_phone"] || "+25213195111";
  const officeHours = settings["office_hours"] || "Saturday – Thursday: 8:00 AM – 5:00 PM\nFriday: Closed";
  const accreditationText =
    settings["accreditation_text"] ||
    settings["accreditation_badge"] ||
    "Accredited by the Ministry of Education, Culture and Higher Education of the Federal Government of Somalia.";

  const telHref = contactPhone.split("/")[0]?.trim() || contactPhone;

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-clip">
      {/* 1. HERO SECTION (ROUNDED CARD HERO) */}
      <SectionHero
        badge="Get in Touch"
        title="Contact JANIC"
        description="Have questions about student projects, professional training cohorts, or institutional research collaboration? Reach out to our team."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className={styles.section} aria-label="Contact information and message form">
        <div className={styles.container}>
          <div className={styles.card}>
            <ScrollReveal animation="fade-right" duration={850} rootMargin="0px" className={styles.infoEntrance}>
              <aside className={styles.infoPanel} aria-labelledby="contact-information-title">
                <header>
                  <p className={styles.eyebrow}>Contact Information</p>
                  <h2 id="contact-information-title">{campusTitle}</h2>
                  <p className={styles.campus}>{campusWing}</p>
                </header>
                <dl className={styles.details}>
                  <div className={styles.detail}>
                    <span className={styles.icon}><MapPin size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                    <div><dt>Address</dt><dd>{campusAddress}</dd></div>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.icon}><Mail size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                    <div><dt>Email</dt><dd><a href={`mailto:${contactEmail}`}>{contactEmail}</a></dd></div>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.icon}><Phone size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                    <div>
                      <dt>Telephone</dt>
                      <dd>
                        <a href={`tel:${telHref.replace(/[^\d+]/g, "")}`}>{contactPhone}</a>
                      </dd>
                    </div>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.icon}><Clock size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                    <div>
                      <dt>Office Hours</dt>
                      <dd>
                        {officeHours.split("\n").map((line, idx, arr) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </dd>
                    </div>
                  </div>
                </dl>
                <div className={styles.affiliationWrap}>
                  <div className={styles.affiliation}>
                    <ShieldCheck size={23} strokeWidth={1.8} aria-hidden="true" />
                    <div>
                      <h3>Academic Affiliation</h3>
                      <h4>{institutionName}</h4>
                      <p>{accreditationText}</p>
                    </div>
                  </div>
                </div>
              </aside>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" duration={850} delay={120} rootMargin="0px" className={styles.formEntrance}>
              <div className={styles.formPanel}>
                <header className={styles.formHeader}>
                  <p className={styles.eyebrow}>Send a Message</p>
                  <h2>How Can We Collaborate?</h2>
                  <p>Complete the form below. A JANIC department coordinator will respond within 1–2 business days.</p>
                </header>
                <ContactForm initialSubject={initialSubject} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
