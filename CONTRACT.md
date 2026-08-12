# Build contract — read before writing any component

Stack: **Vite + React 19 + TypeScript + Tailwind CSS v4**.
Tailwind v4 is configured via `@tailwindcss/vite` and a CSS-first `@theme` block
in `src/index.css`. **There is no `tailwind.config.ts` and you must not create one.**

The authoritative design spec is `DanielPlsHireMe_Layout_Spec.md` at the repo root.
This file only records the shared contract every component codes against.

## Design tokens (already defined — use these utility names)

| Utility | Value | Use |
|---|---|---|
| `bg-canvas` | `#FAFAFA` | the page tint — reads as **gutter** |
| `bg-surface` | `#FFFFFF` | white content cells and cards |
| `bg-row-alt` | `#F5F5F5` | even rows in the comparison table |
| `bg-dark` | `#141414` | dark CTA section |
| `bg-dark-card` | `#1E1E1E` | dark cards |
| `text-ink` / `bg-ink` | `#0A0A0A` | headlines, body |
| `text-muted` | `#6B7280` | subtitles, annotations |
| `text-dark-ink` | `#FFFFFF` | text on dark |
| `text-dark-muted` | `#A0A0A0` | muted text on dark |
| `border-rule` | `oklch(0 0 0 / 0.07)` | **every** structural hairline |
| `border-rule-strong` | `oklch(0 0 0 / 0.12)` | emphasis only — table header underline, dot grid |
| `max-w-frame` | `64rem` | the content frame — all cells are this wide |
| `max-w-rail` | `80rem` | the outer rail vertical |
| `border-line-dark` / `bg-line-dark` | `#2A2A2A` | decorative lines on dark (FadingLines) |

> `bg-paper`, `bg-card` and `border-line` are **gone** — replaced by `bg-canvas`,
> `bg-surface` and `border-rule` respectively. A leftover reference renders
> unstyled with no error. Dark mode is a `.dark` class token swap; no component
> references a raw color for a surface or a rule, so nothing else needs to know.
| `text-green` / `bg-green` | `#16B364` | primary accent |
| `bg-green-dark` | `#14A15A` | green button hover |
| `text-coral` / `bg-coral` | `#F97066` | secondary accent |
| `bg-yellow` | `#FDB022` | tertiary, sparing |
| `border-placeholder-border` | `#D1D5DB` | dashed placeholder border |
| `bg-placeholder-bg` | `#F9FAFB` | placeholder fill |
| `text-placeholder-text` | `#9CA3AF` | placeholder label |

Fonts: `font-display` (Tegno, self-hosted at `public/fonts/Tegno.woff2` with a
`.ttf` fallback; Space Grotesk backs it up). Three uses ONLY: the hero headline,
the CTA headline, and the phone number in the contact modal. `font-sans`
(Figtree, default on `body`), `font-pixel` (Press Start 2P — always 10px or
smaller, always `text-muted`).

> Tegno is licensed **freeware, non-commercial, personal use only** (PutraCetol
> Studio — see `public/fonts/LICENSE.txt`). Fine for a personal portfolio; buy a
> license before it goes near commercial work.

Animation: `animate-modal-in` (200ms ease-out, fade + 8px rise) is registered.

## Hard rules

