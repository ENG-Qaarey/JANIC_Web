"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./JanicCta.module.css";

interface CtaLink { href: string; label: string; }
interface JanicCtaProps {
  eyebrow?: string;
  description?: React.ReactNode;
  primary?: CtaLink;
  secondary?: CtaLink;
}

const defaultDescription = <>Join our vibrant ecosystem of developers, researchers, and visionaries.<br />Together, we can create solutions for a brighter, more inclusive future.</>;

/** The Home page's closing "Get Involved" section, reused across public pages. */
export function JanicCta({
  eyebrow = "Get Involved",
  description = defaultDescription,
  primary = { href: "/submit-innovation", label: "Get Started Today" },
  secondary,
}: JanicCtaProps) {
  const titleId = useId();
  const copyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const copy = copyRef.current;
    if (!copy || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        copy.setAttribute("data-visible", "true");
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    copy.setAttribute("data-ready", "true");
    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <svg className={styles.waves} viewBox="0 0 1440 500" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 180 C290 150 330 500 720 500 C1030 500 1190 230 1440 80 L1440 500 L0 500Z" fill="currentColor" opacity=".4" />
        <path d="M0 230 C300 170 360 500 720 500 C1010 500 1160 300 1440 170 L1440 220 C1170 310 1020 500 720 500 C340 500 300 220 0 290Z" fill="currentColor" opacity=".6" />
        <path d="M0 395 C290 310 420 520 720 500 C1040 490 1170 300 1440 290 L1440 340 C1180 345 1040 500 720 500 C400 530 290 360 0 450Z" fill="currentColor" opacity=".45" />
        <path d="M0 180 C290 150 330 500 720 500 C1030 500 1190 260 1440 170" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div ref={copyRef} className={styles.copy}>
        <svg className={styles.rays} viewBox="0 0 70 26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 3L17 20M35 2V19M62 3L53 20" /></svg>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={titleId} className={styles.title}>Have an Idea? Let&apos;s Turn It Into<br />Innovation.</h2>
        <p className={styles.intro}>{description}</p>
        <div className={styles.actions}>
          <Link href={primary.href} className={styles.button}>{primary.label} <ArrowRight size={18} aria-hidden="true" /></Link>
          {secondary && <Link href={secondary.href} className={`${styles.button} ${styles.outline}`}>{secondary.label}</Link>}
        </div>
      </div>
    </section>
  );
}
