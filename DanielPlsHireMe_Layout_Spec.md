# DanielPlsHireMe — Complete Layout & Build Specification

> **Purpose:** Single-page portfolio website to apply for a creative intern position. Deploy on Vercel. This document is the ONLY reference Claude Code needs to build the entire site.

---

## 1. DESIGN SYSTEM

### 1.1 Fonts

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display/Hero | `Tegno` (self-host in `/public/fonts/`, `@font-face`) — fallback: `Space Grotesk` weight 700 | — | ONLY the hero headline. All lowercase. Nothing else. |
| Section headers | `Figtree` (Google Fonts) | 700–800 | Section titles, card titles, CTA headline |
| Body text | `Figtree` (Google Fonts) | 500 | Paragraphs, descriptions, card content |
| Playful small text | `Press Start 2P` (Google Fonts) | 400 | Subtitles, annotations, footnotes, labels. Always small (10–12px). Always `#6B7280`. Think of it as "Minecraft chat font." |

### 1.2 Color Palette

| Token | Hex | Where it goes |
|---|---|---|
| `--bg-primary` | `#FAFAFA` | Default page background |
| `--bg-white` | `#FFFFFF` | Alternating sections, card backgrounds |
| `--bg-dark` | `#141414` | Final CTA section only |
| `--bg-dark-card` | `#1E1E1E` | Video carousel cards |
| `--accent-green` | `#16B364` | Primary accent — links, CTAs, highlight bars, active states |
| `--accent-coral` | `#F97066` | Secondary accent — comparison card "other applicants" bar, warm pops |
| `--accent-yellow` | `#FDB022` | Tertiary accent — sparingly, badges or highlight moments |
| `--text-primary` | `#0A0A0A` | Headlines, body text |
| `--text-secondary` | `#6B7280` | Subtitles, annotations, muted labels |
| `--text-dark-primary` | `#FFFFFF` | Text on dark backgrounds |
| `--text-dark-secondary` | `#A0A0A0` | Muted text on dark backgrounds |
| `--line` | `#E5E5E5` | All dividers, borders, structural lines |
| `--line-dark` | `#2A2A2A` | Fading vertical lines on dark section |

### 1.3 Visual Rules

**Sharp corners everywhere.** `border-radius: 0` on every single element — cards, buttons, images, inputs, placeholders. No exceptions. No rounding.

**Content column:** `max-w-5xl mx-auto px-6` (Tailwind). This gives ~1024px max content width with consistent padding that scales. The content never touches the viewport edges. Whitespace breathes on both sides naturally.

**Structural lines (inspired by the Attio site — the screenshot at 4:09):**
- Use 1px horizontal lines in `#E5E5E5` between every major section. Full-width of the content column (not viewport-wide).
- These lines are not decorative — they are structural. They separate sections the way Attio uses thin rules to break its page into clear segments. Every section boundary gets one.

**Paper-cutout aesthetic (inspired by the Apple "sticker" image at 4:15 and the Podia collage at 4:14):**
- Cards that contain screenshots or images should feel "placed on" the page — like a sticker or printed photo laid on paper.
- Achieve this with: white background, 1px `#E5E5E5` border, and a subtle `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`. No rounded corners.
- Screenshots inside cards should have a very subtle 1px border so they don't bleed into the card background.

**Vertical fading lines (inspired by Attio at 4:09 and 4:13):**
- These are decorative 1px-wide vertical lines that appear ONLY in the bottom ~40% of the page (specifically the dark CTA section and the section above it).
- Render 15–25 vertical lines spread across the full viewport width.
- Each line is `#E5E5E5` on light backgrounds or `#2A2A2A` on dark backgrounds.
- Randomize: each line should have a different height (between 30px and 180px), and fade from full opacity at the top of the line to 0 opacity at the bottom using a `linear-gradient` mask or `mask-image`.
- Space them with random horizontal gaps (not a uniform grid). Use a seeded random or hardcode positions for consistency.
- They sit behind content (z-index below content) as a background texture. Very subtle. If you squint, they look like rain or a subtle barcode pattern.

---

## 2. PAGE LAYOUT — SECTION BY SECTION

