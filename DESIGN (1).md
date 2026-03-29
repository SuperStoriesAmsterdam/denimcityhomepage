# DESIGN.md
# Visual Specification — Denim City AMS Homepage
# Generated for SuperStories / Peter van Rhoon
# Claude Code: Read this file before writing any UI code.

---

## Emotional Intention

This is the sentence every design decision in this document answers to.

**A stranger who arrives from a search result — who has never heard of Denim City — should feel, within ten seconds: "I didn't know I could know this much about what I wear. And now I want to."**

That is not a welcoming feeling. It is a discovery feeling. The door opening onto a room you didn't know existed. Not a brand addressing you. A place revealing itself.

This feeling is produced by three things working together: a place that is visibly real and in use (photography), language that tells you what is possible here rather than what the place believes in (copy), and a design system that has enough weight to signal seriousness without closing the door on anyone.

The word "sustainability" does not appear in the copy this site is built on. Not because the commitment isn't real — it is — but because the word has collapsed. What Denim City actually offers is rarer and more specific: material literacy. You can come here and learn how the thing you wear is made, from fibre to finish. That is the proposition the design carries. Everything else follows from it.

---

## Identity

**Product**: Homepage for Denim City Amsterdam — the only place in the world where the full value chain of denim is visible, learnable, and participable. Store, academy, lab, incubator, archive, all under one roof in De Hallen.
**Audience**: Anyone drawn to knowing how things are made. The 19-year-old fashion student and the PVH buyer and the tourist who wandered in are all welcome on the same afternoon. The design does not segment them. It presents the place and trusts each person to find their door.
**Feeling**: The discovery of craft. Serious without being closed.
**Visual reference**: The 2018 Denim City Style Guide (v.02) is the primary reference — pink/blue/red system, rule-line architecture, wordmark-as-logo. Living reference: Inventory Magazine. Not the aesthetic of sustainable fashion. The aesthetic of a working place that takes what it does seriously.

---

## Color System

AMS location palette. Do not use SP (mint) or IST colors on this page.

```css
:root {
  --color-primary:    #1200CC;   /* DC Blue — wordmark, all text, nav, borders */
  --color-secondary:  #FFE0DB;   /* DC Pink — page background, the neutral */
  --color-accent:     #FF2B2B;   /* DC Red — AMS tag, hover states, key phrases */

  /* Derived — do not override */
  --color-bg:         #FFE0DB;
  --color-surface:    #F5D0CB;   /* deeper pink — agenda cards, panels */
  --color-text:       #1200CC;
  --color-text-muted: #1200CC99; /* blue at 60% — secondary labels, metadata */
  --color-border:     #1200CC;
}
```

**Rule**: Never introduce a color outside this system. Pink is the neutral — no white backgrounds, no greys. Photography is the only thing that brings outside color into the page, and it should.

**Location color logic**: The AMS pill uses `--color-accent` (red). SP uses green. IST TBD. The background color tells you where you are in the network before you read a word. This is structural, not decorative.

---

## Typography

Two versions are specified. Claude Code: build both as separate HTML outputs. Peter reacts and directs from there.

The constant across both versions: Apercu Pro Regular carries the body, navigation, and UI. This is non-negotiable. Apercu Regular on pink at reading sizes is warm and open — its humanist details at small scale produce the approachability that the heavy display type withholds. The friendliness of this site lives in the body font, not the headline font. Do not compromise it.

Apercu Mono is used for metadata only: dates, durations, prices, technical specs. It signals: this is factual. Use it sparingly.

---

### Version A — Apercu Pro throughout

Hierarchy lives entirely within one family. Weight and scale do all the work.

**Wordmark**: Apercu Pro Black. The DENIM / CITY lockup only. At hero scale, Black weight holds against the pink field without requiring a separate display face.

**Section titles**: Apercu Pro Bold. Section names, pull quotes. Sentence case.

**Body / UI / Nav**: Apercu Pro Regular. All navigation, body copy, labels, arrow links, pills. The tension: 10rem Black wordmark to 0.875rem Regular nav. No other intervention needed.

**Metadata**: Apercu Mono Regular. Dates, durations, prices, specs only.

```css
/* Version A — Apercu Pro (self-hosted, licensed) */
/* Load: Apercu Pro Black, Bold, Regular + Apercu Mono Regular */

:root {
  --font-display: 'Apercu Pro', sans-serif;
  --font-body:    'Apercu Pro', sans-serif;
  --font-mono:    'Apercu Mono', monospace;

  --font-weight-wordmark: 900;
  --font-weight-heading:  700;
  --font-weight-body:     400;
}
```

