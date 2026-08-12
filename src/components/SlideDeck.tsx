import { useEffect, useRef, useState } from 'react'
import { Section, SectionTitle } from './Section'
import { ZoomableImage } from './ZoomableImage'
import { Reveal } from './Reveal'
import { FeatureCard } from './FeatureCard'
import { PixelIcon } from './PixelIcon'

type Slide = { src: string; alt: string }

// All 28 pages of the FBLA presentation deck, rendered from the source PDF.
// The carousel below only ever reads this array's length, so it just works.
const SLIDES: Slide[] = Array.from({ length: 28 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return { src: `/images/slide-deck/slide-${n}.png`, alt: `Slide ${i + 1} of the FBLA presentation deck` }
})

/**
 * Distance in px between one slide's left edge and the next. Same approach
 * as ProjectScroller's `measureStep` — read from the DOM rather than
 * reimplemented from CSS, so it stays correct across breakpoints.
 */
function measureStep(track: HTMLDivElement): number {
  const first = track.firstElementChild as HTMLElement | null
  if (!first) return 0
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
  return first.getBoundingClientRect().width + gap
}

/**
 * Left/right carousel that sits in the FeatureCard mat slot a bare
 * <Placeholder> used to occupy. This is a real `overflow-x: auto` +
 * scroll-snap track (same mechanism as ProjectScroller's "my videos"
 * carousel below), not a React-state image swap — the previous version
 * re-rendered a single <img> on click, which never actually scrolled.
 * The arrow buttons are ProjectScroller's, styling included, rather than
 * the small dark overlay pills this used to have.
 */
function SlideCarousel({ slides }: { slides: Slide[] }) {
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function scrollToIndex(index: number) {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(slides.length - 1, index))
    const step = measureStep(track)
    track.scrollTo({ left: step * clamped, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let raf = 0
    function measure() {
      const step = measureStep(track!)
      const index = step > 0 ? Math.round(track!.scrollLeft / step) : 0
      setActiveIndex(Math.max(0, Math.min(slides.length - 1, index)))
    }
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    measure()
    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [slides.length])

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Slide deck"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className="w-full shrink-0 snap-center"
          >
            <ZoomableImage src={slide.src} alt={slide.alt} className="aspect-video w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="previous slide"
          disabled={activeIndex === 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
          className="flex h-11 w-11 items-center justify-center border border-rule bg-surface text-ink transition-colors duration-150 hover:bg-row-alt disabled:pointer-events-none disabled:opacity-30"
        >
          <PixelIcon name="play" size={13} className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label="next slide"
          disabled={activeIndex === slides.length - 1}
          onClick={() => scrollToIndex(activeIndex + 1)}
          className="flex h-11 w-11 items-center justify-center border border-rule bg-surface text-ink transition-colors duration-150 hover:bg-row-alt disabled:pointer-events-none disabled:opacity-30"
        >
          <PixelIcon name="play" size={13} />
        </button>
      </div>
    </div>
  )
}

export function SlideDeck() {
  return (
    <Section tone="canvas" padding="md">
      <SectionTitle icon="trophy">slide decks</SectionTitle>

      {/*
        FeatureCard now owns the full padding stack — panel padding, the
        translucent rounded-card frame, and the opaque rounded-mat mat
        around the screenshot — so this call site just hands it the
        carousel below as children. There's no separate `.paper p-3`
        wrapper left to reconcile against here.

        href/ctaLabel here link out to the Canva file the deck's animations
        actually live in (the static slide-deck PNGs above can't show
        those), unlike the other FeatureCard call sites where the CTA sends
        visitors to the live project itself.
      */}
      <Reveal className="mt-8">
        <FeatureCard
          title="A slide deck I made last year"
          description="I don't have too many decks, but the ones I make place. This one won me 3rd at nationals"
          href="https://www.canva.com/design/DAGnwGXJpqg/4yC3iLPrQyFGT9LhX-HwXQ/edit"
          ctaLabel="see slide animations in canva"
          seed="slide-deck"
          color="bg-pop-coral"
          image="/images/texture-bar.jpg"
          imagePosition="center 45%"
          rotate={-2}
          className="mx-auto max-w-4xl"
        >
          <SlideCarousel slides={SLIDES} />
        </FeatureCard>
      </Reveal>
    </Section>
  )
}