The page is a single vertical scroll. Sections alternate between `#FAFAFA` and `#FFFFFF` backgrounds. Every section boundary has a 1px `#E5E5E5` horizontal line.

---

### SECTION 1: HERO

**Background:** `#FAFAFA`
**Height:** 100vh (full viewport), flex column, center content vertically and horizontally.

**Layout (centered, stacked vertically, text-align center):**

```
[                                                    ]
[                                                    ]
[           daniel pls hire me                       ]  ← Tegno, all lowercase
[                                                    ]     clamp(3rem, 8vw, 7rem)
[    You asked me to interview for your mentorship.  ]  ← Figtree 500, 1.1rem
[    Couldn't afford it.                             ]     #6B7280
[    So I built you a website instead.               ]     max-width: 480px, centered
[                                                    ]
[    built in an afternoon because                   ]  ← Press Start 2P, 10px
[    im unemployed asf                               ]     #6B7280, margin-top: 2rem
[                                                    ]
[────────────────────────────────────────────────────]  ← 1px #E5E5E5 line
```

- The headline `daniel pls hire me` should feel massive and confident. It's the only Tegno moment on the page. Color: `#0A0A0A`. Letter-spacing: `-0.02em` (slightly tight).
- The subtitle lines are on separate lines (not one paragraph). Stacked with `leading-relaxed`.
- Total vibe: dead simple, lots of air, one big statement. Like a poster with nothing on it except the words.

---

### SECTION 2: WHY ME

**Background:** `#FFFFFF`
**Padding:** `py-20`

**Layout:**

```
[────────────────────────────────────────────────────]  ← section divider line
[                                                    ]
[  why me                                            ]  ← Figtree 800, 2rem, #0A0A0A
[                                                    ]     left-aligned
[  I'm not a graphic designer — I'm a video          ]  ← Figtree 500, 1rem, #0A0A0A
[  editor and web developer who ships real things.    ]     max-width: 640px
[  I've edited content that's hit 40K+ views,        ]     line-height: 1.75
[  placed 3rd nationally in FBLA Digital Video        ]
[  Production, and I'm a Multimedia Producer at       ]
[  Wahoops (45K followers). I built a full web app    ]
[  UI from scratch just to learn. I freelance shoot   ]
[  and edit for a food creator.                       ]
[                                                    ]
[  Slide decks, graphics, sound libraries — I pick    ]  ← second paragraph
[  things up fast because I already understand the    ]     separated by 1.5rem gap
[  fundamentals underneath them: pacing, visual       ]
[  hierarchy, tone, and taste. Everything on this     ]
[  page is proof.                                    ]
[                                                    ]
[  Multimedia Producer @ Wahoops ↗                   ]  ← Figtree 500, 0.875rem
[  Freelance editor & shooter @ urnovafoodie ↗       ]     #16B364, underlined
[                                                    ]     stacked vertically, gap: 0.5rem
[────────────────────────────────────────────────────]
```

- Text is LEFT-aligned, not centered. This section reads like a letter.
- Links have a small arrow `↗` after them. Green underline on hover.
- The whole text block sits on the left side of the content column. It does NOT stretch full width — `max-w-2xl` (640px).

---

### SECTION 3: BENTO COMPARISON CARD

**Background:** `#FAFAFA`
**Padding:** `py-20`

**Layout:**

