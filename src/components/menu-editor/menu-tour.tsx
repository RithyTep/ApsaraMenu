import React, { useEffect, useState } from "react"
import JoyRide, {
  type BeaconRenderProps,
  type CallBackProps,
  type Step,
  type TooltipRenderProps
} from "react-joyride"
import { useAtom } from "jotai"

import { Button } from "@/components/ui/button"
import { tourModeAtom } from "@/lib/atoms"

const steps: Step[] = [
  {
    target: ".editor-categories",
    title: "Categories and Products",
    content:
      "Here you can see the categories and products of your menu. You can drag and drop elements to reorganize them.",
    placement: "right"
  },
  {
    target: ".editor-elements",
    title: "Elements",
    content: "You can add elements like headings and free text to your menu.",
    placement: "right"
  },
  {
    target: ".editor-layers",
    title: "Layers",
    content:
      "Layers allow you to organize the elements of your menu. You can change the order of layers by dragging them up or down. You can rename layers by double-clicking on the name.",
    placement: "right"
  },
  {
    target: ".editor-size",
    title: "Preview",
    content:
      "Here you can see how your menu will look on a mobile device or desktop. You can click on elements to edit them.",
    placement: "left",
    placementBeacon: "top"
  },
  {
    target: ".editor-toolbar",
    title: "Tools",
    content:
      "Here you will find tools to edit your menu, such as undo and redo changes, copy and paste styles, and more.",
    placement: "top-end",
    placementBeacon: "top"
  },
  {
    target: ".editor-theme",
    title: "Theme",
    content: (
      <span>
        Choose a color and font theme for your menu. You can choose{" "}
        <strong>Customize theme</strong> to select your own color palette.
      </span>
    ),
    placement: "left",
    placementBeacon: "left-start"
  },
  {
    target: ".editor-settings",
    title: "Settings",
    content:
      "In this section you can change the configuration of your menu, such as text size and element alignment.",
    placement: "left",
    placementBeacon: "left-start"
  },
  {
    target: ".editor-published",
    title: "Publish and generate your QR code",
    content:
      "Once you have finished designing your menu, you can publish it and generate a QR code so your customers can access it.",
    placement: "bottom-end"
  }
]

export default function MenuTour() {
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
      continuous
      showProgress
      showSkipButton
      beaconComponent={Beacon}
      tooltipComponent={Tooltip}
      floaterProps={{
        hideArrow: true
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
      className="max-w-96 rounded-lg border border-transparent bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="mb-2 font-medium">{step.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{step.content}</p>
      <div className="mt-8 flex items-center justify-between">
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
