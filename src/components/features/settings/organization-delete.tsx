"use client"

import toast from "react-hot-toast"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { deleteOrganization } from "@/server/actions/organization/mutations"
import { cn } from "@/lib/utils"

function OrganizationDelete({ organizationId }: { organizationId: string }) {
  const router = useRouter()

  const { execute, reset } = useAction(deleteOrganization, {
    onExecute: () => {
      toast("Deleting organization...", { icon: "🗑️", duration: 2000 })
    },
    onSuccess: ({ data }) => {
      toast.dismiss()
      if (data?.failure) {
        toast.error(data.failure.reason ?? "Could not delete organization")
      } else {
        router.push("/dashboard")
        reset()
      }
    },
    onError: () => {
      toast.error("Could not delete organization")
      reset()
    }
  })

  const handleDelete = () => {
    execute({
      id: organizationId
    })
  }

  return (
    <>
      <Separator className="my-8" />
      <AlertDialog>
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-base text-red-500">
              Delete Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-center gap-x-8 gap-y-4 sm:flex-row sm:items-center">
            <p className="text-gray-500">
              Delete the organization, catalogs and menus associated with it.{" "}
              <span className="text-red-500 dark:text-red-400">
                This operation is irreversible.
              </span>
            </p>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Organization</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the organization? This action
                  is irreversible. All data associated with the organization
                  will be deleted and cannot be recovered. Make sure you have
                  downloaded all the data you want to keep before continuing.{" "}
                  <Link
                    href="settings/billing"
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                  >
                    Cancel your subscription before deleting the organization.
                  </Link>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(buttonVariants({ variant: "destructive" }))}
                  onClick={() => {
                    handleDelete()
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </CardContent>
        </Card>
      </AlertDialog>
    </>
  )
}
export default OrganizationDelete
