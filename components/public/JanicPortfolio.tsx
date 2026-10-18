"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChartNoAxesColumnIncreasing, Users, Zap } from "lucide-react";
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
interface FeaturedProject extends Omit<ProjectCard, "category"> {
  stats: { value: string; label: string }[];
}
interface JanicPortfolioProps { cards: ProjectCard[]; spotlight: FeaturedProject; }
const statIcons = [Zap, Users, ChartNoAxesColumnIncreasing];

export function JanicPortfolio({ cards, spotlight }: JanicPortfolioProps) {
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
                  <div className={styles.summaryRow}>
                    <p>{card.summary}</p>
                    <span className={styles.cardArrow} aria-hidden="true"><ArrowRight size={20} /></span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className={styles.portfolioButton}>
          <Link href="/projects" className={styles.button}>View Full Portfolio <ArrowRight size={19} aria-hidden="true" /></Link>
        </div>
        <article className={styles.featured} aria-labelledby="janic-featured-project-title">
          <div data-portfolio-reveal className={styles.featuredImageEntrance}>
            <div className={styles.featuredImage}>
              <ProjectMediaCover videoUrl={spotlight.videoUrl} imageUrl={spotlight.heroImage} alt={spotlight.title} />
            </div>
          </div>
          <div data-portfolio-reveal className={styles.featuredCopy}>
            <p className={styles.featuredEyebrow}>Featured Project</p>
            <h3 id="janic-featured-project-title">{spotlight.title}</h3>
            <p className={styles.featuredSummary}>{spotlight.summary}</p>
            <dl className={styles.stats}>
              {spotlight.stats.map((stat, index) => {
                const Icon = statIcons[index % statIcons.length];
                return <div className={styles.stat} key={stat.label}>
                  <span className={styles.statIcon}><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></span>
                  <div><dt>{stat.label}</dt><dd>{stat.value}</dd></div>
                </div>;
              })}
            </dl>
            <Link href={`/projects/${spotlight.slug}`} className={styles.button}>View Case Study <ArrowRight size={19} aria-hidden="true" /></Link>
          </div>
        </article>
      </div>
    </section>
  );
}
