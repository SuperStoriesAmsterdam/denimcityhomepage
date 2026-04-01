# Brandguide Design Workflow

## What This Is

This document describes the process for creating a brand guide — from raw assets to a living, iterable system. The output is not a PDF. It is a live HTML page (`brandguide.html`) built on design tokens, that serves as both the brand reference and the design playground.

The principle: **the brand guide IS the design.** When you change a token, the brand guide page updates. When you see something wrong on the brand guide page, you change the token. There is no drift between the document and the reality, because they are the same thing.

This workflow runs BEFORE the website design workflow (`DESIGNWORKFLOW.md`). Once the brand guide is solid, the website is built on the same tokens.

```
Brand assets + creative direction
        ↓
BRANDGUIDE.md (the rules, written)
        ↓
tokens.json (the values, structured)
        ↓
tokens.css (CSS custom properties)
        ↓
brandguide.html ← live page, everything rendered with real tokens
        ↓
Iterate (annotate → adjust → review)
        ↓
Brand guide is solid → proceed to website build
```

---

## Who Does What

### Peter (Creative Director / Claude Code)
- Provides the raw assets: logos, fonts, colors, reference material, photography, existing style guides
- Directs the creative decisions during the onboarding
- Reviews and annotates the live brand guide page
- Approves the final brand guide before proceeding to website design

### Claude Code
- Runs the onboarding conversation (see steps below)
- Builds `BRANDGUIDE.md`, `tokens.json`, and `brandguide.html`
- Processes `@claude` annotations on the brand guide page
- Keeps BRANDGUIDE.md, tokens.json, and brandguide.html in sync after every change

### Designer (if involved)
- Reviews the live brand guide page
- Leaves `@designer` annotations for polish and refinement
- Does NOT change tokens or the BRANDGUIDE.md directly — flags changes through annotations

---

## The Process

### Step 1 — Collect Assets

Before starting, gather everything that exists. Put it all in the project folder:

```
ProjectName/
├── brand-assets/
│   ├── logos/          ← SVG exports, all variants
│   ├── fonts/          ← font files (will be audited to .woff2 only)
│   ├── img/            ← reference photography, mood images
│   ├── references/     ← existing style guides, PDFs, screenshots
│   └── copy/           ← any existing brand copy, taglines, tone docs
```

