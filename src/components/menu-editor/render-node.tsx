import type { ReactNode } from "react"

export const RenderNode = ({ render }: { render: ReactNode }) => {
  // Minimal implementation to test if RenderNode is the source of infinite loops
  // TODO: Restore full functionality after fixing the issue
  return <>{render}</>
}
