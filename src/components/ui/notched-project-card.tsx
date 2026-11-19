import type { CSSProperties, ReactNode } from "react";

// Notched card, themed: text, borders and the notch follow the site palette.
// The notch cuts the bottom corner; the disc holds an icon (arrow by default).

export type NotchSide = "bottom-right" | "bottom-left" | "none";

export interface NotchedProjectCardProps {
  href?: string;
  title: string;
  image?: string;
  imageAlt?: string;
  hideTitle?: boolean;
  coverAspectClassName?: string;
  coverClassName?: string;
  coverStyle?: CSSProperties;
  coverContent?: ReactNode;
  description?: string;
  children?: ReactNode;
  badge?: string;
  stepLabel?: string;
  tags?: string[];
  technologies?: string[];
  highlightFirstTag?: boolean;
  screen?: { src: string; alt: string; className?: string };
  dim?: number;
  monochrome?: boolean;
  surface?: string;
  accent?: string;
  accentForeground?: string;
  badgeBackground?: string;
  badgeForeground?: string;
  icon?: ReactNode;
  notch?: NotchSide;
  className?: string;
}

const DISC = 64;
const BLOCK = 80;
const FILLET = 28;

const ArrowIcon = () => (
  <svg className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

export function NotchedProjectCard({
  href,
  title,
  image,
  imageAlt = "",
  hideTitle = false,
  coverAspectClassName = "aspect-[4/3]",
  coverClassName = "bg-[var(--secondary)]",
  coverStyle,
  coverContent,
  description,
  children,
  badge,
  stepLabel,
  tags = [],
  technologies = [],
  highlightFirstTag = false,
  screen,
  dim = screen ? 0.45 : 0,
  monochrome = false,
  surface = "var(--background)",
  accent,
  accentForeground,
  badgeBackground = "var(--highlight)",
  badgeForeground = "var(--accent-ink)",
  icon,
  notch = "bottom-right",
  className = "",
}: NotchedProjectCardProps) {
  const side = notch === "bottom-left" ? "left" : "right";
  const hasNotch = notch !== "none" && !stepLabel;
  const edge: CSSProperties = side === "right" ? { right: 0 } : { left: 0 };
  const cornerRadius: CSSProperties =
    side === "right" ? { borderTopLeftRadius: BLOCK - DISC / 2 } : { borderTopRightRadius: BLOCK - DISC / 2 };
  const fillet = (position: CSSProperties) => ({
    ...position,
    width: FILLET,
    height: FILLET,
    background: `radial-gradient(circle at ${side === "right" ? "top left" : "top right"}, transparent ${FILLET - 0.5}px, ${surface} ${FILLET}px)`,
  });

  const imageTone = monochrome
    ? "grayscale transition-[filter,scale] duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0"
    : "transition-[scale] duration-500";

  const discStyle: CSSProperties = {
    width: DISC,
    height: DISC,
    bottom: 0,
    ...edge,
    backgroundColor: accent ?? "var(--accent)",
    color: accentForeground ?? "var(--accent-ink)",
  };

  const content = (
    <>
      <div className="relative">
        <div className={`relative ${coverAspectClassName} overflow-hidden rounded-[28px] border-0 bg-transparent`}>
          {image ? (
            <img
              src={image}
              alt={screen ? "" : imageAlt}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover ${imageTone} ${screen ? "" : "group-hover:scale-[1.04]"}`}
            />
          ) : (
            <div
              aria-hidden="true"
              className={`absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.04] ${coverClassName}`}
              style={coverStyle}
            >
              {coverContent}
            </div>
          )}

          {dim > 0 && <div aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: `rgb(0 0 0 / ${dim})` }} />}

          {screen && (
            <img
              src={screen.src}
              alt={screen.alt}
              className={`absolute bottom-0 right-0 w-[82%] origin-bottom-right drop-shadow-[0_18px_40px_rgba(0,0,0,0.5)] group-hover:scale-[1.07] ${imageTone} ${screen.className ?? ""}`}
            />
          )}

          {badge && (
            <div
              aria-label={`Category: ${badge}`}
              className="pointer-events-none absolute left-0 top-0 z-10"
            >
              <div
                className="flex h-8 items-center rounded-br-[12px] px-1.5"
                style={{ background: surface }}
              >
                <span
                  className="rounded-sm border-0 px-1.5 py-1 text-[9px] font-semibold uppercase leading-none tracking-[0.12em]"
                  style={{ background: badgeBackground, color: badgeForeground }}
                >
                  {badge}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="absolute -right-[28px] top-0"
                style={{
                  width: 28,
                  height: 28,
                  background:
                    "radial-gradient(circle at bottom right, transparent 27.5px, " +
                    surface +
                    " 28px)",
                }}
              />
              <span
                aria-hidden="true"
                className="absolute left-0 -bottom-[28px]"
                style={{
                  width: 28,
                  height: 28,
                  background:
                    "radial-gradient(circle at bottom right, transparent 27.5px, " +
                    surface +
                    " 28px)",
                }}
              />
            </div>
          )}

          {stepLabel && (
            <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-white backdrop-blur-md">
              {stepLabel}
            </span>
          )}
        </div>

        {hasNotch && (
          <>
            <div aria-hidden="true" className="absolute bottom-0" style={{ width: BLOCK, height: BLOCK, background: surface, ...edge, ...cornerRadius }} />
            <span aria-hidden="true" style={fillet({ bottom: BLOCK, ...edge })} />
            <span aria-hidden="true" style={fillet({ bottom: 0, [side]: BLOCK } as CSSProperties)} />
            <span
              aria-hidden="true"
              className="absolute flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 group-hover:brightness-95"
              style={discStyle}
            >
              {icon ?? <ArrowIcon />}
            </span>
          </>
        )}
      </div>

      <h3
        className={
          hideTitle
            ? "sr-only"
            : "mt-5 text-2xl font-medium tracking-tight text-[var(--foreground)]"
        }
      >
        {title}
      </h3>
      {description && <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/70">{description}</p>}
      {children}
      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className={
                highlightFirstTag && index === 0
                  ? "rounded-md bg-[var(--highlight)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-ink)]"
                  : "rounded-md border border-[var(--foreground)]/15 bg-[var(--foreground)]/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground)]/75"
              }
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      {technologies.length > 0 && (
        <ul aria-label="Technologies used" className="mt-4 flex flex-wrap gap-2">
          {technologies.map((technology, index) => (
            <li
              key={`${technology}-${index}`}
              className={
                index === 0
                  ? "rounded-md bg-[var(--highlight)] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-ink)]"
                  : "rounded-md border border-[var(--foreground)]/15 bg-[var(--foreground)]/[0.04] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground)]/75"
              }
            >
              {technology}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const wrapperClassName = `group flex flex-col rounded-[28px] ${
    href ? "outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]" : ""
  } ${className}`;

  return href ? (
    <a href={href} className={wrapperClassName}>
      {content}
    </a>
  ) : (
    <article className={wrapperClassName}>{content}</article>
  );
}

export default NotchedProjectCard;
