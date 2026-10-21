/**
 * Packages the Expo web export (`npx expo export --platform web`) as a
 * claude.ai page: the page body in artifact/index.html plus its scripts and
 * assets as supporting files at relative paths.
 *
 *   EXPO_OFFLINE=1 npx expo export --platform web --output-dir dist
 *   node scripts/build-artifact.mjs dist artifact
 *
 * What it does:
 * - turns absolute paths ("/_expo/…", "/assets/…") into relative ones, so the
 *   app works wherever the page is served;
 * - renames files the host reserves ("_…") or that are awkward in URLs;
 * - makes lazy route chunks load relative to the page, not the current route;
 * - writes the page content without <html>/<head>/<body> (the host adds them),
 *   with a small start-up script that pins the base URL and starts the app's
 *   router at "/".
 */
import fs from 'node:fs';
import path from 'node:path';

const [src = 'dist', out = 'artifact'] = process.argv.slice(2);

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(path.relative(src, full).split(path.sep).join('/'));
  }
})(src);

const keep = files.filter((f) => f.startsWith('_expo/') || f.startsWith('assets/'));
// The host reserves names starting with "_" and URLs dislike "[", "]" and "@".
const safe = (p) =>
  p
    .replace(/^_expo\//, 'app/')
    .split('/')
    .map((segment) => segment.replace(/^_+/, ''))
    .join('/')
    .replace(/[[\]]/g, '')
    .replace(/@/g, '-at-');
const renames = keep.filter((f) => safe(f) !== f).sort((a, b) => b.length - a.length);
if (new Set(keep.map(safe)).size !== keep.length) throw new Error('Two files map to the same published name');

let patchedChunkBase = 0;
fs.rmSync(out, { recursive: true, force: true });
for (const file of keep) {
  const target = path.join(out, safe(file));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!file.endsWith('.js')) {
    fs.copyFileSync(path.join(src, file), target);
    continue;
  }
  let code = fs.readFileSync(path.join(src, file), 'utf8');
  // Full file references become relative and renamed; folder references (asset
  // server locations) just lose their leading slash.
  for (const f of keep) code = code.split(`"/${f}"`).join(`"${safe(f)}"`);
  for (const old of renames) {
    if (code.includes(`/${old}`)) throw new Error(`Unrewritten reference to ${old}`);
  }
  code = code.split('"/assets/').join('"assets/');
  // Metro resolves lazy route chunks against the current address, which changes
  // as the app navigates. Resolve them against the pinned <base> instead.
  const chunkBase = 'url:location.origin+location.pathname}';
  if (code.includes(chunkBase)) {
    code = code.split(chunkBase).join('url:document.baseURI}');
    patchedChunkBase += 1;
  }
  fs.writeFileSync(target, code);
}

if (patchedChunkBase !== 1) throw new Error(`Expected one chunk-base patch, made ${patchedChunkBase}`);

const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\/([^"]+)"/g)].map((m) => safe(m[1]));
if (scripts.length === 0) throw new Error('No scripts found in index.html');

const page = `<title>Theory Trainer</title>
<style>
  /* One light look by design: the app draws its own colours. */
  html { box-sizing: border-box; height: 100%; }
  body { height: 100%; overflow: hidden; background: #ffffff; color: #3c4650; }
  #root { display: flex; height: 100%; flex: 1; }
  .boot { margin: auto; font: 600 16px/1.4 system-ui, sans-serif; color: #6b7785; }
</style>
<div id="root"><p class="boot">Theory Trainer wird geladen …</p></div>
<script>
  // Pin the base URL to this page's folder, then start the app's router at "/".
  (function () {
    var dir = location.pathname.replace(/[^/]*$/, '');
    var base = document.createElement('base');
    base.href = location.origin + dir;
    document.head.appendChild(base);
    try { history.replaceState(null, '', '/'); } catch (e) {}
  })();
</script>
${scripts.map((s) => `<script src="${s}" defer></script>`).join('\n')}
`;
fs.writeFileSync(path.join(out, 'index.html'), page);

const bytes = keep.reduce((n, f) => n + fs.statSync(path.join(out, safe(f))).size, 0);
console.log(`artifact: ${keep.length} files, ${(bytes / 1e6).toFixed(1)} MB, renamed ${renames.length}`);
console.log('scripts:', scripts.join(', '));
