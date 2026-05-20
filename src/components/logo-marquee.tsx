const logos = [
  { name: "FEMSA",         src: "/femsalogo.svg" },
  { name: "Atlas Copco",   src: "/alliies/logos/Atlas-Copco.png" },
  { name: "Be Grand",      src: "/alliies/logos/begrand.png" },
  { name: "City Express",  src: "/alliies/logos/cityexpress.svg" },
  { name: "SACMEX",        src: "/alliies/logos/sacmex.png" },
]

export default function LogoMarquee() {
  return (
    <div className="w-full bg-[#07080c] py-12 px-6" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[11px] font-mono text-white/25 tracking-widest uppercase mb-10">
          Empresas que confían en ADIMEX
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-10 items-center justify-items-center">
          {logos.map((logo) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              className="h-8 w-auto max-w-30 object-contain opacity-40 brightness-0 invert"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
