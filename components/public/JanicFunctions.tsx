"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Binary, Cloud, Code2, Settings, Shield, UsersRound } from "lucide-react";
import styles from "./JanicFunctions.module.css";

const functions = [
  { title: "Technology & Platform Development", description: "Building scalable web applications, mobile platforms, and enterprise software solutions tailored for local and international markets.", icon: Code2, variant: "technology" },
  { title: "Cybersecurity & Trust", description: "Ensuring digital assets are protected through rigorous security protocols and auditing.", icon: Shield, variant: "security" },
  { title: "Cloud Infrastructure", description: "Optimizing deployments for scalability and performance across multi-cloud environments.", icon: Cloud },
  { title: "AI & Machine Learning", description: "Implementing intelligent automation and predictive analytics to drive business insights.", icon: Binary },
  { title: "Embedded Systems", description: "Developing hardware-software integrations for smart city and IoT applications.", icon: Settings },
  { title: "Research & Innovation Support", description: "Providing tools, mentorship, and resources to support student and academic research projects.", icon: UsersRound },
];

export function JanicFunctions() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll<HTMLElement>("[data-function-reveal]");
    if (!elements || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(element => {
      element.setAttribute("data-function-ready", "true");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="janic-functions-title">
      <div className={styles.container}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Our Functions</p>
          <h2 id="janic-functions-title">Comprehensive <span>Tech Solutions</span></h2>
          <p className={styles.intro}>We provide a full spectrum of services from fundamental development to advanced AI implementations.</p>
        </header>
        <div className={styles.grid}>
          {functions.map(({ title, description, icon: Icon, variant }, index) => (
            <div key={title} data-function-reveal className={styles.entrance} style={{ transitionDelay: `${(index % 3) * 120}ms` }}>
              <article className={`${styles.card} ${variant ? styles[variant] : styles.white}`}>
                <div className={styles.cardTop}>
                  <span className={styles.icon}><Icon size={28} strokeWidth={1.8} aria-hidden="true" /></span>
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{title}</h3>
                <p className={styles.description}>{description}</p>
                {variant === "technology" && <ul className={styles.tags} aria-label="Development specialties"><li>Full Stack</li><li>Mobile App</li><li>Cloud Native</li></ul>}
                {variant === "security" && <Link href="/what-we-do" className={styles.learnMore}><span className={styles.arrow}><ArrowRight size={21} aria-hidden="true" /></span>Learn more</Link>}
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
