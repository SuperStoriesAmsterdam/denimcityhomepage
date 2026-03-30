# SuperStories — Design & Build Workflow

## How we work

We build production-ready websites using Claude Code. Designs come from Figma. The output is either deployed directly (Route A) or handed off to a Webflow developer (Route B).

```
Route A: Direct build (smaller sites, design system in place)
Designer → Claude Code → production code → Coolify/hosting

Route B: Webflow handoff (client needs CMS/self-management)
Designer → Claude Code → reference build + specs → Webflow dev → Webflow
```

---

## Roles & responsibilities

### Designer
- Delivers final designs in Figma
- Shares the Figma file link with Peter (view access minimum)
- Uses Figma Variables or Tokens Studio for design tokens (colors, type, spacing)
- Reviews the live reference build and provides feedback via the annotation tool or Figma comments
- When receiving a build for production polish: refines execution, does not redesign (see Handoff rules below)

### Project Manager
- Writes the brief for each page/section (see Brief format below)
- Coordinates between designer, Peter, and Webflow dev
- Manages the live review URL and collects sign-off

### Peter (Creative Director / Claude Code)
- Imports the design via Figma API
- Builds the reference site in Claude Code
- Generates design tokens, animation specs, and asset exports
- Deploys to Coolify for review

### Webflow Developer (Route B only)
- Opens the live reference site as the single source of truth
- Inspects values via browser DevTools
- Uses the design tokens file to set up Webflow Variables
- Recreates animations using Webflow Interactions based on the animation specs
- Does NOT need Figma access — the reference build replaces it

---

## Brief format

When requesting a page build, provide:

```
Page: [name]
Purpose: [what it does, who it's for]
Feeling: [what should a visitor feel within 10 seconds]
Client type: [innovative / corporate / cultural / institutional]
Sections: [list of content blocks, in order]
Content: [copy doc or link]
Figma: [Figma file URL]
Reference: [any inspiration or existing pages to match]
Animations: [describe any motion, or "match homepage"]
Notes: [anything else]
```

---

## Before building

Every build requires two files in the project root:

- **`BRANDGUIDE.md`** — The brand system. Colors, typography, component patterns, tone of voice. This is the constraint set that keeps every page on-brand.
- **`DESIGN.md`** — The design workflow and creative intent. How the brand translates into digital decisions: layout philosophy, interaction patterns, editorial direction.

If either file is missing, do not start the build. Run the `DESIGN.md` onboarding procedure first. These files are the bridge between the designer's intent and the code — without them, the build is technically correct but creatively hollow.

---

## Figma API integration

The Figma API is used to import design tokens and inspect components directly from the designer's file. This eliminates manual handoff and ensures values match the source.

### Setup
The API requires a Personal Access Token stored in `.env`:
```
FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxxxxxx
```
This file is gitignored and never committed. Each team member who needs API access generates their own token via Figma → Settings → Personal Access Tokens.

### How it's used
1. Designer shares the Figma file link
2. Peter provides the link to Claude Code
3. Claude Code reads the file via the API: colors, typography, spacing, component structure
4. Values are extracted into `tokens/tokens.json`
5. The build uses these tokens as CSS custom properties — no manual color-picking or guesswork

### What the API can and cannot do
- **Can**: read all design properties, export images, list components and styles
- **Cannot**: write back to Figma (create/move/edit frames)

---

## Output formats

Every build produces:

### 1. Live reference site
Deployed on Coolify. The primary deliverable. Everyone reviews here.

### 2. Design tokens (`tokens/tokens.json`)
Extracted from Figma and used in the build. A flat, readable JSON file:
```json
{
  "color": {
    "primary": "#0000A5",
    "accent": "#FF2B2B",
    "bg": "#FFE0DB",
    "surface": "#F5D0CB",
    "white": "#FFFFFF"
  },
  "font": {
    "display": "Topol Bold",
    "body": "Apercu Pro",
    "mono": "Apercu Mono"
  },
  "spacing": {
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "48px",
    "xl": "96px"
  }
}
```
The Webflow dev uses this to set up Webflow Variables.

