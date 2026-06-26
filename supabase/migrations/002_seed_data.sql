-- ============================================================
-- SOVEREIGN — Seed Data: Buildings, Achievements, 100 Quest Templates
-- ============================================================

-- ============================================================
-- BUILDINGS (6 total — Phase 1)
-- ============================================================

INSERT INTO public.buildings (id, name, domain, icon_filename, lore_text, unlock_attribute, unlock_threshold, quest_unlock_domain, xp_bonus_pct, display_order) VALUES
('library',          'The Archive',          'mind',       'book-cover.svg',     'Where knowledge crystallizes into power.',             'attr_intelligence', 25, 'mind',    10, 1),
('training_grounds', 'The Proving Ground',   'body',       'weight-lifting-up.svg','Forged by pain, remembered by muscle.',             'attr_strength',     25, 'body',    10, 2),
('workshop',         'The Forge',            'craft',      'anvil.svg',          'Where intention becomes artifact.',                    'attr_technical',    25, 'craft',   10, 3),
('watchtower',       'The Watchtower',       'discipline', 'tower.svg',          'Clarity requires elevation.',                          'attr_discipline',   25, NULL,       5, 4),
('guild_hall',       'The Assembly Hall',    'command',    'players.svg',        'Command begins with trust.',                           'attr_charisma',     40, 'command', 10, 5),
('academy',          'The Academy',          'mind',       'graduate-cap.svg',   'The highest form of the Archive. Mastery begets mastery.','attr_intelligence',60, 'mind',    5, 6);

-- ============================================================
-- ACHIEVEMENTS (18 total — Phase 1)
-- ============================================================

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

-- ============================================================
-- QUEST TEMPLATES (100 total: 25 per domain)
-- Distribution per domain: 8 easy / 10 medium / 5 hard / 2 epic
-- Easy = 75 XP, duration 1-3 days
-- Medium = 175 XP, duration 5-7 days
-- Hard = 350 XP, duration 7-14 days
-- Epic = 650 XP, duration 14-21 days
-- ============================================================

INSERT INTO public.quest_templates
  (title, description, domain, difficulty, xp_reward, rarity, duration_days, objectives, primary_attr, secondary_attr, kingdom_xp_reward, min_level)
VALUES
-- ============================================================
-- BODY DOMAIN (25 quests: 8 easy, 10 medium, 5 hard, 2 epic)
-- ============================================================

-- BODY EASY (8)
('Complete 50 pushups today',
 'Forge the body''s foundation through simple repetition.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e1o1","text":"Do 50 pushups in total throughout the day","order":1}]',
 'attr_strength', 'attr_vitality', 30, 1),

('Drink 2 liters of water today',
 'The most fundamental discipline: feeding the vessel.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e2o1","text":"Drink 2 liters of water before midnight","order":1}]',
 'attr_vitality', 'attr_discipline', 30, 1),

('30-minute walk',
 'Movement clears the mind as much as it strengthens the body.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e3o1","text":"Walk for 30 continuous minutes","order":1}]',
 'attr_vitality', 'attr_strength', 30, 1),

('10-minute morning stretch',
 'Flexibility is the foundation of resilience.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e4o1","text":"Complete a 10-minute full-body stretch routine","order":1}]',
 'attr_vitality', 'attr_discipline', 30, 1),

('Skip rope for 15 minutes',
 'Rhythm builds endurance faster than force.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e5o1","text":"Jump rope for 15 minutes total","order":1}]',
 'attr_strength', 'attr_vitality', 30, 1),

('Hold a plank for 2 minutes total',
 'Stillness under tension is the body''s meditation.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e6o1","text":"Accumulate 2 minutes in plank position","order":1}]',
 'attr_strength', 'attr_focus', 30, 1),

('Do 100 squats today',
 'The legs carry the kingdom.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e7o1","text":"Complete 100 squats throughout the day","order":1}]',
 'attr_strength', 'attr_vitality', 30, 1),

('Sleep 7+ hours tonight',
 'Recovery is not laziness — it is strategy.',
 'body', 'easy', 75, 'common', 1,
 '[{"id":"b1e8o1","text":"Sleep at least 7 hours and confirm in the morning","order":1}]',
 'attr_vitality', 'attr_discipline', 30, 1),

-- BODY MEDIUM (10)
('Complete 150 pushups across 5 days',
 'Consistency is a more powerful force than intensity.',
 'body', 'medium', 175, 'uncommon', 5,
 '[{"id":"b1m1o1","text":"Day 1: 30 pushups","order":1},{"id":"b1m1o2","text":"Day 2: 30 pushups","order":2},{"id":"b1m1o3","text":"Day 3: 30 pushups","order":3},{"id":"b1m1o4","text":"Day 4: 30 pushups","order":4},{"id":"b1m1o5","text":"Day 5: 30 pushups","order":5}]',
 'attr_strength', 'attr_vitality', 60, 1),

('Run or walk 20km this week',
 'Distance is the most honest metric of physical will.',
 'body', 'medium', 175, 'uncommon', 7,
 '[{"id":"b1m2o1","text":"Log 5km","order":1},{"id":"b1m2o2","text":"Log 10km total","order":2},{"id":"b1m2o3","text":"Log 15km total","order":3},{"id":"b1m2o4","text":"Log 20km total","order":4}]',
 'attr_vitality', 'attr_strength', 60, 1),

('Complete 3 gym sessions this week',
 'Iron disciplines the flesh.',
 'body', 'medium', 175, 'uncommon', 7,
 '[{"id":"b1m3o1","text":"Complete gym session 1","order":1},{"id":"b1m3o2","text":"Complete gym session 2","order":2},{"id":"b1m3o3","text":"Complete gym session 3","order":3}]',
 'attr_strength', 'attr_vitality', 60, 1),

