---
name: Sovereign Obsidian Void
colors:
  surface: '#111111'
  surface-dim: '#0F0F0F'
  surface-bright: '#1A1A1A'
  surface-container-lowest: '#000000'
  surface-container-low: '#080808'
  surface-container: '#0A0A0A'
  surface-container-high: '#111111'
  surface-container-highest: '#151515'
  on-surface: '#E8E4DD'
  on-surface-variant: '#5C5C5C'
  inverse-surface: '#E8E6E0'
  inverse-on-surface: '#080808'
  outline: '#1A1A1A'
  outline-variant: '#2A2520'
  surface-tint: '#C41E1E'
  primary: '#C41E1E'
  on-primary: '#FFFFFF'
  primary-container: '#8B3A2A'
  on-primary-container: '#FFFFFF'
  inverse-primary: '#FFFFFF'
  secondary: '#1A1A1A'
  on-secondary: '#B0AAA0'
  secondary-container: '#2A2520'
  on-secondary-container: '#E8E4DD'
  tertiary: '#8B7355'
  on-tertiary: '#1E1E1E'
  tertiary-container: '#1E1E1E'
  on-tertiary-container: '#8B7355'
  error: '#EF4444'
  on-error: '#FFFFFF'
  error-container: '#C41E1E'
  on-error-container: '#FFFFFF'
  background: '#080808'
  on-background: '#E8E4DD'
  surface-variant: '#151515'
typography:
  display-lg:
    fontFamily: Cormorant Garamond
    fontSize: 80px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Cormorant Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Cormorant Garamond
    fontSize: 22px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.2em
rounded:
  sm: 0
  DEFAULT: 0
  md: 0
  lg: 0
  xl: 0
  full: 0
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

# Design System: Sovereign

## 1. Visual Theme & Atmosphere
The Sovereign design system embodies the "Obsidian Void" aesthetic—a dark-first, minimalist approach inspired by high-end editorial layouts and intense anime leveling interfaces. The visual language relies heavily on absolute black (`#080808`), void spaces, and sharp corners to evoke discipline, struggle, and raw progression. 

The atmosphere is intentionally stark and unforgiving. It avoids modern, bubbly SaaS conventions completely, rejecting rounded corners (`radius: 0`), soft drop shadows, and cheerful palettes. Instead, it utilizes sharp borders (`#1A1A1A`), minimalist text alignment, and a singular, blood-red crimson accent (`#C41E1E`) to drive focus toward user progression and achievement.

## 2. Color Palette & Roles
### Primary Foundation
- **Background Void:** `#080808` (Main canvas, deep, heavy).
- **Surface/Card:** `#111111` (Slightly elevated surfaces without shadows).
- **Subtle Muted:** `#151515` (Used for faint highlights or disabled states).

### Accent & Interactive
- **Crimson (Primary Accent):** `#C41E1E` (The singular source of energy. Used for XP bars, primary buttons, and critical alerts).
- **Ember (Secondary Accent):** `#8B3A2A` (Hover states and gradients).
- **Gold (Tertiary Accent):** `#8B7355` (Used sparingly for high-tier achievements or rare elements).

### Typography & Text Hierarchy
- **Primary Text:** `#E8E6E0` (High contrast, slightly warm off-white).
- **Muted Text:** `#5C5C5C` (Used for lore, descriptions, and secondary metadata).

### Functional States
- **Destructive/Error:** `#EF4444`.
- **Borders/Outlines:** `#1A1A1A` to `#2A2520` (Thin, strict architectural lines).

## 3. Typography Rules
### Hierarchy & Weights
- **Hero/Display (Cormorant Garamond):** Used exclusively for titles and massive stat numbers. Exudes elegance and history.
- **UI/Body (Space Grotesk):** The workhorse font for descriptions, dialogs, and main interface labels. Clean and highly legible.
- **Data/Labels (Space Mono):** Used for XP amounts, coordinates, timestamps, and tiny UI labels. Always small (10px - 12px), often uppercase with wide letter-spacing (`0.2em`).

### Spacing Principles
- **Editorial Margins:** Large left margins for desktop (64px sidebar rail + 32px padding). Content breathes.
- **Rhythm:** An 8px base unit controls layout.

## 4. Component Stylings
### Buttons
- **Primary:** Solid crimson (`#C41E1E`) background, white text. No rounded corners (`rounded-none`).
- **Secondary (Outline):** Transparent background, 1px `#2A2520` border. Text is muted off-white.
- **Ghost/Link:** Text only, underline offset, turns crimson on hover.

### Cards & Progress Bars
- **Cards:** No backgrounds (`bg-transparent`) or extremely dark (`#111111`). Content sits directly on the void.
- **Progress/XP Bars:** Extremely thin (2px height). Track is `#1A1A1A`. Fill is a solid crimson `#C41E1E`. Occasionally uses a subtle CSS `pulse-glow` animation for leveling up.
- **Borders:** Global `* { border-radius: 0 !important; }`. All elements are sharp.

### Navigation
- **Desktop Sidebar:** Fixed 64px left rail, background `#080808`. Separated by a 1px `#1A1A1A` border. Features rotated vertical text ("THE VOID") in Space Mono.
- **Mobile Navigation:** Fixed 56px bottom bar, identical styling to sidebar.

## 5. Layout Principles
### Grid & Structure
- **Desktop:** Left-aligned 64px sidebar. Main content fluid but constrained.
- **Mobile:** Single column flow, bottom tab bar.

### Whitespace Strategy
- Elements are separated by vast void spaces rather than encapsulated in bounded boxes.

### Responsive Behavior & Touch
- **Breakpoints:** Shifts at the `md` breakpoint (768px) to hide the sidebar and reveal the bottom nav.

## 6. Design System Notes for Stitch Generation
### Language to Use
"Create a sharp, minimalist interface in the Obsidian Void style. Use absolute black backgrounds (#080808) with zero border radius on all elements. Use Cormorant Garamond for elegant titles and Space Mono for technical labels."

### Color References
- Void Background: `#080808`
- Text Primary: `#E8E6E0`
- Crimson Accent: `#C41E1E`
- Stone Border: `#1A1A1A`

### Component Prompts
- **Quest Card:** "A minimalist quest row with no background color, separated by a 1px #1A1A1A border. A sharp checkbox on the left, Space Grotesk text, and a tiny Space Mono XP label in crimson."
- **XP Bar:** "A 2px high horizontal line. The empty track is dark gray #1A1A1A. The fill is solid crimson #C41E1E."