---

### Version B — Topol + Apercu Pro

Hierarchy comes from two different type characters meeting at the scale boundary.

**Wordmark + Section titles**: Topol Regular. Geometric display face with slight constructive irregularities — at hero scale those read as character, not error. Warmer and more editorial than Apercu at the same size. Regular weight only: scale carries the hierarchy. The wordmark feels made; the body feels used. That contrast is the tension.

**Body / UI / Nav**: Apercu Pro Regular. Same role as Version A — this is the constant.

**Metadata**: Apercu Mono Regular. Same usage as Version A.

```css
/* Version B — Topol + Apercu Pro (both self-hosted, licensed) */
/* Load: Topol Regular + Apercu Pro Regular + Apercu Mono Regular */

:root {
  --font-display: 'Topol', sans-serif;
  --font-body:    'Apercu Pro', sans-serif;
  --font-mono:    'Apercu Mono', monospace;

  --font-weight-wordmark: 400; /* Topol Regular — scale is the weight */
  --font-weight-heading:  400;
  --font-weight-body:     400;
}
```

---

### Type Scale (both versions)

```css
:root {
  --text-xs:   0.75rem;                  /* 12px — Apercu Mono, metadata */
  --text-sm:   0.875rem;                 /* 14px — nav, labels */
  --text-base: 1rem;                     /* 16px — body copy */
  --text-lg:   1.25rem;                  /* 20px — lead paragraphs */
  --text-xl:   1.5rem;                   /* 24px — subheads */
  --text-2xl:  2rem;                     /* 32px — section subtitles */
  --text-4xl:  3.5rem;                   /* 56px — section titles */
  --text-hero: clamp(5rem, 12vw, 10rem); /* DENIM / CITY wordmark */
}
```

**Rules (both versions)**:
- Wordmark: `--text-hero`, all caps, `letter-spacing: -0.02em`
- Section titles: `--font-display`, `--text-4xl`, sentence case
- Navigation: `--font-body`, `--text-sm`, uppercase, `letter-spacing: 0.06em`
- Body copy: `--font-body`, `--text-base`, `line-height: 1.6`
- Lead paragraphs: `--font-body`, `--text-lg`, `line-height: 1.5`
- Metadata: `--font-mono`, `--text-xs`, uppercase
- Key phrases in copy ("towards a brighter blue", "strictly offline"): same font as surrounding text, `--color-accent`

---

## Spatial Logic

**Layout rhythm**: Structured grid with rule-line architecture. Sections are announced by their border, not by whitespace. The page has the density of a working place — not sparse, not decorated. Content sections split: text 45%, photography 55%. Full bleed throughout. No centered wrapper, no max-width container.

**Base unit**: 8px grid. All spacing in multiples of 8.
**Default padding**: 24px horizontal mobile / 48px desktop for text columns. Photography always edge-to-edge within its half.

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

**Vertical rotated labels**: Section names ("Store", "Academy", "Lab", "Agenda") rotated 90° on the left edge of their section. `--font-body`, uppercase, `--text-sm`. From the 2018 style guide. Keep it.

**Rule lines as structure**: Every major section opens with `1px solid --color-border` full viewport width. This is the spatial logic of the site. No decorative whitespace. The line is the separator.

---

## Page Structure — Homepage AMS

Claude Code: build blocks in this sequence.

---

### Block 1 — Hero

The hero earns the wordmark by giving a stranger something to land on before the name asks to mean anything.

- Full viewport height (`100svh`). Background: `--color-bg`.
- **Left half**: DENIM / CITY wordmark top-left, bleeds to viewport edge. "DENIM" line 1, "CITY" line 2 with "AMS" immediately following in `--color-accent`. No space — color does the separation. Below the wordmark, pushed to the bottom quarter of the viewport: one sentence in `--font-body`, `--text-lg`. *"The only place in the world where you can see, learn, and touch the full story of denim."* Not a tagline. A factual statement of what is here.
- **Right half**: Full-bleed photography, top to bottom of the viewport. The image required: a person mid-process, absorbed — Jos at the sewing machine, a student cutting a pattern, a washmaster at the laser. Concentration, not presentation. The person is not looking at the camera. They are doing something. This is what makes a stranger feel like an apprentice looking in — not a customer being addressed. No border-radius. No caption.
- **Top-right**: Vertical nav — ACADEMY / WORKSHOP / LAB / ARCHIVE / STORE / EVENTS / PARTNERS / CONTACT. Right-aligned, `--font-body`, `--text-sm`, uppercase, `--space-3` intervals. `--color-primary`. Active item gets `→` prefix in `--color-accent`.
- **Bottom of left half**: Location pills — AMS (active, red filled) / SP (outlined) / IST (outlined). `--font-body`, `--text-xs`, `border-radius: 999px`.

