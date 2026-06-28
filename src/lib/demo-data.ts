// src/lib/demo-data.ts
// Static demo data — used when NEXT_PUBLIC_DEMO_MODE=true
// No database, no auth, no API calls needed

export interface CustomQuestFormData {
  name: string;
  description: string;
  objectives: string[];
  domain: 'strength' | 'vitality' | 'intelligence' | 'focus' | 'technical' | 'creativity' | 'leadership' | 'charisma' | 'discipline' | 'scholar' | 'warrior' | 'builder' | 'commander';
  difficulty: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
}

export const DEMO_PROFILE = {
  id: 'demo-user',
  character_name: 'Mueez',
  kingdom_name: 'The Obsidian Realm',
  companion_name: 'Aegis',
  class: 'scholar',
  house_id: 'ash',
  level: 3,
  xp: 180,
  xp_to_next_level: 300,
  weekly_xp: 180,
  skill_points: 2,
  attr_strength: 12,
  attr_vitality: 10,
  attr_intelligence: 18,
  attr_focus: 15,
  attr_technical: 14,
  attr_creativity: 13,
  attr_leadership: 10,
  attr_charisma: 11,
  attr_discipline: 16,
  onboarding_complete: true,
};

export const DEMO_QUESTS_ACTIVE = [
  {
    id: 'q1',
    quest_template_id: 'qt1',
    status: 'active',
    started_at: new Date().toISOString(),
    quest_templates: {
      id: 'qt1',
      title: 'Read for 30 Minutes',
      description: 'Study a topic deeply for 30 uninterrupted minutes.',
      domain: 'scholar',
      xp_reward: 100,
      objectives: ['Find a book or article', 'Read without distractions for 30 min', 'Write one insight you gained'],
    },
    objectives_completed: [true, false, false],
  },
  {
    id: 'q2',
    quest_template_id: 'qt2',
    status: 'active',
    started_at: new Date().toISOString(),
    quest_templates: {
      id: 'qt2',
      title: 'Morning Training',
      description: 'Complete a physical training session before noon.',
      domain: 'warrior',
      xp_reward: 100,
      objectives: ['Wake before 8am', 'Complete 20 minutes of exercise'],
      },
    objectives_completed: [true, true],
  },
];

export const DEMO_QUESTS_DORMANT = [
  {
    id: 'qt3',
    title: 'Build Something',
    description: 'Create a tangible project or prototype.',
    domain: 'builder',
    xp_reward: 100,
  },
  {
    id: 'qt4',
    title: 'Lead a Meeting',
    description: 'Take charge of a group discussion or meeting.',
    domain: 'commander',
    xp_reward: 100,
  },
  {
    id: 'qt5',
    title: 'Cold Outreach',
    description: 'Send a meaningful message to someone you admire.',
    domain: 'scholar',
    xp_reward: 150,
  },
  {
    id: 'qt6',
    title: 'Create Without a Plan',
    description: 'Spend 1 hour creating something with no predetermined outcome.',
    domain: 'builder',
    xp_reward: 120,
  },
];

export const DEMO_QUESTS_FULFILLED = [
  {
    id: 'q3',
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    xp_earned: 100,
    quest_templates: {
      title: 'First Steps',
      domain: 'scholar',
      xp_reward: 100,
    },
  },
];

export const DEMO_BUILDINGS = [
  { id: 'b1', name: 'The Scriptorium', description: 'A hall of learning. Boosts Scholar quest XP by 10%.', lore: 'Knowledge is power.', domain: 'scholar', is_built: true, is_available: true, is_locked: false, req_attr: 'attr_intelligence', req_value: 10, xp_bonus: 10 },
  { id: 'b2', name: 'The Forge', description: 'Where weapons are made. Unlocks Warrior quests.', lore: 'Iron sharpens iron.', domain: 'warrior', is_built: false, is_available: true, is_locked: false, req_attr: 'attr_strength', req_value: 10, xp_bonus: 0 },
  { id: 'b3', name: 'The Observatory', description: 'Study the stars. Increases focus attribute gain.', lore: 'The cosmos watch over us.', domain: 'scholar', is_built: false, is_available: true, is_locked: false, req_attr: 'attr_focus', req_value: 14, xp_bonus: 5 },
  { id: 'b4', name: 'The Vault', description: 'Stores your kingdom\'s wealth.', lore: 'Prosperity demands protection.', domain: 'builder', is_built: false, is_available: false, is_locked: true, req_attr: 'attr_technical', req_value: 20, xp_bonus: 0 },
  { id: 'b5', name: 'The Arena', description: 'Train warriors. Unlocks advanced combat quests.', lore: 'Blood drawn in training spares blood in war.', domain: 'warrior', is_built: false, is_available: false, is_locked: true, req_attr: 'attr_strength', req_value: 20, xp_bonus: 15 },
  { id: 'b6', name: 'The Council Hall', description: 'Coordinate your kingdom. Boosts leadership gain.', lore: 'A ruler must listen before commanding.', domain: 'commander', is_built: false, is_available: false, is_locked: true, req_attr: 'attr_leadership', req_value: 15, xp_bonus: 5 },
];

export const DEMO_ACHIEVEMENTS = [
  { id: 'a1', title: 'First Steps', description: 'Complete your first quest', unlocked: true },
  { id: 'a2', title: 'Kingdom Founder', description: 'Build your first monument', unlocked: false },
  { id: 'a3', title: 'First Blood', description: 'Complete your first quest', unlocked: true },
  { id: 'a4', title: "Scholar's Path", description: 'Complete 10 Scholar domain quests', unlocked: false },
];

export const DEMO_COMPANION_RESPONSES: Record<string, string> = {
  default: 'The void stirs. Your kingdom grows stronger with each action. What would you manifest today?',
  quest: 'I have reviewed your standing. You carry the strength of a true sovereign. I recommend beginning the "Read for 30 Minutes" quest — your Intelligence domain is your greatest weapon.',
  struggling: 'Even the mightiest kingdoms were built from a single stone. Return to the Quest Board and find one small action you can complete today. Momentum is everything.',
  week: 'This week you have earned 180 XP — that places you in the top tier of consistent sovereigns. Your discipline attribute is rising faster than any other.',
  kingdom: 'The Obsidian Realm grows. The Scriptorium stands. Three more structures await your command once your attributes meet their requirements.',
  level: 'You stand at Level III. The path to Level IV requires 120 more XP. Two completed quests will take you there.',
};