### 3. Animation specs (`docs/animations.md`)
One entry per animation:
```
## Hero — Scroll fade
Trigger: scroll (0vh – 80vh range)
Element: .hero__title-main
Property: color
From: #0B0B3B (raw indigo)
To: #0066FF (electric blue)
Easing: linear
Duration: scroll-driven (no fixed duration)
Note: simulates denim fading process
```
The Webflow dev recreates these using Webflow Interactions.

The prototype may or may not include animations. Check `docs/animations.md` — if it exists and contains specs, the animations are implemented in the build. If not, the designer or Webflow dev proposes and implements them during the polish phase.

### 4. Production code
Clean HTML/CSS/JS. No frameworks, no dependencies. The Webflow dev can inspect any value via browser DevTools on the live site.

### 5. Changelog (`docs/CHANGES.md`)
Updated with every push. The Webflow dev checks this first — no need to diff the entire site.
```
## 2026-03-25

### Homepage
- Hero: increased title font-size from 200px to 260px
- Hero: fixed scroll-fade not triggering in Safari
- Footer: updated Istanbul address

### About
- New section: Team grid with hover bios
```
One entry per push. Sections grouped by page. Short, scannable, no fluff.

### 6. Annotation tool
Built into every page. A pencil icon (bottom-right corner) activates annotation mode. Click anywhere on the page to leave a note with your name. Annotations are stored in the browser and can be exported as JSON.

This is included by default in every build. The designer, PM, or client uses it to leave feedback directly on the live site — no screenshots or separate tools needed.

---

## Review & feedback

1. Build is deployed to Coolify
2. PM shares the URL with designer and stakeholders
3. Feedback via:
   - **Annotation tool** (built into every page, pencil icon bottom-right)
   - **Figma comments** on the original design
   - **Direct message** to Peter for quick fixes
4. Peter processes feedback in Claude Code
5. Updated build is pushed and live within minutes

---

## Handoff rules: Claude Code → Designer

When a build is handed off to a designer for production polish, this section is their assignment. The brandguide is not a suggestion. It is the floor.

### What the designer receives
- A working HTML/CSS prototype (not a wireframe, not a sketch)
- `BRANDGUIDE.md` — the brand system (their constraint set)
- `DESIGN.md` — the creative intent (their north star)
- All fonts, images, and tokens

### What we expect
1. **Polish, don't redesign** — layout, hierarchy, and color are set. Refine execution, don't reconsider direction. If you believe a structural decision is wrong, flag it with a specific reason before changing it.
2. **Micro-interactions and transitions** — hover states on all interactive elements, smooth transitions (default: 200ms ease), nothing slower without reason. Scroll-triggered effects: propose before implementing. They must serve the content, not perform on top of it. Do not add animations that run on page load without user interaction.
3. **Responsive refinement** — verify at 375px, 768px, 1280px, 1440px. Typography must remain in proportion (`clamp()` values). Photography must crop correctly (subject visible). Fix what breaks, don't restructure.
4. **Cross-browser testing** — Chrome, Safari (macOS + iOS), Firefox, Edge, Android Chrome (all latest).
5. **Performance** — compress images (WebP where possible), verify font loading (`font-display: swap`, no FOUT), remove unused CSS. Lighthouse: aim for 90+ on Performance, Accessibility, Best Practices.
6. **Accessibility** — descriptive `alt` text, WCAG AA contrast, keyboard navigation, visible focus states.

### What the designer must not do
- Introduce new fonts, colors, or decorative elements outside the brandguide
- Change section order or page structure without sign-off
- Add load animations that delay content visibility
- Silently fix things that seem wrong — flag them first
- Interpret silence as approval

### What the designer delivers back
- Cleaned, commented HTML and CSS
- Updates applied to the original Figma file (not a separate copy) at 1440px desktop + 375px mobile, using the font files and color variables from the brandguide
- Design tokens as JSON
- Compressed image assets in the correct folder structure
- A note on any deviations from the prototype and why

