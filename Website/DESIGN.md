# DESIGN.md — Visual Specification Template

> This file is the bridge between a client's brand and Claude Code's build.
> It answers one question: what should someone FEEL when they land on this page?
>
> BRANDGUIDE.md is the constraint set (colors, fonts, rules).
> WORKFLOW.md is the process (how the team works).
> This file is the creative direction that sits between them.
>
> **How to use this template:**
> 1. Start a new project conversation in Claude Code
> 2. Paste this template
> 3. Run the onboarding procedure below — Claude Code interviews you
> 4. The result becomes the project's DESIGN.md
> 5. Save it in the project root alongside BRANDGUIDE.md and WORKFLOW.md
>
> Once filled in, this file becomes the project's master design document.
> Every design decision is tested against the Emotional Intention in section 1.

---

## Onboarding Procedure

Claude Code: when this template is blank (sections contain only placeholders), run this conversation with the creative director before writing any code. Each question builds on the last. Do not skip ahead.

### Step 1 — Emotional Intention

Ask:
> "Complete this sentence: A stranger who arrives from a search result — who has never heard of this brand — should feel, within ten seconds: '____________'"
>
> This is not a tagline. It is the feeling the design must produce. Every decision in this document answers to this sentence.

If the answer is vague ("professional", "modern", "welcoming"), push back:
> "That could describe a thousand websites. What's the feeling that ONLY this brand produces? What would make someone stop scrolling?"

### Step 2 — Audience

Ask:
> "Who are the 2-3 most different people who will visit this page? Not demographics — actual humans. A 19-year-old student, a corporate buyer, and a tourist who walked in from the street. Who are yours?"

Then:
> "The design must work for all of them without treating any of them as the primary target. Does the emotional intention from Step 1 land for all of them?"

### Step 3 — The Defining Image

Ask:
> "If this entire brand had to be represented by one photograph — not a logo, a real photo — what's in it? Who's in it? What are they doing?"

This reveals the brand's visual truth faster than a brief. The answer becomes the hero image direction.

### Step 4 — Anti-references

Ask:
> "Name 2-3 websites, brands, or visual styles that this must absolutely NOT look like. What are you running away from?"

Negative space constrains the design faster than positive references.

### Step 5 — The One Sentence

Ask:
> "If the entire website had to survive as one sentence, which one? The sentence that, if everything else disappeared, would still tell someone what this place/brand/product is."

This sentence gets the most prominent treatment in the design.

### Step 6 — What Is NOT Here

Ask:
> "What sections, features, or content are explicitly NOT on this website? What should a builder NOT add even if it seems logical?"

This prevents scope creep. Write the answers in the "What This Site Does NOT Include" section.

### Step 7 — Existing Material

Ask:
> "What exists already? A style guide? A Figma file? A previous website? Brand photography? Anything I should read before I start?"

Whatever exists becomes the reference material listed at the bottom of this document.

---

## 1. Emotional Intention

<!-- The answer from Step 1. One sentence that every design decision answers to. -->

**A stranger who arrives from a search result — who has never heard of [brand] — should feel, within ten seconds: "_______________"**

This feeling is produced by three things working together:
1. <!-- What visual element creates the first impression? (usually photography or typography) -->
2. <!-- What does the language do? (inform? invite? challenge? reveal?) -->
3. <!-- What does the design system signal? (serious? playful? warm? precise?) -->

---

## 2. Identity

| Field | Value |
|-------|-------|
| Product | <!-- What is this website FOR? What does the brand/place/product do? --> |
| Audience | <!-- The 2-3 humans from Step 2 --> |
| Feeling | <!-- One phrase from Step 1 --> |
| Primary visual reference | <!-- From Step 7: a specific style guide, magazine, website, or aesthetic --> |
| Anti-references | <!-- From Step 4: what this must NOT look like --> |

---

## 3. Color System

<!-- Filled in from the brand's existing material, or developed during the onboarding. -->
<!-- Copy the final values into BRANDGUIDE.md as the canonical source. -->

```css
:root {
    --color-primary:    #______;   /* Description + where it's used */
    --color-secondary:  #______;   /* Description + where it's used */
    --color-accent:     #______;   /* Description + where it's used */
    --color-bg:         #______;
    --color-surface:    #______;
    --color-text:       #______;
    --color-text-muted: #______;
    --color-border:     #______;
}
```

**Background rule:** <!-- What is the default page background? If not white, state this. -->
**Color ceiling:** <!-- Maximum N colors in any single viewport -->
**Photography color:** <!-- Does photography bring outside color into the palette? -->

---

## 4. Typography

<!-- Filled in from the brand's existing material, or developed during the onboarding. -->
<!-- Copy the final values into BRANDGUIDE.md as the canonical source. -->

| Role | Font family | Weight(s) | Where it's used |
|------|-----------|----------|-----------------|
| Display / Wordmark | | | |
| Body / UI / Nav | | | |
| Metadata / Mono | | | |

**The constant:** <!-- Which font carries the warmth / personality / trust? Usually the body font. State why it must not be compromised. -->

