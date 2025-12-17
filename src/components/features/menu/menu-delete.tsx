"use client"

import toast from "react-hot-toast"
import type { Menu } from "@/generated/prisma-client/client"
import { useAction } from "next-safe-action/hooks"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { deleteMenu } from "@/server/actions/menu/mutations"
import { cn } from "@/lib/utils"

export default function MenuDelete({
  menu,
  open,
  setOpen
}: {
  menu: Menu
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { execute, reset } = useAction(deleteMenu, {
    onExecute: () => {
      toast.loading("Deleting Menu...")
    },
    onSuccess: ({ data }) => {
      toast.dismiss()
      if (data?.failure?.reason) {
        toast.error(data.failure.reason)
      } else if (data?.success) {
        toast.success("Menu deleted")
      }
      reset()
    },
    onError: () => {
      toast.error("Something went wrong")
      reset()
    }
  })

  const onDeleteMenu = () => {
    execute({ id: menu.id, organizationId: menu.organizationId })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Menu</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this menu? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={() => onDeleteMenu()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
