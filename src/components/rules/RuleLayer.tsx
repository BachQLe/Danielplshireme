/**
 * The page's vertical hairlines: two centered frames (the inner content
 * `frame` and the wider outer `rail`) whose left and right edges run
 * continuously from the top of the viewport to the bottom, straight through
 * every section, ignoring section content and padding entirely.
 *
 * WHY A FIXED LAYER, AND NOT `border-x` ON EACH SECTION:
 * per-section borders restart at every boundary. Any difference in a
 * section's padding, any section that forgets the class, any section with a
 * different max-width, and the vertical visibly jogs. One fixed layer behind
 * everything means there is exactly one x-position per vertical for the whole
 * page, and no section can get it wrong because no section participates.
 *
 * THE +2px IS LOAD-BEARING — do not "simplify" it to `max-w-frame`:
 * borders are drawn INSIDE the box. A layer at exactly `max-w-frame` puts its
 * 1px verticals on the inner edge of the frame, which is precisely where the
 * frame-width content cells sit — the cells' opaque `surface` fill paints
 * straight over them and the verticals vanish, with nothing to debug. Adding
 * 2px (1px of border per side) pushes the lines just outside the cell so they
 * sit flush against its edge. Horizontal rules, which span exactly
 * `max-w-frame`, then terminate exactly on those verticals: clean crosses,
 * no gap, no doubling.
 *
 * `-z-10` + the opaque cells above is the whole stacking story: rules paint
 * behind content, and any card or cell that crosses one occludes it.
 */
/**
 * The margin strip's width and offset, shared by the left/right stripe divs
 * below. Both fall out of the same two tokens RuleLayer already keys off —
 * `left`/`right` land exactly on the rail line (the calc mirrors the rail
 * div's own centering math), and `width` is just the rail/frame gap, so the
 * stripes run from the rail line in to the frame line with no separate
 * constant to keep in sync if either token changes.
 */
const marginStripeStyle = {
  width: 'calc((var(--container-rail) - var(--container-frame)) / 2)',
  backgroundImage:
    'repeating-linear-gradient(45deg, var(--color-stripe) 0 1px, transparent 1px 9px)',
}

export function RuleLayer() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* `absolute inset-0 mx-auto` rather than `left-1/2 -translate-x-1/2`:
          the auto-margin centering algorithm is the SAME one the in-flow
          `mx-auto max-w-frame` content uses, so the two land on identical
          x-positions by construction. A translate-based center rounds to a
          half pixel on odd viewport widths and blurs the line. */}
      <div className="absolute inset-0 mx-auto w-full max-w-[calc(var(--container-rail)+2px)] border-x border-rule" />
      <div className="absolute inset-0 mx-auto w-full max-w-[calc(var(--container-frame)+2px)] border-x border-rule" />

      {/* Faint 45deg diagonal-stripe texture filling the two margins between
          the rail and frame verticals. Positive slope (45deg, not -45deg) —
          CSS gradient angles run clockwise from vertical, so 45deg is the
          angle whose bands read bottom-left-to-top-right, i.e. "/" not "\". */}
      <div
        className="absolute inset-y-0"
        style={{ left: 'calc((100% - (var(--container-rail) + 2px)) / 2)', ...marginStripeStyle }}
      />
      <div
        className="absolute inset-y-0"
        style={{ right: 'calc((100% - (var(--container-rail) + 2px)) / 2)', ...marginStripeStyle }}
      />
    </div>
  )
}
