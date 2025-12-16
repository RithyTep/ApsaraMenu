"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useQueryClient } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import type { z } from "zod/v4"

import { EmptyImageField } from "@/components/dashboard/empty-image-field"
import { FileUploader } from "@/components/dashboard/file-uploader"
import { ImageField } from "@/components/dashboard/image-field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { updateOrg } from "@/server/actions/organization/mutations"
import type { getCurrentOrganization } from "@/server/actions/user/queries"
import {
  ImageType,
  orgSchema,
  type Plan,
  type SubscriptionStatus
} from "@/lib/types"
import { getInitials } from "@/lib/utils"

export default function OrganizationForm({
  data,
  enabled
}: {
  data: NonNullable<Awaited<ReturnType<typeof getCurrentOrganization>>>
  enabled: boolean
}) {
  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      description: data.description ?? undefined,
      slug: data.slug,
      status: data.status as SubscriptionStatus,
      plan: data.plan?.toUpperCase() as Plan
    }
  })

  const router = useRouter()
  const queryClient = useQueryClient()

  const { execute, status, reset } = useAction(updateOrg, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Information updated")
        queryClient.invalidateQueries({
          queryKey: ["workgroup", "current"]
        })
      } else if (data?.failure?.reason) {
        toast.error(data.failure.reason)
      }

      reset()
    },
    onError: () => {
      toast.error("Could not update business information")
    }
  })

  const onSubmit = (values: z.infer<typeof orgSchema>) => {
    execute(values)
  }

  // Refresh form when data changes
  useEffect(() => {
    form.reset({
      id: data.id,
      name: data.name,
      description: data.description ?? undefined,
      slug: data.slug,
      status: data.status as SubscriptionStatus,
      plan: data.plan?.toUpperCase() as Plan
    })
  }, [data, form])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <fieldset disabled={!enabled} className="mt-10 space-y-6">
        <div className="flex items-center gap-x-8">
          <Avatar className="border-border h-24 w-24 rounded-xl border">
            {data.logo && (
              <AvatarImage src={data.logo} className="rounded-xl" />
            )}
            <AvatarFallback className="text-3xl">
              {getInitials(data.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  Change image
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Upload image</DialogTitle>
                </DialogHeader>
                <FileUploader
                  organizationId={data.id}
                  imageType={ImageType.LOGO}
                  objectId={ImageType.LOGO}
                  limitDimension={500}
                  onUploadSuccess={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["workgroup", "current"]
                    })
                    router.refresh()
                  }}
                />
              </DialogContent>
            </Dialog>
            <p className="mt-2 text-xs">
              A size of 500x500 in JPG or PNG format is recommended.
            </p>
          </div>
        </div>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Business name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Business name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Description"
              />
              <FieldDescription>
                Write a brief description of your business
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Website</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="your-site"
                  className="pl-1!"
                />
                <InputGroupAddon>
                  <InputGroupText>https://.biztro.co/</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                This is your website name. Changing it may affect your SEO
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="space-y-2">
          <FieldLabel>Cover image</FieldLabel>
          {data.banner ? (
            <ImageField
              src={data.banner}
              organizationId={data.id}
              imageType={ImageType.BANNER}
              objectId={ImageType.BANNER}
              onUploadSuccess={() => {
                router.refresh()
              }}
            />
          ) : (
            <EmptyImageField
              organizationId={data.id}
              imageType={ImageType.BANNER}
              objectId={ImageType.BANNER}
              onUploadSuccess={() => {
                router.refresh()
              }}
            />
          )}
          <FieldDescription>
            The cover image will be displayed prominently on your website. A
            size of 1200x800 in JPG format is recommended.
          </FieldDescription>
        </div>
        <Button disabled={status === "executing"} type="submit">
          {status === "executing" ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" />
              {"Saving..."}
            </>
          ) : (
            "Save"
          )}
        </Button>
      </fieldset>
    </form>
  )
}
