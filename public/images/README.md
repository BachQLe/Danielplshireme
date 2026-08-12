## Texture plates

`texture-bar.jpg`, `texture-deco.jpg`, and `texture-lounge.jpg` are not slots
in the table below — nobody drops a replacement in for these. They're the
decorative art-deco noir photo fills for the `<ColorSlab>` behind five of the
`<FeatureCard>`s on the page (see each `<FeatureCard image="...">` call for
the exact `imagePosition` crop). They live in `public/` rather than `dist/`
because `dist/` is build output: Vite wipes and regenerates it on every `npm
run build`, so anything placed there directly would vanish on the next build.
Files under `public/` are copied into `dist/` unchanged, which is what makes
them reliable at the `/images/texture-*.jpg` URLs the `<FeatureCard>` calls
use.

| Plate | Used by |
|---|---|
| `texture-lounge.jpg` | `SoundDesign.tsx` (`seed="sound-design"`), `GraphicDesign.tsx` (`seed="graphic-design"`) |
| `texture-bar.jpg` | `WebWork.tsx` (`frameSeed: 'webwork-pocketace'`), `SlideDeck.tsx` (`seed="slide-deck"`) |
| `texture-deco.jpg` | `WebWork.tsx` (`frameSeed: 'webwork-remedies'`) |

# Drop images here

Every image slot on the page renders a dashed placeholder until you give it a
real file. Swapping one in is a one-line change — no layout adjustment needed,
the aspect ratio is already reserved.

1. Drop the file in this folder, e.g. `public/images/fbla-timeline.png`.
2. Add `src="/images/fbla-timeline.png"` to the matching `<Placeholder>`.

| Slot | Component | Aspect |
|---|---|---|
| FBLA audio timeline screenshot | `src/components/SoundDesign.tsx` | 16:9 |
| Pocket Ace screenshot | `src/components/WebWork.tsx` | 16:10 |
| Personal Remedies screenshot | `src/components/WebWork.tsx` | 16:10 |
| Canva poster | `src/components/GraphicDesign.tsx` | 3:4 portrait |
| FBLA slideshow thumbnail | `src/components/SlideDeck.tsx` | 16:9 |
| Bach Le photo | `src/components/ComparisonCard.tsx` | 40px circle |
| Other-applicants photo | `src/components/ComparisonCard.tsx` | 40px circle |
| Cooking video still | `src/components/ProjectScroller.tsx` | fills panel |
| Signout edit still | `src/components/ProjectScroller.tsx` | fills panel |
| FBLA video still | `src/components/ProjectScroller.tsx` | fills panel |
