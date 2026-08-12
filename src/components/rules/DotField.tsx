import type { CSSProperties } from 'react'

type DotFieldProps = {
  /** Direction the field fades out toward. */
  fade?: 'to bottom' | 'to top' | 'to right' | 'to left'
  className?: string
}

/**
 * The faint dot-grid background: a 16px tile of `rule-strong` dots, masked so
 * it fades out toward one edge.
 *
 * Absolutely positioned and `aria-hidden` — drop it into any `relative`
 * parent as the first child. It sits at `z-0`; give the content beside it
 * `relative z-10` so text never fights the grid.
 *
 * The dots are a `background-image`, so unlike the rules themselves they do
 * NOT survive `forced-colors: active`. That's the correct trade for texture:
 * structure is drawn with real borders precisely so it survives, and this
 * layer is allowed to drop away.
 */
export function DotField({ fade = 'to bottom', className = '' }: DotFieldProps) {
  return (
    <div
      aria-hidden="true"
      className={`dot-field pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{ '--dot-fade': fade } as CSSProperties}
    />
  )
}