('Follow a meal plan for 5 days',
 'The body is built in the kitchen as much as the gym.',
 'body', 'medium', 175, 'uncommon', 5,
 '[{"id":"b1m4o1","text":"Plan your meals for the week","order":1},{"id":"b1m4o2","text":"Follow the plan for Day 1","order":2},{"id":"b1m4o3","text":"Follow the plan for Day 3","order":3},{"id":"b1m4o4","text":"Follow the plan for Day 5","order":4}]',
 'attr_vitality', 'attr_discipline', 60, 1),

('Do 300 bodyweight squats in a week',
 'Repetition is the language the body understands.',
 'body', 'medium', 175, 'uncommon', 7,
 '[{"id":"b1m5o1","text":"Complete 100 squats by Day 3","order":1},{"id":"b1m5o2","text":"Complete 200 squats by Day 5","order":3},{"id":"b1m5o3","text":"Complete 300 squats by Day 7","order":3}]',
 'attr_strength', 'attr_vitality', 60, 1),

('Run 5km without stopping',
 'The first full run marks the moment the body stops negotiating.',
 'body', 'medium', 175, 'uncommon', 5,
 '[{"id":"b1m6o1","text":"Warm up with a 10-minute walk","order":1},{"id":"b1m6o2","text":"Run 5km continuously","order":2},{"id":"b1m6o3","text":"Cool down with a 5-minute walk","order":3}]',
 'attr_vitality', 'attr_strength', 60, 1),

('Complete a 30-day challenge day batch',
 'The compound effect outperforms the spike.',
 'body', 'medium', 175, 'uncommon', 7,
 '[{"id":"b1m7o1","text":"Choose your daily exercise","order":1},{"id":"b1m7o2","text":"Complete 5 consecutive days","order":2},{"id":"b1m7o3","text":"Complete 7 consecutive days","order":3}]',
 'attr_discipline', 'attr_vitality', 60, 1),

('Swim or cycle for 1 hour this week',
 'Variety in motion prevents stagnation in growth.',
 'body', 'medium', 175, 'uncommon', 7,
 '[{"id":"b1m8o1","text":"Swim or cycle for 30 minutes","order":1},{"id":"b1m8o2","text":"Complete the full 1-hour session","order":2}]',
 'attr_vitality', 'attr_strength', 60, 1),

('Do 50 burpees for 3 days straight',
 'Burpees are the court where will is judged.',
 'body', 'medium', 175, 'uncommon', 3,
 '[{"id":"b1m9o1","text":"Day 1: 50 burpees","order":1},{"id":"b1m9o2","text":"Day 2: 50 burpees","order":2},{"id":"b1m9o3","text":"Day 3: 50 burpees","order":3}]',
 'attr_strength', 'attr_discipline', 60, 2),

('Increase your max pushups by 10 in a week',
 'Growth is measured against your former self.',
 'body', 'medium', 175, 'uncommon', 7,
 '[{"id":"b1m10o1","text":"Test your current max pushups","order":1},{"id":"b1m10o2","text":"Train pushups 4 times this week","order":2},{"id":"b1m10o3","text":"Retest and beat your max by at least 10","order":3}]',
 'attr_strength', 'attr_vitality', 60, 2),

-- BODY HARD (5)
('Complete a 7-day morning exercise routine',
 'The morning is the territory only the disciplined claim.',
 'body', 'hard', 350, 'rare', 7,
 '[{"id":"b1h1o1","text":"Exercise before 8AM on Day 1","order":1},{"id":"b1h1o2","text":"Exercise before 8AM on Day 2","order":2},{"id":"b1h1o3","text":"Exercise before 8AM on Day 3","order":3},{"id":"b1h1o4","text":"Exercise before 8AM on Day 4","order":4},{"id":"b1h1o5","text":"Exercise before 8AM on Day 5","order":5},{"id":"b1h1o6","text":"Exercise before 8AM on Day 6","order":6},{"id":"b1h1o7","text":"Exercise before 8AM on Day 7","order":7}]',
 'attr_discipline', 'attr_strength', 100, 3),

('Run 50km in two weeks',
 'Endurance is patience made physical.',
 'body', 'hard', 350, 'rare', 14,
 '[{"id":"b1h2o1","text":"Log 10km total","order":1},{"id":"b1h2o2","text":"Log 25km total","order":2},{"id":"b1h2o3","text":"Log 40km total","order":3},{"id":"b1h2o4","text":"Log 50km total","order":4}]',
 'attr_vitality', 'attr_discipline', 100, 3),

('Complete 1000 pushups in a month',
 'A thousand small acts build a fortress.',
 'body', 'hard', 350, 'rare', 14,
 '[{"id":"b1h3o1","text":"Complete 250 pushups by end of Week 1","order":1},{"id":"b1h3o2","text":"Complete 500 pushups by end of Week 2","order":2},{"id":"b1h3o3","text":"Complete 750 pushups total","order":3},{"id":"b1h3o4","text":"Complete 1000 pushups total","order":4}]',
 'attr_strength', 'attr_vitality', 100, 5),

('Follow a structured workout program for 2 weeks',
 'Structure transforms effort into architecture.',
 'body', 'hard', 350, 'rare', 14,
 '[{"id":"b1h4o1","text":"Find or create a 2-week program","order":1},{"id":"b1h4o2","text":"Complete Week 1 as planned","order":2},{"id":"b1h4o3","text":"Complete Week 2 as planned","order":3},{"id":"b1h4o4","text":"Log your results and reflections","order":4}]',
 'attr_discipline', 'attr_strength', 100, 5),

('Achieve a new personal record in any lift or exercise',
 'The PR is the body''s way of proving the mind right.',
 'body', 'hard', 350, 'rare', 10,
 '[{"id":"b1h5o1","text":"Identify the exercise and current PR","order":1},{"id":"b1h5o2","text":"Follow a progression plan for 1 week","order":2},{"id":"b1h5o3","text":"Attempt the new PR","order":3},{"id":"b1h5o4","text":"Achieve and confirm the new PR","order":4}]',
 'attr_strength', 'attr_vitality', 100, 7),

