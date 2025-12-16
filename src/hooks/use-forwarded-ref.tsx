import React from "react"

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = React.useRef<T>(null)

  React.useEffect(() => {
    if (!ref) return
    if (typeof ref === "function") {
      ref(innerRef.current)
    } else {
      // This is intentional - we're syncing refs
      // eslint-disable-next-line react-hooks/immutability
      ref.current = innerRef.current
    }
  })

  return innerRef
}
