"use client"

import { motion, useInView, Variants } from "motion/react"
import { ElementType, ReactNode, RefObject } from "react"

interface TimelineContentProps {
    as?: ElementType
    className?: string
    animationNum?: number
    customVariants?: {
        visible: (i: number) => object
        hidden: object
    }
    timelineRef: RefObject<HTMLElement | null>
    children: ReactNode
    style?: React.CSSProperties
}

export function TimelineContent({
    as: Tag = "div",
    className,
    animationNum = 0,
    customVariants,
    timelineRef,
    children,
    style,
}: TimelineContentProps) {
    const isInView = useInView(timelineRef as RefObject<Element>, { once: true, margin: "-80px" })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionTag = motion.create(Tag as any) as any

    return (
        <MotionTag
            className={className}
            style={style}
            custom={animationNum}
            variants={customVariants as Variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {children}
        </MotionTag>
    )
}