### Flagging issues
The designer batches questions into one consolidated list:
- What the issue is
- Where it occurs (section, breakpoint, device)
- What they propose
- What the alternative is

All questions go to Peter. Do not deliver without a review round.

---

## Folder structure

Every project on Desktop/Builds follows this structure:

```
ProjectName/
│
├── BRANDGUIDE.md             # Brand system — read first
├── DESIGN.md                 # Design workflow and creative intent
│
├── fonts/                    # Web fonts (.woff2 only)
│   ├── {family}-Regular.woff2
│   ├── {family}-Bold.woff2
│   ├── {family}-Italic.woff2
│   └── {family}-Mono.woff2
│
├── img/                      # Production images (optimized)
│   ├── hero/
│   │   ├── hero-home-01.jpg
│   │   └── hero-about-01.jpg
│   ├── content/
│   │   ├── store-interior-01.jpg
│   │   └── team-portrait-01.jpg
│   ├── icons/
│   │   ├── icon-arrow-right.svg
│   │   └── icon-menu.svg
│   └── logos/
│       ├── logo-primary.svg
│       ├── logo-mono-light.svg
│       └── logo-mono-dark.svg
│
├── tokens/
│   └── tokens.json           # Design tokens from Figma
│
├── docs/
│   ├── animations.md         # Animation specs for Webflow dev
│   ├── CHANGES.md            # Changelog per push
│   └── WORKFLOW.md           # This file
│
├── scripts/
│   └── upload_media.py       # CDN upload script
│
├── .env                      # API keys (gitignored)
├── .gitignore
│
├── index.html                # Entry point / overview
├── homepage-{variant}.html   # Page builds
└── {page}.html               # Additional pages
```

---

## Naming conventions

### Fonts
```
{family}-{weight}.woff2

Examples:
Topol-Bold.woff2
Apercu-Pro-Regular.woff2
Apercu-Pro-Bold.woff2
Apercu-Pro-Italic.woff2
Apercu-Mono.woff2
```
Only `.woff2` — no `.otf`, `.ttf`, or `.woff` in the project folder.

### Images
```
{context}-{subject}-{number}.{ext}

Examples:
hero-home-01.jpg
content-store-interior-01.jpg
content-education-workshop-01.jpg
content-team-portrait-01.jpg
press-dezeen-feature-01.jpg
```
- Always lowercase, hyphens, no spaces
- Number suffix for multiples (`-01`, `-02`)
- Use `.jpg` for photos, `.png` for transparency, `.webp` for optimized delivery
- Maximum 200KB per image for web (resize/compress before adding)

### Icons
```
icon-{name}.svg

Examples:
icon-arrow-right.svg
icon-menu.svg
icon-close.svg
icon-instagram.svg
icon-play.svg
```
- Always SVG
- Optimized (no Figma metadata)
- Single color, using `currentColor` for fill

### Logos
```
logo-{variant}.svg

Examples:
logo-primary.svg          # Full color, default
logo-mono-light.svg       # Single color, for dark backgrounds
logo-mono-dark.svg        # Single color, for light backgrounds
logo-icon.svg             # Icon/mark only, no wordmark
```

### Copy
```
copy-{page}-{lang}.md

Examples:
copy-homepage-en.md
copy-homepage-tr.md
copy-about-en.md
```
Plain markdown. One file per page per language. Headings match section names in the build.

---

## Asset delivery checklist

When a designer or PM delivers assets for a build, this is what we need:

- [ ] Figma file link (shared with Peter)
- [ ] Fonts as `.woff2` (or confirm they're already in the project)
- [ ] Logo SVGs (primary + mono variants)
- [ ] Hero images (high-res, we optimize)
- [ ] Content images (high-res, we optimize)
- [ ] Icons as SVG (or confirm we use an existing set)
- [ ] Copy document per page
- [ ] Brief per page (see Brief format above)

---

*This document is the single source of truth for how we build. If something is unclear, ask Peter.*
