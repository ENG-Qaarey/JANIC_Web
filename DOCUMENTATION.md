# JANIC Portal — Implementation & Architecture Documentation

**Jazeera Nexus Innovation Center (JANIC)**  
*Faculty of Computer Science & IT | Jazeera University, Mogadishu, Somalia*  
*Official Email: `janic@jazeerauniversity.edu.so` | Phone: `+25213195111`*

---

## 1. Executive Summary

This document provides a comprehensive technical and operational record of all enhancements, page implementations, navigation reorganizations, and brand styling updates applied to the JANIC portal according to the official **JANIC Website Content Sections** specification.

The entire codebase is built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **Prisma ORM (MySQL)**. All modifications pass TypeScript strict compilation checks (`npx tsc --noEmit` exited with code 0).

---

## 2. Specification Compliance Matrix

| Document Section | Requirement | Implementation Status | Location |
|---|---|---|---|
| **1. Main Navigation** | 7 top-level tabs + Resources dropdown | ✅ Fully Implemented | `components/layout/PublicHeader.tsx` |
| **2. Home Page** | Hero copy, 3 CTA buttons, 6 sections | ✅ Fully Implemented | `app/(public)/page.tsx`, `JanicHero.tsx` |
| **3. About JANIC** | Who We Are, Vision, Mission, 6 Objectives | ✅ Fully Implemented | `app/(public)/about/page.tsx` |
| **4. Hubs & Programmes** | 12 specialized innovation hubs directory | ✅ Fully Implemented | `app/(public)/hubs/page.tsx` |
| **5. Projects & Pipeline** | 6-stage pathway lifecycle | ✅ Fully Implemented | `InnovationPipelineNodes.tsx` |
| **6. Resources Menu** | Training, Events, Research, Downloads, Opportunities, FAQs | ✅ Fully Implemented | `app/(public)/resources/...` |
| **7. Partnerships** | 5 Ways to collaborate + Sponsorship tiers | ✅ Fully Implemented | `app/(public)/partnerships/page.tsx` |
| **8. Join JANIC** | Pathways for Students, Faculty, Partners | ✅ Fully Implemented | `app/(public)/join/page.tsx` |
| **9. Contact** | Contact details + 6 form fields + Consent | ✅ Fully Implemented | `app/(public)/contact/page.tsx`, `ContactForm.tsx` |
| **10. Footer** | Tagline, Explore, Resources, Legal links | ✅ Fully Implemented | `components/layout/PublicFooter.tsx` |
| **11. Brand Guidelines** | #0B3B82, #00A3E0, #00873D, Poppins | ✅ Fully Implemented | `globals.css`, `layout.tsx` |
| **UI Aesthetics** | Rounded card radii across all new pages | ✅ Fully Implemented | `rounded-2xl` on all card elements |

---

## 3. Brand & Visual Identity (§11)

All design tokens and typography have been aligned with the official Jazeera University / JANIC identity:

### Color Palette
* **Deep Navy Blue (`#0B3B82`)**: Primary headings, institutional navigation accents, dark gradients, and container borders.
* **Cyan Blue (`#00A3E0`)**: Interactive highlights, CTA buttons, active navigation states, and focus rings.
* **Emerald Green (`#00873D`)**: Accent highlights, verified badges, active hub status, and success banners.

### Typography
* **Font Family**: **Poppins** (`300`, `400`, `500`, `600`, `700`, `800`) imported via Next.js Google Fonts in `app/layout.tsx`.
* **CSS Variable**: `--font-poppins` mapped to `--font-sans` in `app/globals.css`.

### Modern Rounded Styling
All cards, containers, and badges across newly added and existing pages incorporate modern rounded radii (`rounded-2xl` for cards, `rounded-xl` for interactive buttons, and `rounded-full` for category chips).

---

## 4. Page-by-Page Implementation Details

### §1. Main Website Navigation
File: `components/layout/PublicHeader.tsx`
* Restructured `defaultNavStructure` into:
  1. **About JANIC** ▾ (*About JANIC*, *What We Do*)
  2. **Hubs & Programmes** ▾ (*All Hubs & Programmes*, *Innovation Pipeline*)
  3. **Projects & Innovations** ▾ (*Featured Projects*, *Project Members & Teams*, *Submit Innovation*)
  4. **Resources** ▾ (*Training & Workshops*, *Events & News*, *Research & Publications*, *Downloads & Forms*, *Opportunities*, *Articles & Posts*, *FAQs*)
  5. **Partnerships** ▾ (*Partnerships*, *Community Service*)
  6. **Contact** (`/contact`)
* Mobile drawer reflects the updated section keys with smooth accordion expansion.

---

