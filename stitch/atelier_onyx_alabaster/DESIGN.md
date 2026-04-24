# Design System Strategy: High-End Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** 

This system moves away from the rigid, boxed-in nature of standard e-commerce to mimic the experience of a high-end fashion editorial or an exclusive physical boutique. We achieve this through "breathable" layouts, intentional asymmetry, and a focus on Tonal Layering rather than structural containment. The goal is to make the user feel like a curator, not just a shopper. We break the "template" look by utilizing large typographic scales and overlapping high-quality imagery with floating UI elements to create a sense of three-dimensional space.

---

## 2. Colors & Surface Philosophy
The palette is rooted in organic, creamy neutrals contrasted by authoritative charcoal depths. This is not a flat design system; it is a system of depth and texture.

*   **Primary (`#5f5e5e`) & Secondary (`#735b3a`):** Used sparingly for intentional focus. Secondary (a rich bronze/tan) should be used for interactive highlights and refined "calls to exclusivity."
*   **The "No-Line" Rule:** Explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a product detail section in `surface-container-low` (`#f3f4f1`) sitting against a main `background` (`#faf9f7`).
*   **Surface Hierarchy & Nesting:** Treat the UI as layers of fine paper. 
    *   **Level 0:** `background` (`#faf9f7`) for the widest canvases.
    *   **Level 1:** `surface-container-low` (`#f3f4f1`) for subtle section grouping.
    *   **Level 2:** `surface-container-highest` (`#e0e3e0`) for active interactive containers or drawers.
*   **The "Glass & Gradient" Rule:** To provide visual "soul," use Glassmorphism for floating navigation and hover states. Use semi-transparent `surface` colors with a 12px-20px backdrop-blur. Apply subtle linear gradients (transitioning from `primary` to `primary-container`) on main CTAs to give them a satin-like finish.

---

## 3. Typography
Typography is our primary tool for conveying luxury. We use a high-contrast pairing that balances heritage (Serif) with modern precision (Sans-serif).

*   **Display & Headlines (Noto Serif):** These are the "Editorial Voice." Use `display-lg` (3.5rem) and `headline-lg` (2.0rem) with generous tracking (letter-spacing) to create a sense of prestige. Headlines should feel like title sequences in a film.
*   **Body & Labels (Manrope):** The "Functional Voice." Manrope provides a clean, architectural counterpoint to the serif. Use `body-md` (0.875rem) for product descriptions and `label-sm` (0.6875rem) in all-caps for technical specs or breadcrumbs.
*   **Hierarchy Note:** Always prioritize whitespace around typography over size. A small label surrounded by 4rem of space (`spacing.12`) feels more luxurious than a large label in a tight box.

---

## 4. Elevation & Depth
In this design system, we do not "box" items; we "lift" them.

*   **The Layering Principle:** Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift without needing a shadow.
*   **Ambient Shadows:** When a "floating" effect is required (e.g., a luxury product hover), use extra-diffused shadows.
    *   *Shadow Specs:* 0px 20px 40px rgba(47, 51, 49, 0.06). The shadow color is a tint of `on-surface` (`#2f3331`) at very low opacity to mimic natural ambient light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at 15% opacity. Never use 100% opaque borders.
*   **Roundedness:** The system uses a **Strict Square (0px)** philosophy. Luxury is found in the precision of the right angle, echoing high-end architecture and bespoke stationary.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (`#5f5e5e`) background with `on-primary` text. Square corners (0px). Padding: `spacing.4` (1.4rem) horizontal.
*   **Secondary:** Ghost style. Transparent background with a "Ghost Border" (outline-variant at 20%).
*   **Tertiary:** Text-only, Noto Serif, underlined with a 1px offset.

### Input Fields
*   **Styling:** Remove all borders except for a 1px `outline` bottom-border. On focus, the bottom border transitions to `secondary`. Labels should use `label-md` and sit above the field with `spacing.2` (0.7rem).

### Cards & Lists
*   **Product Cards:** Forbid dividers. Use `spacing.6` (2rem) between items. The product image should be the hero, with typography appearing below in a "floating" layout. Use `surface-container-low` for the card background to subtly differentiate from the main page background.

### Editorial Navigation
*   **The "Floating" Bar:** A semi-transparent `surface` bar with backdrop-blur. Use `spacing.3` for internal padding and keep the logo centered to maintain the "Atelier" feel.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts where imagery overlaps container edges.
*   **Do** use `spacing.16` (5.5rem) or `spacing.20` (7rem) between major sections to emphasize exclusivity.
*   **Do** use high-quality, desaturated lifestyle photography that matches the palette.
*   **Do** ensure all interactive states (hover/focus) use "Smooth Transitions" (300ms ease-out).

### Don't:
*   **Don't** use standard drop shadows (e.g., #000 at 25%). It cheapens the aesthetic.
*   **Don't** use 1px solid dividers to separate content; use white space or a change in `surface-container` color.
*   **Don't** use rounded corners (`0px` is the standard).
*   **Don't** crowd the interface. If a screen feels "busy," remove an element rather than shrinking it.