**What counts as an asset:**
- Logo files (any format — Claude Code will identify what's usable)
- Font files (any format — will be converted/filtered to .woff2)
- Color values (from an existing style guide, Figma file, or just "we use this blue")
- Photography (existing brand photos, mood references, competitor screenshots)
- Existing style guides (PDF, Figma, InDesign — anything)
- Copy/tone of voice documents
- The Figma file link (if there is one)

**What you don't need yet:**
- Final decisions. The onboarding process will get you there.
- Photography for the website. That comes in the website phase.
- Perfect assets. We work with what exists and refine.

### Step 2 — Onboarding Conversation

Claude Code reads the assets folder and then runs a structured conversation to establish the brand system. This is not a questionnaire — each answer informs the next question.

#### 2a — Brand Identity

> "What does this brand/place/product DO? Not what it believes — what it actually does, in one sentence a stranger would understand."

> "Who encounters this brand? Not a target demographic — describe 2-3 actual humans who interact with it."

> "What should someone feel within 10 seconds of encountering this brand? Not 'professional' or 'modern' — what's the feeling that ONLY this brand produces?"

#### 2b — Color

Claude Code reads existing color values from the assets (style guides, Figma, logo files).

> "Here's what I found: [list colors]. Are these correct? Is anything missing? Is anything outdated?"

> "Which color is the page background? Is it white, or something else? This single decision shapes everything."

> "Maximum how many colors should appear in any single viewport? (Recommended: 3)"

> "Are there colors that must NEVER appear? (greys, black, gradients, etc.)"

Claude Code tests contrast ratios (WCAG AA) for all foreground/background combinations and flags failures.

#### 2c — Typography

Claude Code reads font files from the assets folder.

> "Here's what I found in your fonts folder: [list fonts + weights]. Which ones are actually in use?"

> "Which font carries the personality — the display/headline font, or the body font? This is the constant that must not be compromised."

> "What creates the visual tension — weight differences within one family, or two different families meeting?"

#### 2d — Spatial Logic

> "How dense should this feel? Like a working document (rule lines, tight spacing) or an art gallery (whitespace, breathing room)?"

> "How are sections separated — rule lines, whitespace, background color shifts, or something else?"

> "Photography: what percentage of the composition? 50/50 with text? 55/45? No photography?"

#### 2e — Constraints

> "What must this brand NEVER look like? Name 2-3 visual styles to avoid."

> "What must NEVER appear in the design? (specific effects, patterns, elements)"

This is the most important step. Constraints define a brand faster than aspirations.

### Step 3 — Generate the System

Claude Code takes the onboarding answers and generates three files simultaneously:

**`BRANDGUIDE.md`** — The written rules. Human-readable. Every decision documented with the reasoning behind it.

**`tokens.json`** — The structured values. Machine-readable. Every color, font, spacing value as a flat JSON file.

**`brandguide.html`** — The live page. Visual. Every element rendered with the actual tokens.

These three files are always in sync. Change one → the other two update.

### Step 4 — Build the Live Brand Guide Page

`brandguide.html` is a single HTML page that shows the entire brand system visually. It is built with the same CSS tokens that the website will use. Sections:

#### 4a — Color Palette
- Every color as a large swatch with the variable name, hex value, and where it's used
- All foreground/background combinations with contrast ratios displayed
- A "fail" indicator on combinations that don't meet WCAG AA
- The background rule stated visually (e.g. "Pink is the neutral — no white")

#### 4b — Typography
- Every font rendered at every scale in the type system
- The full type scale from `--text-xs` to `--text-hero`, with actual text
- Font weight comparisons side by side
- The display/body tension demonstrated: hero headline next to body copy
- Metadata font shown in context (dates, prices, specs)

#### 4c — Spacing & Layout
- The spacing scale visualized as colored blocks
- A sample two-column layout (text/image split) at the correct ratio
- Section separation demonstrated (rule lines, whitespace, or whatever the brand uses)
- Mobile vs desktop padding shown

#### 4d — Components
- Every interactive element: buttons, links, arrow links, pills, tags, cards
- Each in default state AND hover state
- Navigation pattern (desktop and mobile)
- Footer pattern

#### 4e — Photography Direction
- Sample images (from brand-assets/img/) displayed in the correct treatment
- The "test question" stated: "Does this feel like X or Y?"
- Do's and don'ts side by side if reference images are available

#### 4f — Logo Usage
- All logo variants rendered on all background colors
- Minimum size demonstrated
- Clear space rules if defined
- What NOT to do with the logo (if constraints exist)

#### 4g — Constraints / What Not To Do
- Every "do not" rule from the onboarding, with a visual example of the violation
- This section exists to make the invisible rules visible

### Step 5 — Iterate

This is where the annotation tool earns its keep. Peter opens `brandguide.html` on the Coolify URL and annotates directly:

**`@claude` annotations on the brand guide:**
- "This blue is too dark — try #1400DD"
- "The body font line-height feels too tight at this size"
- "Add a surface color for cards — slightly darker than the background"
- "The arrow link hover state should be the accent color"

**`@designer` annotations (if a designer is involved):**
- "The display font needs more letter-spacing at hero scale"
- "These two colors are too close — need more separation"
- "The card component needs a hover state"

**Claude Code processes `@claude` feedback:**
1. Reads the annotation
2. Updates `tokens.json` (the value)
3. Updates `BRANDGUIDE.md` (the rule)
4. Updates `brandguide.html` (the visual)
5. Marks the annotation as resolved

**The cycle:**
```
Review brandguide.html → Annotate → Claude Code processes → Review again
```

Repeat until Peter approves. There is no "final presentation" — the brand guide is done when the annotations stop.

### Step 6 — Lock and Proceed

When the brand guide is approved:

1. **`BRANDGUIDE.md`** is frozen — no changes without Peter's sign-off
2. **`tokens.json`** is the source of truth for all design values
3. **`brandguide.html`** is deployed on Coolify as the reference for designers and developers
4. The website build begins, using the same `tokens.json` and `tokens.css`

Any change to the brand system during the website build phase goes back through the brand guide first. You don't change a color in the website — you change it in the brand guide, verify it there, then the website inherits it.

---

## Folder Structure During Brand Guide Phase

```
ProjectName/
├── CLAUDE.md                    ← build rules (from Website template)
├── BRANDGUIDE.md                ← the written brand system (generated)
├── BRANDGUIDEDESIGNWORKFLOW.md  ← this file
│
├── brandguide.html              ← the live brand guide page
│
├── tokens/
│   └── tokens.json              ← structured design values
│
├── css/
│   ├── tokens.css               ← CSS custom properties (generated from tokens.json)
│   ├── reset.css                ← minimal reset
│   └── brandguide.css           ← styles specific to the brand guide page layout
│
├── fonts/                       ← .woff2 only (audited from brand-assets)
│
├── brand-assets/                ← raw input material
│   ├── logos/
│   ├── fonts/                   ← original font files (any format)
│   ├── img/
│   ├── references/
│   └── copy/
│
├── img/                         ← production-ready assets (optimized from brand-assets)
│   ├── logos/
│   └── content/
│
├── js/
│   └── annotate.js              ← annotation tool
│
├── .env                         ← Figma token (gitignored)
├── .env.example
└── .gitignore
```

---

## From Brand Guide to Website

When the brand guide is locked, the transition to the website phase is:

1. `DESIGN.md` is created (the visual specification for the website — page structure, blocks, photography brief)
2. `DESIGNWORKFLOW.md` is added (the team workflow for the website build)
3. The website HTML pages are built using the same `tokens.css` that `brandguide.html` uses
4. `brandguide.html` stays deployed as the permanent reference

The brand guide page is never deleted. It lives alongside the website as the canonical reference. If a designer joins six months later, they open `brandguide.html` and have everything they need.

---

## Starting a Brand Guide — Checklist

```
[ ] Create project folder on Desktop/Builds
[ ] Copy Website assets from AssetsforAll/Website/ (CLAUDE.md, BRANDGUIDEDESIGNWORKFLOW.md, annotate.js)
[ ] Collect all existing brand assets into brand-assets/
[ ] Run the onboarding conversation (Step 2)
[ ] Generate BRANDGUIDE.md + tokens.json + brandguide.html (Step 3-4)
[ ] Deploy brandguide.html to Coolify for review
[ ] Iterate via annotations until approved (Step 5)
[ ] Lock the brand guide (Step 6)
[ ] Proceed to website design workflow (DESIGNWORKFLOW.md)
```

---

*SuperStories BV — Brand Guide Design Workflow — v1.0 — 2026-03-30*
*This workflow runs before the website design workflow. Brand guide first, website second.*
