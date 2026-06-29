---
name: High-End Tech E-Commerce
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9cbc1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#83958c'
  outline-variant: '#3a4a43'
  surface-tint: '#00e1ab'
  primary: '#fbfffa'
  on-primary: '#003828'
  primary-container: '#00ffc2'
  on-primary-container: '#007255'
  inverse-primary: '#006c50'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#fffefd'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e1e1'
  on-tertiary-container: '#636464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#36ffc4'
  primary-fixed-dim: '#00e1ab'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513c'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-page: 64px
  section-padding: 128px
---

## Brand & Style
This design system is engineered to evoke a sense of precision, performance, and luxury within the technology sector. The brand personality is "Technical Elegance"—balancing the raw, powerful nature of high-end hardware with a sophisticated, minimalist aesthetic.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**, set against a deep, cinematic dark mode. It utilizes heavy "dark space" to create a premium gallery feel where the product is the sole focus. Immersive elements, such as subtle atmospheric glows and high-fidelity textures, ensure the interface feels like an extension of the hardware it showcases.

## Colors
The palette is dominated by "Obsidian" blacks and "Gunmetal" grays to provide a deep, non-distracting canvas. The primary accent is a vibrant **Electric Cyan**, used sparingly for high-action items, progress indicators, and interactive states to mimic the RGB lighting found in premium peripherals.

- **Primary:** Electric Cyan (#00FFC2) for calls-to-action and critical highlights.
- **Surface Tiers:** Layered grays (from #050505 to #1A1A1A) define the hierarchy of content containers.
- **Metallic Accents:** Muted silver and brushed steel tones (#B0B0B0) are used for secondary icons and borders to provide a tactile, high-end hardware feel.

## Typography
The typography strategy utilizes a dual-font system to bridge the gap between technical precision and readable luxury. 

**Space Grotesk** is used for all headlines and labels. Its geometric, slightly quirky terminals give the UI a futuristic, "engineered" look. Product titles should be set in large, bold weights to dominate the hierarchy.

**Inter** is used for all body copy and technical specifications. It provides a clean, neutral balance to the more expressive headers, ensuring that long-form product descriptions remain highly legible against dark backgrounds.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop, centered within a maximum container width of 1440px to maintain control over product imagery placement. 

Spacing is intentionally generous. We use a "Vertical Rhythm" of 128px between major sections to allow the user's eyes to rest and the product visuals to "breathe." Gutters are wide (32px) to prevent the technical specifications from feeling cluttered. Alignment should be strict and architectural, favoring left-aligned text blocks paired with large-scale, floating product photography.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Atmospheric Lighting** rather than traditional drop shadows.

- **Layering:** Backgrounds use a pure black (#050505). Interactive cards use a semi-transparent dark gray with a subtle `backdrop-filter: blur(20px)`.
- **Glows:** Instead of shadows, high-priority elements use a soft, primary-colored outer glow (bloom effect) to simulate an emissive light source.
- **Borders:** Containers are defined by 1px "Razor" borders in a low-opacity metallic silver or a faint primary color to separate them from the void.

## Shapes
The shape language is "Precision-Cut." Corners are primarily sharp (0px) to reflect the aggressive industrial design of high-end hardware, or use very slight rounding (4px - `rounded-sm`) for a "machined" feel. 

Large-scale sections and images should maintain sharp 90-degree corners. Minor UI elements like buttons and input fields may use the `rounded-sm` setting to provide a hint of approachability without sacrificing the technical aesthetic.

## Components
### Buttons
- **Primary:** Solid Electric Cyan background with black text. Sharp corners. On hover, apply a cyan outer glow.
- **Ghost:** 1px metallic silver border with transparent background. Text is white.

### Cards
- Translucent backgrounds with a subtle top-to-bottom dark gradient.
- 1px "Razor" border (opacity 10%).
- Images should exceed the card boundaries slightly (overflow: visible) to create a 3D effect.

### Input Fields
- Underline-only style or ultra-thin 1px border.
- Focus state triggers a primary color underline and a faint background tint.

### Navigation
- Sticky top-bar with a heavy backdrop blur.
- Minimalist icon-only or caps-label navigation links.

### Technical Spec Chips
- Small, dark gray fills with uppercase `label-caps` text. 
- Used to highlight features like "1ms Response" or "8K Sensor."