import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(resolve(output, 'index.html'), 'utf8');

assert(!/(?:src|href)\s*=\s*["'][^"']*\/src\//i.test(html),
  'Production HTML must not reference source files. Publish the Vite dist directory.');
assert(/id=["']root["']/.test(html), 'Production HTML is missing the React root.');

const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
  .map((match) => match[1]);
const styles = [...html.matchAll(/<link\b[^>]*>/gi)]
  .filter(([tag]) => /\brel=["']stylesheet["']/i.test(tag))
  .map(([tag]) => tag.match(/\bhref=["']([^"']+)["']/i)?.[1])
  .filter(Boolean);

assert(scripts.some((url) => /^\/assets\/.+\.js$/.test(url)),
  'Production HTML must load generated JavaScript from /assets/.');
assert(styles.some((url) => /^\/assets\/.+\.css$/.test(url)),
  'Production HTML must load generated CSS from /assets/.');

for (const url of [...scripts, ...styles]) {
  if (/^(?:https?:)?\/\//.test(url)) continue;
  const path = resolve(output, url.replace(/^\//, '').split(/[?#]/)[0]);
  assert(path.startsWith(output.endsWith(sep) ? output : output + sep),
    'Asset path must stay within dist.');
  const asset = await stat(path);
  assert(asset.isFile() && asset.size > 0, `Missing or empty production asset: ${url}`);
}

console.log('Production HTML references generated JavaScript and CSS; all local assets exist.');
