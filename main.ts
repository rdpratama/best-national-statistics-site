// Statistik Indonesia — the hand-in program for the national statistics
// site bounty. The site itself is plain static files under app/ (an
// index.html, a stylesheet, and three ES modules holding the data, the
// canvas charts and the hash router), plus 3-4 screenshots of it running.
// This program copies app/ and screenshots/ beside it into /output and
// writes /output/dossier.json with the kit's vendored library, so the
// judge reads the same summary the gate checks. vendor/makefun-frontend.ts
// stays exactly as the kit shipped it: the scorer rebuilds the dossier
// with its own copy and compares the two byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps, as the kit documents them: at most 4 screenshots and
// none over 256 KiB; app/ at most 993 files and directories and 16 MiB;
// the dossier text at most 160 KiB.
// The two runs the grader performs must write the same bytes: copying
// files and building the dossier from them is deterministic — no clock,
// no random value and no network is involved anywhere in this program.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
