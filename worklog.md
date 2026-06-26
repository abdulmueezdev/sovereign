---
Task ID: 1
Agent: Super Z (main)
Task: Scaffold Next.js 16 with TypeScript, Tailwind 4, shadcn; Configure Supabase with @supabase/ssr; Set up auth (login/signup pages, middleware, session handling); Apply Obsidian Void theme

Work Log:
- Initialized fullstack dev environment (Next.js 16.1.3 with Turbopack)
- Installed @supabase/ssr@0.12.0 and @supabase/supabase-js@2.108.2
- Created lib/supabase/client.ts (browser client using createBrowserClient)
- Created lib/supabase/server.ts (server client using createServerClient with cookie handling + admin client)
- Created middleware.ts with Supabase auth session refresh + route protection (protected routes: /dashboard, /quests, /character, /kingdom, /companion, /settings, /onboarding; auth routes: /login, /signup)
- Created SQL migration 001_initial_schema.sql with all 9 tables (profiles, quest_templates, user_quests, buildings, user_buildings, companion_messages, achievements, user_achievements, weekly_xp) + all RLS policies + updated_at trigger + indexes. Applied Replacement 4 (house_id has no DEFAULT)
- Created SQL migration 002_seed_data.sql with all 6 buildings, 18 achievements, and 100 quest templates (25 per domain: 8 easy / 10 medium / 5 hard / 2 epic)
- Created contexts/UserContext.tsx with auth state management (user, profile, loading, refetchProfile, signOut)
- Created login page with email/password form and dark theme
- Created signup page with email/password/confirm form and success state
- Created landing page (/) with brand messaging and CTA buttons
- Created blank dashboard page (/dashboard) that redirects unauthenticated users to /login and users without profiles to /onboarding
- Created placeholder onboarding page (/onboarding)
- Created 404 page with companion-voiced message
- Applied Obsidian Void theme (globals.css): dark-first, #080808 background, #C41E1E crimson primary, #8B7355 gold accent, custom CSS variables for all tokens
- Set up root layout with Cormorant Garamond (serif), Space Grotesk (sans), Space Mono (mono) via next/font/google
- Created game logic library files: lib/xp.ts, lib/attributes.ts, lib/buildings.ts, lib/achievements.ts, lib/weekly.ts, lib/animations.ts
- Created API routes: /api/profile (GET), /api/profile/onboarding (POST), /api/profile/change-house (POST)
- Created .env.local template (removed NEXTAUTH_SECRET per Replacement 11)
- Created .github/workflows/keepalive.yml (Supabase keepalive cron)
- Added placeholder Supabase env vars to .env for local dev
- ESLint passes clean
- Agent Browser verified all 4 routes: / (landing), /login, /signup, /dashboard (redirects to /login when unauthenticated)

Stage Summary:
- All 15 subtasks completed
- App renders correctly with dark Obsidian Void theme
- Auth flow: unauthenticated → /login → /dashboard (redirect working)
- SQL migrations and seed data ready to apply to real Supabase project
- 100 quest templates seeded across 4 domains
- Game logic library (xp, attributes, buildings, achievements, weekly, animations) implemented per spec
- All 13 spec replacements applied
