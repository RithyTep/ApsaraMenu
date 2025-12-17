import React, { useEffect, useRef } from "react"
import { useEditor } from "@craftjs/core"
import { useLayer } from "@craftjs/layers"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// Minimal version to test if LayerHeader is causing the infinite loop
export default function LayerHeader() {
  const {
    id,
    expanded,
    children,
    connectors: { drag, layerHeader },
    actions: { toggleLayer }
  } = useLayer(layer => ({
    expanded: layer.expanded
  }))

  const hasChildren = children.length > 0

  // Only subscribe to selected state
  const { selected } = useEditor((state, query) => ({
    selected: query.getEvent("selected").first() === id
  }))

  const divRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (divRef.current) drag(divRef.current)
  }, [drag])

  useEffect(() => {
    if (headerRef.current) layerHeader(headerRef.current)
  }, [layerHeader])

  // Get display name on-demand (not reactive)
  const { query } = useEditor()
  let displayName = "Unknown"
  try {
    const node = query.node(id).get()
    displayName =
      node?.data?.custom?.displayName ?? node?.data?.displayName ?? "Unknown"
  } catch {
    // ignore
  }

  return (
    <div
      ref={divRef}
      className={cn(
        selected
          ? "rounded-sm bg-indigo-500 text-white"
          : "bg-transparent text-gray-700 dark:text-gray-100",
        "flex flex-row items-center px-2 py-2"
      )}
    >
      <div ref={headerRef} className="flex grow flex-row items-center">
        <span className="layer-name flex grow items-center gap-2 text-xs">
          {displayName}
        </span>
        {hasChildren && (
          <button onMouseDown={() => toggleLayer()} className="mr-2">
            {expanded ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
