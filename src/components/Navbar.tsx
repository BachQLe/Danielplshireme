import type { MouseEvent } from 'react'
import { PixelIcon } from './PixelIcon'

/**
 * Sticky top bar — mounted once in App.tsx, outside <main>, so it isn't
 * subject to the frame-width constraint sections use; the inner wrapper
 * re-aligns to the frame verticals the same way Section.tsx does.
 */
export function Navbar({
  onOpenContact,
}: {
  onOpenContact: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <header className="sticky top-0 z-40 bg-pop-lime">
      <div className="mx-auto flex w-full max-w-frame items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-ink">
          <PixelIcon name="smile" size={22} />
          <span
            className="font-sans lowercase font-extrabold"
            style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}
          >
            bach le's application
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenContact}
          className="bg-ink px-5 py-2.5 text-[0.8125rem] font-bold text-pop-lime transition-opacity duration-200 hover:opacity-80"
        >
          contact me
        </button>
      </div>
    </header>
  )
}
