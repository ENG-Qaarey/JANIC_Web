"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";
import styles from "./JanicAbout.module.css";

const features = [
  { title: "Applied Research Excellence", description: "Solving complex problems through targeted technical research." },
  { title: "Innovation Support", description: "Creating an environment for ideas and prototypes." },
  { title: "Skill Transformation", description: "Bridging the gap between education and industrial requirements." },
  { title: "Regional Impact", description: "Helping students and researchers thrive." },
];

export function JanicAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll<HTMLElement>("[data-about-reveal]");
    if (!elements || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(element => {
      element.setAttribute("data-about-ready", "true");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="janic-about-title">
      <div className={styles.container}>
        <div className={styles.visual}>
          <div data-about-reveal className={styles.mainEntrance}>
            <div className={styles.photo}>
              <Image src="/images/janic-building-lobby.jpg" alt="Jazeera University building in Mogadishu" fill sizes="(max-width: 767px) 85vw, (max-width: 1023px) 65vw, 42vw" className={styles.image} />
            </div>
          </div>
          <div data-about-reveal className={styles.secondaryEntrance}>
            <div className={styles.photo}>
              <Image src="/images/Events.jpg" alt="JANIC technology innovation and workshop" fill sizes="(max-width: 767px) 48vw, (max-width: 1023px) 38vw, 25vw" className={styles.image} />
            </div>
          </div>
          <div data-about-reveal className={styles.badgeEntrance}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}><CalendarDays size={27} strokeWidth={1.8} aria-hidden="true" /></span>
              <div><strong>2021</strong><span>Founded</span></div>
            </div>
          </div>
          <div className={styles.dots} aria-hidden="true" />
        </div>
        <div className={styles.content}>
          <div data-about-reveal className={styles.eyebrow}>About the Center</div>
          <h2 data-about-reveal id="janic-about-title" className={styles.title}>Empowering Digital<br className={styles.titleBreak} /> Evolution in the Region</h2>
          <p data-about-reveal className={styles.description}>
            Jazeera Nexus Innovation Center (JANIC) is at the forefront of technological advancement, dedicated to fostering a culture of innovation and excellence. We serve as a catalyst for growth, providing the tools and environment needed for students and researchers to thrive.
          </p>
          <ul className={styles.features}>
            {features.map((feature, index) => (
              <li key={feature.title} data-about-reveal style={{ transitionDelay: `${index * 120}ms` }} className={styles.feature}>
                <span className={styles.check}><CheckCircle2 size={20} strokeWidth={1.8} aria-hidden="true" /></span>
                <div><h3>{feature.title}</h3><p>{feature.description}</p></div>
              </li>
            ))}
          </ul>
          <div data-about-reveal className={styles.buttonEntrance}>
            <Link href="/about" className={styles.button}>Discover Our Story <ArrowRight size={21} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
