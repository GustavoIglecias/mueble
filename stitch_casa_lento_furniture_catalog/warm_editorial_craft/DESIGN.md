---
name: Warm Editorial Craft
colors:
  surface: '#fff8f4'
  surface-dim: '#dfd9d5'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2ef'
  surface-container: '#f3ede9'
  surface-container-high: '#ede7e3'
  surface-container-highest: '#e7e1de'
  on-surface: '#1d1b19'
  on-surface-variant: '#57423b'
  inverse-surface: '#32302e'
  inverse-on-surface: '#f6efec'
  outline: '#8a726a'
  outline-variant: '#dec0b7'
  surface-tint: '#a23e18'
  primary: '#9f3c16'
  on-primary: '#ffffff'
  primary-container: '#bf542c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59c'
  secondary: '#635e56'
  on-secondary: '#ffffff'
  secondary-container: '#eae1d7'
  on-secondary-container: '#69635c'
  tertiary: '#a03b15'
  on-tertiary: '#ffffff'
  tertiary-container: '#c1532b'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822801'
  secondary-fixed: '#eae1d7'
  secondary-fixed-dim: '#cdc5bc'
  on-secondary-fixed: '#1f1b15'
  on-secondary-fixed-variant: '#4b463f'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832600'
  background: '#fff8f4'
  on-background: '#1d1b19'
  surface-variant: '#e7e1de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-desktop: 4rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3.5rem
---

## Brand & Style

This design system embodies the confluence of Scandinavian restraint and Mediterranean sun-baked warmth. Built for an artisanal residential furniture catalogue and curation suite, the visual language prioritizes tactile materiality, unhurried negative space, and architectural precision.

### Personality & Emotional Response
- **Quiet Luxury:** Dignified, deliberate, and free of superficial ornamentation. Confidence conveyed through meticulous proportions and typographic clarity.
- **Tactile Materiality:** Evokes raw plaster, hand-turned oak, slubbed linen, and porous terracotta.
- **Editorial Intent:** Browsing mirrors a high-production archival publication rather than a transactional storefront.

### Design Movement
- **Warm Editorial Minimalism:** Heavy emphasis on breathable margins, hairline dividers, asymmetric composition, and delicate tonal layering. Structural layouts ground the delicate balance between classical serif display typography and functional humanist geometry.

## Colors

The palette references raw construction and studio craft elements: lime plaster, aged vellum, forged iron, and fired clay.

### Role Mapping
- **Canvas Base (`#FAF8F5`):** Alabaster foundation across all main viewports. Avoids sterile pure whites to retain ambient warmth.
- **Surface Elevation (`#F3EFEA`):** Parchment tint applied to secondary containers, preview trays, and specification cards.
- **Primary Accent (`#C85A32` / `#B94D26`):** Sun-drenched terracotta reserved for primary actions, critical interactive selections, and key status highlights.
- **Neutral Primary (`#1C1A18`):** Deep charcoal anthracite for headers, primary values, and high-emphasis body text. Replaces pure black to avoid jarring optical contrast.
- **Neutral Secondary (`#706A62`):** Grounded taupe for dimensions, secondary meta-tags, structural labels, and inactive icon states.
- **Structural Outlines (`#E7E1D8`):** Fine architectural line work for table borders, dividers, and card boundaries.

## Typography

The typographic hierarchy pairs high-character editorial serif titles with balanced, geometric humanist forms for inventory management, specifications, and navigational controls.

### Implementation Guidelines
- **Editorial Headings:** Use `Playfair Display` for collection titles, editorial banners, piece names, and studio essays. Keep weights light-to-medium (`400` to `500`) to let letterforms breathe.
- **Specification & Management UI:** Use `Plus Jakarta Sans` for pricing, item dimensions (H × W × D), materials tables, filters, and forms.
- **Micro Labels:** Set `label-sm` in all caps with deliberate tracking (`0.08em`) when indicating status, batch runs, or wood finish categories.

## Layout & Spacing

Layouts follow an asymmetric editorial grid anchored by wide exterior margins that frame furniture photography like gallery plates.

