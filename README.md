# DanielPlsHireMe

A one-page portfolio site. Vite + React + TypeScript + Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:5173  (rule-system demo: /#rules)
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve the production build locally
```

## Structure

```
src/
├── index.css              design tokens (@theme), @font-face, keyframes, textures
├── main.tsx               mounts App, or the rule kitchen sink at /#rules
├── App.tsx                composes the nine sections in order
├── lib/
│   └── noise.ts           seeded PRNG → torn-edge polygons
└── components/
    ├── Section.tsx        Section / SectionTitle / PixelNote
    ├── Placeholder.tsx    image slot — dashed box until you pass a src
    ├── Reveal.tsx         scroll fade-in
    ├── FeatureCard.tsx    title/description/CTA panel + torn photo mockup, one card
    ├── PixelIcon.tsx      8-bit icon set, 16×16 grids decoded to <rect>s
    ├── Accent.tsx         IconBadge / StatChip / AccentBlock
    ├── ContactModal.tsx   liquid-glass contact popup
    ├── rules/             the structural hairline system — see below
    │   ├── RuleLayer.tsx  the page's continuous frame + rail verticals
    │   ├── RuleFrame.tsx  centered max-w-frame content wrapper
    │   ├── Rule.tsx       one horizontal line: frame / bleed / inset
    │   ├── RuleGrid.tsx   grid with single-width seams (+ the `ruleCell` classes)
    │   ├── DotField.tsx   masked dot-grid background
    │   └── RuleKitchenSink.tsx  the /#rules demo page
    ├── deco/
    │   ├── ColorSlab.tsx  torn + textured + rotated block of pop color
    │   └── Frame.tsx      the composed slab-behind-content container
    ├── Hero.tsx             1 · daniel pls hire me
    ├── SoundDesign.tsx      2 · i also do sound
    ├── WebWork.tsx          3 · websites i've built
    ├── SlideDeck.tsx        4 · slide decks
    ├── ComparisonCard.tsx   5 · me vs. everyone else who applied
    ├── ProjectScroller.tsx  6 · my videos portfolio — full-bleed project rows
    ├── WhyMe.tsx            7 · why me
    ├── GraphicDesign.tsx    8 · ok fine, here's graphic design
    ├── DarkCTA.tsx          9 · what will it be?
    └── FadingLines.tsx      decorative vertical lines on the dark section
```

## The rule system

Every hairline on the page belongs to one grid. The page is a tinted `canvas`
with white `surface` cells sitting inside a centered **frame** (64rem) and a
wider outer **rail** (80rem). The frame and rail edges are 1px verticals that
run the full height of the viewport, straight through every section; horizontal
rules span the frame and terminate exactly on those verticals, forming clean
crosses.

Four tokens carry the whole thing — `--color-rule` (~7% black),
`--color-rule-strong` (~12%, emphasis only), `--container-frame`,
`--container-rail`. No component may reference a raw color for a rule. Dark mode
is a token swap on `.dark`, so nothing else has to know it exists.

**Which primitive do I reach for?**

| Situation | Use |
|---|---|
| The page's full-height verticals | `<RuleLayer />` — mount once, in `App` |
| A centered block that must line up with them | `<RuleFrame>` (or `<Section>`, which is one) |
| The boundary between stacked siblings | **Nothing.** Put `[&>*+*]:border-t [&>*+*]:border-rule` on their parent |
| A standalone line that isn't a sibling boundary | `<Rule />` — `variant="bleed"` for full viewport, `"inset"` for a gutter |
| A grid whose cells need seams | `<RuleGrid>` + the `ruleCell` class on each child |
| Faint texture behind a section | `<DotField />` |

Kitchen sink with all of it on one screen, plus a dark toggle: **`/#rules`**.

### The three ways this goes wrong

1. **Doubled seams.** Two elements drawing the same line renders it 2px — it
   reads as a darker, thicker line and it is the most common failure. Causes:
   `border` on every cell of a grid (use `RuleGrid`'s asymmetric borders, where
   the container draws `border-t border-l` and each cell draws `border-r
   border-b`); a child drawing `border-b` when its parent already draws
   `[&>*+*]:border-t`; `divide-y` combined with per-child borders. Note
   `divide-*` can never supply an outer edge, so if a block needs one, don't
   use `divide-*` at all.
2. **Misaligned verticals.** Every vertical must derive its x-position from
   `--container-frame` / `--container-rail`. A component that invents its own
   width will be a pixel or two off and the eye catches it instantly. The other
   cause is scrollbars: the fixed `RuleLayer` centers against the viewport while
   in-flow content centers against the content box, so `scrollbar-gutter: stable`
   on `html` is required, not cosmetic. `RuleLayer` also centers with `mx-auto`
   rather than `left-1/2 -translate-x-1/2` so it uses the identical algorithm to
   the content it must align with.
3. **Blurred sub-pixel lines.** Draw rules with real `border-*` utilities —
   never `h-px bg-*`, `box-shadow` spread, or `outline`. A 1px background box
   inside a transformed ancestor (this site rotates every `ColorSlab`) smears
   across two pixel rows or vanishes at some zoom levels. Borders snap. Real
   borders also survive `forced-colors: active`, which background-image lines
   do not.

## The two color systems

Don't mix them. `green` / `coral` / `yellow` are **semantic and interactive** —
links, buttons, the comparison card's column bars. The eight `pop-*` inks
(`pop-yellow`, `pop-mint`, `pop-pink`, `pop-coral`, `pop-violet`, `pop-blue`,
`pop-magenta`, `pop-lime`) are **decorative slab fills**, used through
`<Frame>` / `<ColorSlab>`. Body text never sits directly on a pop ink.

Within that decorative layer, the rule is: **photo fill means an image slot;
flat pop ink means everything else.** The five `<FeatureCard>`s that wrap a
`<Placeholder>` image slot (SoundDesign, the two WebWork cards, GraphicDesign,
SlideDeck) pass `image`/`imagePosition` to fill their `ColorSlab` with one of
the `public/images/texture-*.jpg` plates — `color` stays set on each as the
fallback shown while that photo is loading or if it fails. Everywhere else a
`Frame`/`ColorSlab` shows up — Hero, WhyMe's stats Frame, ComparisonCard —
there's no image slot behind it, so it stays flat pop ink with no `image`
prop at all. `Frame` itself still supports the `image`/`imagePosition` props,
it just has no current caller that needs them — every image-slot artifact on
the page now goes through `FeatureCard` instead, since it also owns the
title/description/CTA panel those five need above the slab.

`vibrant-textured-containers-spec.md` is the source for the torn/grain system,
with two deliberate overrides: it asks for `rounded-3xl`, and this site keeps its
global `border-radius: 0` and lets the torn clip-path be the imperfection; and
its hand-drawn "scribble" lines across each slab have been dropped entirely, so
the only lines on the page are the structural ones described above.

`DanielPlsHireMe_Layout_Spec.md` is the design spec. `CONTRACT.md` records the
token names and shared-component API the sections are built against.

## Before you ship

- **Images** — every slot is a dashed placeholder. See `public/images/README.md`.
- **Tegno** — done. Self-hosted at `public/fonts/Tegno.woff2` (22KB, with a `.ttf`
  fallback), wired via `@font-face` in `src/index.css`. Note the license:
  **freeware, non-commercial, personal use only** (`public/fonts/LICENSE.txt`).
  Fine for a personal portfolio; buy a license before any commercial use.
- **Links** — urnovafoodie and the slide-deck URL are still placeholders. Wahoops
  (`@wahoops_`) and the contact details are real.

## Deploy

Vercel autodetects Vite; `vercel.json` pins the build command and output
directory anyway. Push the repo and import it, or `npx vercel --prod`.