-- BODY EPIC (2)
('Complete a 30-day fitness transformation challenge',
 'Transformation is not an event — it is a sustained declaration.',
 'body', 'epic', 650, 'epic', 21,
 '[{"id":"b1ep1o1","text":"Define your fitness goal and baseline","order":1},{"id":"b1ep1o2","text":"Complete Week 1 workouts","order":2},{"id":"b1ep1o3","text":"Complete Week 2 workouts","order":3},{"id":"b1ep1o4","text":"Complete Week 3 workouts","order":4},{"id":"b1ep1o5","text":"Measure results and compare to baseline","order":5}]',
 'attr_strength', 'attr_discipline', 200, 8),

('Train for and complete a 10km run',
 'The 10K is where joggers become runners.',
 'body', 'epic', 650, 'epic', 21,
 '[{"id":"b1ep2o1","text":"Run 3km without stopping","order":1},{"id":"b1ep2o2","text":"Run 5km without stopping","order":2},{"id":"b1ep2o3","text":"Run 7km without stopping","order":3},{"id":"b1ep2o4","text":"Complete the 10km run","order":4},{"id":"b1ep2o5","text":"Record your time","order":5}]',
 'attr_vitality', 'attr_discipline', 200, 10),

-- ============================================================
-- MIND DOMAIN (25 quests: 8 easy, 10 medium, 5 hard, 2 epic)
-- ============================================================

-- MIND EASY (8)
('Study or read for 45 minutes',
 'One focused session outweighs a day of scattered attention.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e1o1","text":"Study or read uninterrupted for 45 minutes","order":1}]',
 'attr_intelligence', 'attr_focus', 30, 1),

('Summarize one article or chapter',
 'Synthesis is how information becomes understanding.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e2o1","text":"Read one article or book chapter","order":1},{"id":"m1e2o2","text":"Write a 3-sentence summary","order":2}]',
 'attr_intelligence', 'attr_focus', 30, 1),

('Meditate for 10 minutes',
 'The mind that watches itself commands itself.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e3o1","text":"Meditate in silence for 10 minutes","order":1}]',
 'attr_focus', 'attr_discipline', 30, 1),

('Write a journal entry about today',
 'Reflection turns experience into wisdom.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e4o1","text":"Write at least 200 words about your day","order":1}]',
 'attr_intelligence', 'attr_creativity', 30, 1),

('Learn 10 new vocabulary words',
 'Language is the operating system of thought.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e5o1","text":"Find 10 unfamiliar words","order":1},{"id":"m1e5o2","text":"Write each word with its definition and use it in a sentence","order":2}]',
 'attr_intelligence', 'attr_focus', 30, 1),

('Do a digital detox for 2 hours',
 'Silence the noise and the signal reveals itself.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e6o1","text":"Turn off all screens and social media for 2 hours","order":1},{"id":"m1e6o2","text":"Note how you spent the time instead","order":2}]',
 'attr_focus', 'attr_discipline', 30, 1),

('Watch one educational video and take notes',
 'Passive consumption is entertainment. Active consumption is education.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e7o1","text":"Watch a video on a topic you want to learn","order":1},{"id":"m1e7o2","text":"Write 5 key takeaways","order":2}]',
 'attr_intelligence', 'attr_focus', 30, 1),

('Plan your goals for the week',
 'A goal without a plan is a wish with a deadline it will miss.',
 'mind', 'easy', 75, 'common', 1,
 '[{"id":"m1e8o1","text":"Write down 3-5 goals for the week","order":1},{"id":"m1e8o2","text":"Identify the #1 priority","order":2}]',
 'attr_focus', 'attr_intelligence', 30, 1),

-- MIND MEDIUM (10)
('Complete 5 deep work sessions this week',
 'Depth of focus is rarer than talent.',
 'mind', 'medium', 175, 'uncommon', 7,
 '[{"id":"m1m1o1","text":"Complete a 90-minute focused session","order":1},{"id":"m1m1o2","text":"Complete a second session","order":2},{"id":"m1m1o3","text":"Complete a third session","order":3},{"id":"m1m1o4","text":"Complete a fourth session","order":4},{"id":"m1m1o5","text":"Complete a fifth session","order":5}]',
 'attr_focus', 'attr_intelligence', 60, 1),

('Learn one new technical concept',
 'Understanding something new reshapes the architecture of your mind.',
 'mind', 'medium', 175, 'uncommon', 5,
 '[{"id":"m1m2o1","text":"Identify the concept to learn","order":1},{"id":"m1m2o2","text":"Study it for at least 2 hours total","order":2},{"id":"m1m2o3","text":"Explain it in writing in your own words","order":3}]',
 'attr_intelligence', 'attr_focus', 60, 1),

('Read 50 pages of a non-fiction book',
 'Knowledge not applied is knowledge not possessed.',
 'mind', 'medium', 175, 'uncommon', 5,
 '[{"id":"m1m3o1","text":"Read the first 20 pages","order":1},{"id":"m1m3o2","text":"Read to page 40","order":2},{"id":"m1m3o3","text":"Complete 50 pages","order":3}]',
 'attr_intelligence', 'attr_focus', 60, 1),

('Practice a new language for 30 minutes daily for 5 days',
 'A new language is a new lens on reality.',
 'mind', 'medium', 175, 'uncommon', 5,
 '[{"id":"m1m4o1","text":"Day 1: 30 minutes of language practice","order":1},{"id":"m1m4o2","text":"Day 3: 30 minutes of language practice","order":2},{"id":"m1m4o3","text":"Day 5: 30 minutes of language practice and review","order":3}]',
 'attr_intelligence', 'attr_creativity', 60, 2),