### Structural Framework
- **Desktop (12 Columns):** Fluid layout capped at `1440px`. Column gutter is `2.5rem` (`gutter-desktop`) with outer canvas margin of `4rem` (`margin-desktop`).
- **Tablet (8 Columns):** Fluid layout with `1.5rem` gutters and `2rem` margins.
- **Mobile (4 Columns):** Unified single-flow or tight dual-grid with `1rem` gutters and `1.25rem` screen margins.

### Spacing Rhythm
- **Catalogue Grids:** Employ alternating vertical alignments (e.g., left-column offsets using `space-xl`) to prevent monotonous catalog rows and reflect architectural journals.
- **Interior Details:** Use `space-md` between metadata label pairs and `space-lg` to separate functional spec blocks.

## Elevation & Depth

Visual depth avoids artificial drop shadows, relying instead on tonal surface shifts and fine structural contours.

### Depth Hierarchy
- **Level 0 (Canvas):** Pure `#FAF8F5`. Used for primary scroll viewports and article bodies.
- **Level 1 (Grounded Cards):** `#F3EFEA` fill bordered by a 1px solid `#E7E1D8` perimeter outline. Completely flat without shadow.
- **Level 2 (Floating Overlays / Drawers / Quick-views):** `#FAF8F5` surface with a diffuse, warm ambient shadow:
  `box-shadow: 0 12px 32px -4px rgba(28, 26, 24, 0.06), 0 4px 12px -2px rgba(28, 26, 24, 0.03);`
- **Level 3 (Modals & Focus Architecture):** Semi-opaque matte veil backdrop (`rgba(28, 26, 24, 0.4)`) with an elevated `#FAF8F5` dialog bounded by a distinct `1px solid #E7E1D8` outline.

## Shapes

Corner radii balance organic stone softness with crisp joinery precision. 

### Geometric Rationale
- Standard elements (interactive inputs, smaller buttons, chip filters) use a balanced `0.5rem` (`roundedness: 2`).
- Feature cards, imagery containers, and drawer panels scale up to `rounded-lg` (`1rem`) and `rounded-xl` (`1.5rem`) to echo hand-sanded timber and soft Mediterranean masonry.
- Pill forms are strictly avoided for core UI, keeping forms structured rather than playful.

## Components

### Buttons
- **Primary:** Background in rich Terracotta (`#C85A32`), text in Alabaster (`#FAF8F5`). Subtle hover shift to burnt sienna (`#B94D26`). Padding: `0.75rem 1.75rem`. Radii: `0.5rem`.
- **Secondary / Outlined:** Transparent fill with `1px solid #E7E1D8`, text in Deep Anthracite (`#1C1A18`). On hover: surface shifts to `#F3EFEA` with border darkening to `#706A62`.
- **Ghost:** Anthracite text with minimal baseline underline for editorial lookbooks; underline animates width on hover.

### Cards (Furniture & Showcase)
- Composed on Parchment (`#F3EFEA`) with `1px solid #E7E1D8` and `1rem` radius.
- Imagery framed within an aspect-ratio locked container (`4:5` for pieces, `16:10` for room environments) with `0.75rem` inner padding.
- Text block below image: Piece name in `headline-sm`, subtitle/material in `body-sm` (`#706A62`), and dimensions in `label-md`.

### Chips & Attribute Filters
- Material tags (e.g., "Oiled Oak", "Travertine", "Bouclé") use a minimal badge: `#F3EFEA` background, `1px solid #E7E1D8`, `0.375rem` vertical by `0.75rem` horizontal padding. Selected state swaps fill to Anthracite (`#1C1A18`) with Alabaster typography.

### Input Fields & Controls
- **Text Inputs:** Bordered by `#E7E1D8` on transparent background. On active focus: border deepens to `#1C1A18` with zero outer glow. Labels set in `label-sm` resting above the field in `#706A62`.
- **Checkboxes & Radios:** Handled via geometric unadorned squares/circles with `1px solid #706A62`. Checked state fills with `#C85A32` featuring a crisp Alabaster checkmark.

### Dimension & Spec Tables
- Clean tabular layouts separated solely by horizontal hairlines in `#E7E1D8`. Metrics (Weight, Width, Depth, Height, Lead Time) set in `label-md` with muted tone, aligned opposite bold values in `#1C1A18`.