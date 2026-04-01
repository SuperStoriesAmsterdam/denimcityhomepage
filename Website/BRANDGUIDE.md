# BRANDGUIDE.md — [Brand Name]

> This file defines the visual system for [Brand Name].
> Every design decision is documented here with its reasoning.
> The values in this file match `tokens.json` exactly.
> The live brand guide page (`brandguide.html`) renders everything in this file using real tokens.
>
> **Do not change values here without updating `tokens.json` and `brandguide.html` to match.**
> **Do not change values in `tokens.json` without updating this file to match.**
> They are the same system, expressed in two formats.

---

## 1. Brand Identity

| Field | Value |
|-------|-------|
| Brand name | |
| What it does | <!-- One sentence a stranger would understand. Not what it believes — what it DOES. --> |
| Who encounters it | <!-- 2-3 actual humans, not demographics --> |
| Feeling | <!-- What someone feels within 10 seconds. Not "professional" — the feeling only THIS brand produces. --> |
| Position | <!-- What makes this different from everything else in its space --> |

### Emotional Intention

**A stranger encountering this brand for the first time should feel: "_______________"**

This feeling is produced by:
1. <!-- What visual element creates the first impression? -->
2. <!-- What does the language do? -->
3. <!-- What does the design system signal? -->

<!-- Example (Denim City): "I didn't know I could know this much about what I wear. And now I want to." Produced by: photography of craft in progress, language that names what's possible rather than what the brand believes, and a design system heavy enough to signal seriousness without closing the door. -->

---

## 2. Color System

### Primary Palette

```css
:root {
    --color-primary:    #______;   /* [Name] — used for: _______ */
    --color-secondary:  #______;   /* [Name] — used for: _______ */
    --color-accent:     #______;   /* [Name] — used for: _______ */
}
```

<!-- Example (Denim City):
    --color-primary:    #1200CC;   DC Blue — wordmark, all text, nav, borders
    --color-secondary:  #FFE0DB;   DC Pink — page background, the neutral
    --color-accent:     #FF2B2B;   DC Red — AMS tag, hover states, key phrases
-->

### Derived Colors

```css
:root {
    --color-bg:         var(--color-secondary);
    --color-surface:    #______;   /* Slightly darker/lighter variant of bg — cards, panels */
    --color-text:       var(--color-primary);
    --color-text-muted: #______;   /* Primary at reduced opacity — secondary labels, metadata */
    --color-border:     var(--color-primary);
}
```

<!-- Example (Denim City):
    --color-surface:    #F5D0CB;   deeper pink — agenda cards, panels
    --color-text-muted: #1200CC99; blue at 60% — secondary labels, metadata
-->

### Color Rules

**Background:** <!-- What is the default page background? If not white, state this explicitly. -->
<!-- Example (Denim City): Pink is the neutral. No white backgrounds, no greys. -->

**Maximum colors per viewport:** <!-- How many colors can appear in any single screen? -->
<!-- Example (Denim City): Never more than 3 colors in any single viewport. -->

**Photography color:** <!-- Does photography bring outside color into the palette? -->
<!-- Example (Denim City): Photography is the only thing that brings outside color into the page, and it should. -->

**Forbidden colors:** <!-- Colors that must never appear -->
<!-- Example (Denim City): No white backgrounds. No greys. No gradients. No fourth color under any circumstance. -->

**Location/variant color logic (if applicable):**
<!-- Example (Denim City): The AMS pill uses accent (red). SP uses green. IST TBD. The background color tells you where you are in the network before you read a word. Structural, not decorative. -->

### Contrast Check

| Foreground | Background | Ratio | WCAG AA |
|-----------|-----------|-------|---------|
| --color-primary | --color-bg | | |
| --color-accent | --color-bg | | |
| --color-text-muted | --color-bg | | |
| white | --color-accent | | |

<!-- Claude Code: calculate and fill these in. Flag any failures. -->

---

## 3. Typography

### Font Stack

