import React from "react";
import Image from "next/image";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
// Share Home's visual system without changing its component or styles.
import design from "@/components/public/JanicHero.module.css";
import styles from "./SectionHero.module.css";

interface SectionHeroProps {
  badge?: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  image?: string | null;
}

export function SectionHero({
  badge,
  title,
  description,
  breadcrumbs,
  children,
  image,
}: SectionHeroProps) {
  return (
    <section className={`${design.hero} ${styles.section}`} aria-label={title} data-section-hero>
      <div className={design.background} aria-hidden="true">
        <Image src={image?.trim() || "/images/janic-glass-office.png"} alt="" fill sizes="100vw" preload className={design.image} />
      </div>
      <div className={design.wash} aria-hidden="true" />
      <div className={`${design.dots} ${styles.dots}`} aria-hidden="true" />
      <div className={`${design.orbit} ${styles.orbit}`} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.container}>
        <div className={styles.copy}>
          {breadcrumbs && (
            <div className={styles.breadcrumbs}><Breadcrumbs items={breadcrumbs} /></div>
          )}
          {badge && <p className={`${design.eyebrow} ${styles.badge}`}>{badge}</p>}
          <h1 className={`${design.title} ${styles.title}`}>{title}</h1>
          <p className={`${design.description} ${styles.description}`}>{description}</p>
          {children && <div className={styles.actions}>{children}</div>}
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={`${design.glass} ${styles.glass}`}>
            <span>Education</span><span className={styles.arrow}>→</span>
            <span>Innovation</span><span className={styles.arrow}>→</span>
            <span>Impact</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero(props: SectionHeroProps) {
  return <SectionHero {...props} />;
}
