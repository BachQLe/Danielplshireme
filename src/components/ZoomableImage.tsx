import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PixelIcon } from './PixelIcon'

type ZoomableImageProps = {
  src: string
  alt: string
  /** Applied to the inline `<img>` — aspect, object-position, border, etc. */
  className?: string
  /**
   * Absolutely fills its parent instead of sitting in normal flow. Matches
   * ProjectScroller's poster cards, which position the image with
   * `absolute inset-0` rather than sizing it via an aspect utility.
   */
  fill?: boolean
}

/**
 * Wraps any on-site image with click-to-enlarge: a hover scale on the inline
 * image, and a full-screen portal overlay showing it at full size on click.
 * Every real (non-placeholder) image on the site renders through this so the
 * zoom/hover behavior stays identical everywhere instead of being
 * reimplemented per section.
 */
export function ZoomableImage({ src, alt, className = '', fill = false }: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    closeButtonRef.current?.focus()
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = original
      document.removeEventListener('keydown', handleKeyDown)
      trigger?.focus()
    }
  }, [open])

  const wrapperBase = fill
    ? 'group absolute inset-0 block h-full w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 text-left'
    : 'group block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0 text-left'
  const imgBase = fill ? 'h-full w-full' : 'block w-full'

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`enlarge image: ${alt}`}
        className={`${wrapperBase} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green`}
      >
        <img
          src={src}
          alt={alt}
          className={`${imgBase} transition-transform duration-300 ease-out group-hover:scale-105 ${className}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="close enlarged image"
              className="absolute right-4 top-4 z-10 p-2 text-dark-ink transition-colors duration-200 hover:text-coral sm:right-6 sm:top-6"
            >
              <PixelIcon name="cross" size={26} />
            </button>
            <img
              src={src}
              alt={alt}
              className="animate-modal-in relative z-10 max-h-full max-w-full border border-rule object-contain shadow-2xl"
            />
          </div>,
          document.body,
        )}
    </>
  )
}