| Role | Font family | Weight(s) | File | Where it's used |
|------|-----------|----------|------|-----------------|
| Display / Wordmark | | | `fonts/______.woff2` | |
| Body / UI / Nav | | | `fonts/______.woff2` | |
| Metadata / Mono | | | `fonts/______.woff2` | |

<!-- Example (Denim City, Version B):
    Display: Topol, Regular (400), Topol-Regular.woff2, wordmark + section titles
    Body: Apercu Pro, Regular (400), Apercu-Pro-Regular.woff2, nav, body, labels, links, pills
    Mono: Apercu Mono, Regular (400), Apercu-Mono.woff2, dates, durations, prices, specs
-->

### The Constant

<!-- Which font carries the warmth / personality / trust? Usually the body font. Why must it not be compromised? -->

<!-- Example (Denim City): Apercu Pro Regular carries the body, navigation, and UI. This is non-negotiable. Apercu Regular on pink at reading sizes is warm and open — its humanist details at small scale produce the approachability that the heavy display type withholds. The friendliness of this site lives in the body font, not the headline font. -->

### The Tension

<!-- What creates visual hierarchy? How do the fonts work together? -->

<!-- Example (Denim City, Version B): Hierarchy comes from two different type characters meeting at the scale boundary. Topol at hero scale feels made; Apercu at body scale feels used. That contrast is the tension. -->

### Type Scale

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

### Typography Rules

| Element | Font | Size | Weight | Case | Letter-spacing | Line height |
|---------|------|------|--------|------|---------------|-------------|
| Wordmark | --font-display | --text-hero | | | | |
| Section title | --font-display | --text-4xl | | sentence case | | 1.1 |
| Body copy | --font-body | --text-base | | | | 1.6 |
| Lead paragraph | --font-body | --text-lg | | | | 1.5 |
| Navigation | --font-body | --text-sm | | uppercase | 0.06em | 1.0 |
| Metadata | --font-mono | --text-xs | | uppercase | | 1.0 |
| Key phrases | same as surrounding | same | same | same | same | same |

<!-- Key phrases: words that carry extra meaning. How are they distinguished? -->
<!-- Example (Denim City): Key phrases in copy use the same font as surrounding text, rendered in --color-accent. -->

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

### Spacing Rules

| Context | Value |
|---------|-------|
| Horizontal padding (mobile) | --space-3 (24px) |
| Horizontal padding (desktop) | --space-6 (48px) |
| Section separation | <!-- Rule lines? Whitespace? How much? --> |
| Grid gap | <!-- Between columns in a two-column layout --> |

---

## 5. Layout Logic

**Layout rhythm:** <!-- Dense or airy? What signals the rhythm? -->
<!-- Example (Denim City): Structured grid with rule-line architecture. Sections are announced by their border, not by whitespace. The density of a working place. -->

**Content split:** <!-- Text/image ratio -->
<!-- Example (Denim City): Text 45%, photography 55%. -->

**Edge treatment:** <!-- Full bleed or contained? -->
<!-- Example (Denim City): Full bleed throughout. No centered wrapper, no max-width container. Photography always edge-to-edge within its half. -->

**Section separation:** <!-- How sections are divided -->
<!-- Example (Denim City): 1px solid --color-border, full viewport width. The line is the spatial signal. No decorative whitespace. -->

**Rotated labels (if applicable):**
<!-- Example (Denim City): Section names rotated 90° on the left edge. --font-body, uppercase, --text-sm. From the 2018 style guide. -->

---

## 6. Components

### Arrow Links
<!-- The primary interactive element. Define default + hover state. -->

```css
/* Example (Denim City): */
/* → Link text. --font-body, --text-sm, uppercase.
   Default: --color-primary. Hover: --color-accent.
   No filled buttons anywhere. */
```

### Navigation
**Desktop:** <!-- Layout, position, font, active state -->
**Mobile:** <!-- Hamburger? Full screen overlay? Slide-in? -->

<!-- Example (Denim City): Vertical nav top-right. --font-body, --text-sm, uppercase, --space-3 intervals. Active item: → prefix in --color-accent. -->

### Location Pills / Tags (if applicable)

