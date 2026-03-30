# CLAUDE.md — SuperStories Website Build

This file is read by Claude Code at the start of every session. It defines how Claude Code should build, review, and maintain code in this repository. Follow all instructions in this file unless explicitly overridden in the current session.

Reference documents (read these before writing any code):
- `BRANDGUIDE.md` — the brand system (colors, typography, components, constraints)
- `DESIGN.md` — the creative intent and visual specification
- `DESIGNWORKFLOW.md` — the team workflow, roles, and deliverables

**Read order:** DESIGN.md first (understand what the site should feel like), then BRANDGUIDE.md (the constraint set), then DESIGNWORKFLOW.md (how the team works). If any of these files is missing, do not start the build — run the onboarding procedure in the DESIGN.md template first.

---

## 1. Who You Are Working With

You are working with a non-developer creative director. He directs, reviews, and deploys. He does not write code himself. This has two implications:

**When building:** Write code that is as readable as possible. A designer or Webflow developer will inspect your output in browser DevTools. Use named CSS custom properties, not raw hex values. Use semantic class names, not utilities. Comment any non-obvious CSS technique.

**When something is wrong:** Explain what was wrong and what you changed — in plain language. The creative director needs enough vocabulary to describe visual problems to you in future sessions.

---

## 2. The Stack

Website builds are deliberately simple. No build tools, no bundlers, no frameworks unless the project explicitly requires one.

### Default stack (static websites)

| Layer | Technology | Do not substitute with |
|-------|-----------|----------------------|
| Markup | Semantic HTML5 | React, Vue, any JS framework |
| Styling | CSS custom properties + Grid + Flexbox | Tailwind, SCSS preprocessors, CSS-in-JS |
| Interaction | Vanilla JavaScript (if needed) | jQuery, Alpine, any JS library |
| Fonts | Self-hosted .woff2 | Google Fonts CDN, Adobe Fonts, any external font service |
| Deployment | Coolify (static file serving) | Netlify, Vercel, GitHub Pages |

### When a framework IS appropriate

| Situation | Use | Why |
|-----------|-----|-----|
| Client needs a CMS | Webflow (Route B handoff) | Client can edit content themselves |
| Marketing site with blog | Astro or Next.js (static export) | Markdown content, static output, no runtime JS |
| Complex interactive app | React + Vite | Only when the interactivity genuinely requires it |

If the project needs a framework, state which one and why in the first session. The creative director approves the choice.

---

## 3. Project Structure

```
ProjectName/
├── CLAUDE.md                ← this file
├── BRANDGUIDE.md            ← brand system (colors, type, components)
├── DESIGN.md                ← visual specification and creative intent
├── WORKFLOW.md              ← team roles, deliverables, review process
│
├── index.html               ← entry point
├── [page].html              ← additional pages
├── [page]-[variant].html    ← design variants (A/B exploration)
│
├── css/
│   ├── tokens.css           ← CSS custom properties from tokens.json
│   ├── reset.css            ← minimal reset (box-sizing, margin, font-smoothing)
│   ├── typography.css       ← @font-face declarations, type scale
│   ├── layout.css           ← grid systems, section patterns
│   └── components.css       ← buttons, cards, pills, nav, footer
│
├── js/                      ← only if needed
│   └── main.js              ← scroll handlers, nav toggle, annotation tool
│
├── fonts/                   ← .woff2 only, self-hosted
│   ├── {family}-Regular.woff2
│   └── {family}-Bold.woff2
│
├── img/                     ← production images (gitignored if using R2)
│   ├── hero/
│   ├── content/
│   ├── icons/
│   └── logos/
│
├── tokens/
│   └── tokens.json          ← design tokens extracted from Figma
│
├── docs/
│   ├── animations.md        ← animation specs for Webflow dev
│   └── CHANGES.md           ← changelog per push
│
├── scripts/
│   └── upload_media.py      ← R2 upload script
│
├── .env                     ← Figma API token (gitignored)
├── .env.example
└── .gitignore
```

### CSS file organization

Split CSS into purpose-based files. Do not use a single monolithic stylesheet. Each file has one job:

- **tokens.css** — generated from `tokens.json`. Only `:root` custom properties. No selectors.
- **reset.css** — `box-sizing: border-box`, zero margins, `font-display: swap`. Maximum 30 lines.
- **typography.css** — `@font-face` declarations, type scale classes, font loading strategy.
- **layout.css** — grid definitions, section patterns, responsive breakpoints.
- **components.css** — interactive elements: buttons, cards, pills, nav, footer.

---

## 4. Code Quality — Standing Rules