0. **Never override a base class by passing a competing utility in `className`.**
   Tailwind utilities all have the same specificity, so the winner is decided by
   **source order in the generated stylesheet**, not by the order you write them
   in the attribute. `.absolute` is emitted before `.relative`, and `.text-ink`
   before `.text-muted` — so passing `absolute` to a component whose base
   classes include `relative` (or `text-ink` to one that sets `text-muted`)
   silently loses, with no error anywhere. This already cost us every colour
   slab on the page rendering at `height: 0`. Either position/recolour a
   **wrapper** element (what `Frame` does), or set the value **inline**
   (what `PixelNote`'s `style` prop is for).

1. **Sharp corners are still the default.** `border-radius: 0` is enforced
   globally in `@layer base`. Don't reach for a `rounded-*` utility on a new
   component without a reason as deliberate as the two named exceptions below.

   The **named exceptions** are the `--radius-card` / `--radius-mat` /
   `--radius-cta` tokens (`rounded-card`, `rounded-mat`, `rounded-cta`),
   defined in the `@theme` block and used only by `FeatureCard` — its shell,
   inner frame and CTA button are the one place on the page that's deliberately
   rounded, matching a reference the user chose over the sharp-corners default.
   ComparisonCard's 40px header photo circles are the other exception, and stay
   an inline `style={{ borderRadius: '9999px' }}`, unchanged by this rule's
   rewrite — that code still works and there's no reason to migrate it to a
   token.

   Both exceptions beat the base reset, but **not** because an inline style is
   the only thing that can: the built stylesheet declares its cascade layers in
   first-appearance order — `properties → theme → base → components →
   utilities` — with no explicit `@layer a, b, c;` statement anywhere, so the
   `utilities` layer outranks `@layer base` regardless of specificity. That's
   why `FeatureCard`'s `rounded-*` **utility classes** win over the reset with
   no inline style at all; ComparisonCard's inline style is a second, older way
   of winning the same fight, not the only one. To re-verify after a Tailwind
   upgrade: `grep -o "@layer [a-z]*{" dist/assets/index-*.css` prints the
   layer blocks in the order they first appear, which IS the precedence order
   in the absence of a grouping statement.
2. Content column is `mx-auto w-full max-w-frame px-4 sm:px-6` — the `Section`
   component already applies it. Do not re-wrap, and do not invent a different
   width: every cell edge has to land on the frame verticals that `RuleLayer`
   draws, or the page's whole line grid goes crooked.
7. **One owner per line.** Boundaries between stacked siblings belong to the
   parent (`[&>*+*]:border-t [&>*+*]:border-rule`), never to the children. Two
   elements drawing the same seam renders it 2px. See the README's rule-system
   section before adding any border.
3. External links always get `target="_blank" rel="noopener noreferrer"`.
4. No animation libraries. CSS keyframes only.
5. TypeScript strict — no `any`, no unused imports/vars (the build runs `tsc -b`).
6. Named exports only: `export function ComponentName()`.

## Shared components (already written — import, don't reimplement)

```tsx
import { Section, SectionTitle, PixelNote } from './Section'
import { Placeholder } from './Placeholder'
import { Reveal } from './Reveal'
import { Rule } from './rules/Rule'
import { RuleGrid, ruleCell } from './rules/RuleGrid'

// Section renders a frame-width cell: the content column, its fill, and the
// vertical padding. It does NOT draw its own boundary rule — App's
// `[&>*+*]:border-t` owns every section boundary. `Divider` is gone.
<Section tone="surface" padding="lg">…</Section>
//   tone:    'canvas' (transparent, shows the page tint — default) | 'surface' (white cell)
//   padding: 'md' (py-16) | 'lg' (py-20, default) | 'xl' (py-28)

<SectionTitle>why me</SectionTitle>          // Figtree 800, 2rem, left-aligned
<PixelNote>press play or just trust me</PixelNote>  // Press Start 2P, 10px, muted

<Placeholder label="FBLA TIMELINE SCREENSHOT" aspect="aspect-video" />
//   aspect: any Tailwind aspect utility, e.g. "aspect-[3/4]", "aspect-[16/10]"
//   pass src="/images/foo.png" later to swap the dashed box for a real image

<Reveal>…</Reveal>   // optional 400ms opacity fade-in on scroll, once
```

`<FeatureCard>` is the container for every image-slot artifact (SoundDesign,
both WebWork cards, GraphicDesign, SlideDeck): a title / description / CTA
panel on top, sitting above the same torn `ColorSlab` `<Frame>` uses, with a
`Placeholder` mat filling the bottom:

```tsx
import { FeatureCard } from './FeatureCard'

<FeatureCard
  title="Pocket Ace"
  description="AI study tool with a Notion-style environment."
  tags={['React', 'TypeScript']}          // or badge={{ icon, accent, label }} — one or the other
  href="https://pocketace.it.com"
  ctaLabel="pocketace.it.com"             // optional, defaults to 'learn more'
  seed="webwork-pocketace"
  color="bg-pop-mint"
  image="/images/texture-bar.jpg"         // optional — public path to a texture-*.jpg plate
  imagePosition="center 35%"              // per-instance — see ColorSlab's prop docs
  rotate={1.5}
  className="mx-auto max-w-3xl"           // WIDTH AND OUTER MARGIN ONLY, see below
>
  <Placeholder label="POCKET ACE SCREENSHOT" aspect="aspect-[16/10]" />
</FeatureCard>
```

`className` on `FeatureCard` is width and outer margin ONLY (`max-w-*`,
`mx-auto`, and similar) — never a competing `rounded-*`, `overflow-*` or
`bg-*`. `FeatureCard` already sets all three on its own shell and panels, and
`className` is appended after them in the template string, so any of those
three utilities collides with hard rule 0 above: same specificity, decided by
source order in the generated stylesheet, not by which one you think should
win. `FeatureCard` also deliberately sets no `max-w-*` of its own so each
call site's existing width keeps working unmodified.

`<Frame>` / `<ColorSlab>` still exist for flat pop ink with no image slot and
no title/CTA panel (WhyMe's stats block is the only current caller):

```tsx
<Frame seed="whyme-stats" color="bg-pop-blue" rotate={2} className="mt-6 max-w-2xl">…</Frame>
```

`Frame` keeps its own `image`/`imagePosition` props for now, but nothing
currently calls it with them — reach for `FeatureCard` for that shape instead.

For the paper-cutout look (white fill + 1px rule + subtle shadow) use the
`paper` class already defined in `index.css`: `<div className="paper p-6">`.
It's opaque on purpose — cards sit above the rule grid and occlude any rule
they cross.

The rule primitives (`RuleLayer`, `RuleFrame`, `Rule`, `RuleGrid`, `DotField`)
are documented in the README's "The rule system" section, with a live kitchen
sink at `/#rules`. Read that before adding any border anywhere.

## Section order in `src/App.tsx`

Hero → SoundDesign → WebWork → SlideDeck → ComparisonCard →
WorkSection (ProjectScroller, titled "my videos portfolio") → WhyMe →
GraphicDesign → DarkCTA

Tones alternate canvas / surface down the page: Hero canvas, Sound surface,
Web canvas, SlideDeck canvas, Comparison surface, Work canvas, WhyMe surface,
Graphic canvas, DarkCTA `#141414`.

The Web → SlideDeck seam is the one place two `canvas` sections touch, and it
is forced, not an oversight: Work is `canvas` and must be preceded by a
`surface`, which fixes the parity of everything above it against Hero's
`canvas`. One repeat somewhere is unavoidable in this order — putting it
between two transparent sections (which still have the boundary hairline
between them) costs less than merging two white content cells into one block.

## Real URLs

- TikTok cooking video id: `7665869308655930637`
- YouTube signout edit: `https://www.youtube.com/embed/5MPob2nP_Yk`
- Instagram FBLA: `https://www.instagram.com/p/DZfJsalqPp6H1SHUP6KjMz448mJKya7gfPf5nU0/`
- Wahoops (real, note the trailing underscore): `https://instagram.com/wahoops_`
- Contact — phone `571-440-7983` (`tel:+15714407983`), Instagram `@bachqle`
  (`https://instagram.com/bachqle`), email `bachqle.real@gmail.com`. These live in
  `ContactModal.tsx`, opened by both CTA buttons.
- urnovafoodie / Pocket Ace / Personal Remedies / slide-deck links are still
  placeholders — `https://instagram.com/urnovafoodie`, `https://pocketace.it.com`,
  `https://personalremedies.com`.
