// src/lib/use-demo-data.ts
'use client';
import { useState } from 'react';
import {
  DEMO_PROFILE, DEMO_QUESTS_ACTIVE, DEMO_QUESTS_DORMANT,
  DEMO_QUESTS_FULFILLED, DEMO_BUILDINGS, DEMO_ACHIEVEMENTS,
  DEMO_COMPANION_RESPONSES
} from './demo-data';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Hook for profile data
export function useProfile() {
  if (IS_DEMO) return { profile: DEMO_PROFILE, loading: false, error: null };
  // real implementation here (existing hook)
  return { profile: null, loading: true, error: null };
}

// Hook for quests
export function useQuests(tab: 'active' | 'dormant' | 'fulfilled') {
  if (IS_DEMO) {
    const data = tab === 'active' ? DEMO_QUESTS_ACTIVE
      : tab === 'dormant' ? DEMO_QUESTS_DORMANT
      : DEMO_QUESTS_FULFILLED;
    return { quests: data, loading: false, error: null };
  }
  return { quests: [], loading: true, error: null };
}

// Hook for buildings
export function useBuildings() {
  if (IS_DEMO) return { buildings: DEMO_BUILDINGS, loading: false, error: null };
  return { buildings: [], loading: true, error: null };
}

// Hook for achievements
export function useAchievements() {
  if (IS_DEMO) return { achievements: DEMO_ACHIEVEMENTS, loading: false, error: null };
  return { achievements: [], loading: true, error: null };
}

// Companion response helper
export function getDemoCompanionResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('quest') || lower.includes('task')) return DEMO_COMPANION_RESPONSES.quest;
  if (lower.includes('struggling') || lower.includes('hard') || lower.includes('difficult')) return DEMO_COMPANION_RESPONSES.struggling;
  if (lower.includes('week') || lower.includes('progress') || lower.includes('analyz')) return DEMO_COMPANION_RESPONSES.week;
  if (lower.includes('kingdom') || lower.includes('build')) return DEMO_COMPANION_RESPONSES.kingdom;
  if (lower.includes('level') || lower.includes('xp')) return DEMO_COMPANION_RESPONSES.level;
  return DEMO_COMPANION_RESPONSES.default;
}
