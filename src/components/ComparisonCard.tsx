import { Section, SectionTitle } from './Section'
import { Reveal } from './Reveal'
import { IconBadge } from './Accent'
import { PixelIcon, type PixelIconName } from './PixelIcon'
import { ColorSlab } from './deco/ColorSlab'

type ComparisonRow = {
  label: string
  mine: string
  theirs: string
  iconMine: PixelIconName
  iconTheirs: PixelIconName
}

const rows: ComparisonRow[] = [
  {
    label: 'SPEED',
    mine: 'Willing to pump designs quickly',
    theirs: 'Probably slow af',
    iconMine: 'play',
    iconTheirs: 'cross',
  },
  {
    label: 'SOUND',
    mine: '12 years pianist + knows sound design',
    theirs: 'Spams ding sound effects',
    iconMine: 'music',
    iconTheirs: 'music',
  },
  {
    label: 'WEB / UI',
    mine: 'Knows React/TS and UI/UX',
    theirs: 'Purple gradient vibecoding',
    iconMine: 'star',
    iconTheirs: 'sparkle',
  },
  {
    label: 'GRAPHIC DESIGN',
    mine: 'Attention-grabbing + human designs ',
    theirs: 'Default Canva template + GPT posters',
    iconMine: 'sparkle',
    iconTheirs: 'cross',
  },
  {
    label: 'VIDEO EDITING',
    mine: '3 yrs DaVinci Resolve',
    theirs: 'iMovie warrior',
    iconMine: 'film',
    iconTheirs: 'cross',
  },
  {
    label: 'THE EDGE',
    mine: 'SUPER PUMPED!',
    theirs: 'Not as pumped',
    iconMine: 'heart',
    iconTheirs: 'cross',
  },
]

type ColumnProps = {
  name: string
  accent: string
  textAccent: string
  badgeIcon: PixelIconName
  badgeAccent: 'green' | 'coral'
  side: 'mine' | 'theirs'
  divider?: boolean
}

/**
 * One full side of the comparison — accent strip, header, all data rows —
 * rendered as direct grid children (not a wrapping element) so the parent
 * grid can align rows across both columns and stack them cleanly on mobile.
 */
function Column({ name, accent, textAccent, badgeIcon, badgeAccent, side, divider }: ColumnProps) {
  // Follows the RuleGrid convention: exactly one owner per seam, never
  // `border` on every cell. The right column alone owns the vertical seam
  // between columns, and each row alone owns its own top edge — if both
  // neighbors on a shared seam drew it, the seam would render 2px and
  // visibly darker than the rest of the page's hairlines.
  const dividerClass = divider ? 'sm:border-l sm:border-rule' : ''

  return (
    <>
      <div className={`h-1 ${accent} ${dividerClass}`} />
      <div className={`flex items-center gap-3 bg-surface p-4 ${dividerClass}`}>
        <PixelIcon
          name={side === 'mine' ? 'happy-face' : 'sad-face'}
          size={40}
          className={textAccent}
        />
        <span className="text-base font-bold text-ink">{name}</span>
        <IconBadge icon={badgeIcon} accent={badgeAccent} surface="solid" className="ml-auto" />
      </div>
      {rows.map((row, i) => {
        const value = side === 'mine' ? row.mine : row.theirs
        const icon = side === 'mine' ? row.iconMine : row.iconTheirs
        const rowBg = i % 2 === 0 ? 'bg-surface' : 'bg-row-alt'

        return (
          <div
            key={row.label}
            className={`border-t border-rule p-4 ${rowBg} ${dividerClass}`}
          >
            <p className="font-pixel mb-1 text-[8px] uppercase text-muted">
              {row.label}
            </p>
            <p className="flex items-center gap-2 text-[0.875rem] font-medium text-ink">
              <PixelIcon name={icon} size={14} className={textAccent} />
              {value}
            </p>
          </div>
        )
      })}
    </>
  )
}

export function ComparisonCard() {
  return (
    <Section tone="surface" padding="lg">
      <SectionTitle icon="trophy">me vs. other interns</SectionTitle>

      <Reveal className="mt-10">
        <div className="relative isolate mx-auto max-w-3xl">
          {/* Positioned by the wrapper, not by a class on ColorSlab — see the
              note in deco/Frame.tsx about `absolute` losing to ColorSlab's
              own `relative` in the cascade. */}
          <div className="absolute -inset-3 -z-10">
            <ColorSlab
              seed="comparison-slab"
              color="bg-pop-lime"
              image="/images/texture-deco.jpg"
              rotate={-1.5}
              className="h-full w-full"
            />
          </div>
          <div className="paper relative z-10 grid grid-cols-1 overflow-hidden sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[repeat(8,auto)]">
            <Column
              name="Bach Le"
              accent="bg-green"
              textAccent="text-green"
              badgeIcon="check"
              badgeAccent="green"
              side="mine"
            />
            <Column
              name="Other Applicants"
              accent="bg-coral"
              textAccent="text-coral"
              badgeIcon="cross"
              badgeAccent="coral"
              side="theirs"
              divider
            />
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