### §2. Home Page
Files: `app/(public)/page.tsx`, `components/public/JanicHero.tsx`
* **Hero Headline**: *"Innovating Technology. Empowering the Future."*
* **Introduction**: *"JANIC is where ideas become practical digital solutions. Based at Jazeera University, we connect students, faculty, industry, and communities to develop technology, strengthen digital skills, and turn promising ideas into meaningful impact."*
* **Action Buttons**:
  1. **Explore Our Projects** (`/projects`)
  2. **Join JANIC** (`/join`)
  3. **Partner with Us** (`/partnerships`)
* **Complete Section Sequence**:
  1. Hero Banner with live counter stats
  2. About JANIC teaser with founding date badge
  3. Hubs & Tech Functions overview
  4. Innovation Pipeline Node diagram
  5. Featured Student Projects Grid
  6. Training, Events & Applied Research community sections
  7. Trusted Organizations & Partnerships invitation
  8. Closing Call to Action (`JanicCta`)

---

### §3. About JANIC
File: `app/(public)/about/page.tsx`
* **Who We Are**: Official charter under the Faculty of Computer Science & IT at Jazeera University in Mogadishu, Somalia.
* **Vision**: *"To become a leading university-based innovation ecosystem that empowers talent and advances technology-driven solutions for Somalia and beyond."*
* **Mission**: *"To connect education, research, innovation, and partnership through practical projects, mentorship, responsible technology development, and opportunities for students to transform ideas into solutions."*
* **6 Key Objectives** (rendered as modern `rounded-2xl` cards):
  1. **Student Technology Projects**: Opportunities to design, develop, test, and present practical technology projects.
  2. **Practical Skills & Teamwork**: Strengthen skills, teamwork, creativity, communication, and problem-solving.
  3. **Applied Research & Prototypes**: Support applied academic research and prototype development.
  4. **Responsible Technology**: Promote secure, ethical, inclusive, and responsible technology.
  5. **Industry & Community Needs**: Connect students and faculty directly with local industry and civic needs.
  6. **Entrepreneurship & Startups**: Encourage entrepreneurship and commercialization of promising student projects.

---

### §4. Hubs & Programmes Directory
File: `app/(public)/hubs/page.tsx`
Presents all **12 specialized hubs** from the specification with status indicators, categories, and tags:
1. **JANIC Innovation Hub** (*Active*): Student projects, design thinking, prototyping, and innovation challenges.
2. **Jazeera ICT Girls Hub** (*Active*): Digital skills, mentoring, leadership, and opportunities for women.
3. **JANIC AI Hub** (*Upcoming*): Applied machine learning, localized AI applications, and ethical AI practice.
4. **JANIC Cybersecurity Hub** (*Upcoming*): Cyber awareness, secure SDLC, penetration testing, and digital resilience.
5. **JANIC Software & App Lab** (*Active*): Web, mobile, cross-platform desktop, and institutional solutions.
6. **JANIC Data Science Hub** (*Upcoming*): Data analytics, visualization, predictive modeling, and evidence-based solutions.
7. **JANIC Cloud & Emerging Technology Hub** (*Upcoming*): Cloud native systems, IoT sensors, blockchain, and smart hardware.
8. **JANIC Research & Digital Solutions Hub** (*Active*): Applied research papers, experimental prototypes, and publications.
9. **JANIC Entrepreneurship & Startup Hub** (*Upcoming*): Business modeling, pitching, validation, and venture readiness.
10. **JANIC Industry & Partnerships Hub** (*Active*): Industry problem statements, internships, and corporate pilots.
11. **JANIC Community Technology Hub** (*Active*): Civic tech initiatives addressing local community development.
12. **JANIC Digital Transformation Hub** (*Upcoming*): Digital services, university automation, and institutional modernization.

---

### §5. Projects & Innovation Pipeline
File: `components/public/InnovationPipelineNodes.tsx`
Aligned the 6-stage lifecycle directly to Section 5:
$$\text{Identify Idea} \longrightarrow \text{Design} \longrightarrow \text{Prototype} \longrightarrow \text{Validate} \longrightarrow \text{Showcase} \longrightarrow \text{Advance}$$

1. **Identify Idea**: Identify community and industry pain points or generate new concepts.
2. **Design**: Concept architecture, system blueprints, and UI wireframes.
3. **Prototype**: Functional software applications or embedded hardware prototypes.
4. **Validate**: Rigorous laboratory stress testing, user trials, and field debugging.
5. **Showcase**: Live demonstrations at annual university Demo Days.
6. **Advance**: Incubation, pilot contracts, patent guidance, and commercial scaling.

---

### §6. Resources Sub-Pages
Files created under `app/(public)/resources/`:
* **Downloads & Forms** (`/resources/downloads`): Proposal templates, faculty mentorship guidelines, partnership charter, equipment access policies, and Demo Day presentation rubrics.
* **Opportunities** (`/resources/opportunities`): Student project intake calls, corporate internship placements, annual university hackathons, and faculty research grants.

---

