"use client"

const logos = [
  { name: "logoipsum-388", src: "/logoipsum-388.svg" },
  { name: "logoipsum-400", src: "/logoipsum-400(1).svg" },
  { name: "logoipsum-408", src: "/logoipsum-408.svg" },
  { name: "logoipsum-412", src: "/logoipsum-412.svg" },
  { name: "logoipsum-4122", src: "/logoipsum-412.svg" },
]

// Repeat enough times so one "half" is always wider than the viewport
const track = Array(6).fill(logos).flat()

export default function LogoMarquee() {
  return (
    <div className="w-full bg-white py-10 overflow-hidden" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 60s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <p className="text-center text-xs text-muted-foreground mb-6 tracking-wide">
        Trusted by world&apos;s leading companies
      </p>

      {/* Fade edges */}
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="marquee-track flex w-max gap-16 items-center">
          {track.map((logo, i) => (
            <img
              key={`${logo.name}-${i}`}
              src={logo.src}
              alt={logo.name}
              className="h-6 w-auto object-contain invert opacity-20 hover:opacity-40 transition-opacity duration-200"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
