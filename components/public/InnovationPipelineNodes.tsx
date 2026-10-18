"use client";

import { useEffect, useRef } from "react";
import { Lightbulb, Layers, Cpu, CheckCircle2, Award, Rocket } from "lucide-react";
import styles from "./InnovationPipelineNodes.module.css";

const pipelineSteps = [
  { number: "01", name: "Innovation Project", tagline: "Identify real-world problems and formulate hypotheses.", deliverable: "Problem Brief", icon: Lightbulb, position: 250 },
  { number: "02", name: "Design", tagline: "Develop system architecture, blueprints, and UI specs.", deliverable: "System Spec", icon: Layers, position: 205 },
  { number: "03", name: "Build", tagline: "Engineer functional hardware prototypes and codebases.", deliverable: "Working MVP", icon: Cpu, position: 270 },
  { number: "04", name: "Test", tagline: "Rigorous laboratory validation, debugging, and trials.", deliverable: "Field Validated", icon: CheckCircle2, position: 215 },
  { number: "05", name: "Showcase", tagline: "Demonstrate innovations live at Annual Demo Day.", deliverable: "Demo Pitch", icon: Award, position: 275 },
  { number: "06", name: "Scale", tagline: "Incubate, partner, file IP, and deploy to market.", deliverable: "Market Launch", icon: Rocket, position: 195 },
];

export function InnovationPipelineNodes() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const timeline = section?.querySelector<HTMLElement>("[data-timeline]");
    const steps = section?.querySelectorAll<HTMLElement>("[data-step]");
    if (!timeline || !steps || !("IntersectionObserver" in window)) return;

    const timelineObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        timeline.setAttribute("data-started", "true");
        timelineObserver.disconnect();
      }
    }, { threshold: 0.4 });
    const stepObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    timeline.setAttribute("data-ready", "true");
    timelineObserver.observe(timeline);
    steps.forEach(step => { step.setAttribute("data-ready", "true"); stepObserver.observe(step); });
    return () => { timelineObserver.disconnect(); stepObserver.disconnect(); };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="innovation-lifecycle-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>Innovation Lifecycle</p>
          <h2 id="innovation-lifecycle-title">Ideas. Prototypes. <span>Possibilities.</span></h2>
          <p className={styles.intro}>The JANIC Innovation Hub is where radical ideas meet rigorous engineering.<br className={styles.desktopBreak} /> We provide a sandbox for student-led innovation and industrial prototyping.</p>
        </div>
        <div data-timeline className={styles.timeline}>
          <svg className={styles.curve} viewBox="0 0 1200 480" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -40 180 C 10 230 45 250 100 250 C 200 280 220 205 300 205 C 390 205 410 270 500 270 C 590 270 610 215 700 215 C 790 215 810 275 900 275 C 990 275 1010 195 1100 195 C 1160 150 1220 160 1250 180" fill="none" stroke="#eaf6ff" strokeOpacity={0.2} strokeWidth="65" />
            <path d="M -40 180 C 10 230 45 250 100 250 C 200 280 220 205 300 205 C 390 205 410 270 500 270 C 590 270 610 215 700 215 C 790 215 810 275 900 275 C 990 275 1010 195 1100 195 C 1160 150 1220 160 1250 180" fill="none" stroke="#2795ff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol className={styles.steps}>
            {pipelineSteps.map(({ number, name, tagline, deliverable, icon: Icon, position }, index) => (
              <li key={number} data-step className={`${styles.step} ${index % 2 ? styles.above : styles.below}`} style={{ "--node-y": `${position}px`, "--step-delay": `${((index + 0.5) / pipelineSteps.length) * 3000}ms` } as React.CSSProperties}>
                <div className={styles.stepBody}>
                  <span className={styles.icon}><Icon size={34} strokeWidth={1.8} aria-hidden="true" /></span>
                  <div className={styles.content}>
                    <span className={styles.number} aria-hidden="true">{number}</span>
                    <h3>{name}</h3>
                    <p>{tagline}</p>
                    <span className={styles.deliverable}>{deliverable}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
