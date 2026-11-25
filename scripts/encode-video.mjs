// @ts-check
// Re-encodes the hero background video from its original into small, seamlessly looping web files:
//   src/media/hero-dark.webm (VP9) and src/media/hero-dark.mp4 (H.264, for Safari without VP9).
// The last FADE seconds are cross-faded into the first frames, so the file loops with no visible cut.
// Needs ffmpeg + ffprobe on PATH (Windows: winget install Gyan.FFmpeg). Run with: npm run video
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.on('uncaughtException', (error) => {
  console.error(error.message);
  process.exit(1);
});

const ROOT =path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'scripts/source/hero-dark-original.mp4');
const OUT_DIR = path.join(ROOT, 'src/media');

/** Cross-fade length in seconds: long enough to hide the seam in slow fabric motion. */
const FADE = 1.5;
/** The dark overlay hides fine detail, so a smaller, lower-frame-rate picture looks the same and weighs far less. */
const WIDTH = 960;
const FPS = 24;

/** @param {string} command @param {string[]} args */
function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  if (result.error) throw new Error(`${command} not found. Install ffmpeg first (see README: "Hero video").`);
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
  return result.stdout.trim();
}

const duration = Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', SOURCE]));
if (!(duration > FADE * 2)) throw new Error(`Source is too short to loop (${duration}s).`);
const loopLength = duration - FADE;

// The tail (last FADE s) fades into the start of the body, so the output ends exactly where it begins.
const filter = [
  '[0:v]split[forTail][forBody]',
  `[forTail]trim=start=${loopLength}:end=${duration},setpts=PTS-STARTPTS[tail]`,
  `[forBody]trim=start=0:end=${loopLength},setpts=PTS-STARTPTS[body]`,
  `[tail][body]xfade=transition=fade:duration=${FADE}:offset=0,scale=${WIDTH}:-2,fps=${FPS},format=yuv420p[v]`,
].join(';');

/** @type {[string, string[]][]} */
const outputs = [
  ['hero-dark.webm', ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '40', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2']],
  ['hero-dark.mp4', ['-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-profile:v', 'high', '-movflags', '+faststart']],
];

for (const [name, codecArgs] of outputs) {
  const target = path.join(OUT_DIR, name);
  console.log(`Encoding ${path.relative(ROOT, target)}…`);
  run('ffmpeg', ['-y', '-v', 'error', '-i', SOURCE, '-filter_complex', filter, '-map', '[v]', '-an', ...codecArgs, target]);
}

const end = Math.floor((loopLength - 0.05) * 100) / 100;
console.log(`\nDone. The new files have no held frames, so in src/templates/components/hero.js set
  data-window-webm="0 ${end}", data-window-mp4="0 ${end}" and data-crossfade="0.08"
(the loop is already in the file, so the players only need a two-frame hand-over, not a long blend)
then run: npm run build`);