('Complete a full online course module',
 'Structured learning outperforms random curiosity.',
 'mind', 'medium', 175, 'uncommon', 7,
 '[{"id":"m1m5o1","text":"Enroll in a course relevant to your growth","order":1},{"id":"m1m5o2","text":"Complete the first module","order":2},{"id":"m1m5o3","text":"Complete all module quizzes or exercises","order":3}]',
 'attr_intelligence', 'attr_focus', 60, 2),

('Write a detailed analysis of a topic you studied',
 'Analysis is the forge where raw knowledge becomes sharp insight.',
 'mind', 'medium', 175, 'uncommon', 5,
 '[{"id":"m1m6o1","text":"Choose a topic you recently learned","order":1},{"id":"m1m6o2","text":"Write a 500+ word analysis","order":2},{"id":"m1m6o3","text":"Identify at least 3 implications or applications","order":3}]',
 'attr_intelligence', 'attr_creativity', 60, 3),

('Solve 5 challenging puzzles or logic problems',
 'The mind sharpens on resistance, not ease.',
 'mind', 'medium', 175, 'uncommon', 5,
 '[{"id":"m1m7o1","text":"Solve puzzle 1","order":1},{"id":"m1m7o2","text":"Solve 3 puzzles total","order":2},{"id":"m1m7o3","text":"Solve all 5 puzzles","order":3}]',
 'attr_focus', 'attr_intelligence', 60, 2),

('Create a mind map of a complex topic',
 'Mapping knowledge reveals its hidden architecture.',
 'mind', 'medium', 175, 'uncommon', 3,
 '[{"id":"m1m8o1","text":"Choose a complex topic","order":1},{"id":"m1m8o2","text":"Create a visual mind map with at least 15 nodes","order":2},{"id":"m1m8o3","text":"Identify 3 connections you hadn''t seen before","order":3}]',
 'attr_intelligence', 'attr_creativity', 60, 3),

('Read and annotate 3 research papers or long-form articles',
 'The annotated mind retains what the skimming mind loses.',
 'mind', 'medium', 175, 'uncommon', 7,
 '[{"id":"m1m9o1","text":"Read and annotate paper/article 1","order":1},{"id":"m1m9o2","text":"Read and annotate paper/article 2","order":2},{"id":"m1m9o3","text":"Read and annotate paper/article 3","order":3}]',
 'attr_intelligence', 'attr_focus', 60, 4),

('Teach someone a concept you recently learned',
 'Teaching is the final exam of understanding.',
 'mind', 'medium', 175, 'uncommon', 5,
 '[{"id":"m1m10o1","text":"Choose a concept you understand well","order":1},{"id":"m1m10o2","text":"Prepare a clear explanation","order":2},{"id":"m1m10o3","text":"Teach it to someone and answer their questions","order":3}]',
 'attr_intelligence', 'attr_leadership', 60, 3),

-- MIND HARD (5)
('Finish one non-fiction book',
 'A book fully digested is worth a library barely browsed.',
 'mind', 'hard', 350, 'rare', 14,
 '[{"id":"m1h1o1","text":"Read 25% of the book","order":1},{"id":"m1h1o2","text":"Read 50% of the book","order":2},{"id":"m1h1o3","text":"Read 75% of the book","order":3},{"id":"m1h1o4","text":"Finish the book","order":4},{"id":"m1h1o5","text":"Write a 5-point summary","order":5}]',
 'attr_intelligence', 'attr_creativity', 100, 3),

('Complete a certification or online course',
 'Credentials are the world''s shorthand for competence.',
 'mind', 'hard', 350, 'rare', 14,
 '[{"id":"m1h2o1","text":"Enroll in a certification or structured course","order":1},{"id":"m1h2o2","text":"Complete 50% of the material","order":2},{"id":"m1h2o3","text":"Complete 100% of the material","order":3},{"id":"m1h2o4","text":"Pass the final assessment","order":4}]',
 'attr_intelligence', 'attr_focus', 100, 5),

('Build a personal knowledge management system',
 'A second mind doubles the first.',
 'mind', 'hard', 350, 'rare', 14,
 '[{"id":"m1h3o1","text":"Choose your tool (Notion, Obsidian, etc.)","order":1},{"id":"m1h3o2","text":"Create a structure with at least 5 categories","order":2},{"id":"m1h3o3","text":"Populate with 20+ notes from recent learning","order":3},{"id":"m1h3o4","text":"Create 5 cross-links between notes","order":4}]',
 'attr_intelligence', 'attr_technical', 100, 5),

('Write a 2000-word essay on any topic',
 'Extended writing is the ultimate test of coherent thought.',
 'mind', 'hard', 350, 'rare', 10,
 '[{"id":"m1h4o1","text":"Choose your topic and create an outline","order":1},{"id":"m1h4o2","text":"Write the first 1000 words","order":2},{"id":"m1h4o3","text":"Write the full 2000 words","order":3},{"id":"m1h4o4","text":"Edit and polish the final draft","order":4}]',
 'attr_intelligence', 'attr_creativity', 100, 7),

('Master a complex mental model and apply it',
 'Mental models are the compression algorithms of reality.',
 'mind', 'hard', 350, 'rare', 10,
 '[{"id":"m1h5o1","text":"Study a mental model (e.g., first principles, inversion, second-order thinking)","order":1},{"id":"m1h5o2","text":"Write a detailed explanation in your own words","order":2},{"id":"m1h5o3","text":"Apply it to a real decision or problem","order":3},{"id":"m1h5o4","text":"Document the results and insights","order":4}]',
 'attr_intelligence', 'attr_focus', 100, 8),

-- MIND EPIC (2)
('Complete 3 books in a month with full notes',
 'Three books deeply read reshape a worldview.',
 'mind', 'epic', 650, 'epic', 21,
 '[{"id":"m1ep1o1","text":"Finish Book 1 and write notes","order":1},{"id":"m1ep1o2","text":"Finish Book 2 and write notes","order":2},{"id":"m1ep1o3","text":"Finish Book 3 and write notes","order":3},{"id":"m1ep1o4","text":"Write a synthesis connecting all three","order":4}]',
 'attr_intelligence', 'attr_creativity', 200, 10),

