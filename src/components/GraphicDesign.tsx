import { Section, SectionTitle, PixelNote } from './Section'
import { Placeholder } from './Placeholder'
import { Reveal } from './Reveal'
import { FeatureCard } from './FeatureCard'

export function GraphicDesign() {
  // `canvas`, not `surface`: this now sits directly under WhyMe, which is the
  // white content cell. Two `surface` sections in a row merge into one
  // undifferentiated white block with a hairline through it, and the page's
  // tint-is-gutter / white-is-content read collapses.
  return (
    <Section tone="canvas" padding="lg">
      <SectionTitle icon="sparkle">here is how I would tackle graphic design</SectionTitle>
      <PixelNote className="mt-2">
        i work more in website design + video than
        <br />
        graphic design. i made this for the application
      </PixelNote>

      {/*
        FeatureCard now owns the full padding stack — panel padding, the
        translucent rounded-card frame, and the opaque rounded-mat mat
        around the screenshot — so this call site just hands it a bare
        <Placeholder> as children. There's no separate `.paper p-3`
        wrapper left to reconcile against here.
      */}
      <Reveal className="mt-8">
        {/* Placeholder URL — swap for the real hosted link once this project has one. */}
        <FeatureCard
          title="Hiring Instagram Graphic"
          description="built in canva with mints media logo branding"
          href="https://canva.link/zflkzsc29hhd2jb"
          ctaLabel="open in canva"
          seed="graphic-design"
          color="bg-pop-yellow"
          image="/images/texture-lounge.jpg"
          imagePosition="center 25%"
          rotate={1}
          className="mx-auto max-w-3xl"
        >
          <Placeholder
            label="CANVA POSTER — DROP PNG HERE"
            aspect="aspect-square"
            src="/images/hiring-graphic.png"
            alt="Graphic design poster made in Canva"
            className="object-top"
          />
        </FeatureCard>
      </Reveal>
    </Section>
  )
}
