# Sovereign — Game Development Specification v1.0

**For: GLM 5.2 / Antigravity AI Coding Agent**
**Build target: Next.js 14 web application**
**Budget: $0 (free tiers only until monetization)**
**Document completeness: Every system, formula, table, and API endpoint specified. No TBDs.**

> **How to use this document:** Read every section before writing any code. Every section is required. Phase labels (Phase 1, Phase 2, Phase 3+) indicate build order — implement only Phase 1 features until explicitly instructed otherwise. When a decision is marked FIXED, do not deviate from it.

---

## Table of Contents

1. [Product Definition & Scope](#1-product-definition--scope)
2. [Technical Architecture](#2-technical-architecture)
3. [Complete Data Model](#3-complete-data-model)
4. [Game Systems Specification](#4-game-systems-specification)
5. [API Specification](#5-api-specification)
6. [State Management & Logic Flow](#6-state-management--logic-flow)
7. [Animation & Interaction Specification](#7-animation--interaction-specification)
8. [Asset Inventory](#8-asset-inventory)
9. [Free-Tier Budget & Limits](#9-free-tier-budget--limits)
10. [Build Procedure — Week by Week](#10-build-procedure--week-by-week)
11. [Testing & Validation Plan](#11-testing--validation-plan)
12. [Risk Analysis & Mitigation](#12-risk-analysis--mitigation)

---

## 1. Product Definition & Scope

### 1.1 What This Product Is

Sovereign is a browser-based web application that turns real-life self-improvement into an RPG kingdom-building game. Users complete real-world actions — studying, exercising, building skills, leading — and those actions award XP, level up their character, grow attributes, and unlock buildings in a persistent kingdom.

It is NOT a to-do list. It is NOT a habit tracker with cosmetic decoration. It is an identity system that happens to use quests as its input mechanism.

### 1.2 What This Product Is Not

- Not a downloadable game (no Unity, Godot, or game engine)
- Not a mobile app (no React Native or Flutter)
- Not a social media platform
- Not a habit tracker
- Not a task manager
- Not a dashboard or analytics tool

The kingdom map is a styled CSS div layout. The XP bar is a CSS transition. The AI companion is a fetch call. Everything runs in a browser via URL.

### 1.3 Target Platform

**FIXED:** Next.js 14 web application, deployed on Vercel, accessed via browser at a custom domain.

Same technical form factor as Linear, Notion, and Habitica — all of which are React/Next.js web apps with game-like UI.

### 1.4 Target User

Primary demographic: Ambitious males aged 18–24 who consume self-improvement content (YouTube, Reddit, podcasts), are familiar with gaming progression systems (anime leveling aesthetics, RPG stat screens), and feel productivity apps are either too boring or too childish.

**IMPORTANT — This demographic is a hypothesis, not a fact.** The 20-person test cohort in Phase 2 Week 14 must validate this assumption. The product should be built as though the assumption is true, but the retention metrics will reveal whether it holds.

Evidence supporting the hypothesis:
- HabitForge (Solo Leveling-inspired habit tracker) gained a user base in this demographic with anime-leveling aesthetics
- Reddit communities such as r/selfimprovement, r/nosurf, and r/getdisciplined skew young male
- LifeUp has 280K+ downloads with user reviews indicating gaming-oriented self-improvement seekers

Evidence against: LifeUp's top complaint is that it "lacks a real game." Habitica lost its community spaces in 2023 and its guilds in 2023 due to moderation issues. This means the category has a demand problem (users want a more serious experience) and a supply gap.

### 1.5 Core Loop

**Single session (under 5 minutes for casual engagement):**

```
Open app
→ Check active quests on Dashboard
→ Mark objective(s) complete on one quest
→ See XP animation fill the bar
→ [Optional] Check kingdom for any building unlocks
→ [Optional] Message companion
→ Close app
```

**Daily loop (5–15 minutes for power users):**

```
Morning: Check companion for daily quest recommendation
→ Browse Quest Board for available quests
→ Start 1–2 new quests
→ Mark progress on active quests

Evening: Mark completions
→ XP award and animation
→ Level-up gate if threshold crossed
→ Building unlock check
→ Achievement check
→ Check guild weekly progress
```

**Weekly loop:**

```
Monday: House weekly collective XP goal resets
→ New featured quest appears on Quest Board
→ Review progress toward Kingdom Level milestone

Friday: Check House leaderboard position
→ Final push on active quests before week resets
```

### 1.6 Session Length Targets

- Minimum meaningful session: 30 seconds (mark one objective complete)
- Casual session: 2–5 minutes (check dashboard, update quest, view kingdom)
- Power user session: 10–20 minutes (quest board review, companion chat, character review)
- Onboarding session: 90 seconds maximum (3 steps, one page)

### 1.7 Win State and Endgame

There is no win condition. Sovereign is an ongoing identity game.

Milestones that replace a "win state":
- Reach Level 10 (Journeyman status)
- Build all 6 Phase 1 kingdom buildings
- Complete quests in every domain (Renaissance achievement)
- Reach Kingdom Level 5 (Phase 2)
- Reach the top 10 of the House weekly leaderboard (Phase 2)

The "endgame" is a high-level character with a complete kingdom, a recognizable title in the leaderboard, and a reputation in their House. Phase 3 will introduce prestige mechanics (class reset with bonuses) for users who have reached Level 50+.

---

## 2. Technical Architecture

### 2.1 Framework and Engine

**FIXED: Next.js 14 with App Router. No other framework is acceptable.**

Justification:
- Single repo for frontend, API routes, and server components
- App Router enables server-side data fetching without separate API layer for most reads
- Vercel deploys Next.js natively with zero configuration
- shadcn/ui is built for Next.js + Tailwind
- Supabase has a first-class Next.js integration package

Do NOT use: Vite+React (no SSR, no API routes), Remix (less ecosystem support with Supabase), SvelteKit (unfamiliar tech stack risk).

### 2.2 Frontend Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 14.2.x | App Router, SSR, API Routes |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS |
| Components | shadcn/ui | latest | Accessible primitives: Button, Dialog, Input, Tabs, Badge, Sonner |
| Fonts | next/font/google | built-in | Cormorant Garamond, Space Grotesk, Space Mono |
| Animations | CSS transitions only (Phase 1) | — | 90% of animations need no library |
| Icons | Lucide React | latest | Bundled with shadcn; used for UI only, not kingdom icons |
| State | React Context + useState | built-in | No external state library at Phase 1 |
| Form handling | React Hook Form + Zod | latest | Onboarding and settings forms only |

**No Redux. No Zustand. No Jotai.** React Context is sufficient for Phase 1 auth state and user profile.

### 2.3 Backend / BaaS

**FIXED: Supabase only. Do not split across multiple services.**

| Supabase Feature | Used For | Free Limit | Phase |
|---|---|---|---|
| Auth | Email+password login, Google OAuth, session tokens | 50,000 MAU | 1 |
| PostgreSQL | All data: profiles, quests, buildings, messages | 500MB | 1 |
| Row Level Security | Users read only their own rows | Built-in | 1 |
| Edge Functions | AI companion calls, quest generation (server-side Gemini calls) | 500K/month | 1 |
| Realtime | House/guild activity feed | 200 concurrent | 2 |
| Storage | Avatar uploads (avoid — use DiceBear instead) | 1GB | Never |

**Critical operational note:** Supabase free tier pauses projects after 7 consecutive days of zero database requests. To prevent this during development: set up a GitHub Actions scheduled workflow to ping the health endpoint every 3 days. Do NOT let the project pause — data is preserved but the downtime breaks demos.

**Inactivity ping (add to `.github/workflows/keepalive.yml`):**
```yaml
name: Supabase Keepalive
on:
  schedule:
    - cron: '0 12 */3 * *'  # Every 3 days at noon UTC
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl -s "${{ secrets.SUPABASE_URL }}/rest/v1/" -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" > /dev/null
```

### 2.4 AI Integration

**FIXED: Gemini 3 Flash as primary model. Gemini 2.0 Flash was deprecated and shut down June 1, 2026 — do not reference it anywhere in code.**

| Service | Model | Free Limit | RPM | RPD | Use |
|---|---|---|---|---|---|
| Google AI Studio | gemini-3-flash (or `gemini-2.5-flash` if 3 unavailable) | Free, no credit card | 10 | 1,500 | Companion chat, quest lore personalization |
| Groq | llama-3.1-8b-instant | Free, no credit card | varies | 14,400 | Fallback when Gemini unavailable |

**API key management:**
- `GEMINI_API_KEY` — server-side only, in `.env.local`, never in client code
- Never prefix with `NEXT_PUBLIC_` — would expose the key in browser
- All Gemini calls go through Next.js API Route Handlers in `/app/api/`

**AI strategy:** Template-based + light AI personalization. The AI does NOT generate quest content. It only:
1. Personalizes lore text for existing quest templates (1 API call per quest generation, ~20 words output)
2. Responds to companion chat messages (1 API call per message, 200 token max output)

At 50 DAU × 3 AI calls/day = 150 calls/day. Well within 1,500 RPD free limit.

**Rate limit handling:**
```typescript
// lib/gemini.ts — exponential backoff on 429
async function callGemini(prompt: string, maxRetries = 3): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(GEMINI_API_URL, { ... })
      if (response.status === 429) {
        await sleep(Math.pow(2, attempt) * 1000) // 1s, 2s, 4s
        continue
      }
      return await parseResponse(response)
    } catch (e) {
      if (attempt === maxRetries - 1) throw e
    }
  }
  return RULE_BASED_FALLBACK // If all retries fail, use rule-based response
}
```

**Fallback to Groq:** If Gemini returns 429 after 3 retries, call Groq's llama-3.1-8b-instant with the same prompt. If Groq also fails, return a rule-based response from the RULE_RESPONSES dictionary (no API call).

### 2.5 Hosting and Deployment

| Service | Use | Free Tier | Commercial Use |
|---|---|---|---|
| Vercel | Next.js frontend + API routes | 100GB bandwidth, 100K function invocations, 10s timeout | **NOT PERMITTED on Hobby plan** |
| Supabase | Database + Auth | 500MB DB, 50K MAU | Permitted |
| Cloudflare | DNS + SSL for custom domain | Free forever | Permitted |

**CRITICAL — Vercel commercial use policy:** The Vercel Hobby plan explicitly prohibits commercial use in its Terms of Service. For Phase 1 (free product with 20–50 test users, no payment processing), Hobby is acceptable. The moment any paid tier is introduced or ads are run, the project MUST be on Vercel Pro ($20/month).

**10-second function timeout on Hobby:** Gemini API calls typically complete in 1–3 seconds. This is well within Hobby's 10-second limit. If streaming is implemented later (Phase 2), that extends function duration and may require Pro. Do not implement streaming in Phase 1.

**Deployment flow:**
```
Push to GitHub main branch
→ Vercel auto-deploys (CI/CD is built in, zero config)
→ Preview URL generated for every PR
→ Production URL updates on merge to main
```

**Environment variables required:**
```
NEXT_PUBLIC_SUPABASE_URL=             # Public, safe to expose
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # Public, safe to expose (RLS protects data)
SUPABASE_SERVICE_ROLE_KEY=            # NEVER expose — server-side only
GEMINI_API_KEY=                       # NEVER expose — server-side only
GROQ_API_KEY=                         # NEVER expose — server-side only
NEXTAUTH_SECRET=                      # Random string, server-side only
```

### 2.6 Asset Pipeline

**Kingdom building icons:**
- Source: Game-Icons.net (CC-BY license — attribution required in footer)
- Format: SVG, inline embedded or fetched as static files in `/public/icons/`
- Rendering: CSS `filter: brightness(0) invert(0.9)` for warm white on dark background
- Do NOT use `<img>` tags for SVG icons — use inline `<svg>` or CSS background-image for better control

**Character avatars:**
- Source: DiceBear API — `https://api.dicebear.com/9.x/adventurer/svg?seed={userId}&backgroundColor=080808`
- No uploads, no storage costs, consistent per user ID
- Fallback: First character of character name if DiceBear unreachable

**Fonts:**
- All loaded via `next/font/google` in `app/layout.tsx` — no external HTTP request at runtime
- Cormorant Garamond: weights 400, 700 (normal and italic)
- Space Grotesk: weights 400, 500, 600
- Space Mono: weights 400, 700

---

## 3. Complete Data Model

### 3.1 Database Tables — Phase 1

All tables are in the `public` schema. All tables have Row Level Security enabled.

```sql
-- ============================================================
-- CORE USER DATA
-- ============================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id                  UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  character_name      TEXT NOT NULL CHECK (char_length(character_name) BETWEEN 2 AND 30),
  kingdom_name        TEXT NOT NULL CHECK (char_length(kingdom_name) BETWEEN 2 AND 40),
  companion_name      TEXT NOT NULL DEFAULT 'Aegis' CHECK (char_length(companion_name) BETWEEN 2 AND 20),
  class               TEXT NOT NULL CHECK (class IN ('scholar', 'warrior', 'builder', 'commander')),
  house_id            TEXT NOT NULL DEFAULT 'zenith' CHECK (house_id IN ('ash', 'zenith', 'forge', 'crown')),
  house_changed_at    TIMESTAMPTZ,                  -- Enforce once-per-week change limit
  level               INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  xp                  INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  xp_to_next          INTEGER NOT NULL DEFAULT 300, -- XP needed for current level → next level
  xp_total            INTEGER NOT NULL DEFAULT 0,   -- Lifetime XP (never resets on level-up)
  kingdom_level       INTEGER NOT NULL DEFAULT 1 CHECK (kingdom_level >= 1),
  kingdom_xp          INTEGER NOT NULL DEFAULT 0,   -- Separate from character XP
  -- Attributes (all start at 10, grow from quest completion)
  attr_strength       INTEGER NOT NULL DEFAULT 10 CHECK (attr_strength >= 0),
  attr_vitality       INTEGER NOT NULL DEFAULT 10 CHECK (attr_vitality >= 0),
  attr_intelligence   INTEGER NOT NULL DEFAULT 10 CHECK (attr_intelligence >= 0),
  attr_focus          INTEGER NOT NULL DEFAULT 10 CHECK (attr_focus >= 0),
  attr_technical      INTEGER NOT NULL DEFAULT 10 CHECK (attr_technical >= 0),
  attr_creativity     INTEGER NOT NULL DEFAULT 10 CHECK (attr_creativity >= 0),
  attr_leadership     INTEGER NOT NULL DEFAULT 10 CHECK (attr_leadership >= 0),
  attr_charisma       INTEGER NOT NULL DEFAULT 10 CHECK (attr_charisma >= 0),
  attr_discipline     INTEGER NOT NULL DEFAULT 10 CHECK (attr_discipline >= 0), -- Streak-based
  -- Meta
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- QUEST SYSTEM
-- ============================================================

-- Quest templates (seeded by developer, not user-generated at Phase 1)
CREATE TABLE public.quest_templates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 80),
  description         TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 200),
  domain              TEXT NOT NULL CHECK (domain IN ('body', 'mind', 'craft', 'command')),
  difficulty          TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'epic')),
  class_affinity      TEXT[] DEFAULT '{}',           -- Empty array = available to all classes
  xp_reward           INTEGER NOT NULL CHECK (xp_reward > 0),
  rarity              TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic')),
  duration_days       INTEGER NOT NULL DEFAULT 7,
  objectives          JSONB NOT NULL DEFAULT '[]',   -- [{id: UUID, text: string, order: number}]
  -- Attribute rewards on completion
  primary_attr        TEXT NOT NULL,                 -- Which attribute gets +2
  secondary_attr      TEXT NOT NULL,                 -- Which attribute gets +1
  kingdom_xp_reward   INTEGER NOT NULL DEFAULT 50,   -- Kingdom XP on quest complete
  min_level           INTEGER NOT NULL DEFAULT 1,    -- Locked below this level
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User quest instances (one row per quest a user has started)
CREATE TABLE public.user_quests (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id           UUID NOT NULL REFERENCES public.quest_templates(id),
  status                TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'completed', 'failed', 'abandoned')),
  objectives_completed  JSONB NOT NULL DEFAULT '[]', -- Array of completed objective IDs
  progress_pct          INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  started_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_at                TIMESTAMPTZ NOT NULL,
  completed_at          TIMESTAMPTZ,
  failed_at             TIMESTAMPTZ,
  xp_awarded            INTEGER,                     -- Actual XP given (may differ if partial)
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX user_quests_user_status ON public.user_quests(user_id, status);
CREATE INDEX user_quests_due ON public.user_quests(due_at) WHERE status = 'active';

-- ============================================================
-- KINGDOM SYSTEM
-- ============================================================

-- Building definitions (seeded by developer)
CREATE TABLE public.buildings (
  id                  TEXT PRIMARY KEY,              -- 'library', 'training_grounds', etc.
  name                TEXT NOT NULL,
  domain              TEXT NOT NULL CHECK (domain IN ('body', 'mind', 'craft', 'command', 'discipline')),
  icon_filename       TEXT NOT NULL,                 -- filename in /public/icons/ e.g. 'book-cover.svg'
  lore_text           TEXT,
  -- Unlock conditions
  unlock_attribute    TEXT NOT NULL,                 -- Column name in profiles, e.g. 'attr_intelligence'
  unlock_threshold    INTEGER NOT NULL,
  -- What the building provides
  quest_unlock_domain TEXT,                          -- Makes quest templates of this domain available
  xp_bonus_pct        INTEGER NOT NULL DEFAULT 0,    -- % XP bonus for quests in unlock domain
  -- Display
  display_order       INTEGER NOT NULL DEFAULT 0,
  phase               INTEGER NOT NULL DEFAULT 1
);

-- User building status (one row per user per building)
CREATE TABLE public.user_buildings (
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  building_id         TEXT NOT NULL REFERENCES public.buildings(id),
  status              TEXT NOT NULL DEFAULT 'locked'
                        CHECK (status IN ('locked', 'available', 'built', 'upgrading')),
  built_at            TIMESTAMPTZ,
  PRIMARY KEY (user_id, building_id)
);

-- ============================================================
-- AI COMPANION
-- ============================================================

-- Companion message history (max 10 messages per user — prune on insert)
CREATE TABLE public.companion_messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('user', 'companion')),
  content             TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX companion_messages_user_time ON public.companion_messages(user_id, created_at DESC);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================

-- Achievement definitions (seeded by developer)
CREATE TABLE public.achievements (
  id                  TEXT PRIMARY KEY,              -- e.g. 'first_quest', 'level_5'
  title               TEXT NOT NULL,
  description         TEXT NOT NULL,
  condition_type      TEXT NOT NULL,                 -- 'quest_count', 'level', 'building', 'domain_quests', 'chat', 'streak', 'all_domains', 'kingdom_level'
  condition_value     INTEGER NOT NULL,              -- The threshold
  condition_domain    TEXT,                          -- For domain-specific achievements
  xp_bonus            INTEGER NOT NULL DEFAULT 0,
  display_order       INTEGER NOT NULL DEFAULT 0
);

-- User achievement unlocks
CREATE TABLE public.user_achievements (
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id      TEXT NOT NULL REFERENCES public.achievements(id),
  unlocked_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ============================================================
-- LEADERBOARD (Phase 2 — create table now, populate in Phase 2)
-- ============================================================

-- Weekly XP snapshot (refreshed every Monday midnight UTC)
CREATE TABLE public.weekly_xp (
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  house_id            TEXT NOT NULL,
  week_start          DATE NOT NULL,                 -- Monday of the week (ISO week)
  xp_earned           INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, week_start)
);

CREATE INDEX weekly_xp_house_week ON public.weekly_xp(house_id, week_start, xp_earned DESC);
CREATE INDEX weekly_xp_week ON public.weekly_xp(week_start, xp_earned DESC);
```

### 3.2 Seed Data — Buildings

```sql
INSERT INTO public.buildings (id, name, domain, icon_filename, lore_text, unlock_attribute, unlock_threshold, quest_unlock_domain, xp_bonus_pct, display_order) VALUES
('library',          'The Archive',          'mind',       'book-cover.svg',     'Where knowledge crystallizes into power.',             'attr_intelligence', 25, 'mind',    10, 1),
('training_grounds', 'The Proving Ground',   'body',       'weight-lifting-up.svg','Forged by pain, remembered by muscle.',             'attr_strength',     25, 'body',    10, 2),
('workshop',         'The Forge',            'craft',      'anvil.svg',          'Where intention becomes artifact.',                    'attr_technical',    25, 'craft',   10, 3),
('watchtower',       'The Watchtower',       'discipline', 'tower.svg',          'Clarity requires elevation.',                          'attr_discipline',   25, NULL,       5, 4),
('guild_hall',       'The Assembly Hall',    'command',    'players.svg',        'Command begins with trust.',                           'attr_charisma',     40, 'command', 10, 5),
('academy',          'The Academy',          'mind',       'graduate-cap.svg',   'The highest form of the Archive. Mastery begets mastery.','attr_intelligence',60, 'mind',    5, 6);
```

### 3.3 Seed Data — Quest Templates (100 total — first 20 shown)

```sql
-- Phase 1 quest templates: 25 per domain (Body, Mind, Craft, Command)
-- Easy = 75 XP, duration 1–3 days
-- Medium = 175 XP, duration 5–7 days
-- Hard = 350 XP, duration 7–14 days
-- Epic = 650 XP, duration 14–21 days

INSERT INTO public.quest_templates 
  (title, description, domain, difficulty, xp_reward, rarity, duration_days, objectives, primary_attr, secondary_attr, kingdom_xp_reward, min_level)
VALUES
-- BODY — EASY
('Complete 50 pushups today',
 'Forge the body''s foundation through simple repetition.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Do 50 pushups in total throughout the day","order":1}]',
 'attr_strength', 'attr_vitality', 30, 1),

('Drink 2 liters of water today',
 'The most fundamental discipline: feeding the vessel.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Drink 2 liters of water before midnight","order":1}]',
 'attr_vitality', 'attr_discipline', 30, 1),

('30-minute walk',
 'Movement clears the mind as much as it strengthens the body.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Walk for 30 continuous minutes","order":1}]',
 'attr_vitality', 'attr_strength', 30, 1),

-- BODY — MEDIUM
('Complete 150 pushups across 5 days',
 'Consistency is a more powerful force than intensity.',
 'body', 'medium', 175, 'uncommon', 5,
 '[{"id":"o1","text":"Day 1: 30 pushups","order":1},{"id":"o2","text":"Day 2: 30 pushups","order":2},{"id":"o3","text":"Day 3: 30 pushups","order":3},{"id":"o4","text":"Day 4: 30 pushups","order":4},{"id":"o5","text":"Day 5: 30 pushups","order":5}]',
 'attr_strength', 'attr_vitality', 60, 1),

('Run or walk 20km this week',
 'Distance is the most honest metric of physical will.',
 'body', 'medium', 175, 'uncommon', 7,
 '[{"id":"o1","text":"Log 5km","order":1},{"id":"o2","text":"Log 10km total","order":2},{"id":"o3","text":"Log 15km total","order":3},{"id":"o4","text":"Log 20km total","order":4}]',
 'attr_vitality', 'attr_strength', 60, 1),

-- BODY — HARD
('Complete a 7-day morning exercise routine',
 'The morning is the territory only the disciplined claim.',
 'body', 'hard', 350, 'rare', 7,
 '[{"id":"o1","text":"Exercise before 8AM on Day 1","order":1},{"id":"o2","text":"Exercise before 8AM on Day 2","order":2},{"id":"o3","text":"Exercise before 8AM on Day 3","order":3},{"id":"o4","text":"Exercise before 8AM on Day 4","order":4},{"id":"o5","text":"Exercise before 8AM on Day 5","order":5},{"id":"o6","text":"Exercise before 8AM on Day 6","order":6},{"id":"o7","text":"Exercise before 8AM on Day 7","order":7}]',
 'attr_discipline', 'attr_strength', 100, 3),

-- MIND — EASY
('Study or read for 45 minutes',
 'One focused session outweighs a day of scattered attention.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Study or read uninterrupted for 45 minutes","order":1}]',
 'attr_intelligence', 'attr_focus', 30, 1),

('Summarize one article or chapter',
 'Synthesis is how information becomes understanding.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Read one article or book chapter","order":1},{"id":"o2","text":"Write a 3-sentence summary","order":2}]',
 'attr_intelligence', 'attr_focus', 30, 1),

-- MIND — MEDIUM
('Complete 5 deep work sessions this week',
 'Depth of focus is rarer than talent.',
 'mind', 'medium', 175, 'uncommon', 7,
 '[{"id":"o1","text":"Complete a 90-minute focused session","order":1},{"id":"o2","text":"Complete a second session","order":2},{"id":"o3","text":"Complete a third session","order":3},{"id":"o4","text":"Complete a fourth session","order":4},{"id":"o5","text":"Complete a fifth session","order":5}]',
 'attr_focus', 'attr_intelligence', 60, 1),

('Learn one new technical concept',
 'Understanding something new reshapes the architecture of your mind.',
 'mind', 'medium', 175, 'uncommon', 5,
 '[{"id":"o1","text":"Identify the concept to learn","order":1},{"id":"o2","text":"Study it for at least 2 hours total","order":2},{"id":"o3","text":"Explain it in writing in your own words","order":3}]',
 'attr_intelligence', 'attr_focus', 60, 1),

-- MIND — HARD
('Finish one non-fiction book',
 'A book fully digested is worth a library barely browsed.',
 'mind', 'hard', 350, 'rare', 14,
 '[{"id":"o1","text":"Read 25% of the book","order":1},{"id":"o2","text":"Read 50% of the book","order":2},{"id":"o3","text":"Read 75% of the book","order":3},{"id":"o4","text":"Finish the book","order":4},{"id":"o5","text":"Write a 5-point summary","order":5}]',
 'attr_intelligence', 'attr_creativity', 100, 3),

-- CRAFT — EASY
('Write 500 words on any topic',
 'Creation begins with putting something into the world.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Write 500+ words (blog, journal, story, code docs)","order":1}]',
 'attr_creativity', 'attr_technical', 30, 1),

('Fix one bug or ship one small feature',
 'Progress is one completed unit at a time.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Identify the bug or feature","order":1},{"id":"o2","text":"Implement and verify the fix","order":2}]',
 'attr_technical', 'attr_creativity', 30, 1),

-- CRAFT — MEDIUM
('Build a small project feature end-to-end',
 'Full-stack completion is the craftsman''s ritual.',
 'craft', 'medium', 175, 'uncommon', 7,
 '[{"id":"o1","text":"Define the feature scope","order":1},{"id":"o2","text":"Implement the backend/data layer","order":2},{"id":"o3","text":"Build the frontend","order":3},{"id":"o4","text":"Test it manually","order":4}]',
 'attr_technical', 'attr_creativity', 60, 1),

-- CRAFT — HARD
('Ship a complete side project or MVP',
 'Shipping is the discipline that separates builders from dreamers.',
 'craft', 'hard', 350, 'rare', 21,
 '[{"id":"o1","text":"Define scope and pick one core feature","order":1},{"id":"o2","text":"Build the MVP","order":2},{"id":"o3","text":"Deploy to a live URL","order":3},{"id":"o4","text":"Share it with at least one real person","order":4}]',
 'attr_technical', 'attr_leadership', 100, 5),

-- COMMAND — EASY
('Lead or run one meeting effectively',
 'Leadership is proven in small moments before large ones.',
 'command', 'easy', 75, 'common', 1,
 '[{"id":"o1","text":"Prepare an agenda in advance","order":1},{"id":"o2","text":"Run the meeting and reach a decision","order":2}]',
 'attr_leadership', 'attr_charisma', 30, 1),

('Have a difficult conversation you''ve been avoiding',
 'Avoidance costs more than confrontation.',
 'command', 'easy', 75, 'uncommon', 1,
 '[{"id":"o1","text":"Identify the conversation you''ve been avoiding","order":1},{"id":"o2","text":"Have it","order":2}]',
 'attr_charisma', 'attr_leadership', 30, 1),

-- COMMAND — MEDIUM
('Mentor or help someone for one week',
 'Strength multiplied through others becomes legacy.',
 'command', 'medium', 175, 'uncommon', 7,
 '[{"id":"o1","text":"Identify who you will help and with what","order":1},{"id":"o2","text":"Have at least 2 sessions with them","order":2},{"id":"o3","text":"Provide written feedback or guidance","order":3}]',
 'attr_leadership', 'attr_charisma', 60, 3),

-- COMMAND — HARD
('Lead a project or initiative from start to finish',
 'Command without completion is noise.',
 'command', 'hard', 350, 'rare', 14,
 '[{"id":"o1","text":"Define the project goal and assign roles","order":1},{"id":"o2","text":"Hit the first milestone","order":2},{"id":"o3","text":"Hit the second milestone","order":3},{"id":"o4","text":"Complete and review the project","order":4}]',
 'attr_leadership', 'attr_charisma', 100, 5);

-- Developer note: Add 80+ more templates to reach the 100-template target before launch.
-- Distribution target: 25 per domain, 3-4 per difficulty level per domain.
```

### 3.4 Seed Data — Achievements

```sql
INSERT INTO public.achievements (id, title, description, condition_type, condition_value, condition_domain, xp_bonus, display_order) VALUES
('first_quest',      'First Blood',       'Complete your first quest.',                           'quest_count',    1,  NULL,      50,  1),
('five_quests',      'Footsoldier',       'Complete 5 quests.',                                  'quest_count',    5,  NULL,      100, 2),
('ten_quests',       'Knight',            'Complete 10 quests.',                                  'quest_count',    10, NULL,      200, 3),
('twenty_quests',    'Veteran',           'Complete 20 quests.',                                  'quest_count',    20, NULL,      300, 4),
('level_5',          'Apprentice',        'Reach Level 5.',                                       'level',          5,  NULL,      150, 5),
('level_10',         'Journeyman',        'Reach Level 10.',                                      'level',          10, NULL,      300, 6),
('level_20',         'Adept',             'Reach Level 20.',                                      'level',          20, NULL,      500, 7),
('first_building',   'Cornerstone',       'Unlock your first kingdom building.',                  'building',       1,  NULL,      100, 8),
('three_buildings',  'Architect',         'Unlock 3 kingdom buildings.',                          'building',       3,  NULL,      200, 9),
('all_buildings',    'Sovereign',         'Unlock all 6 buildings.',                              'building',       6,  NULL,      500, 10),
('mind_5',           'Scholar',           'Complete 5 Mind quests.',                             'domain_quests',  5,  'mind',    100, 11),
('body_5',           'Iron Will',         'Complete 5 Body quests.',                             'domain_quests',  5,  'body',    100, 12),
('craft_5',          'Artisan',           'Complete 5 Craft quests.',                            'domain_quests',  5,  'craft',   100, 13),
('command_5',        'Lieutenant',        'Complete 5 Command quests.',                          'domain_quests',  5,  'command', 100, 14),
('companion_chat',   'First Contact',     'Send your first message to your companion.',            'chat',           1,  NULL,       50, 15),
('week_streak',      'Seven Days',        'Complete at least one quest on 7 consecutive days.',   'streak',         7,  NULL,      250, 16),
('all_domains',      'Renaissance',       'Complete at least one quest in every domain.',         'all_domains',    4,  NULL,      300, 17),
('kingdom_level_3',  'Town Planner',      'Reach Kingdom Level 3.',                              'kingdom_level',  3,  NULL,      200, 18);
```

### 3.5 Row Level Security Policies

```sql
-- Profiles: Users access only their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Quest templates: Readable by all authenticated users, writable by service role only
ALTER TABLE public.quest_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users read quest templates" ON public.quest_templates
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- User quests: Users access only their own
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their quests" ON public.user_quests
  FOR ALL USING (auth.uid() = user_id);

-- Buildings: All authenticated users read definitions
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users read buildings" ON public.buildings
  FOR SELECT USING (auth.role() = 'authenticated');

-- User buildings: Users access only their own
ALTER TABLE public.user_buildings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their buildings" ON public.user_buildings
  FOR ALL USING (auth.uid() = user_id);

-- Companion messages: Users access only their own
ALTER TABLE public.companion_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their messages" ON public.companion_messages
  FOR ALL USING (auth.uid() = user_id);

-- Achievements: All authenticated users read definitions
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users read achievements" ON public.achievements
  FOR SELECT USING (auth.role() = 'authenticated');

-- User achievements: Users access only their own
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id);

-- Weekly XP: All authenticated users can read (for leaderboard), own rows writable
ALTER TABLE public.weekly_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can read weekly XP" ON public.weekly_xp
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users write their own weekly XP" ON public.weekly_xp
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own weekly XP" ON public.weekly_xp
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 4. Game Systems Specification

### 4.1 Character System

#### XP Formula

```typescript
// lib/xp.ts

/**
 * XP required to advance FROM level n TO level n+1.
 * Formula: Math.round(250 * Math.pow(level, 1.5))
 * 
 * Level thresholds:
 * Level 1→2:   250 XP  (≈ 1 day for active user)
 * Level 2→3:   707 XP  (≈ 3 days)
 * Level 3→4: 1,299 XP  (≈ 5 days)
 * Level 5→6: 2,795 XP  (≈ 11 days)
 * Level 10→11: 7,906 XP (≈ 32 days)
 * Level 20→21: 22,361 XP (≈ 90 days)
 */
export function xpForLevel(level: number): number {
  return Math.round(250 * Math.pow(level, 1.5))
}

/**
 * Total cumulative XP required to reach a given level from Level 1.
 */
export function totalXpForLevel(targetLevel: number): number {
  let total = 0
  for (let l = 1; l < targetLevel; l++) {
    total += xpForLevel(l)
  }
  return total
}

/**
 * Calculate what level a total XP amount corresponds to.
 * Used when awarding large XP bonuses that may trigger multiple level-ups.
 */
export function levelFromTotalXp(totalXp: number): { level: number, xpIntoLevel: number } {
  let level = 1
  let accumulated = 0
  while (true) {
    const next = xpForLevel(level)
    if (accumulated + next > totalXp) {
      return { level, xpIntoLevel: totalXp - accumulated }
    }
    accumulated += next
    level++
    if (level > 999) break // Safety cap
  }
  return { level, xpIntoLevel: 0 }
}
```

#### XP Reward Values by Difficulty

| Difficulty | XP Reward | Kingdom XP | Duration | Rarity |
|---|---|---|---|---|
| Easy | 75 | 30 | 1–3 days | Common |
| Medium | 175 | 60 | 5–7 days | Uncommon |
| Hard | 350 | 100 | 7–14 days | Rare |
| Epic | 650 | 200 | 14–21 days | Epic |

#### Class Starting Bonuses

When a user selects a class during onboarding, their starting attributes are adjusted:

| Class | Primary Boost | Secondary Boost | Primary Attribute | Starting House |
|---|---|---|---|---|
| Scholar | Intelligence +5 | Focus +3 | attr_intelligence | House of Zenith |
| Warrior | Strength +5 | Vitality +3 | attr_strength | House of Ash |
| Builder | Technical +5 | Creativity +3 | attr_technical | House of Forge |
| Commander | Leadership +5 | Charisma +3 | attr_leadership | House of Crown |

#### Attribute Gain per Quest Completion

Every completed quest awards attribute points. The `primary_attr` and `secondary_attr` columns in `quest_templates` specify which attributes receive points.

```typescript
// lib/attributes.ts

// Called inside quest completion handler
export async function awardAttributePoints(
  userId: string,
  primaryAttr: string,  // e.g. 'attr_intelligence'
  secondaryAttr: string // e.g. 'attr_focus'
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select(`${primaryAttr}, ${secondaryAttr}`)
    .eq('id', userId)
    .single()

  await supabase.from('profiles').update({
    [primaryAttr]: (profile[primaryAttr] || 10) + 2,
    [secondaryAttr]: (profile[secondaryAttr] || 10) + 1,
  }).eq('id', userId)
}
```

#### Discipline Attribute (Streak-Based)

Discipline increases based on consecutive-day quest completions. It does NOT decrease when a user misses a day (no punishment mechanic).

```typescript
export async function updateDisciplineStreak(userId: string) {
  // Check if user completed a quest yesterday
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  const { data: yesterdayQuest } = await supabase
    .from('user_quests')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .gte('completed_at', yesterday.toISOString().slice(0, 10))
    .lt('completed_at', new Date().toISOString().slice(0, 10))
    .limit(1)

  if (yesterdayQuest?.length > 0) {
    // Continued streak — gain 1 discipline
    await supabase.from('profiles')
      .update({ attr_discipline: supabase.sql`attr_discipline + 1` })
      .eq('id', userId)
  }
  // No else — discipline never decreases
}
```

#### Level-Up Sequence

When a quest completion causes `xp >= xp_to_next`:

```
1. Calculate new level and remaining XP
2. Update profile: level, xp (remainder), xp_to_next (for new level), xp_total
3. Check if any buildings newly unlock based on updated attributes
4. Check if any achievements trigger based on new level
5. Return { leveledUp: true, newLevel, newTitle, unlockedBuildings, unlockedAchievements }
6. Client receives response and triggers level-up gate animation
```

#### Titles by Level

Titles unlock at specific levels. The title appears below the character name on the profile screen.

| Level | Title |
|---|---|
| 1 | Initiate |
| 3 | Seeker |
| 5 | Apprentice |
| 8 | Scout |
| 10 | Journeyman |
| 15 | Adept |
| 20 | Practitioner |
| 25 | Expert |
| 30 | Master |
| 40 | Grandmaster |
| 50 | Sovereign |

```typescript
export function getTitleForLevel(level: number): string {
  const titles = [
    { minLevel: 50, title: 'Sovereign' },
    { minLevel: 40, title: 'Grandmaster' },
    { minLevel: 30, title: 'Master' },
    { minLevel: 25, title: 'Expert' },
    { minLevel: 20, title: 'Practitioner' },
    { minLevel: 15, title: 'Adept' },
    { minLevel: 10, title: 'Journeyman' },
    { minLevel: 8,  title: 'Scout' },
    { minLevel: 5,  title: 'Apprentice' },
    { minLevel: 3,  title: 'Seeker' },
    { minLevel: 1,  title: 'Initiate' },
  ]
  return titles.find(t => level >= t.minLevel)?.title ?? 'Initiate'
}
```

---

### 4.2 Quest System

#### Quest Lifecycle

```
AVAILABLE → ACTIVE → COMPLETED
                   ↘ FAILED (if due_at passes with incomplete objectives)
                   ↘ ABANDONED (user explicitly abandons)
```

**State transitions:**
- `available`: Quest exists in `quest_templates` and user hasn't started it. A user can have at most 5 active quests simultaneously.
- `active`: User clicked "Start Quest." Row created in `user_quests` with `status = 'active'` and `due_at = NOW() + duration_days`.
- `completed`: All objectives checked. User clicks "Mark Complete." Backend validates and awards XP.
- `failed`: Server-side cron checks expired quests. If `due_at < NOW()` and `status = 'active'` and `progress_pct < 100`, status → `failed`. A recovery quest is generated.
- `abandoned`: User explicitly chooses to abandon. No XP awarded. Recovery quest offered.

#### Quest Board Display Rules

- **Active tab:** All `user_quests` with `status = 'active'` for the current user, sorted by `due_at ASC`.
- **Available tab:** `quest_templates` WHERE `min_level <= profile.level` AND `id NOT IN (recent completions)` AND `class_affinity = [] OR profile.class IN class_affinity`. Ordered by: featured (one epic/rare quest first), then by domain.
- **Completed tab:** All `user_quests` with `status IN ('completed', 'failed', 'abandoned')`, sorted by `completed_at DESC`.

**Quest count limits:**
- Maximum 5 active quests simultaneously (enforce client-side and server-side)
- No limit on completed quests

#### Quest Completion Logic (Server-Side — API Route)

```typescript
// app/api/quests/[id]/complete/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. Fetch the quest and verify ownership + status
  const { data: quest } = await supabase
    .from('user_quests')
    .select('*, quest_templates(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!quest || quest.status !== 'active') {
    return Response.json({ error: 'Quest not found or not active' }, { status: 400 })
  }

  // 2. Verify all objectives are checked
  const totalObjectives = quest.quest_templates.objectives.length
  const completedCount = quest.objectives_completed.length
  if (completedCount < totalObjectives) {
    return Response.json({ error: 'Not all objectives complete' }, { status: 400 })
  }

  // 3. Mark quest complete
  await supabase.from('user_quests').update({
    status: 'completed',
    completed_at: new Date().toISOString(),
    xp_awarded: quest.quest_templates.xp_reward,
    progress_pct: 100,
  }).eq('id', params.id)

  // 4. Award XP and get updated profile
  const template = quest.quest_templates
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  const newXp = profile.xp + template.xp_reward
  const newXpTotal = profile.xp_total + template.xp_reward
  let newLevel = profile.level
  let currentXp = newXp
  let leveledUp = false
  const levelUps: number[] = []

  while (currentXp >= xpForLevel(newLevel)) {
    currentXp -= xpForLevel(newLevel)
    newLevel++
    leveledUp = true
    levelUps.push(newLevel)
  }

  // 5. Award attribute points
  await awardAttributePoints(user.id, template.primary_attr, template.secondary_attr)

  // 6. Award Kingdom XP
  const newKingdomXp = profile.kingdom_xp + template.kingdom_xp_reward
  // Kingdom level: every 1000 kingdom XP = 1 kingdom level
  const newKingdomLevel = Math.floor(newKingdomXp / 1000) + 1

  // 7. Update profile
  const { data: updatedProfile } = await supabase.from('profiles').update({
    xp: currentXp,
    xp_total: newXpTotal,
    xp_to_next: xpForLevel(newLevel),
    level: newLevel,
    kingdom_xp: newKingdomXp,
    kingdom_level: newKingdomLevel,
  }).eq('id', user.id).select('*').single()

  // 8. Check building unlocks
  const unlockedBuildings = await checkBuildingUnlocks(user.id, updatedProfile)

  // 9. Check achievements
  const unlockedAchievements = await checkAchievements(user.id, updatedProfile)

  // 10. Update weekly XP (for leaderboard — Phase 2, but write row now)
  await upsertWeeklyXp(user.id, profile.house_id, template.xp_reward)

  // 11. Update discipline streak
  await updateDisciplineStreak(user.id)

  return Response.json({
    success: true,
    xpAwarded: template.xp_reward,
    leveledUp,
    newLevel,
    newTitle: leveledUp ? getTitleForLevel(newLevel) : null,
    unlockedBuildings,
    unlockedAchievements,
  })
}
```

#### Quest Failure (Cron — Daily Check)

```typescript
// Supabase Edge Function: check-expired-quests
// Schedule: every day at 00:05 UTC
// lib/check-expired-quests.ts

export async function checkExpiredQuests() {
  const supabase = createServiceRoleClient()
  
  const { data: expiredQuests } = await supabase
    .from('user_quests')
    .select('id, user_id, template_id')
    .eq('status', 'active')
    .lt('due_at', new Date().toISOString())

  for (const quest of expiredQuests ?? []) {
    await supabase.from('user_quests')
      .update({ status: 'failed', failed_at: new Date().toISOString() })
      .eq('id', quest.id)
    // Note: No XP penalty. No health penalty. No punishment.
    // Recovery quest is offered on next dashboard load.
  }
}
```

#### Recovery Quest Logic

When a user's dashboard loads and they have a failed quest, the frontend fetches the failed quest and renders a recovery CTA. A recovery quest is the same template but with a shorter duration (50% of original) and 75% of the XP reward.

```typescript
// Client: after loading dashboard
const failedQuests = activeQuests.filter(q => q.status === 'failed')
if (failedQuests.length > 0) {
  // Show "Recovery Quest Available" banner above quest board
  // CTA: "Attempt Again" → creates new user_quest from same template, duration * 0.5, xp * 0.75
}
```

---

### 4.3 Kingdom System

#### Building Unlock State Machine

```
LOCKED → AVAILABLE → BUILT
         (conditions met)   (user clicks "Build")
```

Unlocking happens automatically server-side when attribute thresholds are met after a quest completion. "Building" (transitioning from AVAILABLE to BUILT) is a user-triggered action — no cost, no timer, no currency. The unlock IS the reward.

#### Kingdom Level Progression

```typescript
// Kingdom XP accumulates separately from character XP
// Every 1000 Kingdom XP = +1 Kingdom Level
// Kingdom XP is awarded when completing quests
// Kingdom Level unlocks higher-tier buildings (Phase 2+)

export function getKingdomLevel(kingdomXp: number): number {
  return Math.floor(kingdomXp / 1000) + 1
}
```

#### Building Benefits

Each built building provides a concrete mechanical benefit:

| Building | Unlock Trigger | Benefit |
|---|---|---|
| The Archive (Library) | Intelligence ≥ 25 | +10% XP on all Mind quests |
| The Proving Ground | Strength ≥ 25 | +10% XP on all Body quests |
| The Forge (Workshop) | Technical ≥ 25 | +10% XP on all Craft quests |
| The Watchtower | Discipline ≥ 25 | +5% XP on ALL quests (vigilance bonus) |
| The Assembly Hall | Charisma ≥ 40 | Access to Command quest tier and guild features |
| The Academy | Intelligence ≥ 60 | +5% XP on Mind quests (stacks with Archive), unlocks Epic Mind quests |

```typescript
// lib/buildings.ts

export async function checkBuildingUnlocks(
  userId: string,
  profile: Profile
): Promise<string[]> {
  // Get all currently locked buildings
  const { data: lockedBuildings } = await supabase
    .from('user_buildings')
    .select('building_id, buildings(unlock_attribute, unlock_threshold)')
    .eq('user_id', userId)
    .eq('status', 'locked')

  const newlyAvailable: string[] = []

  for (const ub of lockedBuildings ?? []) {
    const { unlock_attribute, unlock_threshold } = ub.buildings
    const currentValue = profile[unlock_attribute as keyof Profile] as number
    
    if (currentValue >= unlock_threshold) {
      await supabase.from('user_buildings')
        .update({ status: 'available' })
        .eq('user_id', userId)
        .eq('building_id', ub.building_id)
      newlyAvailable.push(ub.building_id)
    }
  }

  return newlyAvailable
}

// Initialize buildings for a new user (called during onboarding)
export async function initializeUserBuildings(userId: string) {
  const { data: allBuildings } = await supabase.from('buildings').select('id')
  
  const rows = allBuildings?.map(b => ({
    user_id: userId,
    building_id: b.id,
    status: 'locked' as const,
  })) ?? []

  await supabase.from('user_buildings').insert(rows)
}
```

---

### 4.4 AI Companion System

#### Rule-Based Response Matching (Phase 1 Primary Path)

```typescript
// lib/companion.ts

const RULE_RESPONSES: Record<string, string> = {
  'quest':      'Your board has {activeCount} active trials. Your {topDomain} work is strongest. Want a new mission aligned with that path?',
  'level':      'You are {xpToNext} echoes from Fragment {nextLevel}. Two quests from your board would close that distance.',
  'struggling': 'Resistance is data. Tell me what blocked you — I will recalibrate your next trial to match your current state.',
  'tired':      'Rest today. Your active trials will not expire for {hoursUntilDue} hours. Return when the stillness passes.',
  'help':       'I can generate a trial, read your progress, or suggest a direction. Name your need.',
  'kingdom':    'Your realm holds {builtCount} built monuments and {availableCount} ready to manifest. {buildingName} awaits your command.',
  'achieve':    'You have claimed {achievementCount} milestones. Your nearest is "{nextAchievement}" — {nextAchievementProgress}.',
  'hello':      'You returned, {characterName}. The void has been watching. What do we build today?',
  'hi':         'You returned, {characterName}. The void has been watching. What do we build today?',
  'who are you': 'I am {companionName}, your architect of intent. I observe your progress, generate your trials, and keep you honest. Ask me anything.',
}

function fillTemplate(template: string, ctx: UserContext): string {
  return template
    .replace('{characterName}',         ctx.characterName)
    .replace('{companionName}',         ctx.companionName)
    .replace('{activeCount}',           String(ctx.activeQuestCount))
    .replace('{topDomain}',             ctx.topDomain)
    .replace('{xpToNext}',              String(ctx.xpToNext))
    .replace('{nextLevel}',             String(ctx.level + 1))
    .replace('{hoursUntilDue}',         String(ctx.hoursUntilDue))
    .replace('{builtCount}',            String(ctx.builtBuildingCount))
    .replace('{availableCount}',        String(ctx.availableBuildingCount))
    .replace('{buildingName}',          ctx.nextAvailableBuilding ?? 'a monument')
    .replace('{achievementCount}',      String(ctx.achievementCount))
    .replace('{nextAchievement}',       ctx.nextAchievement ?? 'First Blood')
    .replace('{nextAchievementProgress}', ctx.nextAchievementProgress ?? 'begin')
}

export async function getCompanionResponse(
  message: string,
  userContext: UserContext,
  conversationHistory: CompanionMessage[]
): Promise<string> {
  const lower = message.toLowerCase().trim()

  // Rule-based check — no API cost
  for (const [keyword, template] of Object.entries(RULE_RESPONSES)) {
    if (lower.includes(keyword)) {
      return fillTemplate(template, userContext)
    }
  }

  // Gemini fallback
  try {
    return await callGemini(message, userContext, conversationHistory)
  } catch (error) {
    // Groq fallback
    try {
      return await callGroq(message, userContext, conversationHistory)
    } catch {
      // Last resort: rule-based generic response
      return fillTemplate(RULE_RESPONSES['help'], userContext)
    }
  }
}
```

#### Gemini API Call (Inside API Route)

```typescript
// app/api/companion/route.ts

export async function POST(req: Request) {
  const { message, userContext, history } = await req.json()

  const response = await callGemini(message, userContext, history)
  
  // Save to companion_messages (keep last 10)
  await saveMessage(userContext.userId, 'user', message)
  await saveMessage(userContext.userId, 'companion', response)
  await pruneMessages(userContext.userId) // Delete oldest if > 10 rows

  return Response.json({ reply: response })
}

async function callGemini(
  message: string,
  ctx: UserContext,
  history: CompanionMessage[]
): Promise<string> {
  const systemPrompt = `You are ${ctx.companionName}, the AI companion for ${ctx.characterName}.
They are a ${ctx.class} at Level ${ctx.level}, titled "${ctx.title}".
Their strongest attribute is ${ctx.topAttribute} (${ctx.topAttributeValue}).
They have ${ctx.activeQuestCount} active quests and ${ctx.builtBuildingCount} built kingdom structures.
You speak in short, direct statements — 1 to 3 sentences maximum.
You are slightly enigmatic but never cryptic to the point of being unhelpful.
Never say "As an AI." Never offer unsolicited mental health advice.
Do not ask clarifying questions unless absolutely necessary.
Context for this conversation: ${JSON.stringify(ctx)}`

  const geminiHistory = history.slice(-8).map(m => ({
    role: m.role === 'companion' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [...geminiHistory, { role: 'user', parts: [{ text: message }] }],
    generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  )

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}
```

**Model string to use:** `gemini-2.5-flash` (or `gemini-3-flash` when that model string is confirmed stable in Google AI Studio). Check the Google AI Studio API reference for the exact model string on the day of implementation, as model naming conventions change.

#### Memory Pruning

```typescript
async function pruneMessages(userId: string) {
  const { data: messages } = await supabase
    .from('companion_messages')
    .select('id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (messages && messages.length > 10) {
    const toDelete = messages.slice(10).map(m => m.id)
    await supabase.from('companion_messages').delete().in('id', toDelete)
  }
}
```

---

### 4.5 Achievement System

Achievement evaluation runs server-side, triggered after every quest completion and level-up.

```typescript
// lib/achievements.ts

export async function checkAchievements(
  userId: string,
  profile: Profile
): Promise<string[]> {
  // Get all achievements not yet earned by this user
  const { data: unearned } = await supabase
    .from('achievements')
    .select('*')
    .not('id', 'in', 
      `(SELECT achievement_id FROM user_achievements WHERE user_id = '${userId}')`
    )

  const unlocked: string[] = []

  for (const achievement of unearned ?? []) {
    let earned = false

    switch (achievement.condition_type) {
      case 'quest_count': {
        const { count } = await supabase
          .from('user_quests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'completed')
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'level':
        earned = profile.level >= achievement.condition_value
        break
      case 'building': {
        const { count } = await supabase
          .from('user_buildings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'built')
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'domain_quests': {
        const { count } = await supabase
          .from('user_quests')
          .select('*, quest_templates!inner(domain)', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'completed')
          .eq('quest_templates.domain', achievement.condition_domain)
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'chat': {
        const { count } = await supabase
          .from('companion_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('role', 'user')
        earned = (count ?? 0) >= achievement.condition_value
        break
      }
      case 'kingdom_level':
        earned = profile.kingdom_level >= achievement.condition_value
        break
      case 'all_domains': {
        const domains = ['body', 'mind', 'craft', 'command']
        const checks = await Promise.all(domains.map(async domain => {
          const { count } = await supabase
            .from('user_quests')
            .select('*, quest_templates!inner(domain)', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'completed')
            .eq('quest_templates.domain', domain)
          return (count ?? 0) > 0
        }))
        earned = checks.every(Boolean)
        break
      }
      case 'streak':
        // 7-day streak check
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        // Count distinct days with completions in the last 7 days
        const { data: recentCompletions } = await supabase
          .from('user_quests')
          .select('completed_at')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .gte('completed_at', sevenDaysAgo.toISOString())
        const distinctDays = new Set(
          recentCompletions?.map(q => q.completed_at?.slice(0, 10)) ?? []
        )
        earned = distinctDays.size >= 7
        break
    }

    if (earned) {
      await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id,
      })
      // Award XP bonus
      if (achievement.xp_bonus > 0) {
        await supabase.from('profiles').update({
          xp: supabase.sql`xp + ${achievement.xp_bonus}`,
          xp_total: supabase.sql`xp_total + ${achievement.xp_bonus}`,
        }).eq('id', userId)
      }
      unlocked.push(achievement.id)
    }
  }

  return unlocked
}
```

---

### 4.6 House System (Phase 1 Data, Phase 2 UI)

The four Houses are pre-made. No user can create a custom House. Users are auto-assigned at onboarding based on class, but can switch once per week from `/settings`.

| House | Class Affinity | Attribute Focus | Color |
|---|---|---|---|
| House of Ash | Warrior | Body (Strength, Vitality) | Crimson #C41E1E |
| House of Zenith | Scholar | Mind (Intelligence, Focus) | Deep Blue #1A3A6A |
| House of Forge | Builder | Craft (Technical, Creativity) | Amber #D68910 |
| House of Crown | Commander | Command (Leadership, Charisma) | Deep Gold #8B7355 |

Weekly collective XP goal: 5,000 XP per House (fixed in Phase 1). This resets every Monday at 00:00 UTC.

The `weekly_xp` table tracks contributions. The guild page shows real-time House progress and individual member rankings. Supabase Realtime is used in Phase 2 to update this live.

---

## 5. API Specification

All API routes are Next.js Route Handlers under `/app/api/`. All routes requiring authentication validate the Supabase session server-side before proceeding.

### 5.1 Authentication Routes

These are handled entirely by Supabase Auth — no custom routes needed.

| Action | Method | Supabase function |
|---|---|---|
| Sign up | — | `supabase.auth.signUp({ email, password })` |
| Sign in | — | `supabase.auth.signInWithPassword({ email, password })` |
| Google OAuth | — | `supabase.auth.signInWithOAuth({ provider: 'google' })` |
| Sign out | — | `supabase.auth.signOut()` |
| Get session | — | `supabase.auth.getUser()` |

### 5.2 Profile Routes

```
GET  /api/profile                  — Get current user's full profile
PUT  /api/profile                  — Update character_name, kingdom_name, companion_name
POST /api/profile/onboarding       — Complete onboarding (sets onboarding_complete = true)
POST /api/profile/change-house     — Change house (enforces once-per-week limit)
```

**GET /api/profile response:**
```typescript
{
  id: string
  characterName: string
  kingdomName: string
  companionName: string
  class: 'scholar' | 'warrior' | 'builder' | 'commander'
  houseId: string
  level: number
  xp: number
  xpToNext: number
  xpTotal: number
  kingdomLevel: number
  kingdomXp: number
  attributes: {
    strength: number
    vitality: number
    intelligence: number
    focus: number
    technical: number
    creativity: number
    leadership: number
    charisma: number
    discipline: number
  }
  title: string           // Computed from level
  createdAt: string
}
```

**POST /api/profile/change-house:**
- Check `house_changed_at` — if within 7 days, return 400 `{ error: 'Can only change house once per week' }`
- Update `house_id` and `house_changed_at = NOW()`

### 5.3 Quest Routes

```
GET    /api/quests/active          — All active quests for current user
GET    /api/quests/available       — Available quest templates for current user
GET    /api/quests/completed       — Completed/failed/abandoned quests (paginated)
GET    /api/quests/:id             — Single quest detail
POST   /api/quests/start           — Start a quest (body: { templateId })
PUT    /api/quests/:id/objective   — Check/uncheck an objective (body: { objectiveId, checked })
POST   /api/quests/:id/complete    — Mark quest complete (validates all objectives done)
POST   /api/quests/:id/abandon     — Abandon active quest
POST   /api/quests/generate        — Generate personalized quest via AI (body: { domain })
```

**POST /api/quests/start request/response:**
```typescript
// Request
{ templateId: string }

// Response (success)
{
  questId: string
  title: string
  dueAt: string
  objectives: Array<{ id: string, text: string, order: number }>
}

// Response (error cases)
{ error: 'Max 5 active quests allowed' }        // 400
{ error: 'Quest already active' }               // 400
{ error: 'Level requirement not met' }          // 403
```

**POST /api/quests/:id/complete response:**
```typescript
{
  success: true
  xpAwarded: number
  leveledUp: boolean
  newLevel?: number
  newTitle?: string
  unlockedBuildings: string[]    // building IDs
  unlockedAchievements: string[] // achievement IDs
}
```

**POST /api/quests/generate request/response:**
```typescript
// Request
{ domain: 'body' | 'mind' | 'craft' | 'command' }

// Response
{
  questId: string        // Newly created user_quest row
  title: string
  loreText: string       // AI-generated, max 20 words
  xpReward: number
  dueAt: string
  objectives: Array<{ id: string, text: string, order: number }>
}
```

### 5.4 Kingdom Routes

```
GET  /api/kingdom                  — All buildings with user status
POST /api/kingdom/:buildingId/build — Build an available building
```

**GET /api/kingdom response:**
```typescript
{
  kingdomLevel: number
  kingdomXp: number
  buildings: Array<{
    id: string
    name: string
    domain: string
    iconFilename: string
    loreText: string
    status: 'locked' | 'available' | 'built'
    unlockAttribute: string
    unlockThreshold: number
    currentAttributeValue: number // User's current value for this attribute
    xpBonusPct: number
    builtAt: string | null
  }>
}
```

**POST /api/kingdom/:buildingId/build:**
- Verify `status === 'available'` for this user
- Update to `status = 'built'`, `built_at = NOW()`
- Check achievements triggered by building count
- Return `{ success: true, unlockedAchievements: string[] }`

### 5.5 Companion Routes

```
GET  /api/companion/history        — Last 10 messages
POST /api/companion/message        — Send message, get AI response
```

**POST /api/companion/message request/response:**
```typescript
// Request
{ message: string }    // Max 500 characters

// Response
{
  reply: string
  source: 'rule-based' | 'gemini' | 'groq' | 'fallback'
}
```

### 5.6 Achievement Routes

```
GET  /api/achievements             — All achievements with earned status for current user
```

**GET /api/achievements response:**
```typescript
Array<{
  id: string
  title: string
  description: string
  xpBonus: number
  earned: boolean
  earnedAt: string | null
}>
```

### 5.7 Admin Routes (Staff Only)

```
GET  /admin/api/users              — User list with basic stats
GET  /admin/api/users/:id          — Single user detail
POST /admin/api/quest-templates    — Create new quest template
PUT  /admin/api/quest-templates/:id — Update quest template
```

Admin routes check for a hardcoded staff email list server-side. No UI for adding staff — edit the array in code.

```typescript
const STAFF_EMAILS = ['your-email@example.com']

function isStaff(email: string | undefined): boolean {
  return STAFF_EMAILS.includes(email ?? '')
}
```

### 5.8 Error Response Format

All API routes return errors in this format:

```typescript
{ error: string, code?: string }
```

Standard HTTP status codes:
- 400: Bad request (invalid input, business rule violation)
- 401: Not authenticated
- 403: Authenticated but not authorized (wrong user's resource, not staff)
- 404: Resource not found
- 429: Rate limited (AI API calls)
- 500: Internal server error

---

## 6. State Management & Logic Flow

### 6.1 Client-Side State Architecture

No external state library. Use React Context for shared state and `useState`/`useReducer` for local state.

```typescript
// contexts/UserContext.tsx
interface UserContextType {
  profile: Profile | null
  loading: boolean
  refetchProfile: () => Promise<void>
}

export const UserContext = createContext<UserContextType>({ ... })

// Wrap app in UserProvider in app/layout.tsx
// All pages that need profile data consume useUser() hook
export function useUser() {
  return useContext(UserContext)
}
```

**What lives in context:** The current user's profile (character stats, level, XP). Refreshed after any mutation (quest complete, level-up, building build).

**What lives in local state:** Page-specific data (quest list, companion history, building grid). Each route fetches its own data on mount via `useEffect` or Server Components.

### 6.2 Server vs Client Data Fetching

| Data | Fetch Method | When |
|---|---|---|
| User profile | Client-side (context, via Supabase JS client) | On auth, after mutations |
| Quest templates (available) | Server Component | On `/quests` page load |
| Active user quests | Client-side | On `/quests` and `/dashboard` |
| Companion history | Client-side | On `/companion` mount |
| Kingdom buildings | Server Component | On `/kingdom` page load |
| Leaderboard | Server Component | On `/leaderboard` page load |

### 6.3 Quest Completion State Flow

```
User clicks "Mark Complete" button
  → Client: disable button, show spinner
  → POST /api/quests/:id/complete
  → Server: validate, award XP, check level-up, check buildings, check achievements
  → Server: return { xpAwarded, leveledUp, newLevel, unlockedBuildings, unlockedAchievements }
  → Client: receive response
    → Fire XP toast (+N XP)
    → Animate XP bar fill
    → If leveledUp: show level-up gate (full screen overlay)
    → If unlockedBuildings: show building unlock toast
    → If unlockedAchievements: show achievement toast (queue if multiple)
    → Refetch profile (to update sidebar XP bar and level display)
    → Remove completed quest from active list
```

### 6.4 Offline Behavior

Sovereign does NOT support offline mode. All actions require an internet connection.

If a user is offline:
- Forms display: "Could not connect. Please check your internet connection."
- Quest completion shows error toast: "Connection lost. Your progress is saved locally — try again when online."
- Do NOT queue actions for sync. The app simply does nothing until reconnected.

### 6.5 Real-Time Updates (Phase 2 Only)

Phase 1: No real-time. All data is fetch-on-load.

Phase 2: Add Supabase Realtime subscriptions for:
- Guild/House weekly XP updates on `/guild` page
- Leaderboard position changes on `/leaderboard`

```typescript
// Phase 2 — enable only when /guild is built
const channel = supabase.channel('house-weekly-xp')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'weekly_xp',
    filter: `house_id=eq.${user.house_id}`
  }, handleHouseXpUpdate)
  .subscribe()
```

---

## 7. Animation & Interaction Specification

### 7.1 CSS Design Tokens

Add these to `tailwind.config.ts` and as CSS custom properties in `globals.css`:

```css
:root {
  /* Colors */
  --bg-void: #080808;
  --bg-void-deep: #000000;
  --bg-panel-companion: #0C0C0C;
  --text-primary: #E8E6E0;
  --text-muted: #5C5C5C;
  --text-ghost: #3A3A3A;
  --accent-crimson: #C41E1E;
  --accent-bronze: #8B7355;
  --border-default: 1px solid #1A1A1A;
  --border-element: 1px solid #2A2A2A;
  --border-active: 1px solid #C41E1E;

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);

  --dur-hover:     150ms;
  --dur-base:      300ms;
  --dur-slow:      800ms;
  --dur-cinematic: 1400ms;
}
```

### 7.2 Every Animation — Complete Specification

| Animation | Trigger | Duration | Easing | Implementation |
|---|---|---|---|---|
| Page element entrance | Component mount or scroll into view | 300ms | `--ease-out-expo` | `opacity: 0 → 1`, `translateY: 20px → 0`. Use `IntersectionObserver` for scroll-triggered. |
| Staggered list entrance | Quest list / building grid load | 60ms per item delay | `--ease-out-expo` | Each item: `animation-delay: N * 60ms`. First item has 0 delay. |
| XP bar fill | After quest completion API response | 800ms | `--ease-out-expo` | CSS `transition: width 800ms var(--ease-out-expo)`. Set width via `element.style.width` after response. Number count-up via `requestAnimationFrame`. |
| XP number count-up | Same trigger as XP bar fill | 800ms | Linear | `requestAnimationFrame` loop incrementing displayed number from old value to new value over 800ms. |
| XP toast | 500ms after XP bar begins filling | 200ms in, 2s hold, 200ms out | `--ease-out-expo` | Slide in from right edge: `translateX: 120% → 0`. Auto-dismiss after 2s. |
| Level-up gate enter | After XP bar completes if level-up | 600ms | `--ease-spring` | Full-screen `#000000` overlay fades in (300ms). Character name scales `0.7 → 1.0` with spring. |
| Level-up gate content | 400ms after overlay appears | 400ms per element, staggered | `--ease-out-expo` | Level text fades up. Title fades up 200ms later. Continue link fades in 400ms later. |
| Level-up gate exit | User clicks "Continue" | 300ms | `--ease-in-quart` | Full overlay fades out. |
| Quest complete celebration | "Mark Complete" button clicked, before API call | 80ms | Linear | Button scales `1.0 → 0.97 → 1.0` (press animation). |
| Building unlock toast | Returned in quest completion response | 200ms in, 3s hold, 200ms out | `--ease-out-expo` | Slide in from right edge, below XP toast. Uses `--border-active` border. |
| Achievement toast | Returned in quest/level-up response | 200ms in, 3s hold, 200ms out | `--ease-out-expo` | Queue multiple achievements — show each for 3s, then next. |
| Building tile unlock | When building status changes locked → available | 400ms | `--ease-out-expo` | Border color transitions from `#2A2A2A → #C41E1E`. Opacity transitions `0.3 → 0.8`. |
| Companion message entry | New message appears | 200ms | `--ease-out-expo` | `opacity: 0 → 1`. User messages: immediate. Companion messages: word-by-word reveal via `animation-delay` per `<span>` (40ms per word). |
| Companion typing indicator | While waiting for API response | Infinite | Ease-in-out | Three dots, each 6px circle, `#C41E1E`. Bounce animation: `translateY: 0 → -4px → 0`, 600ms cycle. Stagger: dot1=0ms, dot2=150ms, dot3=300ms. |
| Tab switch | Clicking tab in quest board | 250ms | `--ease-out-expo` | Active underline slides horizontally. Old tab content fades out (150ms). New tab content fades in (200ms, 150ms delay). |
| Hover — all interactive elements | Mouse enter | `--dur-hover` = 150ms | Linear | Color shifts only. No scale on hover (reserved for click feedback). |
| Hover — quest rows | Mouse enter | 150ms | Linear | Background: `rgba(255,255,255,0)` → `rgba(255,255,255,0.018)`. |
| Active/click — buttons | Mouse down | 80ms | Linear | Scale: `1.0 → 0.97`. |
| Progress bar (kingdom, weekly) | Page load | 700ms | `--ease-out-expo` | Same treatment as XP bar but no glow. |

### 7.3 Hover States — All Interactive Elements

| Element | Default State | Hover State |
|---|---|---|
| Nav links | `color: #5C5C5C` | `color: #E8E6E0`, 150ms |
| Quest rows | `background: transparent` | `background: rgba(255,255,255,0.018)` |
| Primary button | `background: #C41E1E` | `background: #E8282B` |
| Secondary button | `border: 1px solid #2A2A2A` | `border: 1px solid #E8E6E0` |
| Text-link CTA | `color: #C41E1E` | `color: #E8E6E0` |
| Tab (inactive) | `color: #3A3A3A` | `color: #5C5C5C` |
| Building tile (locked) | `opacity: 0.3` | `opacity: 0.4, tooltip shows unlock condition` |
| Building tile (available) | `border: 1px solid #C41E1E` | `border: 2px solid #C41E1E` |
| Building tile (built) | `opacity: 1.0` | `background: rgba(255,255,255,0.025)` |

### 7.4 No Glow Policy

The Obsidian Void design system uses almost no glow effects. Implement the following rule strictly:

**Allowed glow:**
- XP progress bar fill only: `box-shadow: 0 0 6px 1px rgba(196,30,30,0.3)`
- Status dot (active/online): `box-shadow: 0 0 0 2px rgba(196,30,30,0.2)`

**No other glow effects anywhere.** No cursor-following glow. No card hover glow. No button glow. No neon effects.

### 7.5 Toast Queue Management

```typescript
// lib/toasts.ts
// Toasts must not overlap. Queue them with delays.

interface ToastItem {
  type: 'xp' | 'quest-complete' | 'building-unlock' | 'achievement'
  message: string
  delay: number // ms from trigger
}

export function buildToastQueue(completionResult: QuestCompletionResult): ToastItem[] {
  const queue: ToastItem[] = []
  let delay = 0

  // XP toast appears immediately after completion
  queue.push({ type: 'xp', message: `+${completionResult.xpAwarded} XP`, delay })
  delay += 500 // 500ms after XP toast

  // Quest complete toast
  queue.push({ type: 'quest-complete', message: 'Trial complete.', delay })
  delay += 3500 // 3.5s (3s display + 500ms gap)

  // Building unlock toasts (if any)
  for (const building of completionResult.unlockedBuildings) {
    queue.push({ type: 'building-unlock', message: `${building} unlocked.`, delay })
    delay += 3500
  }

  // Achievement toasts (if any)
  for (const achievement of completionResult.unlockedAchievements) {
    queue.push({ type: 'achievement', message: `Achievement: ${achievement}`, delay })
    delay += 3500
  }

  return queue
}
```

---

## 8. Asset Inventory

### 8.1 Kingdom Building Icons

All icons from Game-Icons.net (CC-BY 3.0). Include attribution in footer: "Icons by Game-Icons.net (CC-BY 3.0)."

Download and place in `/public/icons/buildings/`:

| Building | Icon filename | Game-Icons.net path |
|---|---|---|
| The Archive (Library) | `book-cover.svg` | `delapouite/book-cover` |
| The Proving Ground | `weight-lifting-up.svg` | `lorc/weight-lifting-up` |
| The Forge (Workshop) | `anvil.svg` | `lorc/anvil` |
| The Watchtower | `tower.svg` | `delapouite/tower` |
| The Assembly Hall | `players.svg` | `lorc/players` |
| The Academy | `graduate-cap.svg` | `delapouite/graduate-cap` |
| Locked building (generic) | `padlock.svg` | `lorc/padlock` |

**Icon rendering in Tailwind:**
```html
<!-- Warm white, built building -->
<img src="/icons/buildings/book-cover.svg" 
     class="w-16 h-16 invert opacity-90" 
     alt="The Archive" />

<!-- Muted, available building -->
<img src="/icons/buildings/book-cover.svg" 
     class="w-16 h-16 invert opacity-60" 
     alt="The Archive" />

<!-- Grey, locked building -->
<img src="/icons/buildings/padlock.svg" 
     class="w-8 h-8 opacity-30" 
     alt="Locked" />
```

CSS `filter: invert(1)` turns the black SVG icons white. `opacity-90` = warm white. `opacity-60` = available state. `opacity-30` = locked state.

### 8.2 Navigation Icons

The sidebar navigation uses 6 custom geometric SVG glyphs — NOT Lucide icons. These must be designed as simple abstract shapes (not recognizable pictograms) matching the Obsidian Void aesthetic.

Create in `/public/icons/nav/`:

| Route | Icon name | Design brief |
|---|---|---|
| `/dashboard` | `nav-home.svg` | Simple diamond or square |
| `/quests` | `nav-quests.svg` | Horizontal lines with one highlighted |
| `/character` | `nav-character.svg` | Abstract person silhouette or circle with inner ring |
| `/kingdom` | `nav-kingdom.svg` | Small grid of squares |
| `/companion` | `nav-companion.svg` | Abstract wave or speech mark |
| `/settings` | `nav-settings.svg` | Simple circle with inner mark |

All icons: 20×20px viewport, 1px stroke, no fill except `fill="none"`, `stroke="currentColor"`. Default color: `#3A3A3A`. Active: `#E8E6E0`.

If designing these icons is blocked, use Lucide icons as temporary substitutes with these substitutions: Home, Sword, User, Grid, MessageCircle, Settings.

### 8.3 Character Avatars

```typescript
// DiceBear configuration
const AVATAR_BASE = 'https://api.dicebear.com/9.x'
const AVATAR_STYLE = 'adventurer'  // Options: adventurer, bottts, lorelei, pixel-art
const AVATAR_BG = '080808'         // Match void background

export function getAvatarUrl(userId: string): string {
  return `${AVATAR_BASE}/${AVATAR_STYLE}/svg?seed=${userId}&backgroundColor=${AVATAR_BG}`
}

// Companion avatar (different style, different seed)
export function getCompanionAvatarUrl(userId: string, companionName: string): string {
  return `${AVATAR_BASE}/bottts/svg?seed=${companionName}-${userId}&backgroundColor=0C0C0C`
}
```

### 8.4 Color Tokens — Canonical Reference

```typescript
// tailwind.config.ts
export const COLORS = {
  void:       '#080808',  // App background
  voidDeep:   '#000000',  // Level-up gate only
  panelLeft:  '#0C0C0C',  // Companion left panel
  panelRight: '#F5F0E8',  // Companion right panel (only light surface in app)
  textPrimary:'#E8E6E0',  // All primary text
  textMuted:  '#5C5C5C',  // Secondary labels, descriptions
  textGhost:  '#3A3A3A',  // Tertiary, barely visible
  crimson:    '#C41E1E',  // Primary accent — use sparingly
  crimsonHover:'#E8282B', // Crimson button hover state
  bronze:     '#8B7355',  // Second hero headline (italic) only
  borderDefault:'#1A1A1A',// All separators
  borderElement:'#2A2A2A',// Buttons, badges
  inputLight: '#EDE8E0',  // Input background in light panel
  borderLight:'#C8C0B4',  // Input border in light panel
} as const
```

### 8.5 Typography Reference

```typescript
// app/layout.tsx — Font imports
import { Cormorant_Garamond, Space_Grotesk, Space_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-grotesk',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})
```

**Typography class reference:**

| Use case | Classes |
|---|---|
| Hero headline | `font-cormorant text-[80px] font-bold` |
| Kingdom/character name | `font-cormorant text-[64px] font-bold` |
| Quest board title | `font-cormorant text-[40px] font-bold` |
| Section heading | `font-cormorant text-[28px] font-bold` |
| Quest name | `font-cormorant text-[22px] font-bold` |
| Companion quote / lore | `font-cormorant text-[18px] italic` |
| Body text | `font-grotesk text-[14px] font-normal` |
| Button text | `font-grotesk text-[11px] font-medium tracking-[0.2em] uppercase` |
| Section label | `font-grotesk text-[11px] font-medium tracking-[0.2em] uppercase` |
| Wordmark nav | `font-grotesk text-[13px] font-medium tracking-[0.3em]` |
| XP values, stats | `font-mono text-[14px] font-normal` |
| Metadata, timestamps | `font-mono text-[10px] tracking-[0.15em]` |

### 8.6 Sounds (Phase 3+ Only)

No sounds in Phase 1 or Phase 2. If added in Phase 3:
- Source: OpenGameArt.org, filter by CC0 license
- Quest complete: short tone, under 1 second
- Level-up: ambient swell, 2–3 seconds
- Building unlock: subtle chime

---

## 9. Free-Tier Budget & Limits

### 9.1 Service Limits Reference

| Service | Free Limit | Break Point | Action When Breaking |
|---|---|---|---|
| Supabase Auth | 50,000 MAU | 50,000 users log in within a calendar month | Upgrade to Pro ($25/month). This is a success problem. |
| Supabase DB | 500MB storage | ~10,000 active users with full quest history | Archive completed quests older than 90 days (see query below). |
| Supabase Edge Functions | 500,000 invocations/month | 500K AI API calls/month — extremely unlikely | Switch companion chat to direct client-side call pattern (acceptable once users are trusted) |
| Supabase Realtime | 200 concurrent connections | 200 simultaneous guild page viewers | Phase 2 problem. Acceptable at MVP scale. |
| Gemini 3 Flash | 1,500 RPD, 10 RPM | ~500 DAU × 3 AI calls/day | Switch companion fallback to Groq. Keep Gemini for quest generation only. |
| Groq (Llama 3.1 8B) | 14,400 RPD | Very unlikely at MVP | Fall through to rule-based responses only |
| Vercel Hobby | 100GB/month bandwidth, 100K function invocations, 10-second timeout | ~5,000–10,000 MAU | **Upgrade to Pro ($20/month) IMMEDIATELY when first paying user is onboarded** (ToS requires this) |
| DiceBear API | Unlimited | Does not break | — |
| Game-Icons.net | Unlimited static downloads | Does not break | — |
| Cloudflare DNS | Free forever | Does not break | — |

### 9.2 Usage Math at Scale

**At 50 DAU (Phase 1 test cohort):**
- Database writes: 50 users × 2 quest completions/day × 5 rows touched = 500 writes/day → negligible
- AI calls: 50 DAU × 3 calls/day = 150/day → 10% of Gemini free limit
- Bandwidth: ~500KB per session load × 2 sessions/day × 50 users = 50MB/day → 1.5GB/month → well within 100GB
- Function invocations: ~50 users × 10 API calls/day = 500/day → 15,000/month → 15% of 100K limit

**At 500 DAU:**
- AI calls: 500 × 3 = 1,500/day → **at Gemini limit** → enable Groq fallback immediately
- Bandwidth: ~15GB/month → still within 100GB
- Function invocations: ~150,000/month → **over 100K Vercel limit** → must be on Pro by this point

**At 5,000 DAU:**
- AI calls: 15,000/day → **10× over Gemini limit** → enable paid Gemini Tier 1 (pay-as-you-go)
- Database: significant growth → monitor size monthly
- Vercel Pro required: 1TB bandwidth included, easily sufficient

### 9.3 Database Archive Query

Run this monthly once the product has real users:

```sql
-- Check current database size
SELECT pg_size_pretty(pg_database_size(current_database())) AS db_size;

-- Archive old completed quests (keep data, reduce size)
CREATE TABLE IF NOT EXISTS public.archived_user_quests
  AS SELECT * FROM public.user_quests WHERE FALSE; -- Creates empty table with same schema

-- Move quests completed more than 90 days ago to archive
WITH archived AS (
  DELETE FROM public.user_quests
  WHERE status = 'completed'
    AND completed_at < NOW() - INTERVAL '90 days'
  RETURNING *
)
INSERT INTO public.archived_user_quests SELECT * FROM archived;

-- Prune old companion messages (keep only last 10 per user — already handled by code,
-- but run this if memory handling breaks)
DELETE FROM public.companion_messages cm
WHERE cm.created_at NOT IN (
  SELECT created_at FROM public.companion_messages
  WHERE user_id = cm.user_id
  ORDER BY created_at DESC LIMIT 10
);
```

### 9.4 Supabase Inactivity Pause Prevention

The Supabase free tier pauses any project with zero database activity for 7 consecutive days. This WILL happen during development weekends or holiday breaks.

**Prevention — GitHub Actions keepalive:**

```yaml
# .github/workflows/keepalive.yml
name: Supabase Keepalive Ping
on:
  schedule:
    - cron: '0 12 */3 * *'   # Every 3 days at noon UTC
  workflow_dispatch:           # Allow manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -f -s \
            "${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}/rest/v1/" \
            -H "apikey: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}" \
            > /dev/null && echo "Supabase is alive" || echo "Ping failed"
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as GitHub Actions Secrets (Settings → Secrets → Actions).

---

## 10. Build Procedure — Week by Week

Each week has: files to create, tables to verify, components to build, and a "done when" condition. Do not proceed to the next week until the current week's "done when" is satisfied.

### Phase 1: Core Loop (Weeks 1–8)

---

**WEEK 1: Project scaffold, auth, deployment**

Files to create:
```
sovereign/
├── app/
│   ├── layout.tsx                  — Root layout with fonts, UserProvider
│   ├── page.tsx                    — Landing page (static, no data fetch)
│   ├── login/page.tsx              — Login form
│   ├── signup/page.tsx             — Signup form
│   ├── (auth)/layout.tsx           — Redirect to /dashboard if already authed
│   └── not-found.tsx               — 404 page
├── components/
│   └── ui/                         — shadcn components (Button, Input, Dialog, Badge, Sonner)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               — Browser Supabase client
│   │   └── server.ts               — Server-side Supabase client
│   └── utils.ts                    — cn() utility
├── contexts/
│   └── UserContext.tsx             — Auth state context
├── middleware.ts                   — Route protection
├── tailwind.config.ts              — Obsidian Void tokens
├── globals.css                     — CSS variables
└── .github/workflows/keepalive.yml — Supabase ping
```

Actions:
1. `npx create-next-app@latest sovereign --typescript --tailwind --app --eslint`
2. `npx shadcn-ui@latest init` → choose dark theme
3. `npx shadcn-ui@latest add button input dialog badge sonner tabs`
4. Configure Tailwind with Obsidian Void color tokens
5. Create Supabase project at supabase.com
6. Run all SQL from Section 3 in Supabase SQL Editor
7. Add seed data for buildings and achievements
8. Configure Google OAuth in Supabase Auth settings
9. Push to GitHub
10. Connect GitHub repo to Vercel (auto-deploys on push)

**Done when:** `/login` and `/signup` work, users can create accounts, redirect to `/dashboard` (which can be blank) happens after auth. Vercel production URL is live.

---

**WEEK 2: Onboarding flow**

Files to create:
```
app/
├── onboarding/
│   └── page.tsx                    — Single-page onboarding (3 steps)
app/api/
└── profile/
    └── onboarding/route.ts         — POST: create profile, init buildings
```

Onboarding page requirements:
- Step 1: Character name input + Kingdom name input (both required, length validated)
- Step 2: Four class cards (Scholar, Warrior, Builder, Commander) — click to select, one required
- Step 3: Companion name input (pre-filled "Aegis", can change)
- One "Enter Sovereign" CTA that submits all three steps at once
- On submit: call `/api/profile/onboarding`, then redirect to `/dashboard`

Onboarding API route:
```typescript
// app/api/profile/onboarding/route.ts
// POST: Insert into profiles, call initializeUserBuildings(userId)
// Response: { success: true } → client redirects to /dashboard
```

**Done when:** A new user can complete onboarding in under 90 seconds and land on `/dashboard`.

---

**WEEK 3: Dashboard layout and character profile**

Files to create:
```
app/
├── dashboard/page.tsx              — Dashboard (uses sidebar layout)
├── character/page.tsx              — Character profile
└── (app)/layout.tsx                — Sidebar + main content layout for authed routes
components/
├── layout/
│   ├── Sidebar.tsx                 — Left nav rail (icons + wordmark)
│   └── AppLayout.tsx               — Wraps all authed pages
├── ui/
│   ├── XPBar.tsx                   — Custom XP progress bar
│   ├── StatPip.tsx                 — Single attribute display
│   └── Avatar.tsx                  — DiceBear avatar component
```

Dashboard shows:
- XP bar (current XP / next level)
- Active quests list (empty state if none)
- 3 attribute StatPips (top 3 highest)
- Mini kingdom grid (2×3, building status only)
- Companion quote card (static, no AI call)
- Weekly progress ring (quests completed this week / 7 target)

**Done when:** A logged-in user sees their character name, level, XP bar, and attribute values correctly populated from Supabase.

---

**WEEK 4: Quest system data layer**

Files to create:
```
app/api/
├── quests/
│   ├── active/route.ts             — GET active quests
│   ├── available/route.ts          — GET available quest templates
│   ├── completed/route.ts          — GET completed quests
│   ├── start/route.ts              — POST start quest
│   ├── generate/route.ts           — POST generate AI quest
│   └── [id]/
│       ├── route.ts                — GET single quest
│       ├── objective/route.ts      — PUT check/uncheck objective
│       └── complete/route.ts       — POST complete quest
lib/
├── xp.ts                           — xpForLevel, levelFromTotalXp, getTitleForLevel
├── attributes.ts                   — awardAttributePoints
└── buildings.ts                    — checkBuildingUnlocks, initializeUserBuildings
```

Also add 100 quest templates to the database this week. Minimum distribution:
- 25 Body quests (8 easy, 10 medium, 5 hard, 2 epic)
- 25 Mind quests (same distribution)
- 25 Craft quests (same distribution)
- 25 Command quests (same distribution)

**Done when:** `GET /api/quests/available` returns quest templates for the current user. `POST /api/quests/start` creates a `user_quests` row and returns the quest detail.

---

**WEEK 5: Quest board UI and completion flow**

Files to create:
```
app/
└── quests/
    ├── page.tsx                    — Quest board with tabs
    └── [id]/page.tsx               — Quest detail (or use drawer)
components/
└── quests/
    ├── QuestCard.tsx               — Quest card component
    ├── QuestBoard.tsx              — Tabbed quest list
    └── ObjectiveChecklist.tsx      — Objective checkboxes
```

XP animation:
- On quest complete API success: animate XP bar from old value to new value (800ms)
- Show XP toast (+N XP)
- If `leveledUp === true`: show level-up gate overlay
- After gate dismissed: check for building unlock toasts, achievement toasts

**Done when:** A user can start a quest, check objectives, click "Mark Complete," see XP animate, and see their level update if they leveled up.

---

**WEEK 6: Level-up gate and character profile completion**

Files to create:
```
components/
└── overlays/
    └── LevelUpGate.tsx             — Full-screen level-up modal
app/
└── character/page.tsx              — Complete with all attributes, title, achievements
```

Level-up gate requirements:
- Covers full screen with `#000000` background
- Shows new level in large Cormorant Garamond
- Shows new title if milestone
- Shows any unlocked achievements
- "Continue" link to dismiss

Character profile:
- DiceBear avatar (large)
- Character name, title, class
- XP bar
- All 9 attributes as horizontal bars
- Recent milestones list
- Active quests (compact)

**Done when:** Level-up gate triggers correctly, dismisses correctly, and character profile shows accurate data for all attributes.

---

**WEEK 7: Kingdom screen**

Files to create:
```
app/
└── kingdom/page.tsx                — Kingdom map
components/
└── kingdom/
    ├── KingdomGrid.tsx             — 2×3 building grid
    ├── KingdomTile.tsx             — Individual building tile
    └── BuildingDetail.tsx          — Slide-in detail panel on click
app/api/
└── kingdom/
    ├── route.ts                    — GET all buildings with user status
    └── [buildingId]/build/route.ts — POST build an available building
```

Kingdom tile states:
- `locked`: 30% opacity, padlock icon overlay, tooltip on hover showing unlock requirement
- `available`: Full border `1px solid #C41E1E`, 80% opacity, "Manifest" button inside tile
- `built`: Full opacity, building name, tier badge "AWAKENING I"

**Done when:** A user can see their kingdom grid, hover over locked tiles to see unlock conditions, and click "Manifest" on an available building to build it.

---

**WEEK 8: AI companion and final Phase 1 polish**

Files to create:
```
app/
└── companion/page.tsx              — Companion chat interface
app/api/
└── companion/
    ├── history/route.ts            — GET last 10 messages
    └── message/route.ts            — POST send message
lib/
├── companion.ts                    — Rule-based responses + Gemini + Groq
└── gemini.ts                       — Gemini API call with retry/backoff
```

Companion chat requirements:
- Left panel: chat history + input
- Right panel: companion info + directives
- Typing indicator while waiting for API
- Word-by-word text reveal for companion responses
- Quick prompt buttons: "Give me a quest" | "Analyze my week" | "I'm struggling" | "What should I focus on"
- Quick prompts trigger pre-filled message sends (not just fill the input)

Polish tasks this week:
- Error states for all forms and API calls
- Empty states for all lists
- Mobile responsive layout (bottom nav bar for mobile)
- 404 page with companion-voiced message
- Settings page (change display name, change house with weekly limit)

**Done when:** A user can send a message to their companion and receive a coherent response. The app is fully functional on both desktop and mobile. Deploy to test with 5 internal users.

---

### Phase 2: Social + Depth (Weeks 9–14)

Only begin Phase 2 if Phase 1 shows D7 retention > 15% with the test cohort.

**Week 9:** `/guild` page — House hub, weekly collective XP progress bar, member contribution list (read-only). Supabase Realtime subscription for live updates.

**Week 10:** `/leaderboard` — Global weekly XP rankings. Current user row highlighted. House filter (All / Body / Mind / Craft / Command). Top 50 users shown.

**Week 11:** Achievement system — 18 achievements with trigger conditions. Achievement unlock toast. Achievement gallery page accessible from character profile.

**Week 12:** Skill tree — Simple non-branching skill path per class. 5 skills per class. 1 skill point per level-up. Skills shown on character profile. No branching in Phase 2.

**Week 13:** Push notifications via OneSignal (free tier, 10K subscribers). Quest deadline reminders. Level-up celebration when app is closed. Email via Resend (free, 100 emails/day) — weekly progress summary.

**Week 14:** First 20-person test cohort. Collect qualitative feedback via a 5-question Google Form linked from the settings page. Analyze D1, D7, D14 retention. Make go/no-go decision for Phase 3.

---

### Phase 3 (Month 4–6, Conditional)

**Criteria to begin:** D30 retention > 15% AND at least 3 test users report returning daily without being prompted.

Features: Custom guild creation, seasonal events, cosmetic character customization, analytics dashboard, class prestige (reset at Level 50 with bonus attributes), illustrated kingdom art (commission only if revenue exists), AI companion memory depth beyond 10 messages.

---

## 11. Testing & Validation Plan

### 11.1 Core Loop Test (No Real Users, Fake Data)

Before releasing to any user, verify the core loop manually with a test account:

```
1. Sign up as new user
2. Complete onboarding (time it — target < 90 seconds)
3. Start a quest from the quest board
4. Check all objectives
5. Click "Mark Complete"
6. Verify: XP animates correctly
7. Verify: XP bar shows correct new value
8. Create a second test account and level it to Level 3 manually via Supabase SQL
9. Verify level-up gate triggers when XP threshold crossed
10. Verify: correct building unlocks when attribute thresholds are met
11. Send 5 messages to companion — verify responses
12. Build an available building — verify kingdom grid updates
13. Check achievement triggers for first_quest, first_building, companion_chat
```

### 11.2 Metrics to Track

Implement these from day 1 using Supabase queries. No analytics SDK needed.

| Metric | Query | Target |
|---|---|---|
| D1 Retention | Users who log in on Day 1 AND Day 2 / total Day 1 signups | > 40% |
| D7 Retention | Users who log in on any day in Days 5–8 / total Day 1 signups | > 20% |
| D30 Retention | Users who log in in Days 25–35 / total Day 1 signups | > 10% |
| Quest completion rate | Completed quests / started quests | > 60% |
| Avg session length | Not tracked directly — proxy: quests completed per day | > 1/day for active users |
| Onboarding completion | Users who reach dashboard / users who started signup | > 70% |

```sql
-- D7 retention query (run weekly)
SELECT
  DATE_TRUNC('day', p.created_at) AS cohort_day,
  COUNT(DISTINCT p.id) AS signups,
  COUNT(DISTINCT CASE
    WHEN EXISTS (
      SELECT 1 FROM public.user_quests uq
      WHERE uq.user_id = p.id
        AND uq.completed_at >= p.created_at + INTERVAL '5 days'
        AND uq.completed_at <= p.created_at + INTERVAL '8 days'
    ) THEN p.id
  END) AS day7_retained
FROM public.profiles p
WHERE p.created_at >= NOW() - INTERVAL '30 days'
GROUP BY cohort_day
ORDER BY cohort_day;
```

### 11.3 Phase 2 Go/No-Go Decision

After Week 14 test cohort:
- **Go:** D7 retention > 15% AND at least 50% of users completed more than 3 quests
- **Conditional go:** D7 retention 10–15% — fix identified friction points before proceeding
- **No-go:** D7 retention < 10% — investigate root cause before building more features

Root cause investigation for no-go scenario:
1. Survey: "What made you stop using Sovereign?"
2. Check quest completion rate — if < 40%, quests are too hard/irrelevant
3. Check onboarding completion — if < 60%, onboarding is too complex
4. Check companion usage — if < 20% of users chat, companion isn't valuable enough

---

## 12. Risk Analysis & Mitigation

### Risk 1: AI Companion Is Too Slow (API Latency)

**Symptom:** Companion responses take 3–8 seconds, users lose patience.

**Root cause:** Gemini API latency, Supabase Edge Function cold start, large conversation history.

**Mitigations:**
- Show typing indicator immediately (before API call starts)
- Limit conversation history to last 6 messages (not 10) sent to API
- Rule-based matching handles common messages without any API call
- Maximum response `maxOutputTokens: 200` — keeps response generation fast
- If latency consistently > 3 seconds: switch to Groq (Llama 3.1 8B) which is typically faster

### Risk 2: Users Fake Quest Completion

**Symptom:** Users mark quests complete without actually doing the work. Progression feels meaningless.

**Root cause:** No verification mechanism. All completions are self-reported.

**Reality check:** Habitica, LifeUp, and every other self-improvement app has this problem. The product cannot solve it technically. It can only create social and psychological incentives for honesty.

**Mitigations:**
- Phase 2 guilds create social accountability — others can see your contributions
- Companion reflective prompts: after quest complete, ask "What did you do?" (store as journal entry, no validation needed)
- Long quests (7–21 day) with multiple objectives make faking harder
- No punishment for non-completion removes incentive to lie about completion
- If a user cheats themselves, they are the only one affected — accept this

### Risk 3: D7 Retention Below 20%

**Symptom:** Users sign up, play for 1–2 days, then stop.

**Root cause:** The core loop isn't compelling enough, novelty wears off, the app feels like a chore.

**Investigation sequence:**
1. Ask users directly via Google Form
2. Check drop-off point: onboarding? First quest? First level-up?
3. Check whether users who completed more than 5 quests have better retention

**Mitigations:**
- If drop-off at onboarding: simplify further — reduce to 2 steps
- If drop-off after first session: the dashboard doesn't give a clear daily purpose — add a "today's mission" feature
- If drop-off after week 1: user has no new content — build more quest templates, add a daily featured quest

### Risk 4: Database Hits 500MB Free Limit

**Symptom:** Supabase dashboard shows DB size approaching 500MB.

**Timeline:** Unlikely before 5,000–10,000 active users.

**Mitigation:** Run the archive query from Section 9.3. Move completed quests older than 90 days to `archived_user_quests`. Use DiceBear for avatars (zero storage usage). Do NOT use Supabase Storage for any Phase 1 or Phase 2 features.

### Risk 5: Dark Theme Doesn't Resonate With Test Users

**Symptom:** Users describe the app as "confusing," "too dark," or "hard to read."

**Reality:** The Obsidian Void aesthetic is a hypothesis based on Stitch reference images selected by the product owner. It may be too minimal for an 18–24 male audience that is accustomed to brighter, more colorful gaming interfaces (Habitica's pixel art, EpicWin's gold and color).

**Mitigation:**
- Build a theme toggle in Phase 2 (`/settings`) — offer "Void" and "Standard" (slightly more contrast, slightly warmer)
- Run A/B test with first 20 users: 10 see Void theme, 10 see a slightly brighter variation
- Survey: "Does the visual design motivate you?" If < 50% say yes, consider redesign

### Risk 6: Gemini Rate Limits During Development

**Symptom:** During rapid development testing, hitting 10 RPM limit.

**Root cause:** Developer testing companion and quest generation frequently.

**Mitigation:**
- Use Groq as the development default — configure via environment variable `USE_GROQ_FOR_DEV=true`
- Implement a simple development mock that returns static companion responses without any API call:

```typescript
if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_AI === 'true') {
  return `[MOCK] ${userContext.companionName} speaks: Your development continues.`
}
```

### Risk 7: The 18–24 Male Demographic Assumption is Wrong

**Symptom:** Test cohort is predominantly not 18–24 males, or 18–24 males don't retain.

**Reality:** This is the most fundamental business risk. The product may appeal to a different demographic (older productivity enthusiasts, ADHD users, or a gender-mixed audience).

**Mitigation:**
- Do NOT narrow the product to only work for one demographic. The RPG mechanics, dark aesthetic, and kingdom building are universally appealing.
- Track demographic information in the Phase 2 user survey (age, gender, primary reason for using the app)
- If the retained users are mostly a different demographic, pivot the positioning, not the product
- The product is valid for any demographic that responds to progression mechanics and identity-building — adjust marketing, not the game itself

---

## Appendix: File Structure Summary

```
sovereign/
├── .github/workflows/
│   └── keepalive.yml
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    → / (landing)
│   ├── not-found.tsx               → /404
│   ├── globals.css
│   ├── login/page.tsx              → /login
│   ├── signup/page.tsx             → /signup
│   ├── onboarding/page.tsx         → /onboarding
│   ├── (app)/                      → authenticated routes
│   │   ├── layout.tsx              → sidebar wrapper
│   │   ├── dashboard/page.tsx      → /dashboard
│   │   ├── quests/
│   │   │   ├── page.tsx            → /quests
│   │   │   └── [id]/page.tsx       → /quests/:id
│   │   ├── character/page.tsx      → /character
│   │   ├── kingdom/page.tsx        → /kingdom
│   │   ├── companion/page.tsx      → /companion
│   │   ├── settings/page.tsx       → /settings
│   │   ├── leaderboard/page.tsx    → /leaderboard (Phase 2)
│   │   └── guild/page.tsx          → /guild (Phase 2)
│   └── api/
│       ├── profile/
│       │   ├── route.ts
│       │   ├── onboarding/route.ts
│       │   └── change-house/route.ts
│       ├── quests/
│       │   ├── active/route.ts
│       │   ├── available/route.ts
│       │   ├── completed/route.ts
│       │   ├── start/route.ts
│       │   ├── generate/route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── objective/route.ts
│       │       ├── complete/route.ts
│       │       └── abandon/route.ts
│       ├── kingdom/
│       │   ├── route.ts
│       │   └── [buildingId]/build/route.ts
│       ├── companion/
│       │   ├── history/route.ts
│       │   └── message/route.ts
│       └── achievements/route.ts
├── components/
│   ├── ui/                         → shadcn components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── AppLayout.tsx
│   ├── quests/
│   │   ├── QuestCard.tsx
│   │   ├── QuestBoard.tsx
│   │   └── ObjectiveChecklist.tsx
│   ├── kingdom/
│   │   ├── KingdomGrid.tsx
│   │   ├── KingdomTile.tsx
│   │   └── BuildingDetail.tsx
│   ├── companion/
│   │   ├── CompanionChat.tsx
│   │   └── TypingIndicator.tsx
│   └── overlays/
│       └── LevelUpGate.tsx
├── contexts/
│   └── UserContext.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── xp.ts
│   ├── attributes.ts
│   ├── buildings.ts
│   ├── achievements.ts
│   ├── companion.ts
│   ├── gemini.ts
│   ├── groq.ts
│   └── utils.ts
├── middleware.ts
├── tailwind.config.ts
└── public/
    └── icons/
        ├── buildings/              → Game-Icons.net SVGs
        └── nav/                    → Custom geometric nav icons
```

---

*Sovereign Game Development Specification v1.0*
*June 2026 — Prepared for GLM 5.2 / Antigravity AI coding agent*
*Target: Phase 1 launch in 8 weeks at 10–15 hrs/week development pace*
*Total monthly cost at Phase 1 MVP scale (≤50 DAU): $0*