('Design and complete a self-directed learning curriculum',
 'The ultimate discipline is being your own professor.',
 'mind', 'epic', 650, 'epic', 21,
 '[{"id":"m1ep2o1","text":"Define your learning goal and scope","order":1},{"id":"m1ep2o2","text":"Create a 3-week curriculum with daily objectives","order":2},{"id":"m1ep2o3","text":"Complete Week 1","order":3},{"id":"m1ep2o4","text":"Complete Week 2","order":4},{"id":"m1ep2o5","text":"Complete Week 3 and produce a final project or write-up","order":5}]',
 'attr_intelligence', 'attr_discipline', 200, 12),

-- ============================================================
-- CRAFT DOMAIN (25 quests: 8 easy, 10 medium, 5 hard, 2 epic)
-- ============================================================

-- CRAFT EASY (8)
('Write 500 words on any topic',
 'Creation begins with putting something into the world.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"c1e1o1","text":"Write 500+ words (blog, journal, story, code docs)","order":1}]',
 'attr_creativity', 'attr_technical', 30, 1),

('Fix one bug or ship one small feature',
 'Progress is one completed unit at a time.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"c1e2o1","text":"Identify the bug or feature","order":1},{"id":"c1e2o2","text":"Implement and verify the fix","order":2}]',
 'attr_technical', 'attr_creativity', 30, 1),

('Create a simple design or sketch',
 'Every masterpiece starts as a rough shape.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"c1e3o1","text":"Create a design, sketch, or wireframe","order":1}]',
 'attr_creativity', 'attr_technical', 30, 1),

('Organize your workspace or digital files',
 'Order is the prerequisite for flow.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"c1e4o1","text":"Clean or organize your workspace for 30 minutes","order":1}]',
 'attr_technical', 'attr_discipline', 30, 1),

('Document a process or workflow',
 'What is not documented cannot be improved.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"c1e5o1","text":"Write down a process you follow regularly","order":1},{"id":"c1e5o2","text":"Identify one step that could be improved","order":2}]',
 'attr_technical', 'attr_creativity', 30, 1),

('Write a review of something you use',
 'Critical evaluation sharpens the builder''s eye.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"c1e6o1","text":"Choose a tool, app, or product","order":1},{"id":"c1e6o2","text":"Write a 300-word review with pros and cons","order":2}]',
 'attr_creativity', 'attr_intelligence', 30, 1),

('Automate one repetitive task',
 'Intelligence is doing once what can be repeated forever.',
 'craft', 'easy', 75, 'common', 2,
 '[{"id":"c1e7o1","text":"Identify a repetitive task","order":1},{"id":"c1e7o2","text":"Create a script, template, or shortcut for it","order":2}]',
 'attr_technical', 'attr_creativity', 30, 2),

('Learn one new keyboard shortcut or tool feature',
 'Mastery is accumulated efficiency.',
 'craft', 'easy', 75, 'common', 1,
 '[{"id":"c1e8o1","text":"Find a new shortcut or feature in a tool you use","order":1},{"id":"c1e8o2","text":"Use it 5 times today","order":2}]',
 'attr_technical', 'attr_focus', 30, 1),

-- CRAFT MEDIUM (10)
('Build a small project feature end-to-end',
 'Full-stack completion is the craftsman''s ritual.',
 'craft', 'medium', 175, 'uncommon', 7,
 '[{"id":"c1m1o1","text":"Define the feature scope","order":1},{"id":"c1m1o2","text":"Implement the backend/data layer","order":2},{"id":"c1m1o3","text":"Build the frontend","order":3},{"id":"c1m1o4","text":"Test it manually","order":4}]',
 'attr_technical', 'attr_creativity', 60, 1),

('Write a detailed tutorial on something you know',
 'Teaching through writing tests the depth of understanding.',
 'craft', 'medium', 175, 'uncommon', 5,
 '[{"id":"c1m2o1","text":"Choose a topic you know well","order":1},{"id":"c1m2o2","text":"Write a step-by-step tutorial (1000+ words)","order":2},{"id":"c1m2o3","text":"Add code examples or screenshots","order":3}]',
 'attr_creativity', 'attr_technical', 60, 2),

('Refactor or improve an existing project',
 'The second pass is where craft becomes art.',
 'craft', 'medium', 175, 'uncommon', 7,
 '[{"id":"c1m3o1","text":"Choose a project to improve","order":1},{"id":"c1m3o2","text":"Identify 3 areas for improvement","order":2},{"id":"c1m3o3","text":"Implement the improvements","order":3},{"id":"c1m3o4","text":"Verify nothing broke","order":4}]',
 'attr_technical', 'attr_discipline', 60, 2),

('Design a complete UI mockup for a feature',
 'Design before you build — the blueprint precedes the cathedral.',
 'craft', 'medium', 175, 'uncommon', 5,
 '[{"id":"c1m4o1","text":"Define the feature requirements","order":1},{"id":"c1m4o2","text":"Sketch the wireframes","order":2},{"id":"c1m4o3","text":"Create the high-fidelity mockup","order":3}]',
 'attr_creativity', 'attr_technical', 60, 3),

('Set up a development environment from scratch',
 'A clean environment is a clear mind for code.',
 'craft', 'medium', 175, 'uncommon', 3,
 '[{"id":"c1m5o1","text":"Set up the base environment (OS, editor, terminal)","order":1},{"id":"c1m5o2","text":"Install and configure all necessary tools","order":2},{"id":"c1m5o3","text":"Create a starter project and verify everything works","order":3}]',
 'attr_technical', 'attr_discipline', 60, 2),