---

### Block 2 — What this place is

- Rule line above.
- Full width. No image. This block answers: what can I do here?
- Three columns, separated by `1px vertical border` in `--color-border`. Equal width.
- Each column: a short label in `--font-mono`, `--text-xs`, uppercase (e.g. "COME IN", "LEARN TO MAKE", "WORK WITH US"). Below: two or three arrow links to the relevant sections. No descriptions. The links name what's possible; the sections explain it.
- Arrow links: `→ The Store`, `→ Repair & Customization`, `→ Made to Order` / `→ Make Your Own Jeans`, `→ Courses`, `→ Tours` / `→ The Lab`, `→ Incubator`, `→ Collaborate`.
- This block is not routing. It is an index. The difference: it doesn't tell you which door is yours. It shows you all the doors and trusts you to choose.

---

### Block 3 — The Place / Mission

- Rule line above.
- Left (45%): `--font-body`, `--text-lg`. Two paragraphs. First: "Connecting the next generation with the forefront of the denim world" — "towards a brighter blue." in `--color-accent`. Second: the We strive sentence. These lines are earned — they've been with the brand since 2015. They stay. But they follow the image, not precede it. By this point the stranger has already seen the place. Now the language lands differently.
- Right (55%): Full-bleed De Hallen interior — the full space visible, the scale of it. Industrial ceiling, store in the foreground, workshop visible beyond. No person needed here — the space itself speaks. No radius, no caption.

---

### Block 4 — Store

- Rule line above. Rotated label "Store" left edge.
- Left (45%): Section title "The Store" in `--font-display`. Body: *"STRICTLY OFFLINE — Some things you have to see for yourself."* in `--font-body`. This phrase stays in `--color-accent` — it is the most culturally intelligent line in the brief. One arrow link: `→ Explore the store`.
- Right (55%): Full-bleed photography. The 6-meter jeans wall — pairs hung, the scale of it. Or Jos examining a pair for repair. The image should make you want to touch something.

---

### Block 5 — Academy

- Rule line above. Rotated label "Academy" left edge.
- Image left (55%), text right (45%) — flipped from Block 4.
- Image required: hands on fabric, mid-cut or mid-stitch. Process, not result. Someone learning.
- Title: "Make Your Own Jeans." in `--font-display`. Body: one sentence — the conversion fact from the PRD: *"If you find us, you book. 90% of the time."* Or equivalent. `→ View all courses`.

---

### Block 6 — Lab

- Rule line above. Rotated label "Lab" left edge.
- Same structure as Block 4 (text left, image right).
- Image required: the laser or ozone equipment in operation. Technical, specific, not staged.
- Title: "The Lab." Body: *"The only denim laundry lab in the Netherlands. Where wash development, sustainable treatments, and capsule production happen."* `→ The Lab`.

---

### Block 7 — Tours

- Rule line above. No image. Full width.
- Pull quote in `--font-display`, `--text-4xl`, left-aligned (not centered — centered quotes read as decoration): *"If you ever did a tour, you will never buy the same way again."*
- Below: `→ Book a tour (Commercial)` and `→ Book a tour (Educational)` side by side. `--font-body`, `--text-sm`.
- This is the material literacy proposition stated plainly. The tour changes how you see. That is what this site is selling throughout — not a product, not a service, but a change in how you understand what you wear.

---

### Block 8 — Agenda

- Rule line above. Rotated label "Agenda" left edge.
- Horizontal scrolling strip: upcoming Friday Talks, courses, special events.
- Each item: date in `--font-mono` `--text-xs` / event title in `--font-body` `--text-base` / `→ more info`. Bordered cards, `--color-surface` background, `border: 1px solid --color-border`, `border-radius: 0`.
- Friday Talks carry the "STRICTLY OFFLINE" positioning — if space allows, add that label in `--font-mono` beneath the event type.

---

### Block 9 — Footer

- Rule line above.
- Three columns: De Hallen address + opening hours / House of Denim Foundation (one line, linked) / Instagram handles (DC Store, DC Arms, House of Denim).
- `--font-body`, `--text-sm`.
- Location pills repeated: AMS / SP / IST as navigation to other location pages.

