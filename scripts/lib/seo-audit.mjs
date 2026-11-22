// @ts-check
// Lightweight checks that run on every build, so SEO and a11y rules from CLAUDE.md
// are enforced by the pipeline instead of by memory.

/**
 * @typedef {{ level: 'error' | 'warn', message: string }} Finding
 */

/** @param {string} value */
const decodeEntities = (value) =>
  value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** @param {string} pageHtml @param {RegExp} pattern */
const firstMatch = (pageHtml, pattern) => decodeEntities(pageHtml.match(pattern)?.[1] ?? '');

/**
 * @param {string} pageHtml
 * @param {{ isIndexable: boolean, expectAlternates: boolean }} options
 * @returns {Finding[]}
 */
export function auditPage(pageHtml, { isIndexable, expectAlternates }) {
  /** @type {Finding[]} */
  const findings = [];
  /** @param {Finding['level']} level @param {string} message */
  const report = (level, message) => findings.push({ level, message });

  const title = firstMatch(pageHtml, /<title>([^<]*)<\/title>/);
  const description = firstMatch(pageHtml, /<meta name="description" content="([^"]*)"/);
  if (!title) report('error', 'Missing <title>.');
  else if (isIndexable && (title.length < 50 || title.length > 60)) report('warn', `Title is ${title.length} chars (aim for 50–60): "${title}"`);
  if (!description) report('error', 'Missing meta description.');
  else if (isIndexable && (description.length < 120 || description.length > 155)) report('warn', `Description is ${description.length} chars (aim for 120–155).`);

  if (!/<html lang="[a-z]{2}(-[A-Z]{2})?"/.test(pageHtml)) report('error', 'Missing or invalid <html lang>.');
  if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(pageHtml)) report('error', 'Missing absolute canonical URL.');
  if (expectAlternates) {
    if (!/hreflang="x-default"/.test(pageHtml)) report('error', 'Missing hreflang="x-default".');
    if ((pageHtml.match(/<link rel="alternate" hreflang=/g) ?? []).length < 3) report('error', 'Expected an hreflang alternate for every locale plus x-default.');
  }
  for (const property of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
    if (!pageHtml.includes(`property="${property}"`)) report('error', `Missing ${property}.`);
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:image']) {
    if (!pageHtml.includes(`name="${name}"`)) report('error', `Missing ${name}.`);
  }

  const headingLevels = [...pageHtml.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
  const h1Count = headingLevels.filter((level) => level === 1).length;
  if (h1Count !== 1) report('error', `Expected exactly one <h1>, found ${h1Count}.`);
  headingLevels.forEach((level, index) => {
    const previous = index === 0 ? 0 : headingLevels[index - 1];
    if (level > previous + 1) report('error', `Heading level skips from h${previous} to h${level}.`);
  });

  for (const match of pageHtml.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    if (!/\balt="/.test(tag)) report('error', `Image without alt: ${tag.slice(0, 80)}`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) report('error', `Image without width/height (causes layout shift): ${tag.slice(0, 80)}`);
  }
  if (/\sonclick=/i.test(pageHtml)) report('error', 'Inline onclick handler found; use <a href> for navigation.');

  const ids = new Set([...pageHtml.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of pageHtml.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(match[1])) report('error', `In-page link to missing #${match[1]}.`);
  }

  for (const match of pageHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch {
      report('error', 'Invalid JSON-LD block.');
    }
  }

  const robots = firstMatch(pageHtml, /<meta name="robots" content="([^"]*)"/);
  if (isIndexable && robots.includes('noindex')) report('error', 'Indexable page is marked noindex.');
  if (!isIndexable && !robots.includes('noindex')) report('error', 'Non-indexable page is missing noindex.');

  return findings;
}
