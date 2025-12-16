"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import type { Location } from "@/generated/prisma-client/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Image from "next/image"
import { type z } from "zod/v4"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  createLocation,
  updateLocation
} from "@/server/actions/location/mutations"
import { locationSchema } from "@/lib/types"

export default function LocationForm({
  data,
  enabled
}: {
  data: Location | null
  enabled: boolean
}) {
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      description: data?.description ?? undefined,
      address: data?.address ?? undefined,
      phone: data?.phone ?? undefined,
      facebook: data?.facebook ?? undefined,
      instagram: data?.instagram ?? undefined,
      twitter: data?.twitter ?? undefined,
      tiktok: data?.tiktok ?? undefined,
      whatsapp: data?.whatsapp ?? undefined,
      website: data?.website ?? undefined,
      serviceDelivery: data?.serviceDelivery ?? false,
      serviceTakeout: data?.serviceTakeout ?? false,
      serviceDineIn: data?.serviceDineIn ?? false,
      deliveryFee: data?.deliveryFee ?? 0,
      currency: (data?.currency as "MXN" | "USD") ?? "MXN",
      organizationId: data?.organizationId ?? undefined
    }
  })

  const {
    execute: executeCreate,
    status: statusCreate,
    reset: resetCreate
  } = useAction(createLocation, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Location updated")
        // Reload the form with the latest data
        const result = data?.success
        form.reset({
          id: result.id,
          name: result.name,
          description: result.description ?? undefined,
          address: result.address ?? undefined,
          phone: result.phone ?? undefined,
          facebook: result.facebook ?? undefined,
          instagram: result.instagram ?? undefined,
          twitter: result.twitter ?? undefined,
          tiktok: result.tiktok ?? undefined,
          whatsapp: result.whatsapp ?? undefined,
          website: result.website ?? undefined,
          serviceDelivery: result.serviceDelivery ?? false,
          serviceTakeout: result.serviceTakeout ?? false,
          serviceDineIn: result.serviceDineIn ?? false,
          deliveryFee: result.deliveryFee ?? 0,
          currency: (result.currency as "MXN" | "USD") ?? "MXN",
          organizationId: result.organizationId ?? undefined
        })
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
      }

      resetCreate()
    },
    onError: () => {
      toast.error("Failed to update location")
    }
  })

  const {
    execute: executeUpdate,
    status: statusUpdate,
    reset: resetUpdate
  } = useAction(updateLocation, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Location updated")
      } else if (data?.failure.reason) {
        toast.error(data.failure.reason)
      }
      resetUpdate()
    },
    onError: () => {
      toast.error("Failed to update location")
    }
  })

  const onSubmit = (values: z.infer<typeof locationSchema>) => {
    if (data) {
      executeUpdate(values)
    } else {
      executeCreate(values)
    }
  }

  // Refresh form when data changes
  useEffect(() => {
    form.reset({
      id: data?.id,
      name: data?.name,
      description: data?.description ?? undefined,
      address: data?.address ?? undefined,
      phone: data?.phone ?? undefined,
      facebook: data?.facebook ?? undefined,
      instagram: data?.instagram ?? undefined,
      twitter: data?.twitter ?? undefined,
      tiktok: data?.tiktok ?? undefined,
      whatsapp: data?.whatsapp ?? undefined,
      website: data?.website ?? undefined,
      serviceDelivery: data?.serviceDelivery ?? false,
      serviceTakeout: data?.serviceTakeout ?? false,
      serviceDineIn: data?.serviceDineIn ?? false,
      deliveryFee: data?.deliveryFee ?? 0,
      currency: (data?.currency as "MXN" | "USD") ?? "MXN",
      organizationId: data?.organizationId ?? undefined
    })
  }, [data, form])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet disabled={!enabled} className="mt-10">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Location name</FieldLabel>
                <Input {...field} id={field.name} placeholder="Name" />
                <FieldDescription>
                  Reference name for the location, not visible to customers
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Description (optional)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input {...field} id={field.name} placeholder="Address" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input
                  type="tel"
                  {...field}
                  id={field.name}
                  className="sm:w-1/2"
                  placeholder="Phone (optional)"
                />
                <FieldDescription>
                  Location phone number without spaces or dashes
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
      <FieldSet disabled={!enabled} className="mt-10">
        <FieldLegend>Social media and contact</FieldLegend>
        <FieldDescription>
          Add social media and contact methods for this location
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="facebook"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                  Facebook
                </FieldLabel>
                <Input {...field} id={field.name} placeholder="usuario" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="instagram"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                  Instagram
                </FieldLabel>
                <Input {...field} id={field.name} placeholder="usuario" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="twitter"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/twitter.svg"
                    alt="Twitter"
                    width={24}
                    height={24}
                  />
                  Twitter
                </FieldLabel>
                <Input {...field} id={field.name} placeholder="usuario" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="tiktok"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/tiktok.svg"
                    alt="TikTok"
                    width={24}
                    height={24}
                  />
                  TikTok
                </FieldLabel>
                <Input {...field} id={field.name} placeholder="usuario" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="whatsapp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/whatsapp.svg"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                  />
                  WhatsApp
                </FieldLabel>
                <Input {...field} id={field.name} placeholder="Phone number" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
      <FieldSet disabled={!enabled} className="mt-10">
        <FieldLegend>Services</FieldLegend>
        <FieldDescription>
          Configure the services offered at this location
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="serviceDineIn"
            control={form.control}
            render={({ field }) => (
              <FieldLabel htmlFor={field.name}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Dine in</FieldTitle>
                    <FieldDescription>Enable on-site dining</FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              </FieldLabel>
            )}
          />
          <Controller
            name="serviceTakeout"
            control={form.control}
            render={({ field }) => (
              <FieldLabel htmlFor={field.name}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Takeout</FieldTitle>
                    <FieldDescription>Enable takeout orders</FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              </FieldLabel>
            )}
          />
          <Controller
            name="serviceDelivery"
            control={form.control}
            render={({ field }) => (
              <FieldLabel htmlFor={field.name}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Delivery</FieldTitle>
                    <FieldDescription>Enable home delivery</FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              </FieldLabel>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="deliveryFee"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Delivery fee</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    min={0}
                    onChange={e => field.onChange(Number(e.target.value))}
                    onFocus={e => (e.target as HTMLInputElement).select()}
                    inputMode="decimal"
                  />
                  <FieldDescription>0 = Free</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="currency"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Default currency</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"MXN"}>MXN</SelectItem>
                      <SelectItem value={"USD"}>USD</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>
          <Field orientation="responsive">
            <Button
              type="submit"
              disabled={
                statusUpdate === "executing" || statusCreate === "executing"
              }
            >
              {statusUpdate === "executing" || statusCreate === "executing" ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  {"Saving..."}
                </>
              ) : data ? (
                "Update location"
              ) : (
                "Create location"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
