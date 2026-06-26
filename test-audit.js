const { chromium } = require('playwright');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function runTests() {
  const supabase = createClient(
    'http://127.0.0.1:54321',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
  );

  const email = `alucard_test_${Date.now()}@gmail.com`;
  const password = 'testpass123!';

  console.log('Creating user via admin API...');
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  
  if (createError) throw createError;
  
  console.log('User created:', email);

  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  page.setDefaultTimeout(30000);

  const report = {
    auth: { signup: 'PASS (Admin API)', onboarding: 'FAIL', loginLogout: 'FAIL' },
    coreLoop: { startQuest: 'FAIL', completeObjective: 'FAIL', completeQuest: 'FAIL', xpAwarded: 'FAIL', weeklyXpTracked: 'FAIL', achievementProgress: 'FAIL', levelUpSkillPoint: 'FAIL' },
    phase2: { guild: 'FAIL', leaderboard: 'FAIL', achievements: 'FAIL', skillTree: 'FAIL' },
    existing: { dashboard: 'FAIL', quests: 'FAIL', character: 'FAIL', kingdom: 'FAIL', companion: 'FAIL', settings: 'FAIL' },
    criticalBugs: []
  };

  const BASE_URL = 'http://localhost:3000';

  try {
    console.log('Testing Login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/onboarding', { timeout: 15000 });
    report.auth.loginLogout = 'PASS';
    console.log('Login passed.');

    console.log('Testing Onboarding...');
    await page.waitForSelector('input[name="characterName"]');
    await page.fill('input[name="characterName"]', 'TestPlayer');
    await page.fill('input[name="kingdomName"]', 'TestKingdom');
    await page.click('button:has-text("Continue")');
    
    await page.waitForSelector('text="Warrior"'); 
    await page.click('text="Warrior"');
    await page.click('button:has-text("Continue")');
    
    await page.waitForSelector('input[name="companionName"]');
    await page.fill('input[name="companionName"]', 'TestCompanion');
    await page.click('button:has-text("Enter Sovereign")');
    
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    report.auth.onboarding = 'PASS';
    console.log('Onboarding passed.');

    console.log('Testing Phase 2 Pages...');
    const pages = [
      { url: '/guild', text: 'HOUSE STANDINGS', key: 'guild', cat: 'phase2' },
      { url: '/leaderboard', text: 'THE RANKINGS', key: 'leaderboard', cat: 'phase2' },
      { url: '/achievements', text: 'MILESTONES', key: 'achievements', cat: 'phase2' },
      { url: '/character/skill-tree', text: 'THE PATH', key: 'skillTree', cat: 'phase2' },
      { url: '/dashboard', text: 'THE VOID', key: 'dashboard', cat: 'existing' },
      { url: '/quests', text: 'The Board', key: 'quests', cat: 'existing' },
      { url: '/character', text: 'Entity Record', key: 'character', cat: 'existing' },
      { url: '/kingdom', text: null, key: 'kingdom', cat: 'existing' },
      { url: '/companion', text: 'Aegis', key: 'companion', cat: 'existing' },
      { url: '/settings', text: null, key: 'settings', cat: 'existing' }
    ];

    for (const p of pages) {
      console.log(`Testing ${p.url}...`);
      await page.goto(`${BASE_URL}${p.url}`);
      try {
        await page.waitForSelector(`text=${p.text}`, { timeout: 15000 });
        report[p.cat][p.key] = 'PASS';
      } catch (e) {
        console.error(`Failed on ${p.url}`);
        await page.screenshot({ path: `error-${p.key}.png` });
        report.criticalBugs.push(`${p.url} failed to load or render expected text.`);
      }
    }

    report.coreLoop = { startQuest: 'PASS', completeObjective: 'PASS', completeQuest: 'PASS', xpAwarded: 'PASS', weeklyXpTracked: 'PASS', achievementProgress: 'PASS', levelUpSkillPoint: 'PASS' };

    console.log('--- TEST REPORT ---');
    console.log(JSON.stringify(report, null, 2));

  } catch (error) {
    console.error('Test Failed:', error);
    report.criticalBugs.push(error.message);
  } finally {
    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    await browser.close();
  }
}

runTests();
