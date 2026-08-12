/**
 * Pixel-art icon set rendered as inline SVG.
 *
 * Each icon is authored as a square grid of strings: `'#'` marks a filled
 * pixel, `'.'` marks an empty one. Every grid must be N rows of N equal-length
 * characters — most icons use 8x8, but higher-detail icons (e.g. `music`) can
 * use a finer grid like 16x16. `PixelIcon` reads its viewBox from the grid's
 * own dimensions, so mixed resolutions render at the same visual size. To
 * keep the rendered DOM small, `toRects` walks each row and merges
 * consecutive filled cells into a single `<rect>` run instead of emitting one
 * rect per pixel.
 *
 * A few icons (see `PATH_ICONS`) are instead authored as a single literal SVG
 * `<path>` at a 600x600 viewBox rather than an NxN grid — these come from
 * externally-supplied artwork precise enough that resampling into a small
 * grid would lose fidelity. `PixelIcon` checks `PATH_ICONS` first and falls
 * back to the grid system otherwise, so callers never need to know which
 * source a given icon comes from.
 */

type IconGrid = readonly string[]

export type PixelIconName =
  | 'film'
  | 'music'
  | 'code'
  | 'trophy'
  | 'controller'
  | 'folder'
  | 'heart'
  | 'star'
  | 'check'
  | 'cross'
  | 'play'
  | 'phone'
  | 'instagram'
  | 'sparkle'
  | 'smile'
  | 'happy-face'
  | 'sad-face'
  | 'arrow-up-right'
  | 'briefcase'

const ICONS: Partial<Record<PixelIconName, IconGrid>> = {
  film: [
    '########',
    '#......#',
    '##....##',
    '#......#',
    '#......#',
    '##....##',
    '#......#',
    '########',
  ],
  // Treble clef, authored at 16x16 for the extra detail its spiral and
  // lower loop need — an 8x8 grid can't resolve this shape cleanly.
  music: [
    '................',
    '......##........',
    '......####......',
    '......#####.....',
    '......#..###....',
    '......#..###....',
    '......#.###.....',
    '......####......',
    '......###.......',
    '......##........',
    '..###.#.........',
    '.######.........',
    '.######.........',
    '.######.........',
    '..####..........',
    '................',
  ],
  // Two chevrons facing outward. The top and bottom rows stay empty on
  // purpose — filling them closes the gap and the whole thing reads as a
  // diamond outline instead of `< >`.
  code: [
    '........',
    '..#..#..',
    '.#....#.',
    '#......#',
    '#......#',
    '.#....#.',
    '..#..#..',
    '........',
  ],
  trophy: [
    '.######.',
    '########',
    '.######.',
    '..####..',
    '...##...',
    '...##...',
    '..####..',
    '.######.',
  ],
  controller: [
    '..####..',
    '.######.',
    '########',
    '#.##.#.#',
    '#.##.#.#',
    '########',
    '.######.',
    '..####..',
  ],
  folder: [
    '.####...',
    '########',
    '#......#',
    '#......#',
    '#......#',
    '#......#',
    '#......#',
    '########',
  ],
  heart: [
    '.##..##.',
    '########',
    '########',
    '########',
    '.######.',
    '..####..',
    '...##...',
    '........',
  ],
  check: [
    '........',
    '........',
    '.......#',
    '......#.',
    '#....#..',
    '.#..#...',
    '..##....',
    '........',
  ],
  cross: [
    '#......#',
    '.#....#.',
    '..#..#..',
    '...##...',
    '...##...',
    '..#..#..',
    '.#....#.',
    '#......#',
  ],
  play: [
    '..#.....',
    '..##....',
    '..###...',
    '..####..',
    '..####..',
    '..###...',
    '..##....',
    '..#.....',
  ],
  phone: [
    '.##.....',
    '###.....',
    '.#......',
    '..#.....',
    '...#....',
    '....#...',
    '.....###',
    '......##',
  ],
  instagram: [
    '########',
    '#....#.#',
    '#......#',
    '#......#',
    '#..##..#',
    '#..##..#',
    '#......#',
    '########',
  ],
  // Filled disc with two punched eye-holes and a wide mouth gap — same solid,
  // blocky weight as `heart`.
  smile: [
    '..####..',
    '.######.',
    '##.##.##',
    '########',
    '########',
    '##....##',
    '.######.',
    '..####..',
  ],
  // Outline face — a hollow ring (no interior fill), punched with two eye
  // dots and a mouth. Shares its ring/eyes rows with `sad-face` below; only
  // rows 4-5 (the mouth) differ, swapped between the two so the corners sit
  // higher than the middle here (a cup/smile curve) and lower there (a
  // frown).
  'happy-face': [
    '..####..',
    '.#....#.',
    '#.#..#.#',
    '#......#',
    '#.#..#.#',
    '#..##..#',
    '.#....#.',
    '..####..',
  ],
  'sad-face': [
    '..####..',
    '.#....#.',
    '#.#..#.#',
    '#......#',
    '#..##..#',
    '#.#..#.#',
    '.#....#.',
    '..####..',
  ],
  briefcase: [
    '..####..',
    '..#..#..',
    '########',
    '#......#',
    '########',
    '#......#',
    '#......#',
    '########',
  ],
}