```
[────────────────────────────────────────────────────]
[                                                    ]
[  me vs. literally everyone else who applied        ]  ← Figtree 800, 2rem
[  i'm not saying they're bad.                       ]  ← Press Start 2P, 10px, #6B7280
[  i'm saying i built a website.                     ]
[                                                    ]
[  ┌─────────────────────┬─────────────────────────┐ ]
[  │ ▇▇▇ GREEN BAR ▇▇▇▇ │ ▇▇▇ CORAL BAR ▇▇▇▇▇▇▇ │ ]  ← 4px accent bar on top of each col
[  │                     │                         │ ]
[  │ [○ photo]  Bach Le  │ [○ photo]  Other        │ ]  ← 40px circle placeholder + name
[  │                     │           Applicants    │ ]     Figtree 700, 1rem
[  ├─────────────────────┼─────────────────────────┤ ]
[  │ PORTFOLIO           │ PORTFOLIO               │ ]  ← category label: Press Start 2P
[  │ Built a website     │ Basic Google Drive      │ ]     8px, #6B7280, uppercase
[  │                     │ folder                  │ ]     value: Figtree 500, 0.875rem
[  ├─────────────────────┼─────────────────────────┤ ]  ← alternating row bg:
[  │ VIDEO EDITING       │ VIDEO EDITING           │ ]     odd rows: #FFFFFF
[  │ 3 yrs DaVinci       │ iMovie warrior          │ ]     even rows: #F5F5F5
[  │ Resolve             │                         │ ]
[  ├─────────────────────┼─────────────────────────┤ ]
[  │ SOUND               │ SOUND                   │ ]
[  │ 12 years pianist +  │ Spams ding sound        │ ]
[  │ knows sound design  │ effects                 │ ]
[  ├─────────────────────┼─────────────────────────┤ ]
[  │ WEB / UI            │ WEB / UI                │ ]
[  │ Knows React/TS      │ Purple gradient         │ ]
[  │ and UI/UX           │ vibecoding              │ ]
[  ├─────────────────────┼─────────────────────────┤ ]
[  │ THE EDGE            │ THE EDGE                │ ]
[  │ Top 100 global      │ Employed                │ ]
[  │ Brawl Stars         │                         │ ]
[  │ 'Chuck' player      │                         │ ]
[  └─────────────────────┴─────────────────────────┘ ]
[                                                    ]
[────────────────────────────────────────────────────]
```

**Card styling:**
- The entire comparison card: `#FFFFFF` background, 1px `#E5E5E5` border, sharp corners, `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`.
- Max width: `max-w-3xl` (~768px), centered.
- Top bar: a 4px-tall colored strip across the top of each column. Left column: `#16B364`. Right column: `#F97066`.
- Header row: photo placeholder (40px dashed-border circle) + name in Figtree 700. Background `#FFFFFF`.
- Data rows: alternate `#FFFFFF` and `#F5F5F5`. Each row has two cells. Separated by 1px `#E5E5E5` horizontal rules.
- Within each cell: the category label is in `Press Start 2P`, 8px, uppercase, `#6B7280`, `margin-bottom: 4px`. The value text is `Figtree 500`, 0.875rem, `#0A0A0A`.
- Each cell also carries an 8-bit `PixelIcon` — Bach's side gets `code` / `film` / `piano` / `star` / `controller`, theirs gets `folder` / `cross` / `music` / `sparkle` / `briefcase`.
- The last row is the punchline: their edge over a Top 100 global Brawl Stars player is being `Employed`. Play it deadpan — no italics, no wink.
- On mobile (<640px): the two columns stack vertically. Left column (Bach Le) shows fully first, then right column (Other Applicants) shows below. Each becomes a full-width card.

---

### SECTION 4: VIDEO SHOWCASE — VERTICAL SCROLLING CAROUSEL

**Background:** `#FFFFFF`
**Padding:** `py-20`

This section is inspired by the Michael Pumo portfolio site (screenshot at 4:11:33) — the dark testimonial card carousel that scrolls upward continuously.

**Layout:**

```
[────────────────────────────────────────────────────]
[                                                    ]
[  the work                                          ]  ← Figtree 800, 2rem, left-aligned
[  press play or just trust me                       ]  ← Press Start 2P, 10px, #6B7280
[                                                    ]
[              ┌──────────────────┐                  ]
[              │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                  ]  ← Dark card #1E1E1E
[              │  ▓▓ VIDEO ▓▓▓▓▓ │                  ]     280px wide, ~420px tall
[              │  ▓▓ EMBED ▓▓▓▓▓ │                  ]     (portrait aspect for TikTok/IG)
[              │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                  ]
[              │                  │                  ]
[              │  cooking video   │                  ]  ← Figtree 500, 0.875rem, white
[              │  40K+ views      │                  ]     padding: 12px 16px
[              └──────────────────┘                  ]
[              ┌──────────────────┐                  ]  ← these cards scroll upward
[              │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                  ]     in an infinite loop
[              │  ▓▓ VIDEO ▓▓▓▓▓ │                  ]
[              │  ▓▓ EMBED ▓▓▓▓▓ │                  ]
[              │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                  ]
[              │                  │                  ]
[              │  signout edit    │                  ]
[              │  40K+ views      │                  ]
[              └──────────────────┘                  ]
[              ┌──────────────────┐                  ]
[              │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                  ]
[              │  ▓▓ VIDEO ▓▓▓▓▓ │                  ]
[              │  ▓▓ EMBED ▓▓▓▓▓ │                  ]
[              │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │                  ]
[              │                  │                  ]
[              │  FBLA video      │                  ]
[              │  3rd nationally  │                  ]
[              └──────────────────┘                  ]
[                                                    ]
[────────────────────────────────────────────────────]
```

