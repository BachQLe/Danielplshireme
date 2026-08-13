import { FadingLines } from "./FadingLines";
import { Section, SectionTitle } from "./Section";
import { ZoomableImage } from "./ZoomableImage";
import { ColorSlab } from "./deco/ColorSlab";

const LINKS = [
  {
    label: "Multimedia Producer @wahoops_ ↗",
    href: "https://instagram.com/wahoops_",
  },
  {
    label: "Freelance editor & shooter @ urnovafoodie ↗",
    href: "https://instagram.com/urnovafoodie",
  },
];

/** The letter. Left-aligned, unlike the centered hero above it. */
export function WhyMe() {
  return (
    <Section tone="surface" padding="lg" className="relative overflow-hidden">
      {/* Same decorative texture as DarkCTA's FadingLines, recoloured for a
          light surface (`bg-line` vs. its `bg-line-dark`) — see the token
          comment in index.css. `relative z-10` on this wrapper is what lifts
          the real content above the z-0 lines; positioned descendants at
          z-index 0 otherwise paint over static in-flow ones regardless of
          DOM order. */}
      <FadingLines color="bg-line" growWithHero />
      <div className="relative z-10">
        <SectionTitle icon="star">me</SectionTitle>
        {/* relative wrapper so the polaroid below can be positioned against
            THIS box rather than passing `absolute` into a component whose own
            base classes might collide with it (hard rule 0) — nothing here
            declares `relative` itself, but keeping the position local to this
            block, not the whole Section, is what lets it track the text
            instead of the section's full padded height. */}
        <div className="relative">
          <div className="max-w-4xl space-y-6 pr-0 text-[1rem] font-medium leading-[1.75] text-ink sm:pr-72 lg:pr-96">
            {" "}
            <div>
              <p className="mb-3 mt-6 font-figtree text-xl font-extrabold text-ink">
                about me
              </p>
              <ul className="mb-6 list-none space-y-1 pl-0 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent-green">—</span>
                  <span>
                    Video editor and web designer who just graduated high school
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">—</span>
                  <span>I Edit cooking videos for fun</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">—</span>
                  <span>
                    Placed 8th in DECA's ICDC + 3rd nationally in FBLA's Digital
                    Video Production
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">—</span>
                  <span>Multimedia Producer at Wahoops (45K followers)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">—</span>
                  <span>
                    Freelance shoot + edit videos for a local food blogger
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">—</span>
                  <span>
                    Started learning UI/UX a year ago by building and testing a
                    study app among friends
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-green">—</span>
                  <span>
                    Currently building a consumer app for a healthtech company
                  </span>
                </li>
              </ul>
              <p className="mb-3 mt-6 font-figtree text-xl font-extrabold text-ink">
                why me
              </p>
              <p>
                I'm someone who gets easily obsessed and that trait has me put
                my all into everything I do. Design has always been the thing I
                stay up late doing — whether it's tweaking buttons on my sites or editing a cool shot for a video project.
              </p>
              <p className="indent-8">
                I also
                love shooting shots and i'm not scared of
                rejection. I wrote cold emails to professors by hand and got
                rejected by 20 before I landed 2 research assistant roles, one
                at Wharton and one at UCLA. I think every 'no' is a point of data and a chance to adapt and grow,
                and I wouldn't be where I am without rejections.
              </p>
              <p className="indent-8">
                So when I'm designing your graphics,
                building your slideshows, and compiling your sound library, I
                will put that same obsessive effort into every single one — and
                if the first version happens to miss something, I'll make
                another one until everything is up to standard!
              </p>
            </div>
            <div>
              <p className="mb-4 font-figtree text-xl font-extrabold text-ink">
                why i want this
              </p>
              <p>
                I want this because I'm going to learn/work marketing under real,
                successful people and this is a fire way to meet that goal. For backstory I ED'd to my college, UVA, because they had
                an IB pipeline. But as I was chasing prestige, I realized this
                isn't what little me wanted — what my 5 year old self wanted.
                I've spent my childhood and high school years invested in
                film, and after reflecting on myself I realized marketing could totally
                be my thing.
              </p>
              <p className="indent-8">
                Despite the 'lower aura' and unclear road, i'm
                going to run down the path of marketing and create a fulfilling
                life for myself. This internship application is a trail blazer
                on that path, and like everything else i'm giving my all into
                building it — which is why you're reading this on a website and
                not a insta DM.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-start gap-2">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.875rem] font-medium text-green underline decoration-green/60 underline-offset-2 transition-colors duration-200 hover:text-green-dark hover:decoration-green-dark"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Polaroid stack: proof someone reached out first, plus a couple of
            personal ones underneath. Sits to the right of the copy on sm+
            (positioned by this wrapper, not by a class on the card — same
            convention as Frame/ColorSlab); stacks below the text, centered,
            on mobile where there's no room beside it. `flex-col` (not
            `sm:block`) so the `gap-10` below actually applies at every
            breakpoint — block children don't respect `gap`. */}
          <div className="mt-10 flex flex-col items-center gap-24 sm:absolute sm:right-6 sm:top-0 sm:mt-0 sm:w-52 lg:right-8 lg:w-64">
            <div className="relative isolate w-48 sm:w-full">
              {/* Positioned by the wrapper, not by a class on ColorSlab — see the
                note in deco/Frame.tsx about `absolute` losing to ColorSlab's
                own `relative` in the cascade. `top-1/2` keeps the slab out of
                the card's upper half entirely — it only starts at the
                midline and bleeds past the bottom edge, so the colour reads
                as tucked in low behind the photo instead of a halo evenly
                surrounding it. The bleed is bigger than it looks like it
                should need (`-inset-x-2`/`-bottom-8`, not a token `-1`/`-2`):
                ColorSlab's own texture (grain+blotch) needs a reveal on the
                order of tens of px to read as textured rather than a flat
                sliver — see its `imagePosition` doc's "~45-80px ring" note —
                so a thin peek here just showed flat colour with no grain. */}
              <div className="absolute -inset-x-2 top-8 -bottom-8 -z-10">
                <ColorSlab
                  seed="why-me-polaroid"
                  color="bg-pop-violet"
                  image="/images/texture-deco.jpg"
                  rotate={2}
                  className="h-full w-full"
                />
              </div>
              <figure className="paper relative z-10 w-full rotate-[-4deg] p-3 pb-8 transition-transform duration-300 ease-out hover:rotate-[-1deg]">
                <ZoomableImage
                  src="/images/why-me-text.png"
                  alt="Text message from a marketing bootcamp recruiter reaching out after reviewing my application"
                  className="aspect-square w-full object-cover"
                />
              </figure>
            </div>

            {/* Two more, same recipe as above — only the seed (fresh tear per
              slab), color (cycled to the next pop ink so the stack doesn't
              read as one repeated card), and figure tilt change. */}
            <div className="relative isolate w-48 sm:w-full">
              <div className="absolute -inset-x-2 top-8 -bottom-8 -z-10">
                <ColorSlab
                  seed="why-me-polaroid-2"
                  color="bg-pop-coral"
                  image="/images/texture-deco.jpg"
                  rotate={-2}
                  className="h-full w-full"
                />
              </div>
              <figure className="paper relative z-10 w-full rotate-[3deg] p-3 pb-8 transition-transform duration-300 ease-out hover:rotate-[1deg]">
                <ZoomableImage
                  src="/images/roblox-grad-still.jpg"
                  alt="My Roblox avatar in a cap and gown at a graduation-themed event"
                  className="aspect-square w-full object-cover"
                />
              </figure>
            </div>

            <div className="relative isolate w-48 sm:w-full">
              <div className="absolute -inset-x-2 top-8 -bottom-8 -z-10">
                <ColorSlab
                  seed="why-me-polaroid-3"
                  color="bg-pop-mint"
                  image="/images/texture-deco.jpg"
                  rotate={2}
                  className="h-full w-full"
                />
              </div>
              <figure className="paper relative z-10 w-full rotate-[-3deg] p-3 pb-8 transition-transform duration-300 ease-out hover:rotate-[-1deg]">
                <ZoomableImage
                  src="/images/park-selfie.png"
                  alt="Selfie on a walking trail, making a face at the camera"
                  className="aspect-square w-full object-cover"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
