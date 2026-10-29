import React from "react";
import { SectionHero } from "@/components/layout/SectionHero";
import { ScrollReveal } from "@/components/public/ScrollReveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapPin, Mail, Phone, Clock, ShieldCheck, Share2 } from "lucide-react";
import {
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
  GitHubIcon,
} from "@/components/ui/social-icons";
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

  const siteName = settings["site_name"] || "Jazeera Nexus Innovation Center (JANIC)";
  const institutionName = settings["institution_name"] || "Jazeera University";
  const facultyName =
    settings["faculty_name"] || "Faculty of Computer Science & IT (FOCOSIT)";
  const campusWing = settings["campus_wing"] || `${facultyName}, 2nd Floor Innovation Wing`;
  const campusAddress =
    settings["campus_address"] ||
    "Faculty of Computer Science & IT (FOCOSIT), Jazeera University, Mogadishu, Somalia";
  const campusLocation =
    settings["campus_location"] || "Jazeera University Main Campus, KM4, Mogadishu, Somalia";
  const contactEmail = settings["contact_email"] || "janic@jazeerauniversity.edu.so";
  const contactPhone = settings["contact_phone"] || "+252613195111";
  const officeHours = settings["office_hours"] || "Saturday – Thursday: 8:00 AM – 5:00 PM\nFriday: Closed";
  const accreditationText =
    settings["accreditation_text"] ||
    settings["accreditation_badge"] ||
    "Accredited by the Ministry of Education, Culture and Higher Education of the Federal Government of Somalia.";

  // Verified official links only — the block is hidden until an admin sets at least one.
  const socialLinks = [
    { key: "linkedin_url", label: "LinkedIn", href: (settings["linkedin_url"] || "").trim(), Icon: LinkedInIcon },
    { key: "twitter_url", label: "X (Twitter)", href: (settings["twitter_url"] || "").trim(), Icon: TwitterIcon },
    { key: "facebook_url", label: "Facebook", href: (settings["facebook_url"] || "").trim(), Icon: FacebookIcon },
    { key: "github_url", label: "GitHub", href: (settings["github_url"] || "").trim(), Icon: GitHubIcon },
  ].filter((s) => s.href.length > 0);

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
                  <h2 id="contact-information-title">{siteName}</h2>
                  <p className={styles.campus}>{facultyName}</p>
                  <p className={styles.campus}>
                    {institutionName} · Mogadishu, Somalia
                  </p>
                </header>
                <dl className={styles.details}>
                  <div className={styles.detail}>
                    <span className={styles.icon}><MapPin size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                    <div>
                      <dt>Campus Location</dt>
                      <dd>
                        {campusLocation}
                        <br />
                        {campusWing}
                      </dd>
                    </div>
                  </div>
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
                  {socialLinks.length > 0 && (
                    <div className={styles.detail}>
                      <span className={styles.icon}><Share2 size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                      <div>
                        <dt>Social Media</dt>
                        <dd>
                          <div className={styles.socialRow}>
                            {socialLinks.map(({ key, label, href, Icon }) => (
                              <a
                                key={key}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                              </a>
                            ))}
                          </div>
                        </dd>
                      </div>
                    </div>
                  )}
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