**How the vertical carousel works:**
- The carousel container is centered, `max-w-xs` (320px), with `overflow: hidden` and a fixed height of ~500px (so you see roughly one card at a time with the top of the next peeking in).
- Inside: a `div` containing all 3 cards (duplicated once for seamless loop = 6 total cards in the DOM). The inner div animates with `@keyframes scrollUp { from { transform: translateY(0); } to { transform: translateY(-50%); } }` — since the content is duplicated, scrolling 50% resets seamlessly. Animation: `scrollUp 20s linear infinite`.
- On hover over the carousel container: `animation-play-state: paused`.
- Each card: `#1E1E1E` background, sharp corners, no border-radius, 16px gap between cards.
- Video area inside each card: the TikTok and Instagram videos are portrait (9:16). The YouTube video is landscape (16:9). For uniformity in the carousel, give each card a fixed width of 280px. Portrait videos get ~420px height. The YouTube (landscape) card should still be 280px wide but the video area is shorter (~158px), with more padding below for the label.
- For embeds: try native iframe embeds first (TikTok embed.js, YouTube iframe, Instagram embed.js). If Instagram/TikTok embeds are flaky or cause CORS issues, fall back to a styled thumbnail placeholder with a centered play button (▶ in a circle) that links to the URL in a new tab.

---

### SECTION 5: SOUND DESIGN PROOF

**Background:** `#FAFAFA`
**Padding:** `py-20`

**Layout:**

```
[────────────────────────────────────────────────────]
[                                                    ]
[  i also do sound                                   ]  ← Figtree 800, 2rem
[  this is why i can build your                      ]  ← Press Start 2P, 10px, #6B7280
[  sound library                                     ]
[                                                    ]
[  ┌────────────────────────────────────────────┐    ]
[  │                                            │    ]
[  │    [  FBLA TIMELINE SCREENSHOT PLACEHOLDER │    ]  ← dashed border box
[  │       drop PNG here — 16:9 aspect ratio    │    ]     max-w-3xl, centered
[  │                                            │    ]     paper-cutout styling:
[  │                                            │    ]     white bg, 1px #E5E5E5 border
[  └────────────────────────────────────────────┘    ]     box-shadow
[                                                    ]
[  FBLA video project — multi-track audio timeline.  ]  ← Figtree 500, 0.875rem, #6B7280
[  I compose, I layer, I get it.                     ]     centered text below image
[                                                    ]
[────────────────────────────────────────────────────]
```

- The screenshot placeholder is wide — `max-w-3xl` centered. Aspect ratio roughly 16:9 since it's a screenshot of a video editing timeline.
- Paper-cutout card styling: `#FFFFFF` bg, 1px border, subtle shadow.
- Caption is centered below the card with `mt-4`.

---

### SECTION 6: WEB & UI WORK

**Background:** `#FFFFFF`
**Padding:** `py-20`

This layout is inspired by the Podia two-column cards (screenshot at 4:14:48) and the Michael Pumo project cards (screenshot at 4:11:54) — text on the left, image/screenshot on the right within each card.

**Layout:**

