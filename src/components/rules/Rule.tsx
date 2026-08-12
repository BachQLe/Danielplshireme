type RuleVariant = 'frame' | 'bleed' | 'inset'

type RuleProps = {
  /**
   * - `frame` (default): spans the frame, terminating on the frame verticals.
   * - `bleed`: spans the full viewport, ignoring the frame.
   * - `inset`: starts after a gutter on both sides.
   */
  variant?: RuleVariant
  /** `strong` (~12%) is for emphasis only — a table header underline, never an ordinary divider. */
  tone?: 'default' | 'strong'
  /**
   * A rule is decorative by default and renders as an aria-hidden `div`.
   * Pass `as="hr"` ONLY when the line marks a genuine thematic break in the
   * content, because `<hr>` is announced by screen readers.
   */
  as?: 'div' | 'hr'
  /** Gutter for `variant="inset"`, as a Tailwind px-* utility. */
  insetClassName?: string
  className?: string
}

const TONE = {
  default: 'border-rule',
  strong: 'border-rule-strong',
} as const

/**
 * A standalone horizontal hairline.
 *
 * Drawn with a real `border-t`, never `h-px bg-*`. A 1px background box is
 * subject to fractional layout — inside any transformed or scaled ancestor
 * (this codebase rotates every `ColorSlab`) it blurs across two rows of
 * pixels or disappears entirely at certain zoom levels. Borders snap.
 *
 * Reach for this only for a line that is NOT already a boundary between two
 * stacked blocks. Boundaries between siblings belong to the parent, via
 * `[&>*+*]:border-t border-rule` — see `App.tsx` and `Section`. Adding a
 * `Rule` at a boundary that the parent already draws is how you get a 2px
 * seam.
 */
export function Rule({
  variant = 'frame',
  tone = 'default',
  as: Tag = 'div',
  insetClassName = 'px-4 sm:px-6',
  className = '',
}: RuleProps) {
  const line = `border-0 border-t ${TONE[tone]}`
  const a11y = Tag === 'div' ? { 'aria-hidden': true as const } : {}

  if (variant === 'inset') {
    // The border has to live on a NESTED element. Padding on the bordered
    // element itself pads its content box — the border still runs the full
    // width, so an "inset" implemented with `px-*` insets nothing at all.
    return (
      <div aria-hidden="true" className={insetClassName}>
        <Tag {...a11y} className={`${line} ${className}`} />
      </div>
    )
  }

  if (variant === 'bleed') {
    // Escapes the frame to full viewport width. Requires `overflow-x: clip`
    // on an ancestor (set on `html` in index.css) — `w-screen` on a centered
    // child otherwise pushes the page into horizontal scroll.
    return (
      <Tag
        {...a11y}
        className={`relative left-1/2 w-screen -translate-x-1/2 ${line} ${className}`}
      />
    )
  }

  return <Tag {...a11y} className={`w-full ${line} ${className}`} />
}
