"use client"

import { useEffect } from "react"
import { trackMetaEvent } from "@/lib/meta-pixel"

/**
 * Dispara `ViewContent` de Meta Pixel al montar la ficha de producto.
 * El wrapper cliente permite mantener la página como Server Component.
 */
export default function ViewContentTracker({
  contentId,
  contentName,
  value,
  currency = "MXN",
}: {
  contentId: string
  contentName: string
  value?: number
  currency?: string
}) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_ids: [contentId],
      content_type: "product",
      content_name: contentName,
      ...(value !== undefined ? { value, currency } : {}),
    })
  }, [contentId, contentName, value, currency])

  return null
}
