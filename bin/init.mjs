#!/usr/bin/env node
//
// init.mjs — installer for the qavajs-skill repository.
//
// Usage:
//   npx github:bermudas/qavajs-skill init [options]
//
// Options:
//   --target <ide[,ide...]>  claude (default) | cursor | windsurf | all
//   --skills <list>          comma-separated subset of skills to install
//                            (default: every skill in skills/)
//   --update                 overwrite existing installations
//   --yes, -y                skip the interactive IDE-detection prompt
//   --list                   print available skills and exit
//   --help, -h               show this help
//
// Defaults: when no --target is supplied, the script detects which IDE
// directories already exist in the cwd (.claude, .cursor, .windsurf) and
// installs into all of them; if none are found, it falls back to .claude.
//
// Skills are copied verbatim from `skills/<name>/` to `<TARGET>/skills/<name>/`,
// preserving the SKILL.md / references / scripts / assets layout.
//

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import readline from 'node:readline';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const REGISTRY = path.join(ROOT, 'skills.json');

const IDE_TARGETS = {
  claude:   { dir: '.claude/skills',   parent: '.claude',   label: 'Claude Code' },
  cursor:   { dir: '.cursor/skills',   parent: '.cursor',   label: 'Cursor' },
  windsurf: { dir: '.windsurf/skills', parent: '.windsurf', label: 'Windsurf' },
};

function helpText() {
  return [
    'qavajs-skill installer',
    '',
    'Usage:',
    '  npx github:bermudas/qavajs-skill init [options]',
    '',
    'Options:',
    '  --target <ide>      claude (default) | cursor | windsurf | all',
    '  --skills <list>     comma-separated skills to install (default: all)',
    '  --update            overwrite existing skills',
    '  --yes, -y           skip the interactive prompt',
    '  --list              show available skills and exit',
    '  --help, -h          show this help',
    '',
    'Examples:',
    '  npx github:bermudas/qavajs-skill init                  # detect IDE, install everything',
    '  npx github:bermudas/qavajs-skill init --target claude  # only into .claude/skills',
    '  npx github:bermudas/qavajs-skill init --update         # overwrite if already present',
    '',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { command: null, target: null, skills: null, update: false, yes: false, list: false, help: false };
  let i = 0;
  while (i < argv.length) {
    const a = argv[i++];
    if (!args.command && !a.startsWith('-')) { args.command = a; continue; }
    if (a === '--update') args.update = true;
    else if (a === '--yes' || a === '-y') args.yes = true;
    else if (a === '--list') args.list = true;
    else if (a === '-h' || a === '--help') args.help = true;
    else if (a === '--target') args.target = argv[i++];
    else if (a === '--skills') args.skills = argv[i++];
    else { console.warn(`Unknown flag: ${a}`); }
  }
  if (!args.command) args.command = 'init';
  return args;
}

function listSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort();
}

function readRegistry() {
  if (!fs.existsSync(REGISTRY)) return { skills: [] };
  try { return JSON.parse(fs.readFileSync(REGISTRY, 'utf8')); }
  catch { return { skills: [] }; }
}

function detectTargets(cwd) {
  return Object.entries(IDE_TARGETS).filter(([, ide]) => fs.existsSync(path.join(cwd, ide.parent)));
}

function prompt(question, def = '') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (ans) => { rl.close(); resolve((ans || '').trim() || def); });
  });
}

// Names that should never be carried into an installed skill — evals are an
// authoring-time artifact, not something end users need.
const EXCLUDE_FROM_COPY = new Set(['evals', 'node_modules', '.git']);

function copyDir(src, dest, overwrite) {
  const exists = fs.existsSync(dest);
  if (exists && !overwrite) return { copied: false, existed: true };
  if (exists) fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, {
    recursive: true,
    filter: (s) => !EXCLUDE_FROM_COPY.has(path.basename(s)),
  });
  return { copied: true, existed: exists };
}

async function chooseTargets(args) {
  const cwd = process.cwd();
  if (args.target === 'all') return Object.keys(IDE_TARGETS);
  if (args.target) return args.target.split(',').map((s) => s.trim()).filter(Boolean);

  const detected = detectTargets(cwd);
  if (detected.length === 0) return ['claude'];
  if (detected.length === 1 || args.yes) return detected.map(([k]) => k);

  const labels = detected.map(([k, v]) => `${k} (${v.label})`).join(', ');
  const ans = await prompt(`Detected IDEs: ${labels}.\nInstall to which? [all]: `, 'all');
  if (ans === 'all') return detected.map(([k]) => k);
  return ans.split(',').map((s) => s.trim()).filter((s) => IDE_TARGETS[s]);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.command === 'help') {
    console.log(helpText());
    return;
  }

  const available = listSkills();

  if (args.list) {
    const reg = readRegistry();
    console.log('Available skills:');
    for (const name of available) {
      const meta = (reg.skills || []).find((s) => s.name === name) || {};
      const desc = meta.description ? ` — ${meta.description}` : '';
      console.log(`  • ${name}${desc}`);
    }
    return;
  }

  if (args.command !== 'init') {
    console.error(`Unknown command: ${args.command}\n`);
    console.error(helpText());
    process.exit(1);
  }

  if (available.length === 0) {
    console.error(`No skills found in ${SKILLS_DIR}.`);
    process.exit(1);
  }

  const wanted = args.skills ? args.skills.split(',').map((s) => s.trim()).filter(Boolean) : available;
  const skills = wanted.filter((s) => available.includes(s));
  const missing = wanted.filter((s) => !available.includes(s));
  if (missing.length) console.warn(`! Skipping unknown skills: ${missing.join(', ')}`);
  if (skills.length === 0) {
    console.error('No matching skills selected. Use --list to see available skills.');
    process.exit(1);
  }

  const targets = await chooseTargets(args);
  if (targets.length === 0) {
    console.error('No valid targets resolved.');
    process.exit(1);
  }

  const cwd = process.cwd();
  console.log(`\nInstalling ${skills.length} skill(s) into ${targets.length} target(s) at ${cwd}\n`);

  let installed = 0, replaced = 0, skipped = 0;
  for (const target of targets) {
    const ide = IDE_TARGETS[target];
    if (!ide) { console.warn(`! Unknown target: ${target}`); continue; }
    const dest = path.join(cwd, ide.dir);
    fs.mkdirSync(dest, { recursive: true });
    console.log(`→ ${ide.label} (${ide.dir})`);
    for (const name of skills) {
      const src = path.join(SKILLS_DIR, name);
      const out = path.join(dest, name);
      const r = copyDir(src, out, args.update);
      if (r.copied && !r.existed) { installed++; console.log(`  ✓ ${name}`); }
      else if (r.copied && r.existed) { replaced++; console.log(`  ↻ ${name} (replaced)`); }
      else { skipped++; console.log(`  — ${name} (already installed; pass --update to overwrite)`); }
    }
  }

  console.log(`\nDone. installed=${installed}, replaced=${replaced}, skipped=${skipped}.`);
  if (skipped > 0 && !args.update) {
    console.log('Tip: re-run with --update to refresh skills already in place.');
  }
}

main().catch((err) => { console.error(err && err.stack ? err.stack : err); process.exit(1); });
