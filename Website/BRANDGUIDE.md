# BRANDGUIDE.md — [Brand Name]

> Fill this in before any build starts. This file defines the visual constraint set.
> The designer and Claude Code both work within these boundaries — no exceptions without sign-off.
> DESIGN.md is the creative intent. This is the system that protects it.

---

## 1. Brand Identity

| Field | Value |
|-------|-------|
| Brand name | |
| One-line description | <!-- What this brand/place/product IS, in one sentence --> |
| Audience | <!-- Who encounters this brand? Be specific. --> |
| Feeling | <!-- What should someone feel within 10 seconds of encountering the brand? --> |
| Position | <!-- What makes this brand different from everything else in its space? --> |

---

## 2. Color System

Define the complete palette. Everything not listed here is forbidden.

### Primary palette

```css
:root {
    --color-primary:    #______;   /* Main brand color — used for: _______ */
    --color-secondary:  #______;   /* Background / neutral — used for: _______ */
    --color-accent:     #______;   /* Highlight / action — used for: _______ */
}
```

### Derived colors (computed from primary palette)

```css
:root {
    --color-bg:         var(--color-secondary);
    --color-surface:    #______;   /* Slightly darker/lighter variant of bg — cards, panels */
    --color-text:       var(--color-primary);
    --color-text-muted: #______;   /* Primary at reduced opacity — secondary labels */
    --color-border:     var(--color-primary);
}
```

### Color rules
- **Background:** What is the default page background? (If not white, state this explicitly — e.g. "Pink is the neutral. No white backgrounds.")
- **Maximum colors per viewport:** How many colors can appear in any single screen? (Recommended: 3)
- **Photography color:** Does photography bring outside color into the palette? (Usually yes — state this.)
- **Forbidden colors:** List any colors that must never appear (e.g. "No greys. No black. No gradients.")

### Contrast check
Test these combinations and confirm WCAG AA compliance:

| Foreground | Background | Ratio | Pass? |
|-----------|-----------|-------|-------|
| --color-primary | --color-secondary | | |
| --color-accent | --color-secondary | | |
| --color-text-muted | --color-secondary | | |
| white | --color-accent | | |

---

## 3. Typography

### Font stack

| Role | Font family | Weight(s) | File |
|------|-----------|----------|------|
| Display / Wordmark | | | `fonts/______.woff2` |
| Body / UI / Nav | | | `fonts/______.woff2` |
| Metadata / Mono | | | `fonts/______.woff2` |

### Type scale

```css
:root {
    --text-xs:   0.75rem;                  /* 12px — metadata, timestamps */
    --text-sm:   0.875rem;                 /* 14px — nav, labels, captions */
    --text-base: 1rem;                     /* 16px — body copy */
    --text-lg:   1.25rem;                  /* 20px — lead paragraphs */
    --text-xl:   1.5rem;                   /* 24px — subheadings */
    --text-2xl:  2rem;                     /* 32px — section subtitles */
    --text-4xl:  3.5rem;                   /* 56px — section titles */
    --text-hero: clamp(5rem, 12vw, 10rem); /* hero / wordmark */
}
```

### Typography rules

| Element | Font | Size | Weight | Case | Spacing | Line height |
|---------|------|------|--------|------|---------|-------------|
| Wordmark | | --text-hero | | | | |
| Section title | | --text-4xl | | | | 1.1 |
| Body copy | | --text-base | | | | 1.6 |
| Lead paragraph | | --text-lg | | | | 1.5 |
| Navigation | | --text-sm | | | | 1.0 |
| Metadata | | --text-xs | | | | 1.0 |
| Key phrases | Same as surrounding | Same | Same | Same | Same | Same |

<!-- Key phrases: words or short phrases that carry extra meaning. Define how they're distinguished — usually color (accent) rather than weight or style. -->

---

## 4. Spacing System

Base unit: 8px. All spacing in multiples of 8.

```css
:root {
    --space-1:  8px;
    --space-2:  16px;
    --space-3:  24px;
    --space-4:  32px;
    --space-6:  48px;
    --space-8:  64px;
    --space-12: 96px;
}
```

### Spacing rules
- **Horizontal padding (mobile):** `--space-3` (24px)
- **Horizontal padding (desktop):** `--space-6` (48px)
- **Section separation:** <!-- Rule lines? Whitespace? How much? -->
- **Grid gap:** <!-- Between columns in a two-column layout -->

---

## 5. Layout Patterns

### Grid system
<!-- Describe the default layout grid. Common: 45% text / 55% image, or 12-column. -->

### Section structure
<!-- How are sections separated? Rule lines? Whitespace? Background color change? -->

### Content width
<!-- Full bleed? Max-width container? Mixed? -->

---

## 6. Component Library

Define every reusable component. A builder needs exact specifications.

### Buttons / Links
<!-- Primary CTA style, secondary links, arrow links. Include hover states. -->

```css
/* Example: Arrow link */
.arrow-link {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    text-transform: uppercase;
    color: var(--color-primary);
    text-decoration: none;
}
.arrow-link:hover {
    color: var(--color-accent);
}
/* Usage: → Link text */
```

### Navigation
<!-- Desktop layout, mobile layout, active state, hover state -->

### Cards
<!-- If the design uses cards (agenda, blog, portfolio), define: background, border, radius, padding, shadow -->

### Pills / Tags
<!-- Location pills, category tags, status badges -->

### Footer
<!-- Column structure, content, links, social icons -->

---

## 7. Photography Rules

<!-- Photography is often doing 50%+ of the visual work. Define what images must show and how they're treated. -->

### Content direction
- **What images should show:** <!-- Process? People? Space? Product? -->
- **What images should NOT show:** <!-- Staged? Empty? Stock? -->
- **The test for every image:** <!-- Does it feel like X or Y? The first is correct. -->

### Technical treatment
- **Crop:** <!-- Full bleed? Contained? -->
- **Border radius:** <!-- 0px? 8px? -->
- **Shadow:** <!-- None? Subtle? -->
- **Filter:** <!-- None? Desaturated? -->
- **Caption:** <!-- Below? Overlay? None? -->

---

## 8. What NOT To Do

Explicitly list things that are off-limits. This prevents a builder from adding things that "seem right" but violate the brand.

- Do not...
- Do not...
- Do not...
- Do not...
- Do not...

---

## 9. References

List the visual references that define the brand's visual territory.

| Reference | What it teaches |
|-----------|----------------|
| <!-- e.g. "2018 Style Guide v.02" --> | <!-- e.g. "Wordmark-as-logo, rule-line architecture, rotated labels" --> |
| <!-- e.g. "Inventory Magazine" --> | <!-- e.g. "Tone: serious working place, not lifestyle" --> |

---

*SuperStories BV — BRANDGUIDE template — v1.0 — 2026-03-28*
*Fill this in for every website project. A builder cannot build on-brand without this document.*
