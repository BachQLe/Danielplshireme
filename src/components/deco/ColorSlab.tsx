import type { CSSProperties, ReactNode } from 'react'
import { tornPolygon } from '../../lib/noise'

type ColorSlabProps = {
  /** Seed for the torn-edge polygon. Vary per instance so no two slabs tear alike. */
  seed: string
  /** Any Tailwind `bg-*` utility. One flat pop color — never two on one slab. */
  color?: string
  /** Public path, e.g. "/images/texture-bar.jpg". Fills the slab with a photo
   *  instead of leaving the flat pop ink exposed. `color` stays on underneath as
   *  the fallback for a slow or failed load. */
  image?: string
  /** CSS background-position, only meaningful with `image`. Defaults to
   *  'center' for a specific reason: only a ~45-80px RING of the slab is ever
   *  visible — the opaque `.paper` card covers the middle. The plates are
   *  ~316x420 portrait, `cover`-cropped into this landscape box, so `center`
   *  puts the most readable part of each photo exactly where the card hides
   *  it. Per-instance positions push the interesting part of the plate out
   *  into the visible ring instead. */
  imagePosition?: string
  /** Degrees. Spec caps this at ±2.5deg — past that it stops reading as intentional. */
  rotate?: number
  /** Swaps the texture pairing to blotch + halftone. See the comment below for why. */
  halftone?: boolean
  className?: string
  children?: ReactNode
}

/**
 * The workhorse: a torn, textured, rotated block of flat color. Behind
 * content in `Frame`, but usable standalone anywhere a loud color patch is
 * needed.
 *
 * `rotate` is expected to stay within ±2.5deg (the spec's cap — beyond that
 * the tilt reads as a bug, not a design choice). Not enforced at runtime;
 * just don't pass anything wilder than that.
 *
 * DO NOT pass a position utility (`absolute`, `fixed`) through `className`.
 * The base classes below include `relative`, and Tailwind emits `.absolute`
 * before `.relative`, so at equal specificity `relative` wins regardless of
 * the order you write them in the attribute — the slab collapses to
 * `height: 0` and vanishes with no error anywhere. To place a slab behind
 * content, position a WRAPPER div and give the slab `h-full w-full`, the way
 * `Frame` does.
 */
export function ColorSlab({
  seed,
  color = 'bg-pop-yellow',
  image,
  imagePosition = 'center',
  rotate = -1.5,
  halftone = false,
  className = '',
  children,
}: ColorSlabProps) {
  // `tex-grain` and `tex-halftone` both paint onto `::after`, so combining
  // them means one silently overwrites the other's background-image. Rather
  // than let that fight happen, halftone REPLACES grain instead of stacking
  // on top of it: halftone on -> tex-blotch + tex-halftone (no tex-grain);
  // halftone off -> tex-grain + tex-blotch, the default pairing. This also
  // keeps every slab at exactly two texture utilities, per the spec's cap.
  const textureClasses = halftone ? 'tex-blotch tex-halftone' : 'tex-grain tex-blotch'

  const style: CSSProperties = {
    clipPath: tornPolygon(seed),
    transform: `rotate(${rotate}deg)`,
    // Scopes paint/layout invalidation to this box so scrolling past a page
    // full of slabs doesn't force the browser to repaint everything else.
    contain: 'paint',
    // Only spread these in when `image` is set: keeps the no-image render
    // path free of stray `backgroundImage: undefined` keys and byte-identical
    // to how this component rendered before photo fills existed.
    ...(image && {
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: imagePosition,
      // Only a thin ring of the plate ever shows past the opaque mat (see
      // `imagePosition` doc above), so it reads as a decorative texture, not
      // a photo — push the saturation up and soften it a touch so it pops as
      // color rather than reading as a dim, literal photo.
      filter: 'saturate(0.9) brightness(1.5) blur(2px)',
    }),
  }

  return (
    // `isolate` pins a new stacking context so the `::before`/`::after`
    // blend layers (mix-blend-mode: multiply) only blend with this slab's
    // own fill, not with whatever sits behind or beside it on the page.
    <div
      className={`relative isolate overflow-hidden ${textureClasses} ${color} ${image ? 'tex-photo ' : ''}${className}`}
      style={style}
    >
      {/* Colorizes the photo plate with this slab's own `color` — each
          image-filled card already passes a distinct pop ink (pink, mint,
          blue, magenta, coral, ...), so the tint alternates card to card for
          free instead of every plate reading the same hue. `color` blend
          mode takes the ink's hue/saturation and keeps the photo's own
          luminosity, so it reads as a tint over the plate rather than a flat
          wash; the div's own opacity (not the ink's alpha) controls how
          strong that tint is, same trick as the texture layers above. Scoped
          to `image` only — flat pop-ink slabs elsewhere on the page (Hero,
          DarkCTA) are untouched. */}
      {image && (
        <div
          className={`pointer-events-none absolute inset-0 ${color}`}
          style={{ mixBlendMode: 'color', opacity: 0.6 }}
        />
      )}
      {children}
    </div>
  )
}
