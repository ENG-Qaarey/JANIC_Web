"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectMediaCover } from "./ProjectMediaCover";
import styles from "./JanicPortfolio.module.css";

interface ProjectCard {
  title: string;
  summary: string;
  category: string;
  heroImage: string;
  slug: string;
  videoUrl?: string | null;
}

interface JanicPortfolioProps {
  cards: ProjectCard[];
  spotlight?: unknown;
}

export function JanicPortfolio({ cards }: JanicPortfolioProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll<HTMLElement>("[data-portfolio-reveal]");
    if (!elements || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(element => { element.setAttribute("data-ready", "true"); observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="janic-portfolio-title">
      <div className={styles.container}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Projects Portfolio</p>
          <h2 id="janic-portfolio-title">Innovation <span>in Action</span></h2>
          <p className={styles.intro}>Explore real projects developed at JANIC. From AI and robotics to digital platforms,<br className={styles.desktopBreak} /> our work turns ideas into real-world impact.</p>
        </header>
        <div className={styles.grid}>
          {cards.map((card, index) => (
            <div key={`${card.slug}-${index}`} data-portfolio-reveal className={styles.cardEntrance} style={{ transitionDelay: `${index * 120}ms` }}>
              <Link href={`/projects/${card.slug}`} className={styles.card}>
                <div className={styles.mediaFrame}>
                  <ProjectMediaCover videoUrl={card.videoUrl} imageUrl={card.heroImage} alt={card.title} />
                  <span className={styles.category}>{card.category}</span>
                </div>
                <div className={styles.cardCopy}>
                  <h3>{card.title}</h3>
                  <p className={styles.description}>{card.summary}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardAction}>View Solution</span>
                    <span className={styles.cardArrow} aria-hidden="true"><ArrowRight size={18} /></span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className={styles.portfolioButton}>
          <Link href="/projects" className={styles.button}>View Full Portfolio <ArrowRight size={19} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
