// One-off: rasterize the Djera brand mark into the app icons via sharp.
// Run: node scripts/gen-icon.mjs   (sharp is a devDependency)
import sharp from 'sharp';

const BRAND = '#2a673a';
const ONBRAND = '#fcf8f1';
const ACCENT = '#e18e43';

// The mark (dart + saffron dot) on an 80×80 grid, from src/shared/components/Brand.tsx.
const mark = (scale, tx, ty) => `
  <g transform="translate(${tx},${ty}) scale(${scale})">
    <g transform="rotate(-12 40 40)">
      <path d="M40 18 L58 60 L40 51 Z" fill="${ONBRAND}" fill-opacity="0.98"/>
      <path d="M40 18 L22 60 L40 51 Z" fill="${ONBRAND}" fill-opacity="0.55"/>
    </g>
    <circle cx="64" cy="16" r="5" fill="${ACCENT}"/>
    <circle cx="64" cy="16" r="5" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
  </g>`;

// Full-bleed app icon: solid brand background + mark (no transparency — iOS masks corners).
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${BRAND}"/>
  ${mark(9, 152, 152)}
</svg>`;

// Android adaptive foreground: transparent, mark sized into the safe zone.
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  ${mark(6, 272, 272)}
</svg>`;

const out = (svg, file) =>
  sharp(Buffer.from(svg)).png().resize(1024, 1024).toFile(file).then(() => console.log('wrote', file));

await out(iconSvg, 'assets/images/icon.png');
await out(iconSvg, 'assets/images/favicon.png');
await out(fgSvg, 'assets/images/android-icon-foreground.png');
console.log('done');