('Write and publish a blog post or article',
 'Publishing is the bridge between creation and impact.',
 'craft', 'medium', 175, 'uncommon', 5,
 '[{"id":"c1m6o1","text":"Choose your topic and outline","order":1},{"id":"c1m6o2","text":"Write the full article (1000+ words)","order":2},{"id":"c1m6o3","text":"Edit and publish it","order":3}]',
 'attr_creativity', 'attr_leadership', 60, 3),

('Build a reusable component or library',
 'The builder who creates tools creates leverage.',
 'craft', 'medium', 175, 'uncommon', 7,
 '[{"id":"c1m7o1","text":"Identify a pattern you repeat often","order":1},{"id":"c1m7o2","text":"Abstract it into a reusable component or function","order":2},{"id":"c1m7o3","text":"Write documentation for it","order":3},{"id":"c1m7o4","text":"Use it in a real project","order":4}]',
 'attr_technical', 'attr_creativity', 60, 4),

('Complete a creative challenge (art, music, writing)',
 'Creativity is a muscle that atrophies without use.',
 'craft', 'medium', 175, 'uncommon', 5,
 '[{"id":"c1m8o1","text":"Choose a creative challenge","order":1},{"id":"c1m8o2","text":"Spend at least 3 hours on it","order":2},{"id":"c1m8o3","text":"Complete and share the result","order":3}]',
 'attr_creativity', 'attr_technical', 60, 2),

('Contribute to an open-source project',
 'The open road is built by many hands.',
 'craft', 'medium', 175, 'uncommon', 7,
 '[{"id":"c1m9o1","text":"Find a project you use and care about","order":1},{"id":"c1m9o2","text":"Identify an issue to work on","order":2},{"id":"c1m9o3","text":"Submit a pull request","order":3}]',
 'attr_technical', 'attr_leadership', 60, 3),

('Create a personal portfolio piece',
 'Your work speaks louder than your resume.',
 'craft', 'medium', 175, 'uncommon', 7,
 '[{"id":"c1m10o1","text":"Choose your strongest skill to showcase","order":1},{"id":"c1m10o2","text":"Build a polished piece that demonstrates it","order":2},{"id":"c1m10o3","text":"Publish it online","order":3}]',
 'attr_creativity', 'attr_technical', 60, 4),

-- CRAFT HARD (5)
('Ship a complete side project or MVP',
 'Shipping is the discipline that separates builders from dreamers.',
 'craft', 'hard', 350, 'rare', 21,
 '[{"id":"c1h1o1","text":"Define scope and pick one core feature","order":1},{"id":"c1h1o2","text":"Build the MVP","order":2},{"id":"c1h1o3","text":"Deploy to a live URL","order":3},{"id":"c1h1o4","text":"Share it with at least one real person","order":4}]',
 'attr_technical', 'attr_leadership', 100, 5),

('Build and ship a full-stack application',
 'Full-stack means no excuses, no dependencies, no half measures.',
 'craft', 'hard', 350, 'rare', 14,
 '[{"id":"c1h2o1","text":"Design the architecture","order":1},{"id":"c1h2o2","text":"Build the backend API","order":2},{"id":"c1h2o3","text":"Build the frontend","order":3},{"id":"c1h2o4","text":"Deploy and test the full stack","order":4}]',
 'attr_technical', 'attr_creativity', 100, 7),

('Write a comprehensive technical documentation set',
 'Documentation is the love letter you write to your future self.',
 'craft', 'hard', 350, 'rare', 10,
 '[{"id":"c1h3o1","text":"Outline the documentation structure","order":1},{"id":"c1h3o2","text":"Write the getting started guide","order":2},{"id":"c1h3o3","text":"Write the API reference","order":3},{"id":"c1h3o4","text":"Write the architecture overview","order":4}]',
 'attr_technical', 'attr_intelligence', 100, 5),

('Redesign and rebuild a feature from scratch',
 'Starting over with experience is not waste — it is wisdom applied.',
 'craft', 'hard', 350, 'rare', 14,
 '[{"id":"c1h4o1","text":"Identify the feature to rebuild","order":1},{"id":"c1h4o2","text":"Document what was wrong with the old version","order":2},{"id":"c1h4o3","text":"Design the new version","order":3},{"id":"c1h4o4","text":"Implement and deploy it","order":4}]',
 'attr_technical', 'attr_creativity', 100, 8),

('Create a complete design system',
 'A design system is the constitution of visual consistency.',
 'craft', 'hard', 350, 'rare', 14,
 '[{"id":"c1h5o1","text":"Define colors, typography, and spacing","order":1},{"id":"c1h5o2","text":"Build 10+ reusable components","order":2},{"id":"c1h5o3","text":"Write usage guidelines","order":3},{"id":"c1h5o4","text":"Build a showcase page","order":4}]',
 'attr_creativity', 'attr_technical', 100, 8),

-- CRAFT EPIC (2)
('Build and launch a product with real users',
 'A product without users is a hobby with delusions of grandeur.',
 'craft', 'epic', 650, 'epic', 21,
 '[{"id":"c1ep1o1","text":"Validate the idea with 5 potential users","order":1},{"id":"c1ep1o2","text":"Build the MVP","order":2},{"id":"c1ep1o3","text":"Launch and get 10 real users","order":3},{"id":"c1ep1o4","text":"Collect feedback and iterate","order":4},{"id":"c1ep1o5","text":"Document the journey","order":5}]',
 'attr_technical', 'attr_leadership', 200, 10),

('Create a comprehensive open-source library',
 'Libraries are the infrastructure other builders walk on.',
 'craft', 'epic', 650, 'epic', 21,
 '[{"id":"c1ep2o1","text":"Identify a problem worth solving","order":1},{"id":"c1ep2o2","text":"Build the core functionality","order":2},{"id":"c1ep2o3","text":"Write full documentation and examples","order":3},{"id":"c1ep2o4","text":"Publish to a package registry","order":4},{"id":"c1ep2o5","text":"Get at least 3 external users or stars","order":5}]',
 'attr_technical', 'attr_creativity', 200, 12),

