# Build spec: vibrant, textured, imperfect containers

Paste this whole file to Claude Code. Stack: **React + Tailwind**. No image assets — all texture is inline SVG + CSS.

---

## 0. The look, in one sentence

A flat vibrant color shape sits *behind* the content, slightly rotated, with **torn edges**, a **grain overlay** so the fill isn't a dead-flat swatch, and **thin hand-drawn lines** that cross over the top and run off the edges of the container.

Four layers, always in this order:

```
1. neutral card       (#F2F0EC / #EFEFEF) — the calm base, square-ish, rounded-3xl
2. color shape        vibrant fill, torn clip-path, rotated ~1–2deg, overflows the card
3. content            screenshot / text / children — counter-rotated to stay level
4. mess               grain + halftone + scribble lines, pointer-events-none, overflowing
```

Rule of thumb: **the container is calm, the shape inside it is loud.** Don't make the card itself neon.

---

## 1. Tokens

`tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        ink:   '#131313',
        paper: '#FAF8F5',
        shell: '#F1EFEB',
        pop: {
          yellow: '#FFC93C',
          mint:   '#7BE0B4',
          pink:   '#FF9FB2',
          coral:  '#FF7A5C',
          violet: '#B98CF5',
          blue:   '#8DA6F7',
          magenta:'#E86BE0',
          lime:   '#C6E85B',
        },
      },
      rotate: { '1.5': '1.5deg', '2.5': '2.5deg' },
    },
  },
}
```

Use **one** pop color per container. Never gradient between two pops — these are flat inks, gradients read as 2015 SaaS.

---

## 2. Global CSS

`app/globals.css` (or wherever your Tailwind entry is):

```css
@layer utilities {
  /* fine film grain — breaks up the flat fill */
  .tex-grain::after {
    content: '';
    position: absolute;
    inset: -20%;                 /* overscan so rotation never reveals an edge */
    pointer-events: none;
    opacity: 0.22;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* coarse blotch — uneven ink density, the "risograph" tell */
  .tex-blotch::before {
    content: '';
    position: absolute;
    inset: -20%;
    pointer-events: none;
    opacity: 0.35;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.6' intercept='0.2'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23b)'/%3E%3C/svg%3E");
  }

  /* halftone dots — use on ~1 in 3 shapes, not every one */
  .tex-halftone::after {
    content: '';
    position: absolute;
    inset: -30%;
    pointer-events: none;
    opacity: 0.28;
    mix-blend-mode: multiply;
    background-image: radial-gradient(currentColor 1.1px, transparent 1.3px);
    background-size: 6px 6px;
    transform: rotate(22deg);     /* kills moiré against the pixel grid */
    -webkit-mask-image: linear-gradient(115deg, #000 0%, transparent 65%);
            mask-image: linear-gradient(115deg, #000 0%, transparent 65%);
  }
}
```

Notes Claude Code must respect:

- Every textured element needs `relative isolate overflow-hidden`. `isolate` stops `mix-blend-mode` from bleeding onto siblings.
- Texture layers are `::before` / `::after` — never extra DOM, never `pointer-events`.
- `inset: -20%` matters. Rotating a clipped shape with a flush-fit texture exposes a hairline gap.

---

## 3. Deterministic randomness

Randomness must be **seeded**, not `Math.random()` — otherwise SSR and client render different shapes and React screams about hydration mismatch.

`lib/noise.ts`:

