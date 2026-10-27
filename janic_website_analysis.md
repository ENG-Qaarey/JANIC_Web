# JANIC Website — Full Gap Analysis & Implementation Plan

## 1. Current State of the Codebase

The project is a **Next.js 16** app (App Router) with:

| Layer | Technology |
|---|---|
| Framework | Next.js 16.3.8, React 19, TypeScript |
| Styling | Tailwind CSS 4 + CSS Modules |
| Database | MySQL via Prisma 6 |
| Auth | Clerk (OAuth/Google/GitHub) + custom JWT (`lib/auth/jwt`) |
| UI | Radix primitives, Lucide icons, Framer Motion, Recharts, Sonner toasts |
| Font | Plus Jakarta Sans (the doc asks for **Poppins or Inter**) |
| File uploads | Local (`/public/uploads`) |
| CMS settings | `SiteSetting` model (key/value) — hero text, nav links, etc. are DB-driven |

### Existing Public Routes (`app/(public)/…`)

| Route | Status | Doc Section Match |
|---|---|---|
| `/` (Home) | ✅ Exists | §2 Home — partial match |
| `/about` | ✅ Exists | §3 About JANIC — partial match |
| `/innovation-hub` | ✅ Exists | §4 Hubs — **very** partial (single page, not 12 hubs) |
| `/projects` | ✅ Exists | §5 Projects — good match |
| `/project-members` | ✅ Exists | Supplements §5 |
| `/research` | ✅ Exists | §6 Resources → Research & Publications |
| `/training` | ✅ Exists | §6 Resources → Training & Workshops |
| `/events` | ✅ Exists | §6 Resources → Events & News |
| `/partnerships` | ✅ Exists | §7 Partnerships — partial match |
| `/community-services` | ✅ Exists | Not in doc (extra) |
| `/contact` | ✅ Exists | §9 Contact — partial match |
| `/faq` | ✅ Exists | §6 Resources → FAQs |
| `/submit-innovation` | ✅ Exists | Supports §8 Join JANIC |
| `/posts` | ✅ Exists | Not explicitly in doc |
| `/search` | ✅ Exists | Not in doc (bonus) |
| `/what-we-do` | ✅ Exists | Not in doc (overlaps About) |
| `/login`, `/register` | ✅ Exists | Auth flows |

### Existing Admin Routes (`app/admin/…`)

Full CRUD panels for: dashboard, projects, project-members, events, research, training, partnerships, messages, submissions, media, settings, team. **This admin backend already covers most content management needs.**

### Existing Database Models (Prisma)

`Project`, `ProjectMember`, `ProjectGalleryItem`, `TrainingProgram`, `ResearchPaper`, `Event`, `InnovationSubmission`, `PartnershipInquiry`, `ContactMessage`, `TeamMember`, `Media`, `SiteSetting`, `ServiceCategory`, `Service`, `ServiceRequest`, + engagement models (comments, likes, ratings).

---

## 2. Gap Analysis — Section by Section

### §1 Navigation Structure

