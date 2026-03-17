"use client"

const logos = [
  { name: "logoipsum-388", src: "/logoipsum-388.svg" },
  { name: "logoipsum-400", src: "/logoipsum-400(1).svg" },
  { name: "logoipsum-408", src: "/logoipsum-408.svg" },
  { name: "logoipsum-412", src: "/logoipsum-412.svg" },
  { name: "logoipsum-4122", src: "/logoipsum-412.svg" },
]

export default function LogoMarquee() {
  return (
    <div className="w-full bg-white py-10" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <p className="text-center text-xs text-muted-foreground mb-5 tracking-wide">
        Trusted by world&apos;s leading companies
      </p>
      <div className="flex items-center justify-between w-[62%] mx-auto ">
        {logos.map((logo) => (
          <img
            key={logo.name}
            src={logo.src}
            alt={logo.name}
            className="h-6 w-auto object-contain hover:opacity-70 transition-opacity duration-200 invert opacity-20"
          />
        ))}
      </div>
    </div>
  )
}
