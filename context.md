# Sovereign - Project Context & History

This document serves as the comprehensive memory and context file for the Sovereign project. It captures the architecture, the specific design system, database nuances, and a detailed log of all changes and error resolutions made to date. 

Use this file to instantly understand the state of the project when starting a new session.

## 1. Project Overview
- **Name:** Sovereign
- **Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Supabase (PostgreSQL & Auth).
- **Core Concept:** A gamified Life RPG application where users act as a "Seeker" building their "Kingdom" and managing their character's attributes via quests, skills, and buildings.

## 2. Design System: Obsidian Void
The application strictly follows the **Obsidian Void** design system. 
**Aesthetic:** Dark Souls UI meets Notion minimalism. It is a premium game interface, not a generic SaaS dashboard. Every pixel must feel intentional and atmospheric.
**Strict Rules:**
- **No Rounded Corners:** Absolute `rounded-none` on every element (buttons, inputs, cards, borders).
- **Fonts:** 
  - Primary / Headers: `Cormorant` (Serif).
  - Secondary / Body / Data: `Space Grotesk` (Sans).
  - Terminal / System logs: `JetBrains Mono` or default Mono.
- **Color Palette:**
  - Backgrounds: `#080808` (Deep Void), `#121212` (Elevated Void), `#1A1A1A` (Borders/Lines).
  - Text: `#E8E6E0` (Primary text/Bone white), `#5C5C5C` (Secondary text/Ash).
  - Accent: `#C41E1E` (Crimson - used for CTAs, active states, and warnings).
- **Styling Details:** No floating bubbles or generic cards. Inputs use 1px bottom borders instead of bounding boxes. Layouts favor stark, asymmetric column splits (e.g., 65/35 or 4/5/3 grid).

## 3. Database & Backend (Supabase)
The app uses Supabase for Auth and PostgreSQL for the database.
- **RLS (Row Level Security):** Enabled across tables (e.g., `profiles`, `user_quests`). Users can only read/update their own data.
- **Crucial Schema Mapping (The Attribute Mismatch):** 
  There was a mismatch between the legacy frontend attribute names and the production database columns. To avoid altering the production database schema, a mapping layer was introduced in the API routes (`/api/profile/route.ts` and `/api/profile/onboarding/route.ts`).
  *Mapping Rule:*
  - Frontend `attr_vitality` ➔ Database `attr_constitution`
  - Frontend `attr_focus` ➔ Database `attr_wisdom`
  - Frontend `attr_technical` ➔ Database `attr_dexterity`
  - Frontend `attr_leadership` ➔ Database `attr_perception`

## 4. Comprehensive Work Log & Changes

### A. Repository & Deployment Prep
- Removed internal AI logs, unused directories, and sensitive files (`.env`, `design/`, `worklog.md`, `prisma/`, `db/`, etc.) using `git rm -r --cached` to clean the public GitHub repo for Vercel deployment.
- Fixed the build configuration to ensure `npm run build` completes with zero errors.

### B. UI/UX "Obsidian Void" Overhaul
Rewrote the entire frontend to eradicate generic SaaS UI elements and strictly enforce the Obsidian Void rules:
- **Global & Layout:** Adjusted `globals.css` and the Sidebar to use stark borders, `Cormorant` / `Space Grotesk` typography, and `#080808` backgrounds.
- **Dashboard (`/dashboard`):** Implemented a 4/5/3 column grid. Converted quest cards to stark border-bottom layouts.
- **Quests (`/quests`):** Removed generic tabs, implementing strict text-based sorting and flat quest lists.
- **Character (`/character`):** Styled the attribute bars with 1px tracking lines and serif headers.
- **Kingdom (`/kingdom`):** Overhauled building cards with 65/35 visual splits.
- **Companion (`/companion`):** Eradicated chat bubbles. AI messages are `Cormorant italic 22px text-[#E8E6E0]`, while User messages are `Space Grotesk 14px text-[#5C5C5C]` right-aligned. Input field is a single 1px bottom border.
- **Settings (`/settings`):** Stripped bounding boxes from inputs, replacing them with precise bottom borders that glow crimson (`#C41E1E`) on focus.

### C. Authentication & Onboarding Fixes
- **Sign Up Disabled:** Temporarily disabled new account registration on `/signup` and hardcoded instructions for testers to use the `admin@gmail.com` (pw: `admin123`) credentials.
- **Onboarding API Bug Fix (`/api/profile/onboarding`):**
  - *Error:* The onboarding API was silently failing (returning a 500 error) during profile creation due to the missing schema columns (`attr_focus`, etc.).
  - *Fix:* Extracted the attributes from the frontend POST request, mapped them to the production database columns (e.g., `attr_wisdom`), and securely injected them into the Supabase `insert()` payload.
  - *Error Logging:* Added detailed error logging (`profileError.message` and `profileError.code`) to the JSON response so any future RLS or schema insertion errors appear directly in the browser's network tab/console.
  - *Schemas:* Updated `src/lib/schemas.ts` (`onboardingSchema`) to accept the frontend attribute names as optional Zod fields.

## 5. Current Status
The codebase is clean, successfully builds, and is actively deployed on Vercel. The entire UI follows the Obsidian Void aesthetic, and the backend schema mismatches have been resolved at the API mapping layer. The app is ready for the next phase of feature development.
