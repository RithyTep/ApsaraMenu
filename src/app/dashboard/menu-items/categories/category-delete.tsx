"use client"

import toast from "react-hot-toast"
import type { Category } from "@/generated/prisma-client/client"
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
import { deleteCategory } from "@/server/actions/item/mutations"
import { cn } from "@/lib/utils"

export default function ItemDelete({
  category,
  children
}: {
  category: Category
  children: React.ReactNode
}) {
  const { execute, reset } = useAction(deleteCategory, {
    onExecute: () => {
      toast("Deleting category...", { icon: "🗑️" })
    },
    onSuccess: async ({ data }) => {
      // see https://github.com/TheEdoRan/next-safe-action/issues/376
      if (data?.success) {
        // toast.success("Categoría eliminada")
      } else if (data?.failure?.reason) {
        toast.error(data?.failure?.reason)
      }
      reset()
    },
    onError: () => {
      toast.dismiss()
      toast.error("Something went wrong")
      reset()
    }
  })

  const onDeleteCategory = () => {
    execute(category)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={() => onDeleteCategory()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