### HTML
- Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. No `<div>` soup.
- Every `<img>` has a descriptive `alt` attribute. Not "image" — describe what's in the photo.
- Every `<img>` has explicit `width` and `height` attributes to prevent layout shift.
- Every page has `<html lang="...">` set correctly.
- Every page has `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- No inline styles. Ever. All styling goes in CSS files.
- No inline JavaScript. All scripts go in `js/` and are loaded with `defer`.

### CSS
- All colors, fonts, spacing, and sizing use CSS custom properties from `tokens.css`. Never hardcode a hex value, font name, or pixel value in a component rule.
- Class names describe what something IS, not how it looks: `.hero`, `.section-store`, `.agenda-card` — not `.big-text`, `.pink-bg`, `.left-column`.
- No `!important`. If specificity is fighting you, your selectors are wrong — simplify them.
- No vendor prefixes manually. Use standard properties — browsers support them.
- No `float` for layout. CSS Grid and Flexbox only.
- Media queries go inside the component they modify, not in a separate "responsive.css" file.
- `clamp()` for fluid typography — no media query breakpoints for font sizes.

### JavaScript
- Vanilla JS only. No libraries, no jQuery, no Alpine.
- JavaScript is progressive enhancement — the page must work without JS enabled.
- No JavaScript for layout. CSS handles all layout.
- Scroll-triggered effects use `IntersectionObserver`, not scroll event listeners.
- Navigation toggle is the only JS that should run on page load.

---

## 5. Typography — The Rules That Matter Most

Typography makes or breaks a website build. These rules apply to every project.

### Font loading
```css
/* typography.css */

