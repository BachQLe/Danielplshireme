import { Section, SectionTitle, PixelNote } from './Section'
import { Placeholder } from './Placeholder'
import { Reveal } from './Reveal'
import { FeatureCard } from './FeatureCard'

export function SoundDesign() {
  return (
    <Section tone="surface" padding="lg">
      <SectionTitle icon="music">i do sound design</SectionTitle>
      <PixelNote className="mt-2">
        i can build your
        <br />
        sound library + music library
      </PixelNote>

      {/*
        This is the first of five image-section FeatureCards down the
        page (this one, both WebWork cards, GraphicDesign, SlideDeck),
        sharing just three plates between them: lounge -> bar -> deco ->
        lounge -> bar. That order is deliberate so no two ADJACENT cards
        repeat a plate, counting WhyMe and Work above and Comparison
        below even though those stay flat pop ink. imagePosition is set
        per-instance rather than left at ColorSlab's 'center' default
        because only a thin ring of the slab shows past the opaque mat
        in front of it — see ColorSlab's `imagePosition` prop doc for
        why bare 'center' would hide the readable part of each plate
        instead of showing it.
      */}
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
          title="Timeline for one of my video projects"
          description="I have 12 years of classical piano experience which helps me a lot with sound design"
          seed="sound-design"
          color="bg-pop-pink"
          image="/images/texture-lounge.jpg"
          imagePosition="center 30%"
          rotate={-1}
          className="mx-auto max-w-3xl"
        >
          <Placeholder
            label="FBLA TIMELINE SCREENSHOT — DROP PNG HERE"
            aspect="aspect-square"
            src="/images/fbla-audio-timeline.png"
            alt="Screenshot of the multi-track audio timeline from the FBLA video project"
          />
        </FeatureCard>
      </Reveal>
    </Section>
  )
}
