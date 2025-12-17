import { memo, useCallback, useEffect, useRef, useState } from "react"
import ContentEditable from "react-contenteditable"
import { useEditor } from "@craftjs/core"
import { useLayer } from "@craftjs/layers"

const LayerNameInner = () => {
  const { id } = useLayer()

  // Don't subscribe to state.nodes directly - access via query to avoid re-renders
  const { actions, query } = useEditor()

  // Get displayName on mount only - use ref to avoid re-renders
  const getDisplayName = useCallback(() => {
    try {
      const node = query.node(id).get()
      return (
        node?.data?.custom?.displayName ?? node?.data?.displayName ?? "Unknown"
      )
    } catch {
      return "Unknown"
    }
  }, [id, query])

  const [displayName, setDisplayName] = useState(() => getDisplayName())

  // Update displayName only when needed (not during render)
  useEffect(() => {
    setDisplayName(getDisplayName())
  }, [getDisplayName])

  const [editingName, setEditingName] = useState(false)
  const nameDOM = useRef<HTMLElement | null>(null)

  const clickOutside = useCallback((e: MouseEvent) => {
    if (nameDOM.current && !nameDOM.current.contains(e.target as Node)) {
      setEditingName(false)
    }
  }, [])

  useEffect(() => {
    return () => {
      window.removeEventListener("click", clickOutside)
    }
  }, [clickOutside])

  const contentEditableRef = useRef<ContentEditable | null>(null)

  useEffect(() => {
    const ref = contentEditableRef.current
    if (ref) {
      nameDOM.current = ref.el.current
      window.removeEventListener("click", clickOutside)
      window.addEventListener("click", clickOutside)
    }
  }, [clickOutside])

  return (
    <ContentEditable
      html={displayName}
      disabled={!editingName}
      ref={contentEditableRef}
      onChange={e => {
        actions.setCustom(id, custom => (custom.displayName = e.target.value))
      }}
      tagName="h2"
      className="line-clamp-1"
      onDoubleClick={() => {
        if (!editingName) setEditingName(true)
      }}
    />
  )
}

// Wrap in memo to prevent unnecessary re-renders during drag operations
export const LayerName = memo(LayerNameInner)
