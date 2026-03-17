"use client"

import { motion } from "motion/react"
import { CallToAction } from "@/components/ui/cta-3"

export default function CTA() {
    return (
        <section data-theme="light" className="w-full bg-white py-24 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <CallToAction />
            </motion.div>
        </section>
    )
}
