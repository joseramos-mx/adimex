"use client"

import { ArrowUpRight } from "lucide-react"

const cards = [
  {
    title: "Robot Systems",
    description:
      "KUKA offers industrial robots in a wide range of versions with various payload capacities and reaches. Learn more!",
    image: null,
  },
  {
    title: "Production Systems",
    description:
      "KUKA offers industrial robots in a wide range of versions with various payload capacities and reaches. Learn more!",
    image: null,
  },
  {
    title: "Production Machines",
    description:
      "KUKA offers industrial robots in a wide range of versions with various payload capacities and reaches. Learn more!",
    image: null,
  },
]

export default function Articles() {
  return (
    <section className="w-full bg-[#07080c] py-20 px-6">
      <h2
        className="text-white text-center text-3xl font-bold mb-12"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        Discover the variety of automation solutions by ADIMEX
      </h2>

      <div className="max-w-6xl mx-auto border border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {cards.map((card) => (
          <div key={card.title} className="flex flex-col p-0 ">
            {/* Image area */}
            <div className="w-full aspect-4/3 bg-[#111318] flex items-center justify-center">
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#111318]" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-6 flex-1">
              <h3
                className="text-[#a7a9ac] font-bold text-lg"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "#a7a9ac",
                  fontFamily: "var(--font-geist-sans)",
                }}
              >
                {card.description}
              </p>

              {/* Button */}
              <div className="flex items-center mt-auto pt-4">
                <button className="flex items-center gap-0 group">
                  <span className="bg-[#017bfd] p-2 flex items-center justify-center">
                    <ArrowUpRight size={16} className="text-white" />
                  </span>
                  <span
                    className=" px-4 py-2 text-[#07080c] text-xs bg-white hover:bg-[#017bfd] hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Leer más
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
