"use client"

import toast from "react-hot-toast"
import { useAction } from "next-safe-action/hooks"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { deleteVariant } from "@/server/actions/item/mutations"
import { cn } from "@/lib/utils"

export default function VariantDelete({
  children,
  variantId,
  menuItemId
}: {
  children: React.ReactNode
  variantId: string | undefined
  menuItemId: string | undefined
}) {
  const { execute, reset } = useAction(deleteVariant, {
    onExecute: () => {
      toast.loading("Deleting variant...")
    },
    onSuccess: ({ data }) => {
      if (data?.failure?.reason) {
        toast.dismiss()
        toast.error(data.failure.reason)
      } else if (data?.success) {
        toast.dismiss()
      }
      reset()
    },
    onError: error => {
      console.error(error)
      toast.dismiss()
      toast.error("Something went wrong")
      reset()
    }
  })

  const onDeleteVariant = () => {
    execute({
      id: variantId ?? "",
      menuItemId: menuItemId ?? ""
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Variant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this variant? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={() => onDeleteVariant()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
