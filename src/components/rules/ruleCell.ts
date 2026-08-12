/**
 * The class every direct child of a `RuleGrid` must carry. Which one you use
 * has to match the grid's technique — see `RuleGrid.tsx` for the full
 * explanation of the two:
 *
 * - `default` pairs with a `RuleGrid` that draws `border-t border-l`. Each
 *   cell owns its own right and bottom seam; the container closes the top and
 *   left. Nothing overlaps, so nothing doubles.
 * - `ragged` pairs with `<RuleGrid ragged>`, which closes the outer box with
 *   `border-r border-b` instead. Cells pull themselves 1px up and left so
 *   their edges land ON their neighbours' rather than beside them — which is
 *   what lets a partially-filled last row still terminate cleanly.
 *
 * Mixing them (ragged cells in a default grid or vice versa) produces exactly
 * the doubled 2px seams both techniques exist to avoid.
 *
 * Lives in its own module rather than beside the component because a file that
 * exports both a component and a plain constant breaks React Fast Refresh —
 * every edit to this string would force a full reload instead of a hot swap.
 */
export const ruleCell = {
  default: 'border-r border-b border-rule',
  ragged: '-ml-px -mt-px border-l border-t border-rule',
} as const
