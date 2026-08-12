import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DotField } from './DotField'
import { Rule } from './Rule'
import { RuleFrame } from './RuleFrame'
import { RuleGrid } from './RuleGrid'
import { ruleCell } from './ruleCell'
import { RuleLayer } from './RuleLayer'

/**
 * Numbered heading for one of the 11 demonstrated blocks below. Kept as a
 * tiny local component (not exported — this file owns exactly one public
 * export, `RuleKitchenSink`) so every block gets the same label treatment
 * and the page stays self-documenting without repeating markup 11 times.
 */
function DemoHeading({ n, title }: { n: number; title: string }) {
  return (
    <div className="px-4 pt-16 pb-4 first:pt-8 sm:px-6">
      <p className="font-pixel text-muted text-[10px] tracking-wide uppercase">
        {String(n).padStart(2, '0')} / 11
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight">{title}</h2>
    </div>
  )
}

/** Small explanatory note under/around a demoed primitive. */
function DemoCaption({ children }: { children: ReactNode }) {
  return <p className="text-muted px-4 py-3 text-sm sm:px-6">{children}</p>
}

const filledCells = [
  { label: 'Frame width', value: '64rem — max-w-frame' },
  { label: 'Rail width', value: '80rem — max-w-rail' },
  { label: 'Rule alpha', value: '7% black / 9% white' },
  { label: 'Rule-strong alpha', value: '12% black / 14% white' },
  { label: 'Dot tile', value: '16px, 1px dot' },
  { label: 'Corner radius', value: '0 — no exceptions' },
]

// Deliberately 5 items in a 3-column grid: the last row (2 of 3 columns)
// is where the `ragged` technique earns its keep — see block 05 below.
const raggedCells = [
  { label: 'RuleLayer', value: 'frame + rail verticals' },
  { label: 'RuleFrame', value: 'centered content wrapper' },
  { label: 'Rule', value: 'frame / bleed / inset' },
  { label: 'RuleGrid', value: 'default / ragged seams' },
  { label: 'DotField', value: 'faded dot texture' },
]

const tableRows = [
  { project: 'Bloom Skincare — Launch Film', type: 'Video edit', turnaround: '3 days', status: 'Delivered' },
  { project: 'Northwind SaaS — Explainer', type: 'Motion graphics', turnaround: '5 days', status: 'Delivered' },
  { project: 'Atlas Fitness — Ad Set (x6)', type: 'Short-form edit', turnaround: '2 days', status: 'In review' },
  { project: 'Fernweg Travel — Brand Deck', type: 'Slide deck', turnaround: '4 days', status: 'Delivered' },
  { project: 'Solace Audio — Sound Design', type: 'Sound design', turnaround: '1 day', status: 'Delivered' },
]

const bleedCards = [
  'Bloom Skincare',
  'Northwind SaaS',
  'Atlas Fitness',
  'Fernweg Travel',
  'Solace Audio',
  'Harbor & Co.',
]

/**
 * Full-page demo of every structural-rule primitive, so the hairline system
 * can be eyeballed in one scroll instead of hunting through the real pages
 * it eventually gets threaded into. Lives at `/#rules` — see `main.tsx`.
 */
