import type { ReactNode } from 'react'
import { ColorSlab } from './ColorSlab'

type FrameProps = {
  /** Seed for the color slab's torn edge. */
  seed: string
  /** Any Tailwind `bg-*` utility, forwarded to `ColorSlab`. */
  color?: string
  /** Public path, forwarded to `ColorSlab`. Once set, `color` stops being the
   *  visible fill and becomes only the fallback shown during a slow/failed load. */
  image?: string
  /** CSS background-position, forwarded to `ColorSlab`. See `ColorSlab` for why
   *  the default ('center') matters — only a thin ring of the slab is visible
   *  past the `.paper` card it sits behind. */
  imagePosition?: string
  /** Degrees, forwarded to `ColorSlab`. Keep within ±2.5deg. */
  rotate?: number
  /** The screenshot / media / text that sits on top of the color slab. */
  children: ReactNode
  className?: string
}

/**
 * The composed container pages actually import: neutral content sitting
 * above a torn, textured color slab.
 *
 * ```tsx
 * <Frame seed="community" color="bg-pop-yellow" rotate={-1.5}>
 *   <img src="/shots/community.png" alt="" className="w-full shadow-2xl" />
 * </Frame>
 * ```
 *
 * The `image`/`imagePosition` path above still exists on this component —
 * they're forwarded straight to `ColorSlab` — but every current caller
 * pairing a torn slab with a photo fill and a screenshot mockup uses
 * `FeatureCard` instead, which owns the title/description/CTA panel on
 * top of the same slab. Reach for `FeatureCard` for that shape; `Frame`
 * stays for flat pop ink sitting behind plain content (WhyMe's stats),
 * where there's no image slot and no card panel to speak of. See
 * `FeatureCard` for the photo-fill example.
 *
 * `color` still needs to be set even when `image` is: it's the fill shown
 * while the photo is loading (or if it fails to), not just an unused prop.
 *
 * Two things callers must vary between instances:
 * - `seed` — give every `Frame` a unique seed so no two torn edges come out
 *   looking identical.
 * - `rotate` — alternate the sign as you go down the page (`-1.5`, `+2`,
 *   `-1`, `+1.5`, ...) so the tilts read as handmade rather than a
 *   uniformly skewed grid.
 */
export function Frame({
  seed,
  color,
  image,
  imagePosition,
  rotate = -1.5,
  children,
  className = '',
}: FrameProps) {
  return (
    // overflow-visible is load-bearing: the ColorSlab wrapper below overhangs
    // this box on all sides (`inset-x-[-2%] inset-y-[6%]`) so the torn edge
    // reads past the content bounds. `overflow-hidden` is the instinctive
    // thing to reach for on a wrapper like this, but it would silently clip
    // that overhang right at the boundary and the slab would lose its
    // bleed without any visible error.
    //
    // isolate is ALSO load-bearing here, for a separate reason: a `relative`
    // element with `z-index: auto` does not create a stacking context, so
    // without `isolate` the ColorSlab's `-z-10` would paint behind the
    // nearest ancestor stacking context instead of behind just this Frame —
    // which on this site means behind the enclosing Section's opaque
    // bg-canvas/bg-surface background. The slab would be fully hidden with no
    // typecheck or console error to catch it. `isolate` scopes a stacking
    // context to this wrapper so `-z-10` is contained within it: the slab
    // paints above the section background but still below the content.
    // (This is independent of ColorSlab's own `isolate`, which exists to
    // contain its mix-blend-mode texture layers — both are needed.)
    <div className={`relative isolate overflow-visible ${className}`}>
      {/* The slab is positioned by this WRAPPER, never by a class passed into
          ColorSlab. ColorSlab's own base classes include `relative`, and
          Tailwind emits `.absolute` before `.relative`, so an `absolute`
          passed through className loses the cascade at equal specificity —
          the slab silently becomes position:relative with height:0 and
          disappears. Positioning the wrapper sidesteps the collision. */}
      <div className="absolute inset-x-[-2%] inset-y-[6%] -z-10">
        <ColorSlab
          seed={seed}
          color={color}
          image={image}
          imagePosition={imagePosition}
          rotate={rotate}
          className="h-full w-full"
        />
      </div>
      <div className="relative z-10 p-6 sm:p-10">{children}</div>
    </div>
  )
}