---

## Photography Brief

Photography is doing 55% of the composition on this page. It is not decoration. It is evidence.

**What the images need to show**: craft in progress. Not the result — the process. Not the space empty — the space in use.

**The test for every image**: does this make a stranger feel like an apprentice looking in, or a customer being addressed? The first is correct. The second is not.

**Specific requirements by block**:
- Block 1 hero: a person mid-process, not looking at camera. Concentration. Jos, or a student, or Bowie at the wash equipment. The image that says: *something real is happening here*.
- Block 3 place: the De Hallen interior at scale. Industrial ceiling visible. No people required — the architecture earns its moment here.
- Block 4 store: the 6-meter jeans wall, or hands examining a pair. Touch-able.
- Block 5 academy: hands on fabric. Mid-cut or mid-stitch. Learning visible.
- Block 6 lab: the equipment in operation. Technical specificity. Not staged.

**Technical treatment**: Full-bleed within column. No border-radius. No drop shadow. No caption box. No filter or color treatment — the photographs carry their own color into the pink/blue system. Let them.

---

## Component Defaults

**Arrow links**: `→ Link text`. `--font-body`, `--text-sm`, uppercase. Default: `--color-primary`. Hover: `--color-accent`. No filled buttons anywhere on the homepage.

**Location pills**: `border: 1px solid --color-primary`, `border-radius: 999px`, `padding: 2px 10px`. Inactive: transparent, `--color-primary` text. Active (AMS): `background: --color-accent`, `color: white`, `border-color: --color-accent`.

**Section dividers**: `1px solid --color-border`, full viewport width. No margin above or below — the line is the spatial signal.

**Agenda cards**: `background: --color-surface`, `border: 1px solid --color-border`, `border-radius: 0`, `padding: --space-3`.

---

## Performance

- Apercu Pro and Topol are licensed fonts — self-host both. No external CDN calls for typography.
- Load only the weights in use. Version A: Apercu Pro Regular, Bold, Black + Apercu Mono Regular. Version B: Topol Regular + Apercu Pro Regular + Apercu Mono Regular.
- `font-display: swap` on all faces.
- Preload the display font — it is above the fold.
- No JavaScript for layout. CSS grid and flexbox only.
- Static photography. No hero video.
- No animation libraries. CSS only if animation needed. `prefers-reduced-motion` respected.

---

## What Not To Do

- No white backgrounds. Pink is the neutral.
- No border-radius on structural elements (0px everywhere except location pills).
- No drop shadows — not decorative, not functional.
- No gradients.
- No more than 3 colors in any single viewport.
- No sustainability vocabulary in copy: not "eco", not "green", not "responsible". The work speaks for itself.
- No photography of empty spaces in the hero — people, process, and making are what earns the first impression.
- No typewriter effects, scroll-triggered text reveals, entrance animations on copy.
- Do not center the wordmark. Top-left, bleeds to edge.
- Do not use Apercu Mono for body copy. Metadata and specs only.
- Do not add a fourth color under any circumstance.

---

## Reference

**Primary visual reference**: 2018 Denim City Style Guide v.02, Website Development mockups (SS_Denim-City_Website-Development_01), Type Exploration (SS_Denim-City_Type-Exploration_01).

**What the 2018 spec established and this spec preserves**: wordmark-as-logo, location color differentiation via background, rule lines as structural separator, photography at 55% of composition, Apercu Mono for metadata only, rotated section labels.

**What this spec changes from 2018**: The hero is no longer wordmark-only — it pairs the wordmark with a person mid-process, so a stranger has something to land on. The emotional intention is named explicitly and every decision answers to it. The language frame shifts from sustainability-era vocabulary to material literacy. The photography brief specifies human presence and process, not space alone.

**Three questions this spec was tested against before being written**:
- Sagmeister: what is the one thing this design needs to make someone feel that they wouldn't feel looking at anything else in this category? → *The discovery of a room you didn't know existed.*
- Inez & Vinoodh: who specifically is this made for, and where is that truth in the design? → *The person who didn't know they wanted to understand what they wear — and the hero image is where that truth lives.*
- Gibson: what is already present in the culture that this positioning hasn't priced in yet? → *Material literacy is replacing sustainability as the appetite. The design carries craft and process, not ethics and claims.*

---

*This file is the source of truth for all UI decisions on the Denim City AMS homepage. When in doubt, return here.*
