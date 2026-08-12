import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { PixelIcon } from './PixelIcon'
import { SocialIcon } from './SocialIcon'

const HEADING_ID = 'contact-modal-heading'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Liquid-glass contact dialog, opened by the navbar's "contact me" button or
 * either DarkCTA button. Portaled to `document.body` so its `fixed inset-0`
 * always resolves against the real viewport, regardless of which trigger's
 * ancestors do (DarkCTA's section has a transform on it, which would
 * otherwise become the containing block for a fixed descendant). Traps
 * focus, closes on Escape or backdrop click, and returns focus to whichever
 * trigger actually opened it.
 */
export function ContactModal({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLElement | null>
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Move focus into the dialog on open; return it to the trigger on close.
  // The trigger node is captured up front so the cleanup below focuses the
  // button that was actually clicked, not whatever `triggerRef.current`
  // happens to hold by the time cleanup runs.
  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    closeButtonRef.current?.focus()
    return () => {
      trigger?.focus()
    }
  }, [open, triggerRef])

  // Escape closes the dialog.
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Focus trap: Tab / Shift+Tab cycle within the dialog's focusable children.
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Lock body scroll while open, restoring whatever value it had before.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop is a sibling of the panel, stacked underneath — panel
          clicks never bubble to it, so no stopPropagation is needed. */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={HEADING_ID}
        className="modal-glass animate-modal-in relative z-10 w-full max-w-sm p-8"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="close contact info"
          className="absolute right-3 top-3 p-2 text-dark-ink transition-colors duration-200 hover:text-coral"
        >
          <PixelIcon name="cross" size={26} />
        </button>

        {/* text-dark-muted throughout: this panel sits on the dark section,
            where text-muted (#6B7280) fails AA at these sizes. */}
        <h2 id={HEADING_ID} className="font-pixel text-[10px] text-dark-muted">
          reach me directly
        </h2>

        <a
          href="tel:+15714407983"
          className="font-display mt-6 flex items-center gap-3 text-dark-ink transition-colors duration-200 hover:text-green"
          style={{ fontSize: 'clamp(1.5rem, 6vw, 2.25rem)' }}
        >
          <PixelIcon name="phone" size={24} />
          571-440-7983
        </a>

        <a
          href="https://www.instagram.com/bachqle/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-3 text-[1rem] font-bold text-dark-ink transition-colors duration-200 hover:text-green"
        >
          <SocialIcon name="instagram" size={18} />
          @bachqle
          <PixelIcon name="arrow-up-right" size={10} />
        </a>

        <a
          href="https://www.linkedin.com/in/baqh/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-3 text-[1rem] font-bold text-dark-ink transition-colors duration-200 hover:text-green"
        >
          <SocialIcon name="linkedin" size={18} />
          linkedin
          <PixelIcon name="arrow-up-right" size={10} />
        </a>

        <a
          href="https://www.tiktok.com/@b4chle"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-3 text-[1rem] font-bold text-dark-ink transition-colors duration-200 hover:text-green"
        >
          <SocialIcon name="tiktok" size={18} />
          @b4chle
          <PixelIcon name="arrow-up-right" size={10} />
        </a>

        <a
          href="mailto:bachqle.real@gmail.com"
          className="font-pixel mt-8 block text-[9px] text-dark-muted transition-colors duration-200 hover:text-dark-ink"
        >
          bachqle.real@gmail.com
        </a>
      </div>
    </div>,
    document.body,
  )
}
