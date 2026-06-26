-- ============================================================
-- SOVEREIGN — Phase 2 Schema
-- ============================================================

CREATE TABLE public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  class TEXT NOT NULL CHECK (class IN ('scholar', 'warrior', 'builder', 'commander')),
  tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3, 4, 5)),
  cost INTEGER NOT NULL DEFAULT 1,
  primary_attr_bonus TEXT,
  effect_type TEXT CHECK (effect_type IN ('xp_multiplier', 'quest_unlock', 'max_quests', 'attr_double', 'attr_bonus')),
  effect_value INTEGER,
  prerequisite_skill_id TEXT REFERENCES public.skills(id),
  icon_name TEXT
);

CREATE TABLE public.user_skills (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES public.skills(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);

-- Alter profiles
ALTER TABLE public.profiles
  ADD COLUMN skill_points_available INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN skill_points_total INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN xp_multiplier_pct INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN max_active_quests INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN attr_double_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- Alter achievements to support rarity (missing in initial schema but required for phase 2 UI)
ALTER TABLE public.achievements
  ADD COLUMN rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'));

-- Alter user_achievements
ALTER TABLE public.user_achievements
  ALTER COLUMN unlocked_at DROP NOT NULL,
  ALTER COLUMN unlocked_at DROP DEFAULT,
  ADD COLUMN progress_current INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN progress_target INTEGER;

-- RLS Policies
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their user_skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id);
