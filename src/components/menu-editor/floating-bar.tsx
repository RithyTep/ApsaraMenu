import { useCallback, useEffect, useRef, useState } from "react"
import { useEditor } from "@craftjs/core"
import { useAtom } from "jotai"
import {
  Clipboard,
  ClipboardPaste,
  Lock,
  LockOpen,
  Monitor,
  Redo2,
  TabletSmartphone,
  Undo2
} from "lucide-react"

import { TooltipHelper } from "@/components/dashboard/tooltip-helper"
import { useSetUnsavedChanges } from "@/components/dashboard/unsaved-changes-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { elementPropsAtom, frameSizeAtom } from "@/lib/atoms"
import { FrameSize } from "@/lib/types"

export default function FloatingBar() {
  // Get actions and query without subscribing to state changes
  const { actions, query } = useEditor()

  // Manually track undo/redo state with polling instead of reactive subscription
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [enabled, setEnabled] = useState(true)

  // Poll for history state changes instead of subscribing reactively
  useEffect(() => {
    const checkHistoryState = () => {
      try {
        setCanUndo(query.history.canUndo())
        setCanRedo(query.history.canRedo())
        // Access enabled state through query to avoid subscription
        const state = query.getState()
        setEnabled(state.options.enabled)
      } catch {
        // Ignore errors during unmount
      }
    }

    // Initial check
    checkHistoryState()

    // Poll every 500ms instead of subscribing to state changes
    const interval = setInterval(checkHistoryState, 500)

    return () => clearInterval(interval)
  }, [query])

  const [propsCopy, setPropsCopy] = useAtom(elementPropsAtom)

  const onPasteProps = useCallback(
    (clonedProps: unknown) => {
      const nodeId = query.getEvent("selected").first()
      if (nodeId) {
        actions.setProp(nodeId, props => {
          return (props = Object.assign(props, clonedProps))
        })
      }
    },
    [query, actions]
  )

  const onCopyProps = useCallback(() => {
    const nodeId = query.getEvent("selected").first()
    if (nodeId) {
      const node = query.node(nodeId).get()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, text, ...props } = node.data.props
      setPropsCopy(props)
    }
  }, [query, setPropsCopy])

  const { setUnsavedChanges, clearUnsavedChanges } = useSetUnsavedChanges()

  // Store actions.history.clear in a ref to avoid dependency issues
  const clearHistoryRef = useRef(() => actions.history.clear())

  // Update ref in effect to avoid accessing during render
  useEffect(() => {
    clearHistoryRef.current = () => actions.history.clear()
  }, [actions])

  useEffect(() => {
    if (canUndo) {
      setUnsavedChanges({
        message:
          "You have unsaved changes. Are you sure you want to leave the Editor?",
        dismissButtonLabel: "Cancel",
        proceedLinkLabel: "Discard changes",
        proceedAction: () => {
          clearHistoryRef.current()
        }
      })
    } else {
      clearUnsavedChanges()
    }
  }, [setUnsavedChanges, clearUnsavedChanges, canUndo])

  const [frameSize, setFrameSize] = useAtom(frameSizeAtom)

  const handleUndo = useCallback(() => {
    actions.history.undo()
  }, [actions])

  const handleRedo = useCallback(() => {
    actions.history.redo()
  }, [actions])

  const handleToggleEnabled = useCallback(() => {
    actions.setOptions(options => (options.enabled = !enabled))
  }, [actions, enabled])

  return (
    <div className="editor-toolbar fixed bottom-24 left-1/2 flex h-12 -translate-x-1/2 flex-row items-center justify-between rounded-full bg-gray-800 px-1 text-white shadow-lg sm:bottom-8 sm:min-w-[200px] dark:border dark:border-gray-700 dark:bg-gray-900">
      <TooltipHelper content="Undo">
        <Button
          disabled={!canUndo}
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleUndo}
        >
          <Undo2 className="size-4" />
        </Button>
      </TooltipHelper>
      <TooltipHelper content="Redo">
        <Button
          disabled={!canRedo}
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleRedo}
        >
          <Redo2 className="size-4" />
        </Button>
      </TooltipHelper>
      <Separator
        orientation="vertical"
        className="mx-1 hidden h-6! bg-gray-600 sm:inline-flex"
      />
      <TooltipHelper
        content={
          frameSize === FrameSize.MOBILE
            ? "Switch to Desktop view"
            : "Switch to Mobile view"
        }
      >
        <Button
          variant="ghost"
          size="icon"
          className="hidden rounded-full sm:inline-flex"
          onClick={() =>
            setFrameSize(
              FrameSize.DESKTOP === frameSize
                ? FrameSize.MOBILE
                : FrameSize.DESKTOP
            )
          }
        >
          {frameSize === FrameSize.MOBILE ? (
            <Monitor className="size-4" />
          ) : (
            <TabletSmartphone className="size-4" />
          )}
        </Button>
      </TooltipHelper>
      <Separator
        orientation="vertical"
        className="mx-1 hidden h-6! bg-gray-600 sm:inline-flex"
      />
      <TooltipHelper content="Copy style">
        <Button
          variant="ghost"
          size="icon"
          className="hidden rounded-full sm:inline-flex"
          onClick={onCopyProps}
        >
          <Clipboard className="size-4" />
        </Button>
      </TooltipHelper>
      <TooltipHelper content="Paste style">
        <Button
          disabled={Object.keys(propsCopy).length === 0}
          variant="ghost"
          size="icon"
          className="hidden rounded-full sm:inline-flex"
          onClick={() => onPasteProps(propsCopy)}
        >
          <ClipboardPaste className="size-4" />
        </Button>
      </TooltipHelper>
      <Separator
        orientation="vertical"
        className="mx-1 hidden h-6! bg-gray-600 sm:inline-flex"
      />
      <TooltipHelper content="Restrict changes">
        <Button
          variant="ghost"
          size="icon"
          className="hidden rounded-full sm:inline-flex"
          onClick={handleToggleEnabled}
        >
          {enabled ? (
            <LockOpen className="size-4" />
          ) : (
            <Lock className="size-4" />
          )}
        </Button>
      </TooltipHelper>
    </div>
  )
}
