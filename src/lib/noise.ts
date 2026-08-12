/* -------------------------------------------------------------------------
   Seeded randomness for the vibrant-textured-container decorations (torn
   slab edges). The randomness is seeded rather than drawn from
   Math.random() so a given shape is stable across React re-renders: the
   same seed always produces the same polygon, so nothing reshuffles under
   a component just because its parent re-rendered.
   (The spec this was ported from also cites SSR hydration-mismatch safety —
   this app is a client-only Vite SPA with no server render, so that specific
   failure mode doesn't apply here, but render stability still does.)
------------------------------------------------------------------------- */

/** Turns an arbitrary string into a 32-bit unsigned int, for use as a PRNG seed. */
export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** A small deterministic PRNG keyed by a string, so a given seed always replays the same sequence of [0, 1) values. */
export function rng(seed: string): () => number {
  let a = hashString(seed)
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Torn-paper edge as a responsive polygon() clip-path. */
export function tornPolygon(seed: string, perSide = 5, jitter = 1.6): string {
  const r = rng(seed)
  const j = () => (r() * 2 - 1) * jitter // ±jitter %
  const pts: string[] = []
  const walk = (n: number, at: (t: number, off: number) => [number, number]) => {
    for (let i = 0; i < n; i++)
      pts.push(
        at(i / n, j())
          .map((v) => `${v.toFixed(2)}%`)
          .join(' ')
      )
  }
  walk(
    perSide,
    (t: number, o: number): [number, number] => [t * 100, 0 + o]
  ) // top
  walk(
    perSide,
    (t: number, o: number): [number, number] => [100 - o, t * 100]
  ) // right
  walk(
    perSide,
    (t: number, o: number): [number, number] => [100 - t * 100, 100 - o]
  ) // bottom
  walk(
    perSide,
    (t: number, o: number): [number, number] => [0 + o, 100 - t * 100]
  ) // left
  return `polygon(${pts.join(', ')})`
}