```ts
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: string): () => number {
  let a = hashString(seed);
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Torn-paper edge as a responsive polygon() clip-path. */
export function tornPolygon(seed: string, perSide = 5, jitter = 1.6): string {
  const r = rng(seed);
  const j = () => (r() * 2 - 1) * jitter;          // ±jitter %
  const pts: string[] = [];
  const walk = (
    n: number,
    at: (t: number, off: number) => [number, number]
  ) => {
    for (let i = 0; i < n; i++) pts.push(at(i / n, j()).map(v => `${v.toFixed(2)}%`).join(' '));
  };
  walk(perSide, (t, o) => [t * 100, 0 + o]);          // top
  walk(perSide, (t, o) => [100 - o, t * 100]);        // right
  walk(perSide, (t, o) => [100 - t * 100, 100 - o]);  // bottom
  walk(perSide, (t, o) => [0 + o, 100 - t * 100]);    // left
  return `polygon(${pts.join(', ')})`;
}

/** A wandering hand-drawn line across a 0..100 viewBox. */
export function scribblePath(
  seed: string,
  opts: { segments?: number; wobble?: number; angle?: number } = {}
): string {
  const { segments = 5, wobble = 9, angle = 0 } = opts;
  const r = rng(seed);
  const rad = (angle * Math.PI) / 180;
  const y0 = 15 + r() * 70;
  let d = `M -8 ${(y0 - 8 * Math.tan(rad)).toFixed(2)}`;
  let prev = y0;
  for (let i = 1; i <= segments; i++) {
    const x = -8 + ((116) * i) / segments;
    const drift = x * Math.tan(rad);
    const y = y0 + drift + (r() * 2 - 1) * wobble;
    const cx1 = x - 116 / segments / 2;
    d += ` Q ${cx1.toFixed(2)} ${(prev + (r() * 2 - 1) * wobble).toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`;
    prev = y;
  }
  return d;
}
```

---

## 4. Primitives

### `components/deco/Scribble.tsx`

Thin drifting lines. `vector-effect="non-scaling-stroke"` + `preserveAspectRatio="none"` is the trick: the path stretches to fill any box, but the stroke stays a crisp hairline instead of ballooning.

```tsx
type ScribbleProps = {
  seed: string;
  count?: number;
  className?: string;
  angle?: number;
  wobble?: number;
  opacity?: number;
};

export function Scribble({
  seed,
  count = 3,
  className = '',
  angle = -12,
  wobble = 9,
  opacity = 0.5,
}: ScribbleProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      style={{ opacity }}
    >
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={scribblePath(`${seed}-${i}`, { wobble, angle: angle + i * 4 })}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
```

Use `text-ink/40` on the parent to color them. They should look like pencil construction lines, not doodles.

### `components/deco/ColorSlab.tsx`

The workhorse — a torn, textured, rotated block of color.

```tsx
import { tornPolygon } from '@/lib/noise';

type ColorSlabProps = {
  seed: string;
  color?: string;            // any Tailwind bg-* class
  rotate?: number;           // degrees
  halftone?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function ColorSlab({
  seed,
  color = 'bg-pop-yellow',
  rotate = -1.5,
  halftone = false,
  className = '',
  children,
}: ColorSlabProps) {
  return (
    <div
      className={`relative isolate overflow-hidden tex-grain tex-blotch ${
        halftone ? 'tex-halftone' : ''
      } ${color} ${className}`}
      style={{
        clipPath: tornPolygon(seed),
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}
```

> `tex-grain` and `tex-halftone` both target `::after`. If `halftone` is true, drop `tex-grain` and let blotch+halftone carry it, **or** split halftone onto a nested `<span className="tex-halftone absolute inset-0" />`. Pick one and be consistent — do not let two utilities fight over the same pseudo-element.

### `components/deco/Frame.tsx`

The composed container. This is what pages actually import.

```tsx
import { ColorSlab } from './ColorSlab';
import { Scribble } from './Scribble';

type FrameProps = {
  seed: string;
  color?: string;
  rotate?: number;
  children: React.ReactNode;   // the screenshot / media
  className?: string;
};

export function Frame({ seed, color, rotate = -1.5, children, className = '' }: FrameProps) {
  return (
    // overflow-visible: the scribbles MUST be able to run off the edge
    <div className={`relative overflow-visible ${className}`}>
      <ColorSlab
        seed={seed}
        color={color}
        rotate={rotate}
        className="absolute inset-x-[-2%] inset-y-[6%] -z-10"
      />
      <div className="relative z-10 p-6 sm:p-10">{children}</div>
      <Scribble
        seed={`${seed}-lines`}
        count={3}
        className="z-20 text-ink/35"
      />
    </div>
  );
}
```

---

## 5. Section usage

```tsx
<section className="rounded-3xl bg-shell p-6 sm:p-10">
  <h2 className="text-5xl font-medium tracking-tight text-ink">Community</h2>
  <p className="mt-3 max-w-xl text-ink/70">Where your people talk…</p>

  <Frame seed="community" color="bg-pop-yellow" rotate={-1.5} className="mt-10">
    <img src="/shots/community.png" alt="" className="w-full rounded-xl shadow-2xl" />
  </Frame>
</section>
```

Vary `seed` per section so no two torn edges are identical. Alternate `rotate` sign down the page (`-1.5`, `+2`, `-1`, `+1.5`) so it reads as handmade rather than skewed.

---

## 6. Hard rules

1. **One pop color per container.** Mixing two vibrant fills in one card is noise, not energy.
2. **Text never sits on a pop color** unless it's `text-ink` at 18px+ and you've verified ≥4.5:1. `#FFC93C` and `#C6E85B` fail against white. Put copy on `bg-shell` / `bg-paper`.
3. **Decorative SVG gets `aria-hidden` and `pointer-events-none`.** Always.
4. **Scribbles live outside the clipped element.** `clip-path` on a parent will chop them; that's why `Frame` keeps `overflow-visible` and `ColorSlab` owns the clip.
5. **Max 2 texture utilities per element.** Grain + blotch is the default. Adding halftone on top of both turns the color to mud.
6. **Rotation ≤ 2.5deg.** Beyond that it stops looking intentional.
7. **No `Math.random()` anywhere.** Seeded only.

---

## 7. Performance

- The data-URI filters rasterize once per unique size. Reuse the same utility classes rather than generating per-instance `feTurbulence` — that's what makes this cheap.
- Add `contain: paint;` to `ColorSlab` if you see repaint cost on scroll.
- `mix-blend-mode` promotes a layer. Fine for ~10 slabs per page; if you're rendering 50, swap `tex-blotch` for a flat `bg-black/[0.03]` on the ones below the fold.
- Grain layers should **not** animate. Never put `transition` on opacity of a blend layer.

---

## 8. Verify before calling it done

Build a `/kitchen-sink` route rendering all 8 pop colors × `{halftone: true|false}` and check:

- [ ] No hairline gap between the clip edge and the texture at any viewport width
- [ ] Torn edges differ between seeds and are **identical across reload** (no hydration warning in console)
- [ ] Scribble stroke width is visually equal on a 320px and a 1440px container
- [ ] Grain visible at 100% zoom but not crawling/aliasing at 200%
- [ ] Blend layers don't tint neighboring sections (add `isolate` where they do)
- [ ] Run axe or Lighthouse a11y — zero contrast failures, zero unlabeled SVG
- [ ] Screenshot dark mode if you support it: `mix-blend-mode: multiply` needs to become `screen` on dark backgrounds
