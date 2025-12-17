import React, { useMemo } from "react"
import { useEditor } from "@craftjs/core"
import { Mouse } from "lucide-react"

export default function SettingsPanel() {
  // Don't return 'related' from selector as state.nodes[id]?.related creates new reference
  // Instead, return the selectedNodeId and access related via query when needed
  const { active, query } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first()
    return {
      active: currentlySelectedNodeId
    }
  })

  // Get related settings using query - this won't trigger re-renders on unrelated state changes
  const related = useMemo(() => {
    if (!active) return null
    try {
      const node = query.node(active).get()
      return node?.related ?? null
    } catch {
      return null
    }
  }, [active, query])

  return (
    <div className="editor-settings">
      {active && related?.settings && React.createElement(related.settings)}
      {!active && (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
          <div className="rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/70 dark:text-indigo-500">
            <Mouse className="size-6" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Select a component to edit
          </span>
        </div>
      )}
    </div>
  )
}
