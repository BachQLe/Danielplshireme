import { useEffect, useRef, type CSSProperties } from 'react'

/**
 * The hero poster — ported from a Figma export (`hero.html` at the repo
 * root has the original static markup this was built from).
 *
 * The poster's `container-type: inline-size` plus `cqw`-based positions and
 * sizes on every child lock the whole 1920×1080 composition (headline,
 * portrait, speech bubble) together: shrink the frame and every piece
 * scales in lockstep, instead of each fighting its own breakpoint. The
 * coordinates below are copied straight from the export — don't convert
 * them to rem/vw/%, that decouples them from the lock and the pieces drift
 * apart at sizes other than the one they were eyeballed at.
 *
 * Deliberately edge-to-edge (no section padding): this is a poster placed
 * in the frame, not a padded content cell, and it's opaque enough to occlude
 * the frame verticals it crosses — see RuleLayer's stacking comment.
 */

/*
 * `--hero-progress` (0 → 1, set on the root element by the scroll effect
 * below) drives two things that live in different components: this
 * translateY, and the line-length grow in WhyMe's <FadingLines
 * growWithHero>. Whole-page-scoped custom property rather than props/context
 * because the two consumers are unrelated siblings in the tree, and reading
 * a CSS var costs a style recalc, not a React re-render, on every scroll tick.
 *
 * The lag is deliberately small (100px cap) — "doesn't move too much" — and
 * needs no z-index/position:sticky trick to get the roll-up-and-cover look:
 * this section is a plain static box, WhyMe right after it is `relative`
 * (Section.tsx) with an opaque surface fill, and default CSS paint order
 * already puts positioned siblings above static ones. Lagging behind the
 * scroll is what creates the overlap for that opaque sibling to cover.
 */

/*
 * Extra height added above the original 1920×1080 composition, in cqw (same
 * unit as every child's position below). The background image is itself
 * exactly 1920×1080, so widening the box's aspect ratio like this makes
 * `bg-cover` scale it up to fill the added height — a zoom, not a letterbox.
 * Every child's `top` below has this added on top of its original authored
 * value so the whole composition stays pinned to the bottom of the frame;
 * the new space reads as blank top padding instead of shifting anything.
 */
const HERO_TOP_PAD_CQW = 10

const posterStyle: CSSProperties = {
  aspectRatio: `1920 / ${1080 + (HERO_TOP_PAD_CQW / 100) * 1920}`,
  containerType: 'inline-size',
  backgroundImage: 'url(/images/hero/background-texture.jpg)',
  transform: 'translateY(calc(var(--hero-progress, 0) * 100px))',
}

/*
 * Entrance sequence, all on mount (nothing scroll-triggered — this is the
 * first thing on the page): the two headline lines drop in from above with
 * a stagger between them, the portrait pops up from below once the text has
 * landed (1500ms), and the bubble drops in the same way the text did, a
 * second after the portrait (2500ms). Durations stay short (~400ms) so the
 * staggered delays read as a snappy sequence rather than a slow build.
 * `prefers-reduced-motion` is handled globally (see bottom of index.css),
 * which collapses every duration here to ~0 automatically.
 */
const line1Style: CSSProperties = {
  left: '11.0cqw',
  top: `${1.5 + HERO_TOP_PAD_CQW}cqw`,
  fontSize: '14.5cqw',
}
const line2Style: CSSProperties = {
  left: '11.0cqw',
  top: `${15.0 + HERO_TOP_PAD_CQW}cqw`,
  fontSize: '14.5cqw',
  animationDelay: '90ms',
}

const photoStyle: CSSProperties = {
  left: '30.0844cqw',
  top: `${22.6312 + HERO_TOP_PAD_CQW}cqw`,
  width: '38.7220cqw',
  height: '39.4024cqw',
  animationDelay: '1500ms',
}

const bubbleStyle: CSSProperties = {
  left: '57.6387cqw',
  top: `${34.5003 + HERO_TOP_PAD_CQW}cqw`,
  width: '14.1183cqw',
  height: '10.5826cqw',
  animationDelay: '2500ms',
}

/*
 * The headline now sits low enough that HIRE dips into the hair, where solid
 * black reads as a smudge against dark hair instead of type. These two
 * layers are a white-outline duplicate of each line, masked by the
 * portrait's own alpha channel — visible only where the portrait is opaque,
 * i.e. exactly the silhouette, not a bounding box. Fill is transparent so
 * the underlying black line1/line2 still shows through the letterform;
 * only the stroke is drawn, tracing the edges against the dark hair.
 * Reusing the same PNG costs nothing extra over the network (browser cache,
 * same URL as the <img> below). mask-position is (photo origin − line
 * origin) so the reused portrait lines back up with where it's actually
 * drawn on screen; redo that math if `photoStyle` or either line's left/top
 * ever changes. */
const maskShared: CSSProperties = {
  color: 'transparent',
  WebkitTextStroke: '0.3cqw #fff',
  WebkitMaskImage: 'url(/images/hero/portrait.png)',
  maskImage: 'url(/images/hero/portrait.png)',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: '38.7220cqw 39.4024cqw',
  maskSize: '38.7220cqw 39.4024cqw',
}

const line1MaskStyle: CSSProperties = {
  ...line1Style,
  ...maskShared,
  WebkitMaskPosition: '19.0844cqw 21.1312cqw',
  maskPosition: '19.0844cqw 21.1312cqw',
}

const line2MaskStyle: CSSProperties = {
  ...line2Style,
  ...maskShared,
  WebkitMaskPosition: '19.0844cqw 7.6312cqw',
  maskPosition: '19.0844cqw 7.6312cqw',
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    let raf = 0

    function update() {
      raf = 0
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const progress = rect.height > 0 ? Math.min(1, Math.max(0, 1 - rect.bottom / rect.height)) : 0
      root.style.setProperty('--hero-progress', progress.toFixed(4))
    }

    function onScrollOrResize() {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (raf) cancelAnimationFrame(raf)
      root.style.removeProperty('--hero-progress')
    }
  }, [])

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-frame">
      <div className="relative w-full overflow-hidden bg-cover bg-center" style={posterStyle}>
        <div
          className="font-display text-ink animate-hero-drop-in absolute z-[1] leading-none whitespace-nowrap"
          style={line1Style}
        >
          DANIEL PLS
        </div>
        <div
          className="font-display text-ink animate-hero-drop-in absolute z-[1] leading-none whitespace-nowrap"
          style={line2Style}
        >
          HIRE ME
        </div>
        <img
          src="/images/hero/portrait.png"
          alt="Bach Le wearing pixel-art sunglasses"
          className="animate-hero-pop-up absolute z-[2] block"
          style={photoStyle}
        />
        <img
          src="/images/hero/speech-bubble.png"
          alt="Speech bubble reading: I love lime"
          className="animate-hero-drop-in absolute z-[3] block"
          style={bubbleStyle}
        />
        <div
          aria-hidden="true"
          className="font-display animate-hero-drop-in pointer-events-none absolute z-[4] leading-none whitespace-nowrap"
          style={line1MaskStyle}
        >
          DANIEL PLS
        </div>
        <div
          aria-hidden="true"
          className="font-display animate-hero-drop-in pointer-events-none absolute z-[4] leading-none whitespace-nowrap"
          style={line2MaskStyle}
        >
          HIRE ME
        </div>
      </div>
    </section>
  )
}
