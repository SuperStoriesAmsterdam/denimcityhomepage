# PRD — Denim City Amsterdam Homepage

## 1. Project Identity

| Field | Value |
|-------|-------|
| Project name | Denim City Amsterdam Homepage |
| Client | Denim City / House of Denim Foundation |
| Working directory | `~/Desktop/Builds/denimcityhomepage` |
| Type | Static website (Set B — no FastAPI) |
| Deployment | Coolify (static file serving) |
| Route | Route A (direct build) + Route B option (Webflow handoff) |

---

## 2. What Exists Already

### Master documents (do NOT overwrite)
- **`DESIGN (1).md`** — 337-line visual specification for the Denim City AMS homepage. This is the master design document. It defines emotional intention, color system, typography (Version A: Apercu Pro / Version B: Topol + Apercu), spatial logic, all 9 page blocks, photography brief, component defaults, and constraints. Read this first.
- **`WORKFLOW.md`** — Team workflow: roles (designer, PM, Peter, Webflow dev), brief format, Figma API integration, output formats, handoff rules, naming conventions, asset delivery checklist.

### Template documents (in `Website/` subfolder — copy to project root)
- **`CLAUDE.md`** — Build rules for static website projects: stack, code quality, typography, responsive, images, animation, performance, accessibility, annotation tool, design tokens, variants, Webflow handoff, session checklist, hygiene pass.
- **`DESIGN.md`** — Blank onboarding template (not needed here — the DC master doc already exists).
- **`BRANDGUIDE.md`** — Blank brand system template (fill in from DESIGN (1).md values).
- **`DESIGNWORKFLOW.md`** — Renamed copy of WORKFLOW.md for the template set.

### Existing build files
- `homepage-a-fade.html` — Version A with scroll fade effect
- `homepage-b-spread.html` — Version B with spread effect
- `homepage-c-ticker.html` — Version C with ticker effect
- `homepage-dc.html`, `homepage-original.html`, `homepage-v2.html`, `homepage.html` — earlier iterations
- `hero-a-fade.html`, `hero-b-spread.html`, `hero-c-ticker.html` — hero variants
- `index.html` — entry/overview page
- `overview.html` — variant overview
- `style.css` — monolithic stylesheet (needs splitting per CLAUDE.md rules)
- `fonts/` — 21 font files (needs audit: only .woff2 should remain)
- `Beeld/` — image assets folder

---

## 3. What Needs To Be Built

### Phase 1 — Project setup

1. **Copy `Website/CLAUDE.md` to project root** as the active CLAUDE.md
2. **Rename `DESIGN (1).md` to `DESIGN.md`** — remove the space and parentheses
3. **Fill in `BRANDGUIDE.md`** from the values in DESIGN.md (color system, typography, spacing, component defaults, photography rules, constraints)
4. **Create folder structure** per CLAUDE.md section 3:
   - `css/` — split `style.css` into `tokens.css`, `reset.css`, `typography.css`, `layout.css`, `components.css`
   - `js/` — annotation tool
   - `tokens/` — `tokens.json`
   - `docs/` — `animations.md`, `CHANGES.md`
5. **Audit `fonts/`** — remove everything that isn't `.woff2`. Only keep weights actually used.
6. **Create `.gitignore`** and `.env.example` (for Figma token)

### Phase 2 — Annotation API (`annotations.superstories.nl`)

A shared microservice on Hetzner via Coolify. One deploy, serves all website projects. Same stack as SaaS products.

**Stack:** FastAPI + PostgreSQL + Docker (via Coolify on existing Hetzner server)

**Endpoints:**
```
GET    /annotations?project={id}&page={path}     → all annotations for a page
POST   /annotations                               → create annotation
PUT    /annotations/{id}                           → update (resolve, edit)
GET    /export?project={id}&target=claude          → download @claude JSON
GET    /export?project={id}&target=designer        → download @designer JSON
DELETE /annotations/{id}                           → delete annotation
```

**Data model:**
```
Annotation
├── id              (int, auto)
├── project         (str — "denimcity", "clientX", etc.)
├── page            (str — "/index.html", "/about.html")
├── block           (str — "hero", "store", "academy", "general")
├── target          (str — "claude" or "designer")
├── priority        (str — "high", "medium", "low")
├── text            (str — the feedback)
├── name            (str — who left it)
├── x               (int — horizontal position as % of viewport)
├── y               (int — vertical position in px from top)
├── status          (str — "open" or "resolved")
├── resolved_in     (date, nullable)
├── created_at      (datetime)
```

**Auth:** Simple API key in header (`X-Annotation-Key`). One key per project, set in Coolify env vars. Not user auth — just spam prevention.

**Deployment:**
1. Create repo `superstories/annotations-api`
2. Copy SaaS CLAUDE.md + SUPERSTORIES-PLATFORM.md into it
3. Build FastAPI app with the endpoints above
4. Deploy via Coolify on existing Hetzner server
5. Point `annotations.superstories.nl` to it

### Phase 3 — Annotation tool (`js/annotate.js`)

Build once, reuse across all website projects. Talks to the annotation API — no localStorage.

