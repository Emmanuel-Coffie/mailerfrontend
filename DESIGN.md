---
name: GreenHaul Solutions
description: A correspondence studio for audience operations and visual email composition.
colors:
  primary: "#245c58"
  dark: "#193f3d"
  bright: "#3f7b74"
  soft: "#e8f0ed"
  greenBorder: "#cbdcd5"
  background: "#f3f5f7"
  surface: "#ffffff"
  text: "#203438"
  secondary: "#627175"
  muted: "#78878b"
  border: "#dfe5e8"
  subtle: "#eef2f3"
  sidebar: "#173f40"
  sidebarSurface: "#204a4a"
  sidebarText: "#f1f6f4"
  sidebarMuted: "#b4c9c6"
  success: "#287457"
  warning: "#9a6418"
  error: "#bd3e3e"
  info: "#356b93"
typography:
  display:
    fontFamily: "Manrope, Inter, sans-serif"
    fontSize: "clamp(26px, 2.7vw, 36px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, Inter, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
rounded:
  chip: "6px"
  control: "8px"
  base: "10px"
  surface: "12px"
spacing:
  action-gap: "8px"
  compact: "16px"
  grid-gap: "20px"
  panel: "26px"
  page: "38px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "6px 18px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.surface}"
    padding: "{spacing.panel}"
  navigation:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebarText}"
  chip:
    rounded: "{rounded.chip}"
    height: "27px"
---
# Design System: GreenHaul Solutions

## Overview

**Creative North Star: "The Correspondence Studio"**

A calm operations workspace opens into a spacious email workbench. Ink teal navigation, cool porcelain surfaces and pale eucalyptus selections give dense campaign information a clear hierarchy. Manrope headings and Inter body text make the interface feel composed and practical.

The supplied logo remains the identity anchor. `public/brand-logo.jpg` is the exact user asset, unchanged; do not redraw or recolor it. Starter email artwork is composed from HTML and CSS, with muted content-specific colors.

**Key Characteristics:**

- Ink teal navigation and flat bordered work surfaces.
- Manrope headings paired with compact Inter interface text.
- A selectable email canvas with a contextual inspector.

## Colors

The frontmatter records the shared palette from `src/theme.ts`. Its `colors` object is the runtime authority: `MuiCssBaseline` exposes each entry as `--color-<key>`, and `src/styles.css` consumes these variables through layout aliases.

### Primary

Deep teal `primary` identifies primary actions; `dark` and `bright` supply its theme variants. Eucalyptus `soft` and `greenBorder` support quieter interactions. The `sidebar` family distinguishes persistent navigation.

### Neutral

Porcelain `background`, white `surface`, and restrained `border`/`subtle` lines establish hierarchy. Ink `text` carries content; `secondary` carries supporting copy. Use semantic success, warning, error and info colors for feedback. Status chips additionally own explicit paired foreground/background tones in `ui.tsx`.

**The Shared Palette Rule.** Change shared colors in the theme and preserve the CSS variable bridge.

## Typography

**Display Font:** Manrope, falling back to Inter and sans-serif.  
**Body Font:** Inter, falling back to sans-serif.

Display titles use the responsive frontmatter scale; unmodified MUI h1 uses 34px. Headline and title roles distinguish panel headings from compact labels. Body copy uses the frontmatter scale; secondary copy uses 13px with 1.6 line height. Page descriptions are limited to 65ch. Metrics use tabular numerals.

Email content has its own portable Arial, Georgia or Verdana font choice. Do not impose application web fonts on exported email.

## Layout

The desktop rail is 232px, or 80px collapsed, beside a 76px utility header. Pages have a 1680px maximum width and 38px desktop padding. Flat panels use the documented panel spacing with 20px grid gaps.

At 1200px and below, page padding narrows and the designer inspector moves below the canvas. At 899px and below, navigation becomes a drawer, the header is 64px and multicolumn operational layouts stack. At 600px and below, page side padding becomes 16px and the designer stacks tools, canvas and inspector. At 1700px and above, the designer columns widen.

The designer uses a 600px maximum email canvas and a 375px mobile preview. Its desktop tool and inspector columns are 170px and 240px. The six starter designs form three columns on desktop and two at the narrow breakpoint.

## Elevation & Depth

Cards and buttons are flat, separated by borders and tone. Dialogs and menus use structural shadows; the email paper and welcome letter use restrained ambient depth. Do not describe this implementation as entirely shadow-free.

### Shadow Vocabulary

- Dialog: `0 24px 80px rgba(23,63,64,.18)`.
- Menu: `0 12px 32px rgba(23,63,64,.12)`.
- Email paper: `0 12px 32px #20343812`.

## Shapes

Controls use gently curved corners; panels use the larger surface radius. Chips are compact rounded rectangles. Borders are typically 1px. The fixed sidebar remains square-edged. The theme base radius is distinct from explicit card and control overrides.

## Components

### Buttons

Primary actions use teal with white text, a 42px minimum height and 18px horizontal padding. Outlined secondary actions use a white surface and a quiet border; hover shifts to eucalyptus. Icon buttons normally reserve 40px in each dimension. Background transitions last 160ms.

### Chips

Status chips combine a visible status label and dot with a semantic foreground/background pair. Their color mapping belongs to `StatusChip`, not to individual pages.

### Cards / Containers

White, bordered, rounded work surfaces use the surface token. Default panels have 26px padding; mobile panels reduce to 20px. Loading and empty states reuse the same content boundaries.

### Inputs / Fields

MUI outlined controls use white surfaces, quiet borders and a 44px minimum input height. Labels, hints, errors and disabled behavior belong to the shared form components. Preserve visible keyboard focus; the global focus outline is 3px with a 3px offset.

### Navigation

The teal rail uses pale text, brighter hover and a pale eucalyptus active surface. The active link includes an arrow and stronger weight. Mobile navigation is a MUI drawer.

### Visual Email Designer

Select an actual email section to edit its content in the inspector. Eight section types support headings, text, buttons, images, dividers, columns, spacing and footers. Move, duplicate, remove, undo and redo controls operate on the same content. Selection uses an inset teal outline; keyboard focus uses a stronger blue outline.

The designer includes visual, HTML and preview views. Existing unrecognized HTML stays intact until an explicit replacement. Email rendering and metadata serialization belong to `src/email/design.ts`; the editor uses existing template HTML/text fields.

Reduced-motion preferences suppress animation, transitions and smooth scrolling. Forced-colors rules restore visible selected outlines and surface borders.

## Do's and Don'ts

### Do:

- Do reuse theme colors through the CSS variable bridge.
- Do preserve the exact supplied logo asset.
- Do retain keyboard focus, reduced-motion and forced-colors treatments.
- Do keep email rendering independent of application web fonts.

### Don't:

- Don't create page-specific replacements for shared form and table behaviors.
- Don't replace existing HTML silently when opening the visual designer.
- Don't claim demo previews verify delivery or rendering in every email client.

