import type { ReactNode } from 'react'
import { ColorSlab } from './deco/ColorSlab'
import { PixelIcon } from './PixelIcon'

type FeatureCardProps = {
  title: string
  description: string
  /** Omit to render the card with no CTA button (e.g. a mockup with no
   *  single external link to send visitors to). */
  href?: string
  ctaLabel?: string
  seed: string
  color?: string
  image?: string
  imagePosition?: string
  rotate?: number
  /** Width and outer margin ONLY — see the comment on the `<article>` below
   *  for why nothing else belongs here. */
  className?: string
  /** Just the mockup, e.g. a `<Placeholder>`. */
  children: ReactNode
}

/**
 * One card container that owns the whole artifact block: a title / description
 * / CTA panel on top, and a torn, textured colour panel (screenshot mockup
 * inside) filling the bottom. Replaces the old `Frame` + loose-sibling-text
 * pattern — the title, description, chips and external link used to sit
 * outside the slab as scattered siblings; here the `<article>` owns all of it.
 *
 * `.paper` (the card shell's own class, see `index.css`) sets no
 * `border-radius` of its own, so `paper rounded-card` on the shell and
 * `paper rounded-mat` on the inner mat below are collision-free — nothing is
 * fighting over the same property. `overflow-hidden` also never clips an
 * element's *own* border or box-shadow (only descendants' paint), so the
 * shell keeps `.paper`'s hairline and shadow even while it clips the slab's
 * overscanned tear on three sides.
 */
export function FeatureCard({
  title,
  description,
  href,
  ctaLabel = 'learn more',
  seed,
  color,
  image,
  imagePosition,
  rotate = -1.5,
  className = '',
  children,
}: FeatureCardProps) {
  return (
    // className carries WIDTH AND OUTER MARGIN ONLY. FeatureCard deliberately
    // sets no max-w-* of its own so callers' existing max-w-3xl / max-w-lg /
    // max-w-2xl keep working unchanged. Baking a width into these base
    // classes AND accepting a caller max-w-* would be the exact
    // equal-specificity collision CONTRACT.md hard rule 0 documents (source
    // order, not attribute order, decides the winner) — whichever utility
    // the generated stylesheet happens to emit second would silently win.
    // For the same reason, do not pass a competing rounded-*, overflow-* or
    // bg-* through className either: this component already sets all three
    // on the shell and on the two panels below.
    <article className={`paper mx-auto w-full overflow-hidden rounded-card ${className}`}>
      {/* card top: title, description, badge/tag row, CTA — all above the slab */}
      <div className="bg-row-alt px-6 py-8 sm:px-9 sm:py-10">
        <h3 className="text-ink text-[1.375rem] font-bold">{title}</h3>
        <p className="text-muted mt-2 text-[0.875rem] font-medium">{description}</p>
        {/* bg-dark / text-dark-ink, NOT bg-ink / text-surface: --color-ink and
            --color-surface both flip inside the .dark block (index.css:114-130
            at the time this was written), which would invert this button into
            a light pill on a dark page. --color-dark (#141414) and
            --color-dark-ink (#fff) are absent from that block, so they're the
            invariant pair for a surface that must stay dark regardless of
            page theme — DarkCTA.tsx:21 already reaches for bg-dark for this
            exact reason. */}
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-cta bg-dark px-5 py-2.5 text-[0.875rem] font-bold text-dark-ink transition-colors duration-150 hover:bg-dark-card"
          >
            {ctaLabel}
            <PixelIcon name="arrow-up-right" size={10} />
          </a>
        ) : null}
      </div>

      {/* card bottom: torn colour panel behind the mockup mat. bg-row-alt here
          MUST stay identical to the bg-row-alt on the top panel above: a
          negative-z child paints ABOVE its own stacking-context parent's
          background (not behind the page below the parent), so the slab's
          torn notches reveal THIS div's fill, not whatever is further back.
          If the two panels' backgrounds ever drift apart, the tear stops
          reading as one continuous seam and gets a visible colour ring where
          the notches cut through. */}
      <div className="relative isolate overflow-hidden bg-row-alt px-3 pt-5 pb-4 sm:px-5 sm:pt-7 sm:pb-5">
        {/* isolate here is load-bearing for the same reason as Frame.tsx's:
            a `relative` element with `z-index: auto` does not itself create a
            stacking context, so without `isolate` the slab's `-z-10` would
            escape past THIS div and paint behind the nearest ancestor
            stacking context instead — on this page, behind the enclosing
            Section's opaque bg-canvas/bg-surface, hiding the slab entirely
            with no typecheck or console error. That still holds even though,
            unlike Frame's wrapper, this div also paints its own opaque
            bg-row-alt: the background alone doesn't create a stacking
            context, only `isolate` (or `position` + non-auto `z-index`) does.
            (Independent of ColorSlab's own `isolate`, which contains its
            mix-blend-mode texture layers — both are needed.) */}
        {/* Wrapper is pinned at top-0, NOT inset upward, and overscans past
            the panel by inset-x-[-7%] / bottom-[-9%]. Both numbers come
            straight from tornPolygon() (noise.ts:47-62):
            - Every edge vertex is offset by `o`, |o| <= jitter (1.6, the
              default). The top edge is emitted as `[t*100, 0 + o]` — a
              NEGATIVE `o` would put that vertex above the box, but an
              element paints nothing outside its own bounds, so the vertex
              just flattens to the box edge instead of bulging out. The tear
              only ever bites INWARD. That means top-0 already shows the
              full intended zigzag; nudging to top-[-2%] would be strictly
              worse, slicing through the polygon's interior below the
              deepest possible 1.6% notch and rendering a flat line instead
              of teeth.
            - The other three edges tear the same way, so they're left to the
              panel's own `overflow-hidden` to eat — which is why this
              wrapper overscans past the panel on those three sides, clearing
              worst case `1.6% x slabDimension` (the bite) plus
              `(perpendicular/2) x sin(2.5deg)` (the rotation swing, capped
              by ColorSlab's rotate prop) plus a couple px of antialiasing.
              Across the five feature cards' aspect ratios that peaks near
              4.5% horizontal / 6.3% vertical, and inset-x-[-7%] / bottom-
              [-9%] clears both with margin.
            - The axes work OPPOSITE to intuition: the portrait card needs
              MORE horizontal overscan than the landscape ones, because the
              rotation-swing term scales with the slab's HEIGHT, not its
              width. A future card with a more extreme aspect ratio must
              re-derive this — going short fails silently as a jagged sliver
              poking past the card's rounded edge, no error anywhere. */}
        <div className="absolute inset-x-[-7%] top-0 bottom-[-9%] -z-10">
          <ColorSlab
            seed={seed}
            color={color}
            image={image}
            imagePosition={imagePosition}
            rotate={rotate}
            className="h-full w-full"
          />
        </div>
        <div className="rounded-card bg-surface/55 p-1.5">
          <div className="paper rounded-mat p-1">{children}</div>
        </div>
      </div>
    </article>
  )
}
