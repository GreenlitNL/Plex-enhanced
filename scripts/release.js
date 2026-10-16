#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function runQuiet(cmd) {
  try {
    return run(cmd);
  } catch (e) {
    return '';
  }
}

const root = path.resolve(__dirname, '..');
const scriptFile = path.join(root, 'plex-enhanced-player.user.js');

// 1. Get latest tag
const latestTag = runQuiet('git describe --tags --match "v*" --abbrev=0') || 'v6.4.0';
console.log(`Latest release tag: ${latestTag}`);

// 2. Get commits since latest tag
const revRange = `${latestTag}..HEAD`;
const commitsRaw = runQuiet(`git log ${revRange} --format="%s"`);

if (!commitsRaw) {
  console.log('No new commits found since last release.');
  process.exit(0);
}

const commits = commitsRaw.split('\n').filter(Boolean);
console.log(`Evaluating ${commits.length} commit(s) since ${latestTag}...`);

// 3. Determine bump type
let bump = null;

for (const msg of commits) {
  if (msg.includes('BREAKING CHANGE:') || /^[a-z]+(\([a-zA-Z0-9_-]+\))?!:/.test(msg)) {
    bump = 'major';
    break;
  } else if (/^feat(\([a-zA-Z0-9_-]+\))?:/.test(msg)) {
    if (bump !== 'major') bump = 'minor';
  } else if (/^(fix|perf|revert)(\([a-zA-Z0-9_-]+\))?:/.test(msg)) {
    if (!bump) bump = 'patch';
  }
}

if (!bump) {
  console.log('No release-triggering commits (feat, fix, perf, breaking) found. Skipping release.');
  process.exit(0);
}

console.log(`Determined release bump: ${bump.toUpperCase()}`);

// 4. Calculate new version
const cleanTag = latestTag.replace(/^v/, '');
const parts = cleanTag.split('.').map(Number);
let [major = 6, minor = 4, patch = 0] = parts;

if (bump === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (bump === 'minor') {
  minor += 1;
  patch = 0;
} else if (bump === 'patch') {
  patch += 1;
}

const nextVersion = `${major}.${minor}.${patch}`;
const nextTag = `v${nextVersion}`;

// 5. Read and update plex-enhanced-player.user.js
const content = fs.readFileSync(scriptFile, 'utf8');
const versionRegex = /^(\/\/ @version\s+)\S+/m;

if (!versionRegex.test(content)) {
  console.error('Could not find // @version in plex-enhanced-player.user.js');
  process.exit(1);
}

const isDryRun = process.env.RELEASE_DRY_RUN === 'true';
console.log(`Target: // @version ${nextVersion} (${nextTag})`);

if (isDryRun) {
  console.log('Dry run enabled. Skipping file write and git push.');
  process.exit(0);
}

const newContent = content.replace(versionRegex, `$1${nextVersion}`);
fs.writeFileSync(scriptFile, newContent, 'utf8');

// 6. Update CHANGELOG.md
const changelogFile = path.join(root, 'CHANGELOG.md');
const today = new Date().toISOString().split('T')[0];
const releaseHeader = `## [${nextVersion}](https://github.com/GreenlitNL/Plex-enhanced/releases/tag/${nextTag}) (${today})\n\n`;

const feats = commits.filter(c => /^feat(\([a-zA-Z0-9_-]+\))?:/.test(c)).map(c => `* ${c}`);
const fixes = commits.filter(c => /^(fix|perf)(\([a-zA-Z0-9_-]+\))?:/.test(c)).map(c => `* ${c}`);

let entry = releaseHeader;
if (feats.length > 0) {
  entry += `### Features\n\n${feats.join('\n')}\n\n`;
}
if (fixes.length > 0) {
  entry += `### Bug Fixes\n\n${fixes.join('\n')}\n\n`;
}

let existingChangelog = '';
if (fs.existsSync(changelogFile)) {
  existingChangelog = fs.readFileSync(changelogFile, 'utf8');
}
fs.writeFileSync(changelogFile, entry + existingChangelog, 'utf8');

// 7. Git commit & tag
run('git config user.name "github-actions[bot]"');
run('git config user.email "github-actions[bot]@users.noreply.github.com"');
run('git add plex-enhanced-player.user.js CHANGELOG.md');
run(`git commit -m "chore(release): ${nextVersion} [skip ci]"`);
run(`git tag -a "${nextTag}" -m "Release ${nextTag}"`);
run('git push origin main --tags');

// 8. Create GitHub Release
try {
  run(`gh release create "${nextTag}" --title "${nextTag}" --generate-notes`);
  console.log(`GitHub release ${nextTag} created successfully.`);
} catch (e) {
  console.error('Failed to create GitHub release via gh CLI:', e.message);
}