-- ============================================================
-- COMMAND DOMAIN (25 quests: 8 easy, 10 medium, 5 hard, 2 epic)
-- ============================================================

-- COMMAND EASY (8)
('Lead or run one meeting effectively',
 'Leadership is proven in small moments before large ones.',
 'command', 'easy', 75, 'common', 1,
 '[{"id":"co1e1o1","text":"Prepare an agenda in advance","order":1},{"id":"co1e1o2","text":"Run the meeting and reach a decision","order":2}]',
 'attr_leadership', 'attr_charisma', 30, 1),

('Have a difficult conversation you''ve been avoiding',
 'Avoidance costs more than confrontation.',
 'command', 'easy', 75, 'uncommon', 1,
 '[{"id":"co1e2o1","text":"Identify the conversation you''ve been avoiding","order":1},{"id":"co1e2o2","text":"Have it","order":2}]',
 'attr_charisma', 'attr_leadership', 30, 1),

('Give genuine positive feedback to someone',
 'Strength recognized becomes strength multiplied.',
 'command', 'easy', 75, 'common', 1,
 '[{"id":"co1e3o1","text":"Identify something someone did well","order":1},{"id":"co1e3o2","text":"Tell them specifically what they did well and why it matters","order":2}]',
 'attr_charisma', 'attr_leadership', 30, 1),

('Say no to something that doesn''t serve your goals',
 'A no to the wrong thing is a yes to the right thing.',
 'command', 'easy', 75, 'common', 1,
 '[{"id":"co1e4o1","text":"Identify a commitment or request that doesn''t align","order":1},{"id":"co1e4o2","text":"Decline it clearly and respectfully","order":2}]',
 'attr_leadership', 'attr_discipline', 30, 1),

('Take charge of a small decision today',
 'Decisiveness is a practice, not a trait.',
 'command', 'easy', 75, 'common', 1,
 '[{"id":"co1e5o1","text":"Identify a decision you''ve been putting off","order":1},{"id":"co1e5o2","text":"Make the decision and act on it","order":2}]',
 'attr_leadership', 'attr_charisma', 30, 1),

('Write a clear email or message to coordinate action',
 'Clarity in communication is leadership in writing.',
 'command', 'easy', 75, 'common', 1,
 '[{"id":"co1e6o1","text":"Draft a clear, actionable message","order":1},{"id":"co1e6o2","text":"Send it and confirm the recipient understands","order":2}]',
 'attr_charisma', 'attr_intelligence', 30, 1),

('Organize one event or gathering',
 'The one who organizes owns the initiative.',
 'command', 'easy', 75, 'common', 3,
 '[{"id":"co1e7o1","text":"Choose the event type and invite people","order":1},{"id":"co1e7o2","text":"Host the event","order":2}]',
 'attr_charisma', 'attr_leadership', 30, 2),

('Practice public speaking for 15 minutes',
 'The voice that shakes is the voice that grows.',
 'command', 'easy', 75, 'common', 1,
 '[{"id":"co1e8o1","text":"Prepare a 5-minute talk on any topic","order":1},{"id":"co1e8o2","text":"Deliver it out loud (to yourself, a friend, or record it)","order":2}]',
 'attr_charisma', 'attr_leadership', 30, 1),

-- COMMAND MEDIUM (10)
('Mentor or help someone for one week',
 'Strength multiplied through others becomes legacy.',
 'command', 'medium', 175, 'uncommon', 7,
 '[{"id":"co1m1o1","text":"Identify who you will help and with what","order":1},{"id":"co1m2o2","text":"Have at least 2 sessions with them","order":2},{"id":"co1m1o3","text":"Provide written feedback or guidance","order":3}]',
 'attr_leadership', 'attr_charisma', 60, 3),

('Facilitate a group discussion or workshop',
 'The facilitator shapes the container where ideas grow.',
 'command', 'medium', 175, 'uncommon', 5,
 '[{"id":"co1m2o1","text":"Prepare the discussion topics or workshop structure","order":1},{"id":"co1m2o2","text":"Facilitate the session","order":2},{"id":"co1m2o3","text":"Summarize the outcomes and next steps","order":3}]',
 'attr_charisma', 'attr_leadership', 60, 3),

('Negotiate something important',
 'Negotiation is the art of creating alignment from opposition.',
 'command', 'medium', 175, 'uncommon', 5,
 '[{"id":"co1m3o1","text":"Identify what you want and what they want","order":1},{"id":"co1m3o2","text":"Prepare your approach","order":2},{"id":"co1m3o3","text":"Have the negotiation conversation","order":3}]',
 'attr_charisma', 'attr_intelligence', 60, 4),

('Build a team or group for a shared goal',
 'Leadership begins when someone decides the group is worth organizing.',
 'command', 'medium', 175, 'uncommon', 7,
 '[{"id":"co1m4o1","text":"Define the shared goal","order":1},{"id":"co1m4o2","text":"Recruit at least 2 other people","order":2},{"id":"co1m4o3","text":"Assign roles and create a plan","order":3}]',
 'attr_leadership', 'attr_charisma', 60, 4),

('Resolve a conflict between two people or groups',
 'The peacemaker holds more power than the warrior.',
 'command', 'medium', 175, 'uncommon', 5,
 '[{"id":"co1m5o1","text":"Understand both sides of the conflict","order":1},{"id":"co1m5o2","text":"Propose a resolution path","order":2},{"id":"co1m5o3","text":"Facilitate the resolution","order":3}]',
 'attr_charisma', 'attr_leadership', 60, 5),

('Create and present a proposal',
 'Proposals are how ideas earn the right to exist.',
 'command', 'medium', 175, 'uncommon', 5,
 '[{"id":"co1m6o1","text":"Write the proposal document","order":1},{"id":"co1m6o2","text":"Create a presentation","order":2},{"id":"co1m6o3","text":"Present it to stakeholders","order":3}]',
 'attr_leadership', 'attr_creativity', 60, 4),

