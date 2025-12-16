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
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { removeMember } from "@/server/actions/user/mutations"
import type { AuthMember } from "@/lib/auth"
import { cn } from "@/lib/utils"

export default function MemberDelete({
  member,
  open,
  setOpen
}: {
  member: AuthMember
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { execute, reset } = useAction(removeMember, {
    onExecute: () => {
      toast.loading("Deleting member...")
    },
    onSuccess: ({ data }) => {
      if (data?.failure?.reason) {
        toast.dismiss()
        toast.error(data.failure.reason)
      } else if (data?.success) {
        toast.dismiss()
        toast.success("Member deleted successfully")
      }
      reset()
    },
    onError: () => {
      toast.error("Something went wrong")
      reset()
    }
  })

  const onDeleteMember = () => {
    execute({ id: member.id })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this member? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={event => event.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={event => {
              event.stopPropagation()
              onDeleteMember()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
