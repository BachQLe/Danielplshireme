import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Hero } from './components/Hero'
import { WhyMe } from './components/WhyMe'
import { WorkSection } from './components/ProjectScroller'
import { SoundDesign } from './components/SoundDesign'
import { WebWork } from './components/WebWork'
import { GraphicDesign } from './components/GraphicDesign'
import { SlideDeck } from './components/SlideDeck'
import { ComparisonCard } from './components/ComparisonCard'
import { DarkCTA } from './components/DarkCTA'
import { RuleLayer } from './components/rules/RuleLayer'
import { Navbar } from './components/Navbar'
import { ContactModal } from './components/ContactModal'

export default function App() {
  const [open, setOpen] = useState(false)
  // Points at whichever button was actually clicked, so focus returns to
  // the right one when the modal closes.
  const triggerRef = useRef<HTMLElement | null>(null)

  function handleOpenContact(event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget
    setOpen(true)
  }

  return (
    <>
      <Navbar onOpenContact={handleOpenContact} />
      {/* Mounted once, for the whole page. Every vertical hairline on the site
          is drawn here — no section draws its own, which is the only way they
          stay on one x-position from the top of the page to the bottom. */}
      <RuleLayer />
      {/*
        `[&>*+*]:border-t` puts EVERY section boundary on the parent instead of
        on the sections themselves. The alternative — each section drawing its
        own `border-b` with `last:border-b-0` — forces every section to know
        whether it is the last one, and the moment two adjacent blocks both
        think they own the seam between them it renders 2px and reads visibly
        darker than the rest of the page's hairlines. Here each boundary has
        exactly one owner by construction, and a section can be reordered
        (Work + WhyMe + Graphic just moved down here) without touching a
        single border.

        Note this is `[&>*+*]:border-t`, not `divide-y`: `divide-*` only draws
        between children and can never supply an outer edge, so mixing it with
        anything that does is the classic doubled-seam bug.
      */}
      <main className="[&>*+*]:border-t [&>*+*]:border-rule">
        <Hero />
        <WhyMe />
        <GraphicDesign />
        <SoundDesign />
        <WebWork />
        <SlideDeck />
        <WorkSection />
        <ComparisonCard />
        <DarkCTA onOpenContact={handleOpenContact} />
      </main>
      <ContactModal open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
    </>
  )
}