```
[────────────────────────────────────────────────────]
[                                                    ]
[  websites i've built                               ]  ← Figtree 800, 2rem
[                                                    ]
[  ┌──────────────────────────┐ ┌──────────────────────────┐ ]
[  │                          │ │                          │ ]
[  │  Pocket Ace              │ │  Personal Remedies       │ ]  ← Figtree 700, 1.25rem
[  │                          │ │                          │ ]
[  │  AI study tool with a    │ │  Consumer health app     │ ]  ← Figtree 500, 0.875rem
[  │  Notion-style environ-   │ │  built with a Boston     │ ]     #6B7280
[  │  ment. Built to test     │ │  healthtech startup.     │ ]
[  │  with friends and learn  │ │  Their API powers        │ ]
[  │  UI/UX.                  │ │  Amazon Alexa.           │ ]
[  │                          │ │                          │ ]
[  │  React · TypeScript      │ │  Supabase · OAuth        │ ]  ← tech tags: Figtree 500
[  │                          │ │                          │ ]     0.75rem, #16B364
[  │  ┌────────────────────┐  │ │  ┌────────────────────┐  │ ]
[  │  │                    │  │ │  │                    │  │ ]
[  │  │   [SCREENSHOT      │  │ │  │   [SCREENSHOT      │  │ ]  ← placeholder box
[  │  │    PLACEHOLDER]    │  │ │  │    PLACEHOLDER]    │  │ ]     aspect ratio 16:10
[  │  │                    │  │ │  │                    │  │ ]     dashed border
[  │  └────────────────────┘  │ │  └────────────────────┘  │ ]
[  │                          │ │                          │ ]
[  │  pocketace.it.com →      │ │  personalremedies.com →  │ ]  ← Figtree 500, 0.875rem
[  │                          │ │                          │ ]     #16B364, underlined
[  └──────────────────────────┘ └──────────────────────────┘ ]
[                                                    ]
[────────────────────────────────────────────────────]
```

**Card styling:**
- Two cards side by side in a `grid grid-cols-2 gap-6` container. On mobile (<640px): `grid-cols-1`.
- Each card: `#FFFFFF` bg, 1px `#E5E5E5` border, sharp corners, paper-cutout shadow, `padding: 24px`.
- Text lives above the screenshot. Screenshot placeholder is at the bottom of the card.
- Tech tags (`React · TypeScript`) use a dot separator, green color, small text.
- The link at the very bottom of each card, after the screenshot.

---

### SECTION 7: GRAPHIC DESIGN POSTER

**Background:** `#FAFAFA`
**Padding:** `py-20`

**Layout:**

```
[────────────────────────────────────────────────────]
[                                                    ]
[  ok fine, here's graphic design                    ]  ← Figtree 800, 2rem
[  i made this poster to prove                       ]  ← Press Start 2P, 10px, #6B7280
[  i can make posters                                ]
[                                                    ]
[          ┌──────────────────────────┐              ]
[          │                          │              ]
[          │                          │              ]
[          │    [ CANVA POSTER        │              ]  ← centered, max-w-lg (~512px)
[          │      IMAGE PLACEHOLDER ] │              ]     portrait aspect ratio ~3:4
[          │                          │              ]     paper-cutout styling
[          │                          │              ]     dashed border placeholder
[          │                          │              ]
[          └──────────────────────────┘              ]
[                                                    ]
[────────────────────────────────────────────────────]
```

- Single centered image slot. Portrait orientation (taller than wide) since it's a poster.
- Paper-cutout card: white bg, 1px border, shadow.
- No additional text needed below — the poster speaks for itself.

---

### SECTION 8: SLIDE DECK

**Background:** `#FFFFFF`
**Padding:** `py-16`

**Layout:**

```
[────────────────────────────────────────────────────]
[                                                    ]
[  slide decks                                       ]  ← Figtree 800, 2rem
[                                                    ]
[  ┌────────────────────────────────────────────┐    ]
[  │                                            │    ]
[  │    [  FBLA SLIDESHOW THUMBNAIL             │    ]  ← placeholder, 16:9 aspect
[  │       SCREENSHOT PLACEHOLDER ]             │    ]     max-w-2xl, centered
[  │                                            │    ]     paper-cutout styling
[  └────────────────────────────────────────────┘    ]
[                                                    ]
[  FBLA Bronze-placing presentation.                 ]  ← Figtree 500, 0.875rem, #6B7280
[  I don't make decks often, but when I do,          ]     centered
[  they place.                                       ]
[                                                    ]
[  view the deck →                                   ]  ← Figtree 500, 0.875rem, #16B364
[                                                    ]     centered, links to Canva/PDF
[────────────────────────────────────────────────────]
```

