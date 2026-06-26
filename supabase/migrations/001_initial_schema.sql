-- ============================================================
-- SOVEREIGN — Complete Database Schema (Phase 1)
-- Applied with Replacement 4: house_id has NO DEFAULT
-- ============================================================

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
  house_id            TEXT NOT NULL CHECK (house_id IN ('ash', 'zenith', 'forge', 'crown')),
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

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

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
