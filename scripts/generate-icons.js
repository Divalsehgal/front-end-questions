// Generates the favicon, app icons and the default Open Graph image into public/ from the brand
// palette, with no image dependencies (a tiny rasteriser + PNG encoder). Output is committed;
// re-run with `npm run icons` after changing the design.
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const NAVY = [0x0d, 0x21, 0x49];
const CREAM = [0xf9, 0xeb, 0xe0];
const TEAL = [0x20, 0x8a, 0xae];
const OUT = new URL('../public/', import.meta.url);

// The lightning bolt from the app header (lucide "zap", simplified), on a 24-unit grid.
const BOLT = [
  [13, 2],
  [3, 14],
  [12, 14],
  [11, 22],
  [21, 10],
  [12, 10],
];

// --- PNG encoding -------------------------------------------------------------------------
const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}
function png(img) {
  const { w, h, px } = img;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    px.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr.set([8, 2, 0, 0, 0], 8); // 8-bit RGB
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// --- Drawing ------------------------------------------------------------------------------
const canvas = (w, h, bg) => {
  const px = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) px.set(bg, i * 3);
  return { w, h, px };
};
const blend = (img, x, y, rgb, a) => {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h || a <= 0) return;
  const i = (y * img.w + x) * 3;
  for (let k = 0; k < 3; k++) img.px[i + k] = Math.round(img.px[i + k] * (1 - a) + rgb[k] * a);
};
/** Fills pixels where `inside(x, y)` holds, 4×4 supersampled for smooth edges. */
function fill(img, [x0, y0, x1, y1], rgb, inside) {
  for (let y = Math.max(0, Math.floor(y0)); y < Math.min(img.h, Math.ceil(y1)); y++)
    for (let x = Math.max(0, Math.floor(x0)); x < Math.min(img.w, Math.ceil(x1)); x++) {
      let hits = 0;
      for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) hits += inside(x + (sx + 0.5) / 4, y + (sy + 0.5) / 4) ? 1 : 0;
      blend(img, x, y, rgb, hits / 16);
    }
}
const inPolygon = (pts) => (x, y) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const roundRect = (x0, y0, x1, y1, r) => (x, y) => {
  const dx = Math.max(x0 + r - x, 0, x - (x1 - r));
  const dy = Math.max(y0 + r - y, 0, y - (y1 - r));
  return x >= x0 && x <= x1 && y >= y0 && y <= y1 && dx * dx + dy * dy <= r * r;
};
function bolt(img, x, y, size, rgb) {
  const pts = BOLT.map(([bx, by]) => [x + (bx / 24) * size, y + (by / 24) * size]);
  fill(img, [x, y, x + size, y + size], rgb, inPolygon(pts));
}

// 5×7 bitmap font (just the glyphs used below).
const FONT = {
  A: '01110100011000111111100011000110001',
  C: '01110100011000010000100001000101110',
  D: '11110100011000110001100011000111110',
  E: '11111100001000011110100001000011111',
  F: '11111100001000011110100001000010000',
  G: '01110100011000010111100011000101111',
  I: '01110001000010000100001000010001110',
  J: '00111000100001000010000101001001100',
  L: '10000100001000010000100001000011111',
  N: '10001110011010110011100011000110001',
  O: '01110100011000110001100011000101110',
  P: '11110100011000111110100001000010000',
  Q: '01110100011000110001101011001001101',
  R: '11110100011000111110101001001010001',
  S: '01111100001000001110000010000111110',
  T: '11111001000010000100001000010000100',
  U: '10001100011000110001100011000101110',
  V: '10001100011000110001100010101000100',
  W: '10001100011000110101101011101110001',
  X: '10001100010101000100010101000110001',
  Y: '10001100010101000100001000010000100',
  Z: '11111000010001000100010001000011111',
  M: '10001110111010110101100011000110001',
  ',': '00000000000000000000001100010001000',
  '·': '00000000000000001100011000000000000',
  ' ': '0'.repeat(35),
};
function text(img, str, x, y, scale, rgb) {
  [...str].forEach((ch, n) => {
    const glyph = FONT[ch] ?? FONT[' '];
    for (let i = 0; i < 35; i++)
      if (glyph[i] === '1') {
        const gx = x + (n * 6 + (i % 5)) * scale;
        const gy = y + Math.floor(i / 5) * scale;
        fill(img, [gx, gy, gx + scale, gy + scale], rgb, () => true);
      }
  });
}
const textWidth = (str, scale) => (str.length * 6 - 1) * scale;

// --- Assets -------------------------------------------------------------------------------
function appIcon(size) {
  const img = canvas(size, size, NAVY);
  bolt(img, size * 0.18, size * 0.18, size * 0.64, TEAL);
  return png(img);
}

function ogImage() {
  const img = canvas(1200, 630, CREAM);
  fill(img, [0, 0, 1200, 630], NAVY, roundRect(40, 40, 1160, 590, 36));
  fill(img, [96, 112, 232, 248], TEAL, roundRect(96, 112, 232, 248, 28));
  bolt(img, 116, 132, 96, NAVY);
  text(img, 'FE GRIND', 272, 128, 15, CREAM);
  const lines = ['FREE FRONTEND INTERVIEW', 'QUESTIONS, QUIZZES', 'AND CODING DRILLS'];
  lines.forEach((l, i) => text(img, l, 96, 312 + i * 64, 7, CREAM));
  fill(img, [96, 516, 1104, 524], TEAL, () => true);
  const tagline = 'JS · TS · REACT · NEXT · CSS · DSA';
  text(img, tagline, 1104 - textWidth(tagline, 4), 538, 4, CREAM);
  return png(img);
}

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#0d2149"/><path d="${BOLT.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * 0.64 + 4.32).toFixed(2)} ${(y * 0.64 + 4.32).toFixed(2)}`).join('')}Z" fill="#208aae"/></svg>\n`;

mkdirSync(OUT, { recursive: true });
writeFileSync(new URL('favicon.svg', OUT), svgIcon);
writeFileSync(new URL('favicon-32.png', OUT), appIcon(32));
writeFileSync(new URL('apple-touch-icon.png', OUT), appIcon(180));
writeFileSync(new URL('icon-192.png', OUT), appIcon(192));
writeFileSync(new URL('icon-512.png', OUT), appIcon(512));
writeFileSync(new URL('og-image.png', OUT), ogImage());
console.warn('Wrote favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png, og-image.png to public/');