**The tension:** <!-- What creates visual hierarchy? Weight vs. scale? Two different type families meeting? State the principle. -->

---

## 5. Spatial Logic

<!-- How the page breathes. Not pixel values — the principle behind the values. -->

**Layout rhythm:** <!-- Dense? Airy? Rule-line separated? Whitespace separated? -->
**Content split:** <!-- Text/image ratio? e.g. 45% text / 55% photography -->
**Edge treatment:** <!-- Full bleed? Max-width container? Mixed? -->
**Section separation:** <!-- Rule lines? Whitespace? Background color shift? -->

---

## 6. Page Structure

Claude Code: build blocks in this sequence. Each block answers a specific question for the visitor.

### Block 1 — Hero
**Question this answers for the visitor:** <!-- What is this place/brand/product? -->
**Layout:** <!-- Full viewport? Split? Image only? -->
**Left/Right or Top/Bottom:** <!-- What goes where? -->
**Image direction:** <!-- What does the image show? Who's in it? What are they doing? -->
**Text:** <!-- What headline? What supporting text? -->
**Navigation:** <!-- Where is the nav? What items? -->

### Block 2 — [Name]
**Question this answers:** <!-- What can I do here? / Why should I care? / What makes this different? -->
**Layout:**
**Content:**

### Block 3 — [Name]
**Question this answers:**
**Layout:**
**Content:**

<!-- Continue for each section. Every block must answer a question. If a block doesn't answer a question, it doesn't belong on the page. -->

### Footer
**Content:** <!-- Address, hours, links, social, secondary nav -->

---

## 7. Photography Brief

<!-- Photography often does 50%+ of the visual work. If the project uses photography, this section is not optional. -->

### What images need to show
<!-- The principle: process vs. result? People vs. space? Action vs. stillness? -->

### The test for every image
<!-- "Does this make a stranger feel like ______ or ______? The first is correct. The second is not." -->

### Specific requirements by block
<!-- Which block needs which type of image? Be as specific as the creative direction allows. -->

| Block | Image subject | Mood | What it must NOT show |
|-------|-------------|------|----------------------|
| Hero | | | |
| Block 2 | | | |
| Block 3 | | | |

### Technical treatment
<!-- Full bleed? Border radius? Shadow? Filter? Caption? -->

---

## 8. Animation Intent

<!-- Does this site use motion? If yes, what's the philosophy? If no, state that explicitly. -->

**Philosophy:** <!-- "Animation serves comprehension" / "Scroll-driven only" / "No animation" -->

### Specific effects (if any)
<!-- Use this format per effect: -->

```
## [Name]
Trigger: [scroll / hover / load / click]
Element: [CSS selector]
Property: [what changes]
From: [start value]
To: [end value]
Easing: [linear / ease / custom]
Duration: [ms or scroll-driven]
Purpose: [why this animation exists — what does the visitor understand better because of it?]
```

---

## 9. Component Defaults

<!-- Define the interactive elements. A builder needs exact specs. -->

**Links / CTAs:** <!-- Arrow links? Buttons? Underlined text? Hover state? -->
**Navigation (desktop):** <!-- Horizontal? Vertical? Position? Active state? -->
**Navigation (mobile):** <!-- Hamburger? Full screen overlay? Slide-in? -->
**Cards (if applicable):** <!-- Background, border, radius, padding, shadow -->
**Tags / Pills (if applicable):** <!-- Shape, active/inactive state -->

---

## 10. What This Site Does NOT Include

<!-- From Step 6. Explicitly list what's out of scope. This prevents a builder from adding things that "seem logical" but aren't planned. -->

- This site does NOT include...
- This site does NOT include...
- This site does NOT include...

---

## 11. What NOT To Do

<!-- Design constraints stated as prohibitions. Easier for a builder to follow than positive statements. -->

- Do not...
- Do not...
- Do not...
- Do not...
- Do not...

---

## 12. Reference Material

### Primary visual reference
<!-- The style guide, magazine, website, or aesthetic that defines the territory -->

| Material | What it establishes |
|----------|-------------------|
| | |
| | |

### What this project preserves from the reference
<!-- Specific patterns, decisions, or principles carried forward -->

### What this project changes from the reference
<!-- What's different? What's been updated? Why? -->

---

## 13. Design Review — Three Questions

Before finalising the design specification, test it against these questions:

1. **Sagmeister test:** What is the one thing this design needs to make someone feel that they wouldn't feel looking at anything else in this space?
   → Answer:

2. **Inez & Vinoodh test:** Who specifically is this made for, and where is that truth visible in the design?
   → Answer:

3. **Gibson test:** What is already present in the culture that this positioning hasn't priced in yet?
   → Answer:

If any answer is blank or vague, the design direction is not ready. Go back to the onboarding.

---

*SuperStories BV — DESIGN.md template — v1.0 — 2026-03-28*
*This is a blank template. Fill it in per project via the onboarding procedure.*
*The filled-in version becomes the project's master design document.*
