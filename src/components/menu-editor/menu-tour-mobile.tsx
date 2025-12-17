import React, { useEffect, useState } from "react"
import JoyRide, {
  type BeaconRenderProps,
  type CallBackProps,
  type Step,
  type TooltipRenderProps
} from "react-joyride"
import { useAtom } from "jotai"
import { Check, Play, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { tourModeAtom } from "@/lib/atoms"

const steps: Step[] = [
  {
    target: ".editor-topbar",
    title: "Top Bar",
    content: (
      <div>
        Access save, preview, and export options for your menu.
        <ul className="my-4 space-y-3">
          <li className="flex items-center gap-2">
            <Play className="size-4 text-orange-400 dark:text-white" />
            <span>Preview your menu</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-green-400 dark:text-white" />
            <span>Save changes</span>
          </li>
          <li className="flex items-center gap-2">
            <QrCode className="size-4 text-blue-400 dark:text-white" />
            <span>Generate your QR code</span>
          </li>
          <li className="flex items-center gap-2">
            <strong className="dark:text-white">Publish</strong>
            <span>Publish your menu on the web</span>
          </li>
        </ul>
      </div>
    ),
    placement: "bottom"
  },
  {
    target: ".editor-toolbar",
    title: "Toolbar",
    content: "Quickly access features like undo/redo.",
    placement: "top"
  },
  {
    target: ".editor-bottombar",
    title: "Bottom Bar",
    content: (
      <div>
        Access element and theme options to customize your menu.
        <ul className="mt-2 space-y-2">
          <li className="flex flex-col gap-2">
            <strong className="text-white">Elements</strong>
            <span>Add elements like headings and free text.</span>
          </li>
          <li className="flex flex-col gap-2">
            <strong className="text-white">Themes</strong>
            <span>Choose a color and font theme for your menu.</span>
          </li>
          <li className="flex flex-col gap-2">
            <strong className="text-white">Sections</strong>
            <span>List the elements of your menu and change their order.</span>
          </li>
          <li className="flex flex-col gap-2">
            <strong className="text-white">Settings</strong>
            <span>
              Select an element of your menu to change its configuration.
            </span>
          </li>
        </ul>
      </div>
    ),
    placement: "top"
  }
]

export default function MenuTourMobile() {
  const [tourMode, setTourMode] = useAtom(tourModeAtom)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCallback = (data: CallBackProps) => {
    if (data.status === "finished" || data.status === "skipped") {
      setTourMode(false)
    }
  }

  if (!isMounted) return null

  return (
    <JoyRide
      run={tourMode}
      callback={handleCallback}
      steps={steps}
      showProgress
      showSkipButton
      beaconComponent={Beacon}
      tooltipComponent={Tooltip}
      floaterProps={{
        hideArrow: true
      }}
      styles={{
        options: {
          zIndex: 1000
        }
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Last",
        next: "Next",
        skip: "Skip",
        open: "Open help dialog"
      }}
    />
  )
}

// Reuse the same Tooltip and Beacon components
function Tooltip({
  backProps,
  index,
  size,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="max-w-80 rounded-lg border border-transparent bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="mb-2 font-medium">{step.title}</h3>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {step.content}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {index + 1} of {size}
        </div>
        <div className="flex justify-end gap-x-2">
          {!isLastStep && (
            <Button {...skipProps} variant="link" size="xs">
              Skip
            </Button>
          )}
          {index > 0 && (
            <Button {...backProps} variant="secondary" size="xs">
              Back
            </Button>
          )}
          <Button {...primaryProps} size="xs">
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  )
}

const Beacon = React.forwardRef<HTMLButtonElement, BeaconRenderProps>(
  (props, ref) => {
    const buttonProps = props as unknown as
      | React.ButtonHTMLAttributes<HTMLButtonElement>
      | BeaconRenderProps

    return (
      <div className="relative">
        <span className="absolute -top-1 -left-1 size-8 animate-ping rounded-full bg-blue-400" />
        <button
          ref={ref}
          {...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          className="absolute inset-auto inline-block size-6 rounded-full bg-blue-500 ring-4 ring-blue-400"
        />
      </div>
    )
  }
)

Beacon.displayName = "Beacon"
