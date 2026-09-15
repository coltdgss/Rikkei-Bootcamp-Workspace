import { chromium } from 'playwright';
import { config } from './config.js';
import { runCourseLearner } from './learner.js';
import * as fs from 'fs';

// Force course 96
config.portal.courseId = '96';
config.portal.courseUrl = 'https://portal.rikkei.edu.vn/learn/96';

async function main() {
  const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
  const context = await browser.newContext({ storageState: config.browser.storageStatePath });
  const page = await context.newPage();

  console.log("Running Course Learner for Debug...");
  try {
    await runCourseLearner(page);
  } catch (e) {
    console.error(e);
  }
  
  await page.waitForTimeout(5000);
  await browser.close();
}

main().catch(console.error);