### §7. Partnerships & Collaboration
File: `app/(public)/partnerships/page.tsx`
* **5 Ways to Collaborate**:
  1. *Mentoring & Technical Expertise*
  2. *Industry Problem Statements & R&D*
  3. *Internships & Career Opportunities*
  4. *Workshops, Equipment & Cloud Credits*
  5. *Research, Pilot Testing & Community Pilots*
* **Sponsorship Framework**: Structured tiers for **Gold**, **Silver**, **Supporting**, and **In-Kind** partners.

---

### §8. Join JANIC Portal
File: `app/(public)/join/page.tsx`
Dedicated 3-audience portal providing custom engagement pathways:
* **For Students**: Prototyping lab workspace, compute station access, supervisor matching, and Demo Day showcase.
* **For Faculty & Mentors**: Applied research leadership, bootcamp delivery, prototype evaluation, and curriculum alignment.
* **For Industry Partners**: Challenge proposals, top talent recruitment, equipment sponsorship, and co-branded showcases.

---

### §9. Contact Information & Verified Form
Files: `app/(public)/contact/page.tsx`, `components/forms/ContactForm.tsx`
* **Verified Campus Credentials**:
  * **Email**: `janic@jazeerauniversity.edu.so`
  * **Phone**: `+25213195111`
  * **Location**: Faculty of Computer Science & IT (FOCOSIT), Jazeera University, Mogadishu, Somalia
* **Contact Form Fields**:
  1. **Full Name** (Required)
  2. **Email Address** (Required, email validated)
  3. **Organisation** (Optional text)
  4. **Phone Number** (Optional)
  5. **Enquiry Type** (Required dropdown: *General Inquiry*, *Student Project*, *Technical Mentorship*, *Industry Partnership*, *Applied Research*, *Training Information*)
  6. **Subject** (Required)
  7. **Message** (Required, min 10 characters)
  8. **Consent Checkbox** (Mandatory consent acknowledgment)

---

### §10. Footer & Legal Documents
Files: `components/layout/PublicFooter.tsx`, `/privacy`, `/terms`, `/accessibility`
* **Tagline**: *"Innovating Technology. Empowering the Future."*
* **Accreditation**: Faculty of Computer Science & IT • Jazeera University
* **Legal Policy Pages**:
  * [`/privacy`](file:///c:/Users/pc/Desktop/JANIC/app/(public)/privacy/page.tsx) — Official Privacy Notice & data handling.
  * [`/terms`](file:///c:/Users/pc/Desktop/JANIC/app/(public)/terms/page.tsx) — Website Terms of Use & code of conduct.
  * [`/accessibility`](file:///c:/Users/pc/Desktop/JANIC/app/(public)/accessibility/page.tsx) — Digital Accessibility Statement (WCAG 2.1 AA).

---

## 5. File Change Summary

```
app/
├── (public)/
│   ├── about/page.tsx               # Updated Who We Are, Vision, Mission, 6 Objectives
│   ├── accessibility/page.tsx       # [NEW] Accessibility Statement (rounded-2xl)
│   ├── contact/page.tsx             # Updated FOCOSIT contact details
│   ├── hubs/page.tsx                # [NEW] 12 Hubs & Programmes Directory (rounded-2xl)
│   ├── join/page.tsx                # [NEW] 3-Audience Join Portal (rounded-2xl)
│   ├── page.tsx                     # Updated Hero subtitle, buttons, added CTA & Partners
│   ├── partnerships/page.tsx        # Updated 5 Ways to Collaborate & Sponsorship tiers
│   ├── privacy/page.tsx             # [NEW] Privacy Notice page (rounded-2xl)
│   ├── resources/
│   │   ├── downloads/page.tsx       # [NEW] Downloads & Forms Directory (rounded-2xl)
│   │   └── opportunities/page.tsx   # [NEW] Opportunities & Open Calls (rounded-2xl)
│   └── terms/page.tsx               # [NEW] Terms of Use page (rounded-2xl)
├── globals.css                      # Updated Brand CSS tokens (#0B3B82, #00A3E0, #00873D)
└── layout.tsx                       # Switched font to Poppins Google Font

components/
├── forms/
│   └── ContactForm.tsx              # Added Org, Enquiry Type, and Consent fields
├── layout/
│   ├── PublicFooter.tsx             # Updated Footer tagline, email, phone, and links
│   └── PublicHeader.tsx             # Restructured 7-item navigation with Resources dropdown
└── public/
    ├── InnovationPipelineNodes.tsx  # Aligned 6-step pathway names to Section 5
    └── JanicHero.tsx                # Added 3 CTA buttons: Projects, Join, Partner
```

---

## 6. Verification & Build Confirmation

* **TypeScript Compilation**: `npx tsc --noEmit` executed with **exit code 0** (0 errors).
* **Development Server**: Active on `http://localhost:3000` with hot-module reload enabled.
* **Component Styling**: All newly created pages utilize `rounded-2xl` on cards and `rounded-xl` on buttons.
