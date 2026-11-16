import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const repo = join(import.meta.dirname, '..', '..');
const pub = join(import.meta.dirname, '..', 'public');
const files = [
  'images/D.svg',
  'images/favicon32.png',
  'images/og.jpg',
  'fonts/Dodo_Rounded_v2-VF.woff2',
  'fonts/Pragmatica.ttf',
];

for (const f of files) {
  mkdirSync(dirname(join(pub, f)), { recursive: true });
  copyFileSync(join(repo, f), join(pub, f));
}
console.log(`prepare-assets: copied ${files.length} files to public/`);
