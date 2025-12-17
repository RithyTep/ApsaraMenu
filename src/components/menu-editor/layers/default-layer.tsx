import React, { useEffect, useRef } from "react"
import { useLayer } from "@craftjs/layers"

import LayerHeader from "@/components/menu-editor/layers/layer-header"

// Minimal version to test if Layers panel is causing the infinite loop
function DefaultLayerInner({ children }: { children: React.ReactNode }) {
  const {
    id,
    expanded,
    connectors: { layer },
    actions: { setExpandedState }
  } = useLayer(layer => ({
    expanded: layer.expanded
  }))

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (divRef.current) {
      layer(divRef.current)
    }
  }, [layer])

  // Auto-expand ROOT on mount
  useEffect(() => {
    if (id === "ROOT") {
      setExpandedState(true)
    }
  }, [id, setExpandedState])

  return (
    <div ref={divRef} className="editor-layers mx-2 mt-2 block rounded-sm">
      <LayerHeader />
      {expanded && children ? (
        <div className="craft-layer-children relative ml-4">{children}</div>
      ) : null}
    </div>
  )
}

export default DefaultLayerInner
