-- Grant permissions to authenticated users for all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_quests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_buildings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companion_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_xp TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_skills TO authenticated;

-- For reference tables, authenticated users only need SELECT
GRANT SELECT ON public.quest_templates TO authenticated;
GRANT SELECT ON public.buildings TO authenticated;
GRANT SELECT ON public.achievements TO authenticated;
GRANT SELECT ON public.skills TO authenticated;
