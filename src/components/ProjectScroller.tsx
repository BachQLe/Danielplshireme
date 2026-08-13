import { useEffect, useRef, useState } from 'react'
import { Section, SectionTitle, PixelNote } from './Section'
import { PixelIcon } from './PixelIcon'
import { ZoomableImage } from './ZoomableImage'

/**
 * One card in the scroller. Deliberately a flat object, not a discriminated
 * union — every project renders through the exact same markup
 * (image-or-placeholder, label, copy, button), so there is no per-kind
 * branch that would justify one.
 */
export type Project = {
  /** Eyebrow above the copy, e.g. "COOKING" — rendered upper-case in green. */
  label: string
  /** 2-3 line description in the site's plain, lowercase-leaning voice. */
  description: string
  /** Omit to render the dashed placeholder panel instead of an <img>. */
  imageUrl?: string
  imageAlt: string
  href: string
}

/** Light-gray card: label/copy/button on the left, a square image on the right. */
function PosterCard({ project }: { project: Project }) {
  const { label, description, imageUrl, imageAlt, href } = project

  return (
    <div className="flex h-full w-full items-stretch border border-rule bg-row-alt">
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-8 lg:p-10">
        <p className="font-sans text-[0.6875rem] font-bold tracking-[0.2em] text-green uppercase">
          {label}
        </p>
        {/* Hidden below `sm`: at the card's mobile aspect there isn't room
            for a 2-3 line description without crowding the button. */}
        <p className="hidden max-w-[46ch] font-sans leading-relaxed text-muted sm:block">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            // bg-dark / text-dark-ink, NOT bg-ink / text-surface: matches
            // FeatureCard's CTA (FeatureCard.tsx:78) — --color-dark and
            // --color-dark-ink are absent from the `.dark` block in
            // index.css, so they're the invariant black-bg/white-text pair
            // regardless of page theme, unlike --color-ink/--color-surface
            // which flip.
            className="inline-flex items-center gap-2 bg-dark px-5 py-2.5 text-[0.875rem] font-bold text-dark-ink transition-colors duration-150 hover:bg-dark-card"
            // Sharp corners are enforced globally (`* { border-radius: 0 }`
            // in index.css, in @layer base), but a `rounded-*` utility would
            // actually beat that reset too — the built stylesheet's cascade
            // layers run `properties -> theme -> base -> components ->
            // utilities` in first-appearance order with no explicit
            // `@layer a, b, c;` statement, so `utilities` outranks `base`
            // regardless of specificity (see FeatureCard's `rounded-card`/
            // `rounded-mat`/`rounded-cta`, which do exactly this). This pill
            // is inline anyway, matching WebWork's now-removed CTA and
            // predating the radius tokens FeatureCard introduced — inline
            // still works, it's just no longer the only way to win.
            style={{ borderRadius: '9999px' }}
          >
            open video
            <PixelIcon name="arrow-up-right" size={10} />
          </a>
        </div>
      </div>

      <div className="relative aspect-square h-full shrink-0">
        {imageUrl ? (
          <ZoomableImage src={imageUrl} alt={imageAlt} className="object-cover" fill />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center border-l border-rule bg-placeholder-bg px-4">
            <span className="text-center font-pixel text-[9px] leading-[1.8] text-placeholder-text">
              {imageAlt}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Distance in px between one card's left edge and the next, read from the
 * DOM rather than reimplemented from CSS: the card's width is a `min()`
 * expression that resolves differently per viewport, so measuring the
 * rendered first card is the only way to get a value that's actually right.
 * Shared by the scroll listener (turns `scrollLeft` into an index) and
 * `scrollToIndex` (turns an index back into a `scrollLeft`), so the two
 * never drift out of sync with each other.
 */
function measureStep(track: HTMLDivElement): number {
  const first = track.firstElementChild as HTMLElement | null
  if (!first) return 0
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
  return first.getBoundingClientRect().width + gap
}

/**
 * A horizontal scroll-snap carousel: the track is a plain `overflow-x: auto`
 * flex row with `scroll-snap-type: x mandatory` and each card
 * `scroll-snap-align: center`. The page is never pinned and never captures
 * scroll — this is a native browser affordance, the same kind of gesture as
 * scrolling a table horizontally, not a scripted animation. `overscroll-x:
 * contain` on the track stops it from chaining a scroll past its own
 * boundary into the browser's back/forward swipe gesture.
 *
 * JS never drives the motion. It only reads `scrollLeft` (rAF-throttled) to
 * highlight the matching dot, and calls `scrollTo()` for the arrow/dot
 * controls — both are just requests layered on top of native scrolling, and
 * both stay interruptible by the user's own drag or wheel input at any time.
 */
export function ProjectScroller({ projects }: { projects: Project[] }) {
  // Checked once, not reactively — matches Reveal.tsx's treatment of the
  // same media query. Scroll-snap itself isn't the kind of motion
  // `prefers-reduced-motion` exists to suppress (it's a native scroll
  // affordance, not a scripted animation), so this only downgrades the
  // *programmatic* `scrollTo` below from smooth to instant.
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function scrollToIndex(index: number) {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(projects.length - 1, index))
    const step = measureStep(track)
    // `behavior` here is needed IN ADDITION to the `motion-reduce:scroll-auto`
    // class below: per spec, an explicit non-`auto` `behavior` passed to
    // `scrollTo()` overrides the element's CSS `scroll-behavior` for that
    // call. The class covers scrolling the user triggers directly (drag,
    // wheel, snap settling); this covers scrolling these buttons trigger —
    // different trigger paths, so both are required to fully respect the
    // preference.
    track.scrollTo({ left: step * clamped, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let raf = 0
    function measure() {
      const step = measureStep(track!)
      const index = step > 0 ? Math.round(track!.scrollLeft / step) : 0
      setActiveIndex(Math.max(0, Math.min(projects.length - 1, index)))
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
  }, [projects.length])

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        // `snap-center` alone leaves the first and last card stuck at the
        // scroll boundary, unable to reach the center of the track. Padding
        // the track (not margining the cards) extends the scrollable range
        // by half a card's worth of empty space on each side, so there's
        // room left to scroll into. P = (track width − card width) / 2,
        // built from the same min() expressions the layout uses below, so
        // one formula covers every breakpoint: 5vw/side under 64rem, 3rem/
        // side at and above it. Set inline rather than as an arbitrary
        // Tailwind class because calc() needs literal whitespace around a
        // binary `-`, which bracket syntax would spell as the unreadable
        // `_-_` — CONTRACT.md hard rule 0 names `style` as the escape hatch
        // for exactly this.
        style={{ paddingInline: 'calc((min(100vw, 64rem) - min(90vw, 58rem)) / 2)' }}
      >
        {projects.map((project, i) => (
          <div
            key={project.href}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}`}
            className="aspect-[16/9] w-[min(90vw,58rem)] shrink-0 snap-center overflow-hidden sm:aspect-[21/9]"
          >
            <PosterCard project={project} />
          </div>
        ))}
      </div>

      {/* Re-insets to the frame edge: the track above is intentionally
          full-bleed (see WorkSection's `-mx-4 sm:-mx-6` wrapper), but these
          controls read as page chrome, not part of the bleed. */}
      <div className="flex items-center justify-center gap-6 px-4 sm:gap-8 sm:px-6">
        <button
          type="button"
          aria-label="Previous project"
          disabled={activeIndex === 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
          className="flex h-11 w-11 items-center justify-center border border-rule bg-surface text-ink transition-colors duration-150 hover:bg-row-alt disabled:pointer-events-none disabled:opacity-30"
        >
          <PixelIcon name="play" size={13} className="rotate-180" />
        </button>

        <div className="flex items-center gap-1">
          {projects.map((project, i) => (
            <button
              key={project.href}
              type="button"
              aria-label={`go to project ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
              onClick={() => scrollToIndex(i)}
              className="flex h-6 w-6 shrink-0 items-center justify-center"
            >
              <span
                className={`h-2 w-2 transition-colors duration-150 ${i === activeIndex ? 'bg-green' : 'bg-rule-strong'}`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next project"
          disabled={activeIndex === projects.length - 1}
          onClick={() => scrollToIndex(activeIndex + 1)}
          className="flex h-11 w-11 items-center justify-center border border-rule bg-surface text-ink transition-colors duration-150 hover:bg-row-alt disabled:pointer-events-none disabled:opacity-30"
        >
          <PixelIcon name="play" size={13} />
        </button>
      </div>
    </div>
  )
}

const PROJECTS: Project[] = [
  {
    label: 'MY COOKING TIKTOK',
    description:
      'A TikTok edit of Che Thai',
    imageUrl: '/images/cooking-still.png',
    imageAlt: 'Still from the cooking video',
    href: 'https://www.tiktok.com/@_bachle/video/7665869308655930637',
  },
  {
    label: 'MY SIGNOUT EDIT',
    description:
      'My friend and I collaborated with the county to post our senior signout video on the official school district instagram account.',
    imageUrl: '/images/signout-still.png',
    imageAlt: 'Still from the signout edit',
    href: 'https://www.instagram.com/p/DZfJsalqPp6H1SHUP6KjMz448mJKya7gfPf5nU0/',
  },
  {
    label: 'FBLA BRONZE VIDEO',
    description:
      "Video I made Junior year on tourism in my state",
    imageUrl: '/images/fbla-video-still.png',
    imageAlt: 'Still from the FBLA competition video',
    href: 'https://www.youtube.com/watch?v=5MPob2nP_Yk',
  },
]

/** What `App.tsx` renders: the section chrome plus the live project data. */
export function WorkSection() {
  return (
    <Section tone="canvas" padding="lg">
      <SectionTitle icon="film">my videos</SectionTitle>
      <PixelNote className="mt-2">some videos I made</PixelNote>

      {/* `Section` applies `px-4 sm:px-6` so ordinary content sits inset
          from the frame edge, but these cards are meant to bleed all the way
          to the cell's edges. Cancelling the padding here (rather than
          inside `ProjectScroller`) keeps the reusable component honestly
          layout-neutral — it never has to assume a parent that padded it. */}
      <div className="-mx-4 mt-10 sm:-mx-6">
        <ProjectScroller projects={PROJECTS} />
      </div>
    </Section>
  )
}
