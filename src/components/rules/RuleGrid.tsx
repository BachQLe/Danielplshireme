import type { ReactNode } from 'react'

type RuleGridProps = {
  /** Tailwind grid-template utility, e.g. "grid-cols-1 sm:grid-cols-3". */
  cols?: string
  /**
   * Switches the seam technique. See the block comment below — short version:
   * `false` (default) leaves a ragged trailing edge when the last row is
   * partially filled; `true` closes the grid's outer box instead.
   */
  ragged?: boolean
  className?: string
  children: ReactNode
}

/**
 * A grid whose cells are separated by single-width hairlines at every
 * intersection.
 *
 * THE ONE RULE: never put `border` on every cell. Adjacent cells then each
 * draw the shared seam and it renders 2px — visibly darker and thicker than
 * the rest of the page's lines, which is the single most common way a rule
 * grid goes wrong. Both techniques below draw each seam exactly once.
 *
 * DEFAULT — asymmetric borders:
 *   container draws `border-t border-l`, every cell draws `border-r border-b`.
 *   Each seam is owned by the cell above/left of it; the container closes the
 *   opening edges. Simple, and nothing overlaps.
 *   Caveat: if the last row is partially filled, the cells that exist draw
 *   their own right/bottom edges but there is nothing to close the row, so the
 *   grid's bottom-right reads as ragged.
 *
 * `ragged` — negative-margin overlap:
 *   every cell draws `border-l border-t` and pulls itself 1px left and up
 *   (`-ml-px -mt-px`) so its edge lands ON its neighbour's rather than beside
 *   it; the container closes with `border-r border-b`. Because the outer box
 *   is closed by the container, a half-empty last row still terminates
 *   cleanly. Use it for grids whose item count isn't a multiple of the column
 *   count.
 *
 * Cells are supplied by the caller as children and must NOT carry their own
 * border utilities — give each one the matching class from `ruleCell`
 * (`./ruleCell`), whose two variants pair with the two techniques above.
 */
export function RuleGrid({
  cols = 'grid-cols-1 sm:grid-cols-3',
  ragged = false,
  className = '',
  children,
}: RuleGridProps) {
  const edges = ragged ? 'border-r border-b' : 'border-t border-l'

  return (
    <div className={`grid ${cols} ${edges} border-rule ${className}`}>
      {children}
    </div>
  )
}
