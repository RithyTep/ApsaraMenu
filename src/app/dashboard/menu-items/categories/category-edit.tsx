"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import type { z } from "zod/v4"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createCategory, updateCategory } from "@/server/actions/item/mutations"
import { useIsMobile } from "@/hooks/use-mobile"
import { ActionType, categorySchema } from "@/lib/types"

export default function CategoryEdit({
  children,
  category,
  action
}: {
  children?: React.ReactNode
  category?: z.infer<typeof categorySchema>
  action: ActionType
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Category</DrawerTitle>
            <DrawerDescription>
              {action === ActionType.CREATE ? "Add" : "Edit"} category
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <CategoryEditForm
              category={category}
              action={action}
              onClose={setOpen}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category</DialogTitle>
          <DialogDescription>
            {action === ActionType.CREATE ? "Add" : "Edit"} category
          </DialogDescription>
        </DialogHeader>
        <CategoryEditForm
          category={category}
          action={action}
          onClose={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

function CategoryEditForm({
  category,
  action,
  onClose
}: {
  category?: z.infer<typeof categorySchema>
  action: ActionType
  onClose: (open: boolean) => void
}) {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: category?.id ?? undefined,
      name: category?.name ?? "",
      organizationId: category?.organizationId ?? undefined
    }
  })

  const {
    execute: executeInsert,
    status: statusInsert,
    reset: resetInsert
  } = useAction(createCategory, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Category added")
        onClose(false)
      } else if (data?.failure.reason) {
        toast.error(data?.failure.reason)
      }

      resetInsert()
    },
    onError: () => {
      toast.error("Could not add category")
      resetInsert()
    }
  })

  const {
    execute: executeUpdate,
    status: statusUpdate,
    reset: resetUpdate
  } = useAction(updateCategory, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Category updated")
        onClose(false)
      } else if (data?.failure.reason) {
        toast.error(data?.failure.reason)
      }

      resetUpdate()
    },
    onError: () => {
      toast.error("Could not update category")
    }
  })

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    if (action === ActionType.CREATE) {
      executeInsert(data)
    } else if (ActionType.UPDATE) {
      executeUpdate(data)
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>Category</FieldLabel>
            <Input {...field} placeholder="Name" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        disabled={statusInsert === "executing" || statusUpdate === "executing"}
        onClick={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        {statusInsert === "executing" || statusUpdate === "executing" ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" /> {"Saving..."}
          </>
        ) : (
          "Save"
        )}
      </Button>
    </form>
  )
}
