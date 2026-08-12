import { ZoomableImage } from './ZoomableImage'

type PlaceholderProps = {
  /** Label shown in the middle of the empty slot. */
  label: string
  /** Tailwind aspect utility, e.g. "aspect-video" or "aspect-[3/4]". */
  aspect?: string
  /** Swap in a real image without touching the layout. */
  src?: string
  alt?: string
  className?: string
}

/**
 * An image slot. Renders a dashed placeholder until `src` is supplied, then
 * renders the image at the same aspect ratio so the layout never shifts.
 */
export function Placeholder({
  label,
  aspect = 'aspect-video',
  src,
  alt,
  className = '',
}: PlaceholderProps) {
  if (src) {
    return (
      <ZoomableImage
        src={src}
        alt={alt ?? label}
        className={`border border-rule object-cover ${aspect} ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed border-placeholder-border bg-placeholder-bg px-4 ${aspect} ${className}`}
    >
      <span className="font-pixel text-placeholder-text text-center text-[10px] leading-[1.8]">
        {label}
      </span>
    </div>
  )
}