- Similar structure to the sound design section but with a link at the bottom.
- Landscape screenshot (16:9) since it's a slide deck.

---

### SECTION 9: DARK CTA (Final Section)

**Background:** `#141414`, full viewport width (breaks out of content column — this section is edge-to-edge dark).
**Padding:** `py-28` (extra tall, breathing room)

This section is inspired by the Michael Pumo dark layout (screenshot at 4:11:33) — dark cards, muted text, accent color pops.

**Vertical fading lines live HERE:**
- 15–25 thin vertical lines across the full width of this section, behind the content.
- Color: `#2A2A2A`.
- Each line: 1px wide, random height between 30px and 180px, positioned randomly across the horizontal axis, anchored to the top of the section, fading from full opacity at top to 0 at bottom.
- Absolutely positioned behind the text content (`z-index: 0`, content at `z-index: 1`).
- Hardcode ~20 lines with varied `left` percentages (e.g., 3%, 8%, 14%, 22%, 31%, 37%, 45%, 51%, 58%, 63%, 69%, 74%, 78%, 83%, 88%, 92%, 95%) and varied heights.

**Layout:**

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]  ← full width #141414
[  |    |       |    |       |   |      |    |       ]  ← fading vertical lines
[  |    |       |                |      |            ]     in #2A2A2A, various heights
[  |            |                                    ]     fading to transparent
[                                                    ]
[                                                    ]
[               What will it be?                     ]  ← Tegno, white, 3rem
[                                                    ]     centered
[       most people sent a DM. i gave you a          ]  ← Figtree 500, 1rem, #A0A0A0
[       website, a poster, three videos, two         ]     max-w-lg, centered
[       apps, a slideshow, and a sound design        ]     line-height: 1.75
[       screenshot. at minimum, that's gotta         ]
[       be worth a conversation.                     ]
[                                                    ]
[                                                    ]
[  ┌────────────────────┐ ┌────────────────────────┐ ]
[  │ i'm PUMPED to      │ │ i'm SUPER PUMPED to    │ ]  ← BOTH #16B364 bg, #0A0A0A
[  │ hire Bach          │ │ hire Bach              │ ]     text, Figtree 700, sharp
[  └────────────────────┘ └────────────────────────┘ ]     corners, hover: darken 10%
[                                                    ]
[     left: px-6 py-3, 0.9375rem                     ]  ← the SUPER one is a step
[     right: px-8 py-4, 1.125rem, "SUPER PUMPED"     ]     larger, and only the words
[     in italics via <em>                            ]     SUPER PUMPED are italic
[                                                    ]
[     Both open the same liquid-glass ContactModal.  ]  ← phone in Tegno, @bachqle,
[     There is no wrong answer. Stack under 640px.   ]     email. Esc / backdrop close.
[                                                    ]
[     built from scratch in an afternoon.            ]  ← Press Start 2P, 9px, #6B7280
[     no templates. yes, i used AI to help           ]     centered, mt-12
[     code it. no, i'm not ashamed.                  ]
[                                                    ]
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]
```

- This is the second Tegno moment (`What will it be?`). Smaller than the hero headline — around 3rem. The third and last is the phone number inside the contact modal.
- The body text is intentionally conversational and a little vulnerable. It's the closer.
- Two green CTA buttons, not one — the question above has two answers and both of them are yes. Sharp corners. On hover, background darkens slightly.
- The tiny Press Start 2P footnote at the bottom is a wink — honest, self-aware, and funny.

---

## 3. RESPONSIVE BEHAVIOR

| Breakpoint | Behavior |
|---|---|
| `<640px` (mobile) | Comparison card columns stack vertically. Web/UI cards stack to single column. Hero headline shrinks via `clamp()`. Video carousel stays single-column (it already is). All padding reduces slightly (`px-4` instead of `px-6`). |
| `640px–1024px` (tablet) | Everything works as desktop but content column narrows naturally via `max-w-5xl`. |
| `>1024px` (desktop) | Full layout as described above. |

---

## 4. TECHNICAL REQUIREMENTS

**Framework:** Next.js (App Router) or Vite + React — whichever scaffolds faster. Use Tailwind CSS.

**Font loading:**
- `Figtree` and `Press Start 2P`: import from Google Fonts via `<link>` in `<head>` or `@import` in global CSS.
- `Tegno`: download the font file, place in `/public/fonts/Tegno.woff2` (or `.ttf`), and register with `@font-face` in global CSS. If Tegno is unavailable anywhere, use `Space Grotesk` at weight 700 as fallback.

**Placeholder images:**
- Every `[PLACEHOLDER]` slot should render as a `div` with:
  - `border: 2px dashed #D1D5DB`
  - Background: `#F9FAFB`
  - Centered text label in `Press Start 2P`, 10px, `#9CA3AF`
  - The specified aspect ratio (use Tailwind `aspect-video` for 16:9, `aspect-[3/4]` for portrait, etc.)
- These are designed to be trivially swappable — replace the placeholder div with `<img src="..." />` and the layout holds.

**Video embeds:**
- TikTok: `<blockquote class="tiktok-embed" data-video-id="7665869308655930637">` + load `https://www.tiktok.com/embed.js`
- YouTube: `<iframe src="https://www.youtube.com/embed/5MPob2nP_Yk" ...>`
- Instagram: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DZfJsalqPp6H1SHUP6KjMz448mJKya7gfPf5nU0/">` + load `https://www.instagram.com/embed.js`
- If any embed fails or is blocked, render a styled fallback: dark card with the video title, a ▶ play icon, and an anchor tag linking out.

**Animations:**
- Vertical carousel: CSS `@keyframes` only. No JS animation libraries.
- Optional: subtle `opacity` fade-in on sections as they scroll into view, using `IntersectionObserver` with a simple CSS transition. Keep it light — `opacity 0 → 1` over 400ms. Not mandatory.

**Deployment:**
- Vercel. Repo name: `DanielPlsHireMe`.
- `vercel.json` with `{ "buildCommand": "...", "outputDirectory": "..." }` as needed.
- All links should use `target="_blank" rel="noopener noreferrer"` for external URLs.

---

## 5. FILE STRUCTURE (suggested)

```
DanielPlsHireMe/
├── public/
│   ├── fonts/
│   │   └── Tegno.woff2         ← self-hosted display font
│   └── images/                  ← drop placeholder PNGs here later
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← font imports, global styles
│   │   ├── page.tsx             ← all sections composed here
│   │   └── globals.css          ← @font-face, CSS variables, keyframes
│   └── components/
│       ├── Hero.tsx
│       ├── WhyMe.tsx
│       ├── ComparisonCard.tsx
│       ├── VideoCarousel.tsx
│       ├── SoundDesign.tsx
│       ├── WebWork.tsx
│       ├── GraphicDesign.tsx
│       ├── SlideDeck.tsx
│       ├── DarkCTA.tsx
│       └── FadingLines.tsx      ← the vertical fading lines component
├── tailwind.config.ts
├── package.json
└── vercel.json
```

---

## 6. QUICK REFERENCE — WHAT GOES WHERE

| Content | Section | Status |
|---|---|---|
| Hero headline | Section 1 | Built-in copy |
| "Why me" body text | Section 2 | Built-in copy |
| Wahoops + urnovafoodie links | Section 2 | Placeholder URLs |
| Chad photo + frown photo | Section 3 | Placeholder circles |
| Comparison chart data | Section 3 | Built-in copy |
| Cooking TikTok (40K views) | Section 4 | Embed URL provided |
| Signout YouTube (40K views) | Section 4 | Embed URL provided |
| FBLA Instagram video | Section 4 | Embed URL provided |
| FBLA timeline screenshot | Section 5 | Placeholder image slot |
| Pocket Ace screenshot | Section 6 | Placeholder image slot |
| Personal Remedies screenshot | Section 6 | Placeholder image slot |
| Canva graphic design poster | Section 7 | Placeholder image slot |
| FBLA slideshow thumbnail | Section 8 | Placeholder image slot |
| CTA link (IG DMs / email) | Section 9 | Placeholder link |