| Spec Requirement | Current State | Gap |
|---|---|---|
| Home, About JANIC, Hubs & Programmes, Projects & Innovations, Resources (dropdown), Partnerships, Contact | INNOVATION (dropdown), RESEARCH (dropdown), ABOUT (dropdown), PARTNERSHIPS (dropdown), CONTACT | **Navigation structure differs significantly.** Must restructure `defaultNavStructure` in [`PublicHeader.tsx`](file:///c:/Users/pc/Desktop/JANIC/components/layout/PublicHeader.tsx#L34-L78). |
| Resources dropdown: Training, Events & News, Research, Downloads & Forms, Opportunities, FAQs | Training/Research/Events scattered under INNOVATION and RESEARCH dropdowns | **Need a unified "Resources" dropdown with 6 sub-items.** |
| "Hubs & Programmes" top-level nav | No dedicated Hubs listing page | **Need new `/hubs` route** with 12 hub cards. |

> [!IMPORTANT]
> The navigation is currently DB-overridable via `nav_links` setting, but the **default fallback** in code must change.

---

### §2 Home Page

| Spec Element | Current Component | Gap |
|---|---|---|
| Hero headline: *"Innovating Technology. Empowering the Future."* | [`JanicHero`](file:///c:/Users/pc/Desktop/JANIC/components/public/JanicHero.tsx) — DB-driven `hero_title` | ✅ **Already matches** (default value matches doc). |
| Hero intro text | `hero_subtitle` setting | ⚠️ Current default text differs from doc; update default or DB value. |
| 3 CTA buttons: Explore Our Projects / Join JANIC / Partner with Us | Hero has CTAs but different wording | ⚠️ Update button labels & links. |
| Featured Projects section | [`JanicPortfolio`](file:///c:/Users/pc/Desktop/JANIC/components/public/JanicPortfolio.tsx) | ✅ Exists but hardcoded fallback projects. Needs dynamic selection. |
| Hubs & Programmes teaser | [`JanicFunctions`](file:///c:/Users/pc/Desktop/JANIC/components/public/JanicFunctions.tsx) | ⚠️ Exists as "Functions" — rename and match 12-hub structure. |
| Training & Events section | [`JanicCommunitySections`](file:///c:/Users/pc/Desktop/JANIC/components/public/JanicCommunitySections.tsx) | ✅ Exists (events + research). Needs "Training" addition. |
| Latest News section | Not present as standalone section | 🔴 **Missing.** Need a news/announcements component. |
| Partnerships section | Not present on homepage | 🔴 **Missing.** Need a partnership invite section. |
| Call to Action | [`JanicCta`](file:///c:/Users/pc/Desktop/JANIC/components/public/JanicCta.tsx) exists (used on About page) | ⚠️ Exists but not imported on homepage. Need to add. |

---

### §3 About JANIC

| Spec Element | Current State | Gap |
|---|---|---|
| Who We Are text | [`AboutPage`](file:///c:/Users/pc/Desktop/JANIC/app/(public)/about/page.tsx) has history section | ⚠️ Text content needs updating to match doc exactly. |
| Vision statement | Exists in About page | ⚠️ Compare and update text. |
| Mission statement | Exists | ⚠️ Compare and update text. |
| 6 Objectives (bullet list) | Exists as "Core Values" | 🔴 **Mismatch.** Doc has 6 specific objectives, code has 6 "Core Values". Either add objectives as separate section or replace. |
| Team / Leadership section | [`MentorsLeadershipSection`](file:///c:/Users/pc/Desktop/JANIC/components/public/MentorsLeadershipSection.tsx) | ✅ Exists. |

---

### §4 Hubs & Programmes (12 Hubs)

This is the **largest gap** in the project.

| Item | Status |
|---|---|
| Dedicated `/hubs` listing page (all 12 hubs) | 🔴 **Does not exist.** |
| Individual hub detail pages (`/hubs/[slug]`) | 🔴 **Does not exist.** |
| Database model for hubs | 🔴 **No `Hub` model in Prisma.** |
| Admin CRUD for managing hubs | 🔴 **Does not exist.** |
| "Active/Proposed" status toggle | 🔴 **Not modelled.** |

**12 hubs required:**

1. JANIC Innovation Hub
2. Jazeera ICT Girls Hub
3. JANIC AI Hub
4. JANIC Cybersecurity Hub
5. JANIC Software & App Lab
6. JANIC Data Science Hub
7. JANIC Cloud & Emerging Technology Hub
8. JANIC Research & Digital Solutions Hub
9. JANIC Entrepreneurship & Startup Hub
10. JANIC Industry & Partnerships Hub
11. JANIC Community Technology Hub
12. JANIC Digital Transformation Hub

> [!WARNING]
> The doc says: *"Publish them as active only after JANIC leadership confirms their status."* The system must support a `status` field (proposed/active) that controls public visibility.

---

### §5 Projects & Innovations

| Spec Element | Current State | Gap |
|---|---|---|
| Project listing + detail pages | ✅ `/projects` and `/projects/[slug]` exist | |
| Project profile fields (title, description, problem, solution, tech, status, team, images, demo) | ✅ `Project` model covers most fields | ⚠️ Missing: `intendedUsers`, `achievements`, `nextSteps`, `projectPathway` stage. |
| Project status enum: proposed, in development, prototype, pilot, completed | ✅ Has `ContentStatus` (DRAFT/PUBLISHED/ARCHIVED) | 🔴 **Mismatch.** Need a separate `projectStage` field for the 6-stage pathway, independent of publication status. |
| Project pathway visualization | [`InnovationPipelineNodes`](file:///c:/Users/pc/Desktop/JANIC/components/public/InnovationPipelineNodes.tsx) | ⚠️ Exists but labels may differ from doc: *Identify/Create → Design → Prototype → Validate → Showcase → Advance*. |
| Publication note (permission checks) | No enforcement in code | ⚠️ Governance is manual (admin publishes), which satisfies the doc's intent. |

---

### §6 Resources (Dropdown Menu)

| Sub-page | Current Route | Gap |
|---|---|---|
| Training & Workshops | `/training` ✅ | |
| Events & News | `/events` ✅ | ⚠️ "News" is partially covered by `/posts`; could merge or add news filtering. |
| Research & Publications | `/research` ✅ | |
| Downloads & Forms | 🔴 **Does not exist** | Need `/resources/downloads` route + possibly a `Download` model or static page. |
| Opportunities | 🔴 **Does not exist** | Need `/resources/opportunities` route (internships, competitions, calls). |
| FAQs | `/faq` ✅ | |

> [!NOTE]
> The doc specifies a **single "Resources" dropdown** that collapses on mobile. The current nav splits these items across multiple top-level dropdowns. Restructuring the nav will solve this.

---

### §7 Partnerships

| Spec Element | Current State | Gap |
|---|---|---|
| Partnerships page | [`/partnerships`](file:///c:/Users/pc/Desktop/JANIC/app/(public)/partnerships/page.tsx) ✅ | |
| "Ways to collaborate" list | Need to verify content matches doc's 5 bullets | ⚠️ Compare text. |
| Sponsorship levels (Gold/Silver/Supporting/In-kind) | 🔴 **Not implemented.** | Need sponsorship section (hidden until approved). |
| Partner logos display | 🔴 **No partner logo grid.** | Need a partner/sponsor model or static config. |

---

### §8 Join JANIC

| Spec Element | Current State | Gap |
|---|---|---|
| Dedicated "Join JANIC" page | 🔴 **Does not exist as standalone page** | Need `/join` route with 3 audience tabs (Students / Faculty / Partners). |
| Student: Explore hubs, workshops, application | `/submit-innovation` partially covers this | ⚠️ Need broader "Join" landing. |
| Faculty/Mentors section | 🔴 Not present | |
| Partners section | Links to `/partnerships` would suffice | ⚠️ Cross-link. |

---

### §9 Contact

| Spec Element | Current State | Gap |
|---|---|---|
| Contact page | `/contact` ✅ | |
| Official email: `janic@jazeerauniversity.edu.so` | Footer shows `info@janic.edu.so` (DB-driven) | ⚠️ Update DB setting or default. |
| Phone: `+25213195111` | Footer shows `+252 61 555 1234` | ⚠️ Update. |
| Contact form fields: Name, Email, Org, Enquiry type, Message, Consent | `ContactMessage` model has: name, email, phone, subject, message | ⚠️ Missing: `organization`, `enquiryType` dropdown, `consent` checkbox. |
| Social media links | Not present on contact page | ⚠️ Add social links (placeholder until verified). |

---

### §10 Footer

| Spec Element | Current State | Gap |
|---|---|---|
| JANIC tagline | ✅ [`PublicFooter`](file:///c:/Users/pc/Desktop/JANIC/components/layout/PublicFooter.tsx) | ⚠️ Tagline text differs. |
| Footer links matching doc | Current links don't match doc's list | ⚠️ Update link structure. |
| Privacy Notice / Terms / Accessibility | 🔴 Not present | Need placeholder pages (hidden until approved). |

---

### §11 Brand Guidelines

| Spec | Current | Gap |
|---|---|---|
| Deep Navy Blue `#0B3B82` | `--color-janic-navy: #08245C` | ⚠️ **Different shade.** Update CSS token. |
| Cyan Blue `#00A3E0` | `--color-janic-blue: #0875D1` | ⚠️ **Different shade.** Update CSS token. |
| Emerald Green `#00873D` | `--color-janic-green: #059669` | ⚠️ **Different shade.** Update CSS token. |
| Font: Poppins or Inter | Plus Jakarta Sans | ⚠️ **Different font.** Change in [`layout.tsx`](file:///c:/Users/pc/Desktop/JANIC/app/layout.tsx#L8-L12). |

---

## 3. Summary: What Exists vs. What's Missing

### ✅ Already Built (needs content/text updates only)
- Home page skeleton (Hero, Featured Projects, Functions, CTA, Community)
- About page (history, vision, mission, values, team)
- Projects listing + detail pages
- Training listing + detail
- Research listing + detail
- Events listing + detail
- Partnerships page
- Contact page + form
- FAQ page
- Admin panel (full CRUD for all entities)
- Auth system (Clerk + JWT)
- Media management
- DB settings CMS

### ⚠️ Exists but Needs Modification
1. **Navigation structure** — restructure to match doc's 7-item nav with Resources dropdown
2. **Brand colours** — update 3 CSS tokens to match doc hex values
3. **Font** — switch from Plus Jakarta Sans to Poppins or Inter
4. **Hero CTA buttons** — update labels and link targets
5. **Homepage sections** — add missing News, Partnerships, and CTA sections
6. **About page** — update text content (objectives vs core values)
7. **Contact form** — add `organization`, `enquiryType`, `consent` fields
8. **Footer** — update tagline, links, and add legal placeholders
9. **Project model** — add `projectStage` field for the 6-stage pathway
10. **Innovation Pipeline** — update node labels to match doc

### 🔴 Does Not Exist (New Development Required)
1. **Hubs & Programmes system** (Prisma model, CRUD, listing page, detail pages, admin panel)
2. **"Join JANIC" page** (`/join` with 3 audience tracks)
3. **Downloads & Forms page** (`/resources/downloads`)
4. **Opportunities page** (`/resources/opportunities`)
5. **Sponsorship section** on Partnerships page
6. **Partner logos grid**
7. **Privacy Notice / Terms / Accessibility** placeholder pages

---

## 4. Recommended Implementation Plan

### Phase 1 — Brand & Navigation Alignment (1–2 days)
> Low risk, high visual impact. Sets the foundation.

- [ ] Update CSS colour tokens in [`globals.css`](file:///c:/Users/pc/Desktop/JANIC/app/globals.css) to `#0B3B82`, `#00A3E0`, `#00873D`
- [ ] Switch font from Plus Jakarta Sans to **Inter** (or Poppins) in [`layout.tsx`](file:///c:/Users/pc/Desktop/JANIC/app/layout.tsx)
- [ ] Restructure [`defaultNavStructure`](file:///c:/Users/pc/Desktop/JANIC/components/layout/PublicHeader.tsx#L34-L78) to: Home | About JANIC | Hubs & Programmes | Projects & Innovations | Resources ▾ | Partnerships | Contact
- [ ] Update [`PublicFooter`](file:///c:/Users/pc/Desktop/JANIC/components/layout/PublicFooter.tsx) links and tagline

### Phase 2 — Content Updates (2–3 days)
> Update existing pages to match document text.

- [ ] Homepage: update hero subtitle, CTA buttons, add News section, add Partnerships teaser, add CTA component
- [ ] About page: replace "Core Values" with the 6 Objectives from the doc; update Who We Are / Vision / Mission text
- [ ] Contact page: add `organization`, `enquiryType` dropdown, `consent` checkbox to the form; update `ContactMessage` model
- [ ] Partnerships page: add "Ways to collaborate" content matching doc's 5 bullets
- [ ] Update DB settings defaults (email, phone, tagline)

### Phase 3 — Hubs & Programmes (3–5 days)
> Biggest new feature. Requires end-to-end work.

- [ ] Add `Hub` model to Prisma schema:
  ```prisma
  model Hub {
    id          String        @id @default(cuid())
    name        String
    slug        String        @unique
    tagline     String        @db.Text
    description String        @db.Text
    icon        String?
    coverImage  String?
    status      ContentStatus @default(DRAFT)  // DRAFT = proposed, PUBLISHED = active
    order       Int           @default(0)
    isActive    Boolean       @default(false)
    createdAt   DateTime      @default(now())
    updatedAt   DateTime      @updatedAt
  }
  ```
- [ ] Run migration: `npx prisma migrate dev --name add-hub-model`
- [ ] Create `HubRepository` + `HubService`
- [ ] Create API routes: `app/api/admin/hubs/…`
- [ ] Create admin CRUD page: `app/admin/hubs/…`
- [ ] Create public pages: `app/(public)/hubs/page.tsx` (listing) + `app/(public)/hubs/[slug]/page.tsx` (detail)
- [ ] Seed the 12 hubs from the document (status = DRAFT until confirmed)
- [ ] Update homepage `JanicFunctions` component to pull from `Hub` model

### Phase 4 — New Pages (2–3 days)
> Fill the remaining content gaps.

- [ ] Create `/join` page with 3 tabbed sections (Students / Faculty & Mentors / Partners)
- [ ] Create `/resources/downloads` page (static or model-backed)
- [ ] Create `/resources/opportunities` page
- [ ] Create placeholder legal pages: `/privacy`, `/terms`, `/accessibility` (hidden from footer until approved)
- [ ] Add sponsorship section to Partnerships page (hidden until approved via DB toggle)

### Phase 5 — Project Model Enhancement (1–2 days)
> Align project data with document requirements.

- [ ] Add `projectStage` enum to Prisma: `IDEA | DESIGN | PROTOTYPE | VALIDATE | SHOWCASE | ADVANCE`
- [ ] Add fields: `intendedUsers`, `achievements`, `nextSteps` to `Project` model
- [ ] Update project admin form + public detail page
- [ ] Update `InnovationPipelineNodes` labels to match doc

### Phase 6 — Polish & QA (2–3 days)

- [ ] Responsive testing (mobile dropdown for Resources)
- [ ] Dark mode consistency with new brand colours
- [ ] SEO: verify meta tags, OG images, sitemap includes new routes
- [ ] Accessibility audit (WCAG contrast ratios with new colours)
- [ ] Content review against the document's "Items to Confirm" checklist

---

## 5. Estimated Total Effort

| Phase | Effort | Priority |
|---|---|---|
| Phase 1 — Brand & Nav | 1–2 days | 🔴 Critical |
| Phase 2 — Content Updates | 2–3 days | 🔴 Critical |
| Phase 3 — Hubs & Programmes | 3–5 days | 🟡 High |
| Phase 4 — New Pages | 2–3 days | 🟡 High |
| Phase 5 — Project Model | 1–2 days | 🟢 Medium |
| Phase 6 — Polish & QA | 2–3 days | 🟢 Medium |
| **Total** | **~11–18 working days** | |

---

## 6. Risks & Decisions Needed Before Implementation

| # | Decision | Who Decides |
|---|---|---|
| 1 | **Font choice**: Poppins or Inter? (Inter is more neutral and already a Tailwind default; Poppins is warmer.) | JANIC Leadership / Design |
| 2 | **Hub status**: Which of the 12 hubs should be published as "active" immediately? | JANIC Leadership |
| 3 | **Colour migration**: Changing the 3 brand colours will affect every page. Confirm the exact hex values. | JANIC Leadership |
| 4 | **"What We Do" page**: Not in the doc. Keep, merge into About, or remove? | ICT Team |
| 5 | **"Community Services" page**: Not in the doc. Keep as bonus or remove? | ICT Team |
| 6 | **Posts/Blog**: Not mentioned in the doc. Keep as part of "Events & News" or remove? | ICT Team |
| 7 | **Downloads & Forms**: Static content page or DB-managed with file uploads? | ICT Team |
| 8 | **Sponsorship levels**: The doc says "publish only after formal approval." Implement the UI now (hidden) or defer entirely? | JANIC Leadership |
| 9 | **Contact email domain**: Doc says `@jazeerauniversity.edu.so`, current system uses `@janic.edu.so`. Which is canonical? | JANIC Admin |
| 10 | **Privacy Notice / Terms**: Draft these documents or just create empty placeholder pages? | Legal / JANIC Leadership |

---

## 7. Architecture Notes

The existing architecture is **well-suited** for all the required changes:

- **Repository pattern** ([`repositories/`](file:///c:/Users/pc/Desktop/JANIC/repositories)) makes adding `HubRepository` straightforward.
- **Service layer** ([`services/`](file:///c:/Users/pc/Desktop/JANIC/services)) cleanly separates business logic.
- **Admin panel** already has patterns for CRUD — new hub/opportunity admin pages follow the same structure.
- **SiteSetting** model allows toggling visibility of sponsorship, legal pages, etc. without code deploys.
- **CSS Module pattern** used by all public components means colour changes propagate via CSS variables — no component-level changes needed for brand alignment.

> [!TIP]
> The document is a **content specification**, not a redesign. The existing UI architecture, component library, and admin system are reusable. The primary work is **content alignment, navigation restructuring, and the new Hub entity**.