**Features:**
- **Pencil icon** fixed bottom-right to toggle annotation mode
- **Click anywhere** to leave feedback
- **Two audiences via tag:**
  - `@claude` — feedback for Claude Code (blue dots) → Claude reads, processes, resolves
  - `@designer` — feedback for external designer (red dots) → designer sees them live on the same URL
- **Block detection** — auto-detects which section (hero, store, academy, etc.) via `data-block`, section ID, or class name
- **Priority** — high / medium / low
- **Side panel** (Alt+P) — list view of all annotations, grouped by audience
- **Export** — download JSON per audience via API
- **Resolve** — click a marker to mark as resolved (syncs to all viewers in real-time)
- **Keyboard shortcuts** — Alt+A toggle mode, Alt+P toggle panel, Escape close
- **Shared state** — Peter in Amsterdam and designer in Lissabon see the same annotations on the live Coolify URL

**Configuration per project** (in the `<script>` tag or a small config block):
```html
<script>
    window.SS_ANNOTATIONS = {
        api: 'https://annotations.superstories.nl',
        project: 'denimcity',
        key: 'project-api-key-here'
    };
</script>
<script src="js/annotate.js" defer></script>
```

After building, copy `annotate.js` back to `AssetsforAll/Website/js/` as the reusable version.

### Phase 4 — Update DESIGNWORKFLOW.md

Add a **Feedback** section to the workflow document describing:
- How annotation mode works
- The `@claude` / `@designer` distinction
- That annotations are shared in real-time — Peter and remote designers see the same markers on the live URL
- How Claude Code reads and processes `@claude` annotations at session start
- How `@designer` annotations are visible to the designer without any export step
- The resolve flow

### Phase 5 — Update CLAUDE.md

Add instruction that Claude Code at session start:
1. Fetches open `@claude` annotations via the API: `GET /annotations?project={id}&target=claude&status=open`
2. Processes them in priority order (high → medium → low)
3. Marks each as resolved after implementing via `PUT /annotations/{id}`
4. Ignores `@designer` annotations entirely

### Phase 6 — Homepage build

With the infrastructure in place, build the actual homepage following DESIGN.md block-by-block:
1. Hero (Block 1)
2. What this place is (Block 2)
3. The Place / Mission (Block 3)
4. Store (Block 4)
5. Academy (Block 5)
6. Lab (Block 6)
7. Tours (Block 7)
8. Agenda (Block 8)
9. Footer (Block 9)

Two typography variants: Version A (Apercu Pro throughout) and Version B (Topol + Apercu Pro). Both specified in DESIGN.md.

---

## 4. Design System Summary

Extracted from DESIGN.md for quick reference:

### Colors (AMS palette only)
```css
--color-primary:    #1200CC;   /* DC Blue */
--color-secondary:  #FFE0DB;   /* DC Pink — page background */
--color-accent:     #FF2B2B;   /* DC Red — AMS tag, hover, key phrases */
--color-surface:    #F5D0CB;   /* deeper pink — cards, panels */
--color-text:       #1200CC;
--color-text-muted: #1200CC99; /* blue at 60% */
--color-border:     #1200CC;
```

Pink is the neutral. No white backgrounds. No greys. Max 3 colors per viewport.

### Typography
- Display: Topol Regular OR Apercu Pro Black (two variants)
- Body/UI/Nav: Apercu Pro Regular (constant across both)
- Metadata: Apercu Mono Regular
- Hero: `clamp(5rem, 12vw, 10rem)`
- Fluid type via `clamp()`, 8px spacing grid

### Layout
- 45% text / 55% photography
- Full bleed, no max-width container
- Rule lines as section separators (`1px solid --color-border`)
- Rotated vertical section labels (left edge)

### Components
- Arrow links: `→ Link text`, uppercase, `--text-sm`, hover → accent
- Location pills: `border-radius: 999px`, active AMS = red filled
- Agenda cards: `--color-surface` bg, `border: 1px solid`, `border-radius: 0`
- No filled buttons anywhere on the homepage

### Constraints (What NOT To Do)
- No white backgrounds
- No border-radius on structural elements
- No drop shadows, no gradients
- No sustainability vocabulary
- No typewriter effects or entrance animations on text
- No centered wordmark — top-left, bleeds to edge
- No Apercu Mono for body copy
- No fourth color

---

## 5. Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | CSS custom properties + Grid + Flexbox |
| Interaction | Vanilla JavaScript (annotation tool, nav toggle, scroll effects) |
| Fonts | Self-hosted .woff2 (Topol, Apercu Pro, Apercu Mono) |
| Deployment | Coolify (static) |
| Feedback | Annotation tool (`js/annotate.js`) → FastAPI API on Hetzner (`annotations.superstories.nl`) |

No frameworks on the website itself. No build tools. No dependencies. The annotation API is a separate microservice.

---

## 6. What This Project Does NOT Include

- No CMS / backend / database
- No e-commerce / checkout
- No blog
- No user accounts or login
- No contact form with server-side processing (use `mailto:` or external form service)
- No SP (São Paulo) or IST (Istanbul) location pages — only AMS
- No animation libraries

---

*Handover document — take this to the denimcityhomepage project chat.*
*Claude Code reads CLAUDE.md + DESIGN.md + BRANDGUIDE.md + DESIGNWORKFLOW.md and builds from there.*