('Give a 10-minute presentation on a topic',
 'A presentation is leadership distilled into time.',
 'command', 'medium', 175, 'uncommon', 5,
 '[{"id":"co1m7o1","text":"Research and outline the topic","order":1},{"id":"co1m7o2","text":"Create slides or visual aids","order":2},{"id":"co1m7o3","text":"Deliver the presentation","order":3}]',
 'attr_charisma', 'attr_intelligence', 60, 3),

('De-network: Have 5 meaningful conversations this week',
 'Depth of connection beats breadth of contacts.',
 'command', 'medium', 175, 'uncommon', 7,
 '[{"id":"co1m8o1","text":"Have meaningful conversation 1","order":1},{"id":"co1m8o2","text":"Have meaningful conversation 3","order":2},{"id":"co1m8o3","text":"Have meaningful conversation 5","order":3}]',
 'attr_charisma', 'attr_leadership', 60, 2),

('Set clear expectations for a project or relationship',
 'Unclear expectations are the root of most conflicts.',
 'command', 'medium', 175, 'uncommon', 5,
 '[{"id":"co1m9o1","text":"Identify the project or relationship","order":1},{"id":"co1m9o2","text":"Write down the expectations clearly","order":2},{"id":"co1m9o3","text":"Communicate and get alignment","order":3}]',
 'attr_leadership', 'attr_charisma', 60, 3),

('Delegate a task and follow up',
 'Delegation is trust made practical.',
 'command', 'medium', 175, 'uncommon', 5,
 '[{"id":"co1m10o1","text":"Identify a task to delegate","order":1},{"id":"co1m10o2","text":"Assign it with clear instructions","order":2},{"id":"co1m10o3","text":"Follow up and provide feedback","order":3}]',
 'attr_leadership', 'attr_charisma', 60, 4),

-- COMMAND HARD (5)
('Lead a project or initiative from start to finish',
 'Command without completion is noise.',
 'command', 'hard', 350, 'rare', 14,
 '[{"id":"co1h1o1","text":"Define the project goal and assign roles","order":1},{"id":"co1h1o2","text":"Hit the first milestone","order":2},{"id":"co1h1o3","text":"Hit the second milestone","order":3},{"id":"co1h1o4","text":"Complete and review the project","order":4}]',
 'attr_leadership', 'attr_charisma', 100, 5),

('Mediate a high-stakes disagreement',
 'The mediator who stays calm owns the room.',
 'command', 'hard', 350, 'rare', 14,
 '[{"id":"co1h2o1","text":"Understand both parties'' positions deeply","order":1},{"id":"co1h2o2","text":"Create a safe space for dialogue","order":2},{"id":"co1h2o3","text":"Guide both parties to a mutually acceptable resolution","order":3},{"id":"co1h2o4","text":"Document the agreement","order":4}]',
 'attr_charisma', 'attr_leadership', 100, 7),

('Build and lead a community or group for a month',
 'Communities outlast the leaders who build them — if built right.',
 'command', 'hard', 350, 'rare', 14,
 '[{"id":"co1h3o1","text":"Define the community purpose","order":1},{"id":"co1h3o2","text":"Recruit at least 5 members","order":2},{"id":"co1h3o3","text":"Run the community for 2 weeks","order":3},{"id":"co1h3o4","text":"Sustain it through Week 4 with at least 3 active members","order":4}]',
 'attr_leadership', 'attr_charisma', 100, 8),

('Deliver a keynote or major presentation',
 'The keynote is the summit of communicative leadership.',
 'command', 'hard', 350, 'rare', 10,
 '[{"id":"co1h4o1","text":"Craft your core message","order":1},{"id":"co1h4o2","text":"Build the presentation","order":2},{"id":"co1h4o3","text":"Rehearse at least 3 times","order":3},{"id":"co1h4o4","text":"Deliver the presentation","order":4}]',
 'attr_charisma', 'attr_leadership', 100, 10),

('Create and execute a strategy that achieves a measurable result',
 'Strategy without execution is philosophy. Execution without strategy is chaos.',
 'command', 'hard', 350, 'rare', 14,
 '[{"id":"co1h5o1","text":"Define the objective and metrics","order":1},{"id":"co1h5o2","text":"Create the strategy document","order":2},{"id":"co1h5o3","text":"Execute the first phase","order":3},{"id":"co1h5o4","text":"Execute the second phase and measure results","order":4}]',
 'attr_leadership', 'attr_intelligence', 100, 10),

-- COMMAND EPIC (2)
('Launch and sustain a team initiative with 5+ people for a month',
 'The true test of leadership is what happens when you step back.',
 'command', 'epic', 650, 'epic', 21,
 '[{"id":"co1ep1o1","text":"Define the initiative and recruit 5+ people","order":1},{"id":"co1ep1o2","text":"Launch Week 1 with clear roles and goals","order":2},{"id":"co1ep1o3","text":"Sustain through Week 2","order":3},{"id":"co1ep1o4","text":"Sustain through Week 3 with measurable progress","order":4},{"id":"co1ep1o5","text":"Complete Week 4 and document outcomes","order":5}]',
 'attr_leadership', 'attr_charisma', 200, 12),

('Build and grow a community from zero to 20 active members',
 'Communities are the hardest product to build and the most resilient once built.',
 'command', 'epic', 650, 'epic', 21,
 '[{"id":"co1ep2o1","text":"Define the community mission and values","order":1},{"id":"co1ep2o2","text":"Build the initial space and content","order":2},{"id":"co1ep2o3","text":"Recruit the first 10 members","order":3},{"id":"co1ep2o4","text":"Grow to 20 active members","order":4},{"id":"co1ep2o5","text":"Establish self-sustaining rituals or routines","order":5}]',
 'attr_charisma', 'attr_leadership', 200, 15);