@font-face {
    font-family: 'Display Font';
    src: url('../fonts/DisplayFont-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```
- `font-display: swap` on every `@font-face`. No exceptions.
- Preload the display font in `<head>` — it is above the fold:
  ```html
  <link rel="preload" href="fonts/DisplayFont-Regular.woff2" as="font" type="font/woff2" crossorigin>
  ```
- Load only the weights actually used. If the design uses Regular and Bold, do not load Light, Medium, or Black.
- `.woff2` only. No `.otf`, `.ttf`, or `.woff` in the project.

### Type scale
Define the entire type scale in `tokens.css` as custom properties. Every text element references the scale — no raw `font-size` values anywhere else.

```css
/* tokens.css */
:root {
    --text-xs:   0.75rem;
    --text-sm:   0.875rem;
    --text-base: 1rem;
    --text-lg:   1.25rem;
    --text-xl:   1.5rem;
    --text-2xl:  2rem;
    --text-4xl:  3.5rem;
    --text-hero: clamp(5rem, 12vw, 10rem);
}
```

### Line height
- Body copy: `line-height: 1.6`
- Headings: `line-height: 1.1`
- Display/hero: `line-height: 1.0`
- Navigation: `line-height: 1.0`

---

## 6. Responsive Design

### Breakpoints
```css
/* layout.css */

/* Mobile first — base styles are mobile */

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Wide */
@media (min-width: 1440px) { ... }
```

### Rules
- **Mobile first.** Base styles are for the smallest screen. Media queries add complexity upward.
- **Test at these widths:** 375px (iPhone SE), 768px (iPad), 1024px (small laptop), 1280px (desktop), 1440px (wide desktop).
- **Typography scales with `clamp()`.** Hero text, section titles, and lead paragraphs use `clamp()` for fluid sizing. Body text stays at `1rem`.
- **Photography crops correctly.** When an image spans a column, verify the subject is visible at every breakpoint. Use `object-fit: cover` with `object-position` tuned to the subject.
- **Navigation collapses.** Desktop: horizontal or vertical nav visible. Mobile: hamburger menu with full-screen overlay. Transition: `200ms ease`.
- **Grid collapses gracefully.** Two-column layouts (45/55 text/image) stack to single column on mobile. Image goes first (above the fold), text follows.

### Common responsive pattern
```css
.section {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6);
}

@media (min-width: 1024px) {
    .section {
        grid-template-columns: 45fr 55fr;
    }
}
```

---

## 7. Images & Media

### The Core Rule
**Images never go in git** (unless the project is very small and Cloudflare R2 is not set up). Use `.gitignore` to exclude all image formats.

### Image optimization
- **Format:** `.webp` for photos where possible, `.jpg` as fallback. `.png` only for transparency. `.svg` for icons and logos.
- **Max file size:** 200KB per image for web delivery. Resize and compress before adding to the project.
- **Dimensions:** Export at 2x for retina, serve responsive sizes via `srcset` or Cloudflare `?width=` parameter.

| Context | Width (1x) | Width (2x / retina) |
|---------|-----------|-------------------|
| Hero / fullwidth | 1400px | 2800px |
| Section image (55% column) | 800px | 1600px |
| Card / thumbnail | 400px | 800px |
| Avatar / icon | 80px | 160px |

### Layout shift prevention
Every `<img>` has explicit `width` and `height` attributes matching the aspect ratio:
```html
<img src="img/hero/hero-home-01.jpg" alt="Craftsman at sewing machine" width="1400" height="900" loading="lazy">
```

### Lazy loading
All images below the fold use `loading="lazy"`. The hero image does NOT use lazy loading — it must load immediately.

### Icons
- Always SVG.
- Use `currentColor` for fill so the icon inherits text color.
- Inline small icons (`<svg>` in HTML) for critical-path icons (nav, arrows).
- External file for decorative icons (`<img src="img/icons/icon-name.svg">`).

### .gitignore
```
.env
media/
*.jpg
*.jpeg
*.JPG
*.JPEG
*.png
*.PNG
*.gif
*.webp
*.pdf
*.zip
node_modules/
```

---

## 8. Animation & Interaction

### Philosophy
Animation serves comprehension, not decoration. Every animation must answer: does this help the visitor understand the page, or does it just move?

### Allowed patterns
- **Hover states:** color transitions on links and interactive elements. `transition: color 200ms ease`.
- **Scroll-driven effects:** parallax, color shifts, fade-in of sections. Use `IntersectionObserver` in JS or CSS `scroll-timeline` where supported.
- **Navigation transitions:** menu open/close. `200ms ease`.

### Forbidden patterns
- **Entrance animations on text.** No typewriter effects, no letter-by-letter reveals, no slide-in-from-left on headings.
- **Load animations that delay content.** The page must be readable the instant it loads.
- **Animation libraries.** No GSAP, no Anime.js, no Framer Motion. CSS only. If a scroll effect needs JS, use vanilla `IntersectionObserver`.

### Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```
This is included in every build. No exceptions.

---

## 9. Performance

### Targets
Lighthouse scores on mobile (throttled):
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Checklist
- Fonts preloaded (display font only)
- `font-display: swap` on all `@font-face`
- Images compressed (< 200KB each)
- Images have `width` and `height` attributes
- Images below the fold use `loading="lazy"`
- No external CSS or JS dependencies (no CDN calls)
- No unused CSS
- No render-blocking JavaScript
- `<meta name="viewport">` present
- Total page weight under 2MB (including images)

---

## 10. Accessibility — Non-negotiable

- **Color contrast:** WCAG AA minimum (4.5:1 for body text, 3:1 for large text). Test every color combination in the brand palette — not all combinations will pass.
- **Keyboard navigation:** every interactive element reachable via Tab. Visible focus states (outline, not just color change).
- **Semantic structure:** one `<h1>` per page, heading levels do not skip (no `<h1>` → `<h3>`).
- **Alt text:** every image has descriptive alt text. Decorative images use `alt=""`.
- **Link text:** descriptive. "View all courses" not "Click here". "Book a tour" not "Learn more".
- **Reduced motion:** `prefers-reduced-motion` respected (see section 8).
- **Language:** `<html lang="...">` set on every page.

---

## 11. Annotation Tool

Every build includes a built-in annotation tool for review feedback. This is non-optional — it is part of the workflow.

### Behaviour
- A pencil icon fixed to the bottom-right corner of the page.
- Click it to activate annotation mode.
- In annotation mode, click anywhere on the page to leave a note with your name.
- Annotations are stored in localStorage.
- Annotations can be exported as JSON (for passing feedback to the builder).

### Implementation
Include the annotation script in every page:
```html
<script src="js/annotate.js" defer></script>
```

The annotation tool is removed before final production deployment. It is a review tool, not a production feature.

---

## 12. Design Tokens — The Bridge

Design tokens are the single source of truth for visual values. They come from Figma (via the Figma API) and are stored as `tokens/tokens.json`.

### Token to CSS workflow
1. Designer creates/updates tokens in Figma
2. Claude Code reads them via Figma API
3. Values are written to `tokens/tokens.json`
4. `tokens.css` is generated from `tokens.json` (`:root` custom properties)
5. All CSS references the custom properties — never raw values

### tokens.json format
```json
{
    "color": {
        "primary": "#1200CC",
        "secondary": "#FFE0DB",
        "accent": "#FF2B2B",
        "surface": "#F5D0CB",
        "text": "#1200CC",
        "text-muted": "#1200CC99"
    },
    "font": {
        "display": "Topol",
        "body": "Apercu Pro",
        "mono": "Apercu Mono"
    },
    "spacing": {
        "1": "8px",
        "2": "16px",
        "3": "24px",
        "4": "32px",
        "6": "48px",
        "8": "64px",
        "12": "96px"
    }
}
```

### Figma API setup
```
# .env (gitignored)
FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxxxxxx
```

---

## 13. Variants & A/B Exploration

Website builds often explore multiple visual directions. Each variant is a separate HTML file with a suffix:

```
homepage-a-apercu.html     ← Version A: Apercu Pro throughout
homepage-b-topol.html      ← Version B: Topol display + Apercu body
homepage-c-dark.html       ← Version C: dark background exploration
```

### Rules for variants
- Each variant is a complete, self-contained page. No shared state between variants.
- Variants share the same CSS token files — they differ in which tokens they apply, not in raw values.
- The creative director reviews all variants on the live site and directs which to develop further.
- Once a direction is chosen, non-chosen variants are archived (moved to a `_variants/` folder), not deleted.

---

## 14. Webflow Handoff (Route B)

When the build is handed off to a Webflow developer, the deliverable is the live reference site + supporting files. The Webflow dev never needs Figma access.

### What the Webflow dev receives
1. **Live reference site URL** — the single source of truth. Inspect any value via DevTools.
2. **tokens.json** — for setting up Webflow CSS Variables.
3. **docs/animations.md** — specs for recreating animations in Webflow Interactions.
4. **docs/CHANGES.md** — changelog to track what changed since their last sync.
5. **Font files** — .woff2 for self-hosting in Webflow.

### What the Webflow dev does NOT receive
- Source code (they don't need it — they inspect the live site)
- Figma access (the reference build replaces it)
- Design rationale (that lives in DESIGN.md, which is for the build team)

---

## 15. Before Finishing Any Session

Run through this checklist before declaring work done:

```
[ ] HTML is semantic — no div soup
[ ] All images have descriptive alt text
[ ] All images have width and height attributes
[ ] All images below the fold use loading="lazy"
[ ] Hero image does NOT use lazy loading
[ ] All colors use CSS custom properties from tokens.css
[ ] All font sizes use the type scale custom properties
[ ] Font files are self-hosted .woff2 only
[ ] font-display: swap on all @font-face declarations
[ ] Display font is preloaded in <head>
[ ] No inline styles
[ ] No inline JavaScript
[ ] No external CDN dependencies
[ ] Responsive: tested at 375px, 768px, 1024px, 1440px
[ ] Focus states visible on all interactive elements
[ ] prefers-reduced-motion respected
[ ] Annotation tool included (js/annotate.js)
[ ] docs/CHANGES.md updated with what changed this session
[ ] No commented-out code
[ ] No unused CSS classes
```

---

## 16. Code Hygiene Pass

When asked to run a hygiene pass, check the following:

```
1. DEAD CODE
   [ ] CSS classes defined but not used in any HTML file
   [ ] JavaScript functions defined but never called
   [ ] Font files in /fonts that are not referenced in @font-face

2. DESIGN TOKEN DRIFT
   [ ] Hardcoded hex values in CSS (should use custom properties)
   [ ] Hardcoded font names in CSS (should use custom properties)
   [ ] Hardcoded spacing values in CSS (should use custom properties)
   [ ] tokens.css values that don't match tokens.json

3. ACCESSIBILITY
   [ ] Images without alt text
   [ ] Color combinations that fail WCAG AA contrast
   [ ] Heading levels that skip (h1 → h3)
   [ ] Links with non-descriptive text ("click here", "read more")
   [ ] Missing lang attribute on <html>

4. PERFORMANCE
   [ ] Images over 200KB
   [ ] Images without width/height attributes
   [ ] Fonts loaded from external CDNs
   [ ] Render-blocking scripts (missing defer)
   [ ] Unused CSS (classes not referenced in HTML)

5. BRAND COMPLIANCE
   [ ] Colors outside the BRANDGUIDE.md palette
   [ ] Fonts not listed in BRANDGUIDE.md
   [ ] Border-radius, shadows, or gradients where the brand prohibits them
   [ ] Animation patterns listed in DESIGN.md "What Not To Do" section
```

Report each finding with: file name, line number, description, recommended fix.

---

*SuperStories BV — CLAUDE.md website build template — v1.0 — 2026-03-28*
*Copy this file into every website project repo. The BRANDGUIDE.md and DESIGN.md are project-specific.*
