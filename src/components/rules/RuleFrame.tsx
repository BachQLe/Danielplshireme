import type { ElementType, ReactNode } from 'react'

type RuleFrameProps = {
  /** Rendered element. `section`/`header`/`footer` when the frame IS the landmark. */
  as?: ElementType
  id?: string
  className?: string
  children: ReactNode
}

/**
 * The centered content wrapper. Anything inside it lines up with the frame
 * verticals drawn by `RuleLayer`, and any horizontal `Rule` inside it
 * terminates exactly on them.
 *
 * Named `RuleFrame`, not `Frame`, because `deco/Frame.tsx` already owns that
 * name — that one is the torn color-slab container, an unrelated decoration.
 *
 * NEVER give this `overflow-hidden`. Content is allowed to bleed past the
 * frame's right edge (the project rows, the bleeding card row) and only the
 * viewport should clip it. If a specific subtree genuinely needs clipping,
 * put `overflow-x-clip` on that subtree — `hidden` turns the element into a
 * scroll container and breaks `position: sticky` inside it.
 */
export function RuleFrame({
  as: Tag = 'div',
  id,
  className = '',
  children,
}: RuleFrameProps) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-frame ${className}`}>
      {children}
    </Tag>
  )
}
