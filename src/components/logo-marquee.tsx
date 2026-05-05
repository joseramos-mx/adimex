"use client"

const logos = [
  { name: "FEMSA", src: "/femsalogo.svg" },
  { name: "SmartFit", src: "/smartfitlogo.svg" },
]

// Repeat enough times so one "half" is always wider than the viewport
const track = Array(6).fill(logos).flat()

export default function LogoMarquee() {
  return (
    <div className="w-full bg-[#07080c] text-white py-10 overflow-hidden" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 60s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <p className="text-center text-xs text-muted-foreground mb-6 tracking-wide">
        Empresas que confían en ADIMEX
      </p>

      {/* Fade edges */}
      <div
        className="relative overflow-hidden"
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
              className="h-8 w-auto object-contain opacity-20 hover:opacity-40 transition-opacity duration-200"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
