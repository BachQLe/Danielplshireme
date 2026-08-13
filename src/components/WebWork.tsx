import { Section, SectionTitle } from './Section'
import { Placeholder } from './Placeholder'
import { Reveal } from './Reveal'
import { FeatureCard } from './FeatureCard'

type WebProject = {
  title: string
  description: string
  screenshot: string
  screenshotPosition?: string
  href: string
  linkText: string
  frameSeed: string
  frameColor: string
  frameImage: string
  frameImagePosition: string
  frameRotate: number
}

const projects: WebProject[] = [
  {
    title: 'Pocket Ace',
    description:
      'AI study tool with a Notion-style environment. Built to test with friends and learn UI/UX.',
    screenshot: '/images/pocketace-screenshot.png',
    href: 'https://pocketace.it.com',
    linkText: 'pocketace.it.com',
    frameSeed: 'webwork-pocketace',
    frameColor: 'bg-pop-mint',
    frameImage: '/images/texture-bar.jpg',
    frameImagePosition: 'center 35%',
    frameRotate: 1.5,
  },
  {
    title: 'Healthtech App',
    description:
      'Consumer health app built with a Boston healthtech startup. Their API powers Amazon Alexa. *WIP',
    screenshot: '/images/personal-remedies-screenshot.png',
    screenshotPosition: 'object-[center_15%]',
    href: 'https://remedy-nine.vercel.app/app/home',
    linkText: 'see my WIP app',
    frameSeed: 'webwork-remedies',
    frameColor: 'bg-pop-blue',
    frameImage: '/images/texture-deco.jpg',
    frameImagePosition: 'center 40%',
    frameRotate: -1.5,
  },
]

export function WebWork() {
  return (
    <Section tone="canvas" padding="lg">
      <SectionTitle icon="code">websites i've built</SectionTitle>

      <Reveal className="mt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            // WebProject stays a typed data array — title / description /
            // tags / href / linkText map straight through to FeatureCard's
            // own props (linkText -> ctaLabel) instead of getting
            // hardcoded per-card. FeatureCard now owns the full panel ->
            // translucent rounded-card frame -> opaque rounded-mat padding
            // stack, so each card only needs a bare <Placeholder> as
            // children — this is a structural reorder from the old layout,
            // not a re-skin: the CTA used to sit below the screenshot in a
            // bottom wrapper, and now lives above it, inside the card top.
            <FeatureCard
              key={project.title}
              title={project.title}
              description={project.description}
              href={project.href}
              ctaLabel={project.linkText}
              seed={project.frameSeed}
              color={project.frameColor}
              image={project.frameImage}
              imagePosition={project.frameImagePosition}
              rotate={project.frameRotate}
            >
              <Placeholder
                label={`${project.title.toUpperCase()} SCREENSHOT — DROP PNG HERE`}
                aspect="aspect-square"
                src={project.screenshot}
                alt={`${project.title} screenshot`}
                className={project.screenshotPosition}
              />
            </FeatureCard>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