export function RuleKitchenSink() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Tailwind's `dark` variant is registered as `&:where(.dark, .dark *)`
    // (see index.css) — it matches on an ANCESTOR class, not a media query
    // or component prop. `document.documentElement` (i.e. `<html>`) is the
    // one ancestor common to literally everything the page renders,
    // including the fixed `RuleLayer` (which lives outside this component's
    // own subtree via `position: fixed`), so it's the only element that can
    // flip every token consumer at once.
    document.documentElement.classList.toggle('dark', isDark)
    return () => {
      // Belt-and-suspenders: main.tsx forces a full reload on hash change,
      // which already wipes this class, but an effect that cleans up after
      // itself is correct in isolation too and costs nothing.
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className="bg-canvas text-ink min-h-screen">
      {/* Mounted exactly once per page, as required — see block 01 below. */}
      <RuleLayer />

      <button
        type="button"
        onClick={() => setIsDark((d) => !d)}
        className="border-rule bg-surface fixed top-4 right-4 z-50 border px-3 py-1.5 font-sans text-sm font-semibold"
      >
        {isDark ? 'Light mode' : 'Dark mode'}
      </button>

      <RuleFrame className="pb-32">
        <header className="px-4 pt-8 sm:px-6">
          <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight">
            Rule kitchen sink
          </h1>
          <p className="text-muted mt-2 max-w-prose">
            Every hairline primitive, on one page, so the lines can be checked by eye — in both
            themes, and at both narrow and wide viewports.
          </p>
        </header>

        {/* 01 — RuleLayer. No demo element of its own: it's the fixed layer
            behind this entire page. The two continuous verticals framing
            every block below (and the outer pair further out, at the rail
            width) are it. */}
        <DemoHeading n={1} title="RuleLayer — frame & rail verticals" />
        <DemoCaption>
          Mounted once, at the top of this component. Fixed, aria-hidden, `-z-10`. The vertical
          lines running the full height of the page — the inner pair tight around this text, the
          outer pair further out — are drawn by it, not by any of the blocks below.
        </DemoCaption>

        {/* 02 — the toggle. Also lives outside this flow (fixed top-right);
            called out here rather than duplicated. */}
        <DemoHeading n={2} title="Light / dark toggle" />
        <DemoCaption>
          Top-right corner of the viewport. Toggles the `dark` class on `&lt;html&gt;`, which
          flips every `--color-*` token in index.css — rules, surfaces, and text all invert
          together because every primitive on this page reads from those tokens and none of them
          hardcode a color.
        </DemoCaption>

        {/* 03 — stacked sections, parent-owned boundary. No horizontal
            padding on this wrapper: it has to span the FULL frame width so
            its bg-surface fill and the crossing rules reach the frame
            verticals exactly, the way RuleLayer's own comment describes. */}
        <DemoHeading n={3} title="Stacked sections — crossing horizontals" />
        <div className="[&>*+*]:border-t [&>*+*]:border-rule">
          <div className="bg-surface p-8">
            <h3 className="text-lg font-bold">Discovery</h3>
            <p className="text-muted mt-2">
              Scope, references, and turnaround land in writing before a single frame is cut.
            </p>
          </div>
          <div className="bg-surface p-8">
            <h3 className="text-lg font-bold">Edit</h3>
            <p className="text-muted mt-2">
              First cut goes out within the agreed window, with a changelist attached.
            </p>
          </div>
          <div className="bg-surface p-8">
            <h3 className="text-lg font-bold">Delivery</h3>
            <p className="text-muted mt-2">
              Final export, plus source project files, handed off in one package.
            </p>
          </div>
        </div>
        <DemoCaption>
          The boundary between sections is owned by the parent (`[&amp;&gt;*+*]:border-t
          border-rule`), not by a `border-b` on each child — see the class on the wrapper div
          above. Each horizontal terminates exactly on the frame verticals either side, forming a
          clean cross with no gap and no doubled line.
        </DemoCaption>

        {/* 04 — fully filled grid: 6 cells, 3 columns, 2 complete rows. The
            default (non-ragged) technique is enough here because there's no
            partial trailing row to close. */}
        <DemoHeading n={4} title="RuleGrid — fully filled" />
        <RuleGrid cols="grid-cols-3">
          {filledCells.map((cell) => (
            <div key={cell.label} className={`${ruleCell.default} p-6`}>
              <p className="text-muted text-xs tracking-wide uppercase">{cell.label}</p>
              <p className="mt-1 text-lg font-semibold">{cell.value}</p>
            </div>
          ))}
        </RuleGrid>
        <DemoCaption>
          Each cell carries `ruleCell.default` (`border-r border-b`); the grid itself closes the
          top and left edges. No cell duplicates a seam its neighbour already draws.
        </DemoCaption>

        {/* 05 — ragged grid: 5 cells in 3 columns, so the last row only
            fills 2 of 3 slots. */}
        <DemoHeading n={5} title="RuleGrid — ragged" />
        <RuleGrid ragged cols="grid-cols-3">
          {raggedCells.map((cell) => (
            <div key={cell.label} className={`${ruleCell.ragged} p-6`}>
              <p className="text-muted text-xs tracking-wide uppercase">{cell.label}</p>
              <p className="mt-1 text-lg font-semibold">{cell.value}</p>
            </div>
          ))}
        </RuleGrid>
        <DemoCaption>
          Five items in a three-column grid — the last row has a gap where a sixth cell would go.
          The default technique would leave that corner open, because nothing exists there to
          draw a closing edge. `ragged` flips which edges each cell owns (`border-l border-t`,
          pulled 1px via negative margin onto its neighbour's line) so the GRID's own
          `border-r border-b` closes the outer box regardless of how the last row fills in.
        </DemoCaption>

        {/* 06 — bleed rule. */}
        <DemoHeading n={6} title="Rule variant=&quot;bleed&quot;" />
        <DemoCaption>
          The line below ignores the frame entirely and runs to both edges of the viewport. That
          only works because `html` has `overflow-x: clip` set in index.css — without it, a
          `w-screen` child of a centered container pushes the whole page into horizontal scroll.
        </DemoCaption>
        <Rule variant="bleed" />
        <DemoCaption>Full-viewport width, not frame width — compare it to block 07 below.</DemoCaption>

        {/* 07 — inset rule. */}
        <DemoHeading n={7} title="Rule variant=&quot;inset&quot;" />
        <Rule variant="inset" />
        <DemoCaption>
          Starts after a gutter on both sides (`px-4 sm:px-6` by default) instead of running the
          full frame width. The gutter has to live on a wrapper around the line, not as padding on
          the line itself — padding insets a box's content, but a border still runs the box's full
          width.
        </DemoCaption>

        {/* 08 — DotField. Needs a `relative` parent with the field as the
            first child and any real content given `relative z-10` so it
            stacks above the (absolutely positioned) dots. */}
        <DemoHeading n={8} title="DotField" />
        <div className="border-rule relative flex h-56 flex-col items-center justify-center gap-1 border-y">
          <DotField fade="to bottom" />
          <p className="text-muted relative z-10 font-pixel text-[10px] tracking-wide uppercase">
            fade=&quot;to bottom&quot;
          </p>
          <p className="text-muted relative z-10 max-w-xs px-4 text-center text-sm">
            A 16px dot tile in `rule-strong`, masked so it thins out toward the bottom edge.
          </p>
        </div>
        <DemoCaption>
          Decorative texture, not structure — unlike the border-drawn rules elsewhere on this page
          it's a `background-image`, so it will NOT survive `forced-colors: active`. That's the
          intended trade: structure is drawn with real borders precisely so it survives; texture is
          allowed to drop away.
        </DemoCaption>

        {/* 09 — bleeding card row. No horizontal padding on this wrapper —
            its left edge has to sit exactly on the frame's left edge, which
            it inherits for free from being an ordinary block child of
            RuleFrame's `mx-auto max-w-frame` box. The negative right margin
            then widens the box past the frame's right edge and past the
            viewport; `RuleFrame` deliberately never sets `overflow-hidden`
            (see its own file comment) so nothing upstream clips it, and
            `html`'s `overflow-x: clip` absorbs the overflow without adding a
            scrollbar. `-50vw` is a generous overshoot — the actual gap
            between the frame's right edge and the viewport's right edge is
            at most half the viewport width, so this always reaches past it
            regardless of viewport size. */}
        <DemoHeading n={9} title="Card row bleeding past the frame edge" />
        <div className="-mr-[50vw] flex gap-4 pb-2">
          {bleedCards.map((name) => (
            <div key={name} className="border-rule bg-surface w-[280px] shrink-0 border p-4">
              <p className="font-semibold">{name}</p>
              <p className="text-muted mt-1 text-sm">Case study card, fixed width, non-shrinking.</p>
            </div>
          ))}
        </div>
        <DemoCaption>
          Six 280px cards in a non-wrapping flex row start flush with the frame's left edge and
          run off the right side of the viewport with no scrollbar and no clipping by the frame
          itself.
        </DemoCaption>

        {/* 10 — table with a rule-strong header underline. */}
        <DemoHeading n={10} title="Table — rule-strong header underline" />
        <table className="bg-surface w-full border-collapse text-left">
          <thead>
            <tr className="border-rule-strong border-b">
              <th className="text-muted px-6 py-3 text-xs font-semibold tracking-wide uppercase">
                Project
              </th>
              <th className="text-muted px-6 py-3 text-xs font-semibold tracking-wide uppercase">
                Type
              </th>
              <th className="text-muted px-6 py-3 text-xs font-semibold tracking-wide uppercase">
                Turnaround
              </th>
              <th className="text-muted px-6 py-3 text-xs font-semibold tracking-wide uppercase">
                Status
              </th>
            </tr>
          </thead>
          {/* Same parent-owned pattern as block 03, applied to table rows:
              the tbody draws every seam between rows once, instead of each
              row drawing a border-b it can't know is or isn't the last. */}
          <tbody className="[&>*+*]:border-t [&>*+*]:border-rule">
            {tableRows.map((row) => (
              <tr key={row.project}>
                <td className="px-6 py-3">{row.project}</td>
                <td className="px-6 py-3">{row.type}</td>
                <td className="px-6 py-3">{row.turnaround}</td>
                <td className="px-6 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <DemoCaption>
          The header underline uses `tone="strong"` (`border-rule-strong`, ~12% alpha) — still a
          single-pixel border, just a darker one. A thicker border would break the page's one
          hairline weight; `strong` is the only sanctioned way to emphasize a line.
        </DemoCaption>

        {/* 11 — a card occluding a rule. The Rule sits absolutely at the
            vertical center of the padded box; the card is a later sibling
            with `relative z-10` and an OPAQUE bg-surface fill, so normal
            stacking order plus opacity means it paints over the segment of
            the line behind it rather than the line crossing visibly through
            it — the same occlusion story RuleLayer's own comment describes
            for any opaque cell that crosses a rule. */}
        <DemoHeading n={11} title="A card occluding a rule" />
        <div className="relative py-16">
          <Rule variant="frame" className="absolute top-1/2 right-0 left-0" />
          <div className="border-rule bg-surface relative z-10 mx-auto w-72 border p-5 text-center">
            <p className="font-semibold">This card cuts the line</p>
            <p className="text-muted mt-1 text-sm">
              Opaque surface, stacked above the rule — not crossed by it.
            </p>
          </div>
        </div>
        <DemoCaption>
          Without the card, the horizontal line above would run uninterrupted across this whole
          block. The card is opaque and stacks above it, so the segment behind the card is simply
          not painted — this is the same mechanism `RuleLayer`'s own comment describes for any
          content cell that crosses a rule.
        </DemoCaption>
      </RuleFrame>
    </div>
  )
}
