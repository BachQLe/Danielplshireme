import type { MouseEvent } from 'react'
import { FadingLines } from './FadingLines'
import { PixelIcon } from './PixelIcon'

/**
 * Final section. Full-bleed dark, edge-to-edge — built by hand rather than
 * <Section> since it needs its own background and no closing divider.
 */
export function DarkCTA({
  onOpenContact,
}: {
  onOpenContact: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    // `relative left-1/2 w-screen -translate-x-1/2` (the same full-bleed
    // escape `Rule.tsx` uses for `variant="bleed"`) rather than `max-w-frame`:
    // this is the one section that's meant to run edge-to-edge and paint
    // straight over the frame/rail verticals `RuleLayer` draws behind it,
    // not sit inset between them. Relies on `overflow-x: clip` on `html`
    // (index.css) so escaping the frame doesn't add horizontal scroll.
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-dark pt-28 pb-84">
      <FadingLines />
      <div className="relative z-10 px-4 text-center sm:px-6">
        <h2
          className="font-display font-bold text-dark-ink"
          style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', letterSpacing: '-0.02em' }}
        >
          Which will it be?
        </h2>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onOpenContact}
            className="bg-green px-6 py-3 text-[0.9375rem] font-bold text-ink transition-colors duration-200 hover:bg-green-dark"
          >
            i'm PUMPED to hire Bach
          </button>
          <button
            type="button"
            onClick={onOpenContact}
            className="flex items-center gap-2 bg-green px-8 py-4 text-[1.125rem] font-bold text-ink transition-colors duration-200 hover:bg-green-dark"
          >
            <PixelIcon name="heart" size={20} />
            i'm <em>SUPER PUMPED</em> to hire Bach
          </button>
        </div>
      </div>
    </section>
  )
}
