// @ts-check
// Static site generator: renders every locale to plain HTML (SSG), bundles CSS/JS with
// content hashes, writes sitemap.xml + robots.txt, and audits the output.
// Zero dependencies: needs only Node 22+.
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { siteConfig } from '../src/config/site.js';
import { collectKeyPaths, createI18n } from '../src/lib/i18n.js';
import { renderHomePage } from '../src/templates/pages/home.js';
import { renderNotFoundPage } from '../src/templates/pages/not-found.js';
import { renderRobots, renderSitemap } from '../src/templates/seo/crawl-files.js';
import { auditPage } from './lib/seo-audit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

/** Cascade order matters, so it is explicit. Every file in src/styles must be listed. */
const STYLE_ORDER = ['tokens', 'base', 'header', 'hero', 'about', 'work', 'mock-site', 'guarantee', 'process', 'affordable', 'pricing', 'faq', 'contact', 'footer'];
/** Helpers first, entry point last. Every file in src/scripts must be listed. */
const SCRIPT_ORDER = ['utils', 'language', 'navigation', 'showcase', 'process', 'contact', 'main'];

/** @param {string} content */
const contentHash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 10);

/** @param {string} css */
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

/** @param {string} directory @param {string[]} order @param {string} extension */
async function assertOrderCoversDirectory(directory, order, extension) {
  const files = (await readdir(directory)).filter((file) => file.endsWith(extension)).map((file) => path.basename(file, extension));
  const unlisted = files.filter((file) => !order.includes(file));
  const missing = order.filter((file) => !files.includes(file));
  if (unlisted.length || missing.length) {
    throw new Error(`${path.relative(ROOT, directory)}: unlisted [${unlisted.join(', ')}], missing [${missing.join(', ')}]. Update the order in scripts/build.mjs.`);
  }
}

async function bundleStyles() {
  const directory = path.join(SRC, 'styles');
  await assertOrderCoversDirectory(directory, STYLE_ORDER, '.css');
  const sources = await Promise.all(STYLE_ORDER.map((name) => readFile(path.join(directory, `${name}.css`), 'utf8')));
  const css = minifyCss(sources.join('\n'));
  const file = `assets/css/site.${contentHash(css)}.css`;
  await writeOutput(file, css);
  return file;
}

async function bundleScripts() {
  const directory = path.join(SRC, 'scripts');
  await assertOrderCoversDirectory(directory, SCRIPT_ORDER, '.js');
  const sources = await Promise.all(
    SCRIPT_ORDER.map(async (name) => {
      const source = await readFile(path.join(directory, `${name}.js`), 'utf8');
      return `// --- ${name}.js ---\n${source.replace(/^\/\/ @ts-check\s*\n/m, '')}`;
    }),
  );
  const js = `(() => {\n'use strict';\n${sources.join('\n')}\n})();\n`;
  const file = `assets/js/site.${contentHash(js)}.js`;
  await writeOutput(file, js);
  return file;
}

/** @param {string} relativePath @param {string} content */
async function writeOutput(relativePath, content) {
  const target = path.join(DIST, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
}

/** @param {string} code */
async function loadDictionary(code) {
  return /** @type {Record<string, unknown>} */ (JSON.parse(await readFile(path.join(SRC, 'i18n', `${code}.json`), 'utf8')));
}

/** Every locale must have exactly the same keys, so no visitor ever sees a missing string. */
function assertDictionaryParity(/** @type {Map<string, Record<string, unknown>>} */ dictionaries) {
  const [[referenceCode, reference], ...others] = [...dictionaries.entries()];
  const referenceKeys = new Set(collectKeyPaths(reference));
  for (const [code, dictionary] of others) {
    const keys = new Set(collectKeyPaths(dictionary));
    const missing = [...referenceKeys].filter((key) => !keys.has(key));
    const extra = [...keys].filter((key) => !referenceKeys.has(key));
    if (missing.length || extra.length) {
      throw new Error(`i18n/${code}.json differs from ${referenceCode}.json.\n  missing: ${missing.join(', ') || '-'}\n  extra: ${extra.join(', ') || '-'}`);
    }
  }
}

async function copyStaticFiles() {
  const staticDir = path.join(SRC, 'static');
  await cp(staticDir, DIST, { recursive: true });
}

/** @param {string} relativePath */
async function existsInDist(relativePath) {
  try {
    await stat(path.join(DIST, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function build() {
  const startedAt = Date.now();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const dictionaries = new Map();
  for (const locale of siteConfig.locales) dictionaries.set(locale.code, await loadDictionary(locale.code));
  assertDictionaryParity(dictionaries);

  const [css, js] = await Promise.all([bundleStyles(), bundleScripts(), copyStaticFiles()]);
  const assets = { css, js };
  const year = new Date().getFullYear();
  const isDraft = !siteConfig.isProduction;

  const contexts = siteConfig.locales.map((locale) => ({
    i18n: createI18n(dictionaries.get(locale.code), locale, siteConfig.currency),
    config: siteConfig,
    locale,
    isDraft,
    year,
  }));

  /** @type {{ file: string, html: string, isIndexable: boolean, expectAlternates: boolean }[]} */
  const pages = contexts.map((ctx) => ({
    file: path.posix.join(ctx.locale.path.slice(1), 'index.html'),
    html: renderHomePage(ctx, assets),
    isIndexable: siteConfig.isProduction,
    expectAlternates: true,
  }));
  const defaultContext = contexts.find((ctx) => ctx.locale.code === siteConfig.defaultLocale) ?? contexts[0];
  pages.push({ file: '404.html', html: renderNotFoundPage(defaultContext, contexts, assets), isIndexable: false, expectAlternates: false });

  for (const page of pages) await writeOutput(page.file, page.html);
  await writeOutput('sitemap.xml', renderSitemap(siteConfig, new Date().toISOString().slice(0, 10)));
  await writeOutput('robots.txt', renderRobots(siteConfig));

  let errorCount = 0;
  for (const page of pages) {
    const findings = auditPage(page.html, page);
    for (const finding of findings) {
      if (finding.level === 'error') errorCount += 1;
      console[finding.level === 'error' ? 'error' : 'warn'](`  ${finding.level === 'error' ? '✖' : '⚠'} ${page.file}: ${finding.message}`);
    }
  }
  for (const locale of siteConfig.locales) {
    if (!(await existsInDist(locale.ogImage))) console.warn(`  ⚠ ${locale.ogImage} is missing. Run "npm run images" to generate social share images.`);
  }

  if (errorCount > 0) {
    console.error(`\nBuild finished with ${errorCount} audit error(s).`);
    process.exitCode = 1;
    return;
  }
  console.log(`\n✔ Built ${pages.length} pages (${siteConfig.environment}, ${siteConfig.siteUrl}) in ${Date.now() - startedAt} ms → dist/`);
  if (!siteConfig.isProduction) console.log('  Staging build: noindex, draft banner and placeholder markers are on.');
}

build().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
