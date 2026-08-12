import type { CSSProperties, ReactNode } from 'react'
import { IconBadge } from './Accent'
import type { PixelIconName } from './PixelIcon'

type SectionProps = {
  /**
   * `surface` paints the white content cell. `canvas` stays transparent so the
   * page tint shows through — the section then reads as gutter rather than as
   * content, which is the whole light/dark rhythm of the page.
   */
  tone?: 'canvas' | 'surface'
  /** Vertical rhythm. Matches the spec's py-20 / py-16 / py-28 calls. */
  padding?: 'lg' | 'md' | 'xl'
  /** Anchor id, for the rare in-page link. */
  id?: string
  className?: string
  children: ReactNode
}

const toneClass = {
  canvas: 'bg-transparent',
  surface: 'bg-surface',
} as const

const paddingClass = {
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-28',
} as const

/**
 * A page section: a frame-width cell sitting inside the rule grid, so its
 * left and right edges land exactly on the frame verticals that `RuleLayer`
 * draws behind the page.
 *
 * A section DOES NOT draw its own boundary rule. The parent does, with
 * `[&>*+*]:border-t border-rule` (see `App.tsx`). That's deliberate: a
 * section that draws its own `border-b` has to know whether it's the last one
 * — and the moment two adjacent blocks each think they own the seam, the line
 * renders 2px. Letting the parent own every boundary makes the position
 * question disappear.
 */
export function Section({
  tone = 'canvas',
  padding = 'lg',
  id,
  className = '',
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-frame px-4 sm:px-6 ${toneClass[tone]} ${paddingClass[padding]} ${className}`}
    >
      {children}
    </section>
  )
}

/** Section title — Figtree 800, left-aligned. Pass `icon` to lead with a green IconBadge. */
export function SectionTitle({
  children,
  icon,
}: {
  children: ReactNode
  icon?: PixelIconName
}) {
  if (!icon) {
    return (
      <h2 className="text-ink text-[2rem] leading-tight font-extrabold tracking-tight">
        {children}
      </h2>
    )
  }
  return (
    <div className="flex items-center gap-3">
      <IconBadge icon={icon} accent="green" surface="wash" />
      <h2 className="text-ink text-[2rem] leading-tight font-extrabold tracking-tight">
        {children}
      </h2>
    </div>
  )
}

/** The playful pixel subtitle. Always small, always muted. */
export function PixelNote({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  /** Escape hatch for colour: a `text-*` class passed via `className` loses to
   *  the `text-muted` below at equal specificity, so recolour inline. */
  style?: CSSProperties
}) {
  return (
    <p
      style={style}
      className={`font-pixel text-muted text-[10px] leading-[1.8] ${className}`}
    >
      {children}
    </p>
  )
}
