-- ============================================================
-- SOVEREIGN — Phase 2 Seed Data
-- ============================================================

-- SCHOLAR SKILLS
INSERT INTO public.skills (id, name, description, class, tier, cost, primary_attr_bonus, effect_type, effect_value, prerequisite_skill_id) VALUES
('deep_focus', 'Deep Focus', '+2 Intelligence per quest', 'scholar', 1, 1, 'intelligence +2', 'attr_bonus', 2, NULL),
('arcane_memory', 'Arcane Memory', '+10% XP from reading quests', 'scholar', 2, 1, NULL, 'xp_multiplier', 10, 'deep_focus'),
('scholars_eye', 'Scholar''s Eye', 'Unlock rare quest templates', 'scholar', 3, 2, NULL, 'quest_unlock', 1, 'arcane_memory'),
('mind_palace', 'Mind Palace', '+5 max active quests', 'scholar', 4, 2, NULL, 'max_quests', 5, 'scholars_eye'),
('transcendence', 'Transcendence', 'Double primary attribute gain', 'scholar', 5, 3, NULL, 'attr_double', 2, 'mind_palace');

-- WARRIOR SKILLS
INSERT INTO public.skills (id, name, description, class, tier, cost, primary_attr_bonus, effect_type, effect_value, prerequisite_skill_id) VALUES
('iron_body', 'Iron Body', '+2 Strength per quest', 'warrior', 1, 1, 'strength +2', 'attr_bonus', 2, NULL),
('battle_hardened', 'Battle Hardened', '+10% XP from combat quests', 'warrior', 2, 1, NULL, 'xp_multiplier', 10, 'iron_body'),
('berserkers_rage', 'Berserker''s Rage', 'Unlock rare combat quests', 'warrior', 3, 2, NULL, 'quest_unlock', 1, 'battle_hardened'),
('warlords_command', 'Warlord''s Command', '+5 max active quests', 'warrior', 4, 2, NULL, 'max_quests', 5, 'berserkers_rage'),
('avatar_of_ash', 'Avatar of Ash', 'Double primary attribute gain', 'warrior', 5, 3, NULL, 'attr_double', 2, 'warlords_command');

-- BUILDER SKILLS
INSERT INTO public.skills (id, name, description, class, tier, cost, primary_attr_bonus, effect_type, effect_value, prerequisite_skill_id) VALUES
('craftsmans_eye', 'Craftsman''s Eye', '+2 Dexterity per quest', 'builder', 1, 1, 'dexterity +2', 'attr_bonus', 2, NULL),
('efficient_labor', 'Efficient Labor', '+10% XP from building quests', 'builder', 2, 1, NULL, 'xp_multiplier', 10, 'craftsmans_eye'),
('architects_vision', 'Architect''s Vision', 'Unlock rare building quests', 'builder', 3, 2, NULL, 'quest_unlock', 1, 'efficient_labor'),
('foundry_master', 'Foundry Master', '+5 max active quests', 'builder', 4, 2, NULL, 'max_quests', 5, 'architects_vision'),
('forge_incarnate', 'Forge Incarnate', 'Double primary attribute gain', 'builder', 5, 3, NULL, 'attr_double', 2, 'foundry_master');

-- COMMANDER SKILLS
INSERT INTO public.skills (id, name, description, class, tier, cost, primary_attr_bonus, effect_type, effect_value, prerequisite_skill_id) VALUES
('tactical_mind', 'Tactical Mind', '+2 Charisma per quest', 'commander', 1, 1, 'charisma +2', 'attr_bonus', 2, NULL),
('rallying_cry', 'Rallying Cry', '+10% XP from leadership quests', 'commander', 2, 1, NULL, 'xp_multiplier', 10, 'tactical_mind'),
('strategists_gambit', 'Strategist''s Gambit', 'Unlock rare leadership quests', 'commander', 3, 2, NULL, 'quest_unlock', 1, 'rallying_cry'),
('legions_heart', 'Legion''s Heart', '+5 max active quests', 'commander', 4, 2, NULL, 'max_quests', 5, 'strategists_gambit'),
('crown_unbound', 'Crown Unbound', 'Double primary attribute gain', 'commander', 5, 3, NULL, 'attr_double', 2, 'legions_heart');

-- PHASE 2 ACHIEVEMENTS
-- Clear any potential overlaps from Phase 1 if needed, or just insert new ones
INSERT INTO public.achievements (id, title, description, condition_type, condition_value, xp_bonus, rarity) VALUES
('first_blood_p2', 'First Blood', 'Complete your first quest', 'quest_count', 1, 100, 'common'),
('scholars_path_p2', 'Scholar''s Path', 'Complete 10 Scholar domain quests', 'domain_quests', 10, 250, 'rare'),
('iron_will_p2', 'Iron Will', 'Reach 50 Discipline', 'attribute_threshold', 50, 500, 'rare'),
('kingdom_founder_p2', 'Kingdom Founder', 'Build your first monument', 'building_count', 1, 300, 'common'),
('echo_collector_p2', 'Echo Collector', 'Earn 5,000 total XP', 'total_xp', 5000, 1000, 'epic'),
('marathon_runner_p2', 'Marathon Runner', 'Complete 50 quests', 'quest_count', 50, 750, 'epic'),
('house_loyalist_p2', 'House Loyalist', 'Earn 10,000 XP for your House', 'house_xp', 10000, 2000, 'legendary'),
('void_walker_p2', 'Void Walker', 'Complete a quest between 3 AM and 4 AM', 'time_quest', 1, 200, 'rare'),
('skill_weaver_p2', 'Skill Weaver', 'Unlock your first skill', 'skill_count', 1, 150, 'common'),
('path_master_p2', 'Path Master', 'Unlock all 5 skills in your class', 'class_skills_complete', 5, 5000, 'legendary'),
('guild_champion_p2', 'Guild Champion', 'Contribute 1,000 XP to your House in one week', 'weekly_house_xp', 1000, 1500, 'epic'),
('ascendant_p2', 'The Ascendant', 'Reach Level 20', 'level_threshold', 20, 10000, 'legendary');

-- UPDATE EXISTING USERS WITH SKILL POINTS
UPDATE public.profiles SET skill_points_available = 3, skill_points_total = 3 WHERE skill_points_available = 0;
