"use client"

import { motion, useInView, Variants } from "motion/react"
import { ElementType, ReactNode, RefObject } from "react"

interface TimelineContentProps extends Record<string, unknown> {
    as?: ElementType
    className?: string
    animationNum?: number
    customVariants?: {
        visible: (i: number) => object
        hidden: object
    }
    timelineRef: RefObject<HTMLElement | null>
    children: ReactNode
}

export function TimelineContent({
    as: Tag = "div",
    className,
    animationNum = 0,
    customVariants,
    timelineRef,
    children,
    ...rest
}: TimelineContentProps) {
    const isInView = useInView(timelineRef as RefObject<Element>, { once: true, margin: "-80px" })
    const MotionTag = motion.create(Tag as string)

    return (
        <MotionTag
            className={className}
            custom={animationNum}
            variants={customVariants as Variants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            {...rest}
        >
            {children}
        </MotionTag>
    )
}
