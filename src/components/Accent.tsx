import type { ReactNode } from 'react'
import { PixelIcon, type PixelIconName } from './PixelIcon'

/**
 * Semantic accent primitives — green / coral / yellow used as meaningful
 * color (a stat, a highlight, a labeled callout), always through one of
 * the solid / wash / outline surfaces below.
 *
 * This is a SEPARATE system from `deco/ColorSlab.tsx` and the `pop-*`
 * palette: pop-* inks are decorative torn-paper slab fills with no meaning
 * attached to the color itself. This file's greens/corals/yellows always
 * mean something. Never mix the two systems on one element.
 */

type Accent = 'green' | 'coral' | 'yellow'
type Surface = 'solid' | 'wash' | 'outline'

// Tailwind v4 scans source text for complete class names, so every string
// below has to be spelled out literally — building one with `bg-${accent}`
// would never make it into the generated CSS and the element would render
// unstyled.
const ACCENT_SURFACE: Record<Accent, Record<Surface, string>> = {
  green: {
    solid: 'bg-green text-ink',
    wash: 'bg-green-wash text-green border border-green/30',
    outline: 'bg-transparent text-green border border-green',
  },
  coral: {
    solid: 'bg-coral text-ink',
    wash: 'bg-coral-wash text-coral border border-coral/30',
    outline: 'bg-transparent text-coral border border-coral',
  },
  yellow: {
    solid: 'bg-yellow text-ink',
    wash: 'bg-yellow-wash text-yellow border border-yellow/30',
    outline: 'bg-transparent text-yellow border border-yellow',
  },
} as const

/** A small square icon tile — sits beside a heading, list item, or label. */
export function IconBadge({
  icon,
  accent = 'green',
  surface = 'wash',
  label,
  size = 16,
  className = '',
}: {
  icon: PixelIconName
  accent?: Accent
  surface?: Surface
  /** When set, the icon carries meaning and gets this as its accessible name. Leave unset for a purely decorative badge. */
  label?: string
  size?: number
  className?: string
}) {
  return (
    <span
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center ${ACCENT_SURFACE[accent][surface]} ${className}`}
    >
      <PixelIcon name={icon} size={size} title={label} />
    </span>
  )
}

/** A padded callout for a sentence or two, optionally headed by a pixel-type eyebrow. */
export function AccentBlock({
  accent = 'green',
  surface = 'wash',
  icon,
  eyebrow,
  children,
  className = '',
}: {
  accent?: Accent
  surface?: Surface
  icon?: PixelIconName
  /** Small Press Start 2P label above the content. The icon (if given) only renders alongside this. */
  eyebrow?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`p-4 ${ACCENT_SURFACE[accent][surface]} ${className}`}>
      {eyebrow && (
        <p className="text-muted mb-2 flex items-center gap-1.5 font-pixel text-[8px] uppercase">
          {icon && <PixelIcon name={icon} size={10} />}
          {eyebrow}
        </p>
      )}
      {children}
    </div>
  )
}
