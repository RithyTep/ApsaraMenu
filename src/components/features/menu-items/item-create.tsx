"use client"

import { useState, useTransition } from "react"
import toast from "react-hot-toast"
import { Loader, PlusCircle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"

import { UpgradeDialog } from "@/components/dashboard/upgrade-dialog"
import { Button } from "@/components/ui/button"
import { createItem } from "@/server/actions/item/mutations"
import { appConfig } from "@/app/config"
import { BasicPlanLimits, MenuItemStatus } from "@/lib/types"

export default function ItemCreate() {
  const [isPending, startTransition] = useTransition()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const router = useRouter()
  const { execute, status, reset } = useAction(createItem, {
    onSuccess: ({ data }) => {
      if (data?.failure?.reason) {
        console.error(data.failure.reason)
        if (data.failure.code === BasicPlanLimits.ITEM_LIMIT_REACHED) {
          setShowUpgrade(true)
        } else {
          toast.error(data.failure.reason)
        }
        return
      }
      startTransition(() => {
        router.push(`/dashboard/menu-items/new/${data?.success?.id}`)
        reset()
      })
    },
    onError: error => {
      console.error(error)
      toast.error("Could not create item")
      reset()
    }
  })

  return (
    <>
      <Button
        className="ml-auto gap-2"
        disabled={status === "executing" || isPending}
        onClick={() =>
          execute({
            name: "New item",
            status: MenuItemStatus.DRAFT,
            description: "",
            variants: [
              {
                name: "Regular",
                price: 0
              }
            ]
          })
        }
      >
        {status === "executing" || isPending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <PlusCircle className="size-4" />
        )}
        New item
      </Button>

      <UpgradeDialog
        title="Get more with the Pro plan"
        description={`You have reached the limit of ${appConfig.itemLimit} items on your free plan.
      Consider upgrading to Pro to continue creating without restrictions.`}
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
      />
    </>
  )
}