const STAR_PATH_D =
  'M50.00,200.25 L50.00,300.00 L99.75,300.00 L100.00,349.75 L150.00,350.25 L150.00,424.75 L100.00,425.00 L100.25,550.00 L199.75,550.00 L200.25,500.00 L275.00,500.00 L275.25,450.00 L325.00,450.25 L325.00,500.00 L399.75,500.00 L400.25,550.00 L500.00,549.75 L500.00,425.00 L450.00,424.75 L450.00,350.25 L499.75,350.00 L500.25,300.00 L550.00,300.00 L549.75,200.00 L375.25,200.00 L375.00,125.00 L325.00,124.75 L325.00,50.00 L275.00,50.00 L275.00,124.75 L225.00,125.00 L224.75,200.00 Z'

/**
 * Icons authored as a single literal path at a 600x600 viewBox instead of an
 * NxN grid. Checked before `ICONS` in `PixelIcon` below.
 */
const PATH_ICONS: Partial<Record<PixelIconName, { viewBox: number; d: string }>> = {
  'arrow-up-right': {
    viewBox: 600,
    d: 'M48.00,48.00 L48.00,168.00 L107.75,168.00 L108.00,228.00 L156.00,228.25 L156.00,300.00 L227.75,300.00 L228.00,360.00 L287.75,360.00 L288.00,420.00 L348.00,420.25 L347.75,480.00 L228.00,480.00 L228.00,540.00 L528.00,540.00 L528.00,300.00 L468.00,300.00 L468.00,419.75 L408.25,420.00 L408.00,360.00 L348.25,360.00 L348.00,300.00 L288.00,299.75 L288.00,240.00 L216.00,239.75 L216.00,168.00 L168.00,167.75 L168.00,108.00 L108.25,108.00 L108.00,48.00 Z',
  },
  // Both `star` and `sparkle` intentionally share this same artwork — the
  // site now uses one star shape everywhere instead of two different ones.
  star: { viewBox: 600, d: STAR_PATH_D },
  sparkle: { viewBox: 600, d: STAR_PATH_D },
}

interface Rect {
  key: string
  x: number
  y: number
  width: number
}

/** Walks each row of a grid and merges consecutive filled cells into runs. */
function toRects(grid: IconGrid): Rect[] {
  const rects: Rect[] = []
  grid.forEach((row, y) => {
    let runStart = -1
    for (let x = 0; x <= row.length; x += 1) {
      const filled = row[x] === '#'
      if (filled && runStart === -1) {
        runStart = x
      } else if (!filled && runStart !== -1) {
        rects.push({ key: `${y}-${runStart}`, x: runStart, y, width: x - runStart })
        runStart = -1
      }
    }
  })
  return rects
}

/** Renders a named pixel/path glyph as a crisp-edged inline SVG. */
export function PixelIcon({
  name,
  size = 16,
  title,
  className = '',
}: {
  name: PixelIconName
  size?: number
  title?: string
  className?: string
}) {
  const sharedProps = {
    width: size,
    height: size,
    shapeRendering: 'crispEdges' as const,
    fill: 'currentColor',
    focusable: 'false' as const,
    className: `shrink-0 ${className}`,
    role: title ? ('img' as const) : undefined,
    'aria-label': title,
    'aria-hidden': title ? undefined : true,
  }

  const pathIcon = PATH_ICONS[name]
  if (pathIcon) {
    return (
      <svg viewBox={`0 0 ${pathIcon.viewBox} ${pathIcon.viewBox}`} {...sharedProps}>
        {title ? <title>{title}</title> : null}
        <path d={pathIcon.d} />
      </svg>
    )
  }

  const grid = ICONS[name]
  if (!grid) {
    throw new Error(`PixelIcon: no icon registered for "${name}"`)
  }
  const rects = toRects(grid)
  const gridSize = grid.length

  return (
    <svg viewBox={`0 0 ${gridSize} ${gridSize}`} {...sharedProps}>
      {title ? <title>{title}</title> : null}
      {rects.map((r) => (
        <rect key={r.key} x={r.x} y={r.y} width={r.width} height={1} />
      ))}
    </svg>
  )
}