```css
/* Example (Denim City): */
/* border: 1px solid --color-primary, border-radius: 999px, padding: 2px 10px.
   Inactive: transparent bg, --color-primary text.
   Active (AMS): background --color-accent, color white, border-color --color-accent. */
```

### Cards (if applicable)

```css
/* Example (Denim City): */
/* background: --color-surface, border: 1px solid --color-border,
   border-radius: 0, padding: --space-3. */
```

### Section Dividers

<!-- Example (Denim City): 1px solid --color-border, full viewport width. No margin above or below. -->

### Footer
<!-- Column structure, content types -->

---

## 7. Photography

### Content Direction

**What images should show:** <!-- The principle -->
<!-- Example (Denim City): Craft in progress. Not the result — the process. Not the space empty — the space in use. -->

**The test for every image:**
<!-- Example (Denim City): "Does this make a stranger feel like an apprentice looking in, or a customer being addressed? The first is correct. The second is not." -->

### Technical Treatment

| Property | Value |
|----------|-------|
| Crop | <!-- Full bleed? Contained? --> |
| Border radius | <!-- 0px? 8px? --> |
| Shadow | <!-- None? --> |
| Filter | <!-- None? Desaturated? --> |
| Caption | <!-- Below? Overlay? None? --> |

<!-- Example (Denim City): Full-bleed within column. No border-radius. No drop shadow. No caption box. No filter — the photographs carry their own color into the system. -->

---

## 8. Logo Usage

### Variants

| Variant | File | Use when |
|---------|------|----------|
| Primary | `img/logos/logo-primary.svg` | |
| Mono light | `img/logos/logo-mono-light.svg` | On dark backgrounds |
| Mono dark | `img/logos/logo-mono-dark.svg` | On light backgrounds |
| Icon only | `img/logos/logo-icon.svg` | Favicon, small contexts |

### Rules
- <!-- Minimum size -->
- <!-- Clear space -->
- <!-- What NOT to do with the logo -->

<!-- Example (Denim City): The wordmark IS the logo (DENIM / CITY lockup). No separate logo mark. Top-left, bleeds to edge. Never centered. -->

---

## 9. What NOT To Do

<!-- The most important section. Every constraint from the onboarding, stated as a prohibition. -->

- Do not...
- Do not...
- Do not...
- Do not...
- Do not...

<!-- Example (Denim City):
- No white backgrounds. Pink is the neutral.
- No border-radius on structural elements (0px everywhere except location pills).
- No drop shadows — not decorative, not functional.
- No gradients.
- No more than 3 colors in any single viewport.
- No sustainability vocabulary in copy.
- No photography of empty spaces in the hero.
- No typewriter effects, scroll-triggered text reveals, entrance animations on copy.
- Do not center the wordmark.
- Do not use Apercu Mono for body copy.
- Do not add a fourth color under any circumstance.
-->

---

## 10. References

| Material | What it establishes |
|----------|-------------------|
| | |
| | |

<!-- Example (Denim City):
    2018 Style Guide v.02 → wordmark-as-logo, location color via background, rule lines, rotated labels
    Inventory Magazine → tone: serious working place, not lifestyle
-->

### What this brand guide preserves from the reference
<!-- Specific patterns carried forward -->

### What this brand guide changes from the reference
<!-- What's different and why -->

---

## 11. Design Review — Three Questions

Before locking the brand guide, test it:

1. **Sagmeister:** What is the one thing this brand system needs to make someone feel that they wouldn't feel encountering anything else in this space?
   → Answer:

2. **Inez & Vinoodh:** Who specifically is this made for, and where is that human truth visible in the system?
   → Answer:

3. **Gibson:** What is already present in the culture that this brand system hasn't priced in yet?
   → Answer:

If any answer is blank or vague, the brand guide is not ready to lock.

---

*SuperStories BV — BRANDGUIDE.md template — v2.0 — 2026-03-30*
*Fill in per project via the onboarding in BRANDGUIDEDESIGNWORKFLOW.md.*
*Denim City DESIGN.md served as the reference for quality and structure.*
