"use client"

import React, { use, useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import toast from "react-hot-toast"
// import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Check, Loader, PlusCircle, TriangleAlert, X } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import type { z } from "zod/v4"

import { EmptyImageField } from "@/components/dashboard/empty-image-field"
import { ImageField } from "@/components/dashboard/image-field"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import {
  Combobox,
  ComboboxContent,
  ComboboxCreateNew,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from "@/components/kibo-ui/combobox"
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue
} from "@/components/kibo-ui/tags"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
// legacy Form helpers removed in favor of Field primitives
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch" // Add this import
import { Textarea } from "@/components/ui/textarea"
import { createCategory, updateItem } from "@/server/actions/item/mutations"
import {
  getCategories,
  type getMenuItemById
} from "@/server/actions/item/queries"
import { VariantCreate } from "@/app/dashboard/menu-items/[action]/[id]/variant-create"
import VariantForm from "@/app/dashboard/menu-items/[action]/[id]/variant-form"
import {
  Allergens,
  ImageType,
  menuItemSchema,
  MenuItemStatus
} from "@/lib/types"
import { cn } from "@/lib/utils"

export default function ItemForm({
  promiseItem,
  // categories,
  action
}: {
  promiseItem: ReturnType<typeof getMenuItemById>
  // categories: Prisma.PromiseReturnType<typeof getCategories>
  action: string
}) {
  const item = use(promiseItem)

  const form = useForm<z.output<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      id: item?.id ?? "",
      name: item?.name ?? "",
      description: item?.description ?? "",
      status: (item?.status ?? MenuItemStatus.DRAFT) as MenuItemStatus,
      image: item?.image ?? undefined,
      categoryId: item?.category?.id ?? "",
      organizationId: item?.organizationId ?? "",
      featured: item?.featured ?? false,
      variants: (item?.variants ?? []).map(variant => ({
        id: variant.id ?? "",
        name: variant.name ?? "",
        price: variant.price ?? 0,
        description: variant.description ?? "",
        menuItemId: variant.menuItemId ?? ""
      })),
      allergens: item?.allergens ?? "",
      currency: (item?.currency as "MXN" | "USD") ?? "MXN"
    }
  })
  const [searchCategory, setSearchCategory] = useState<string>("")
  const [openVariant, setOpenVariant] = useState<boolean>(false)

  const { fields } = useFieldArray({
    control: form.control,
    name: "variants"
  })

  useEffect(() => {
    if (item?.variants && item.variants.length > 0) {
      const mappedVariants = item.variants.map(variant => ({
        name: variant.name,
        price: variant.price,
        id: variant.id,
        description: variant.description ?? undefined,
        menuItemId: variant.menuItemId
      }))
      form.setValue(
        "variants",
        mappedVariants as z.infer<typeof menuItemSchema>["variants"]
      )
    }
  }, [item?.variants, form])

  const queryClient = useQueryClient()

  const router = useRouter()

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(item?.organizationId ?? ""),
    initialData: [] // default value
  })

  const saveRef = React.useRef<HTMLButtonElement>(null)

  const title = `${action === "new" ? "Create" : "Edit"} Item`

  const { execute: executeCategory, reset: resetCategory } = useAction(
    createCategory,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          // toast.success("Categoría agregada")
        } else if (data?.failure.reason) {
          toast.error(data?.failure.reason)
        }

        resetCategory()
      },
      onError: () => {
        toast.error("Could not add category")
        resetCategory()
      }
    }
  )

  const handleAddCategory = () => {
    if (searchCategory) {
      executeCategory({ name: searchCategory })
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    }
  }

  const handleOpenVariant = () => {
    if (form.formState.isDirty) {
      toast("Save changes before adding a variant")
      return
    }
    setOpenVariant(true)
  }

  const { execute, status, reset } = useAction(updateItem, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Item updated")
        // Reset the form using the current values so RHF updates defaultValues
        // and clears the dirty state.
        form.reset(form.getValues())

        router.refresh()
      } else if (data?.failure.reason) {
        toast.error(data?.failure.reason)
      }

      reset()
    },
    onError: () => {
      toast.error("Could not update item")
    }
  })

  const onSubmit = (data: z.infer<typeof menuItemSchema>) => {
    // Ensure price is a number before submitting
    if (data.variants) {
      const mapped = data.variants.map(variant => ({
        ...variant,
        price: Number(variant.price)
      }))
      // menuItemSchema may type variants as a non-empty tuple; assert to the expected type
      data.variants = mapped as unknown as z.infer<
        typeof menuItemSchema
      >["variants"]
    }

    execute(data)
  }

  if (!item) {
    return (
      <Alert variant="warning">
        <TriangleAlert className="size-4" />
        <AlertTitle>Item not found</AlertTitle>
        <AlertDescription>
          The item you are looking for does not exist or has been deleted
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="pb-20">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageSubtitle
          title={title}
          className="border-border bg-background sticky top-0 z-10 rounded-xl border px-4 py-3 shadow-xs"
        >
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
              ref={saveRef}
            >
              Close
            </Button>
            <Button disabled={status === "executing"} size="sm" type="submit">
              {status === "executing" ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  {"Saving"}
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </PageSubtitle>
        <div className="mt-10">
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3">
              <FieldSet className="lg:col-span-2">
                <FieldLegend>Item Details</FieldLegend>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Item name"
                        />
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
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id={field.name}
                          placeholder="Add a description. Describe details like ingredients, flavor, etc."
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldLegend>Item Image</FieldLegend>
                <div className="h-full">
                  {item?.image ? (
                    <ImageField
                      className="h-full"
                      src={item.image}
                      organizationId={item.organizationId}
                      imageType={ImageType.MENUITEM}
                      objectId={item.id}
                      onUploadSuccess={() => {
                        router.refresh()
                      }}
                    />
                  ) : (
                    <EmptyImageField
                      className="h-full"
                      organizationId={item.organizationId}
                      imageType={ImageType.MENUITEM}
                      objectId={item.id}
                      onUploadSuccess={() => {
                        router.refresh()
                      }}
                    />
                  )}
                </div>
              </FieldSet>
            </div>
            <FieldSet>
              <FieldContent className="flex gap-4 sm:flex-row">
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="border-border rounded-lg border p-4">
                      <FieldLabel htmlFor={field.name}>Item Status</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={MenuItemStatus.ACTIVE}>
                            Active
                          </SelectItem>
                          <SelectItem value={MenuItemStatus.DRAFT}>
                            Draft
                          </SelectItem>
                          <SelectItem value={MenuItemStatus.ARCHIVED}>
                            Archived
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Change the item status to show or hide it on the menu
                      </FieldDescription>
                    </Field>
                  )}
                />
                <Controller
                  name="currency"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="border-border rounded-lg border p-4">
                      <FieldLabel htmlFor={field.name}>Currency</FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"MXN"}>MXN</SelectItem>
                          <SelectItem value={"USD"}>USD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Select the item currency
                      </FieldDescription>
                    </Field>
                  )}
                />
                <Controller
                  name="featured"
                  control={form.control}
                  render={({ field }) => (
                    <Field
                      className="border-border rounded-lg border p-4"
                      orientation="horizontal"
                    >
                      <FieldContent>
                        <FieldLabel>Featured</FieldLabel>
                        <FieldDescription>
                          Show item in the featured section
                        </FieldDescription>
                      </FieldContent>

                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />
              </FieldContent>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Variants</FieldLegend>
              <FieldDescription>
                Add variants to display different options for the same item
              </FieldDescription>
              <FieldGroup className="md:max-w-md lg:max-w-lg">
                <VariantForm fieldArray={fields} parentForm={form} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenVariant}
                  className="w-full gap-1"
                >
                  <PlusCircle className="size-3.5" />
                  Create variant
                </Button>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Category</FieldLegend>
              <FieldDescription>
                Assign a category to group similar items and display them
                together on the menu.
              </FieldDescription>
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center space-x-2">
                      <Combobox
                        data={categories.map(
                          (c: { id: string; name: string }) => ({
                            label: c.name,
                            value: c.id
                          })
                        )}
                        type="Category"
                        value={field.value}
                        onValueChange={(val: string) => {
                          form.setValue("categoryId", val)
                        }}
                      >
                        <ComboboxTrigger className="min-w-[300px]" />
                        <ComboboxContent>
                          <ComboboxInput
                            value={searchCategory}
                            onValueChange={setSearchCategory}
                            placeholder="Search category..."
                          />
                          <ComboboxList>
                            <ComboboxEmpty>
                              <ComboboxCreateNew
                                onCreateNew={handleAddCategory}
                              />
                            </ComboboxEmpty>
                            <ComboboxGroup>
                              {categories.map(
                                (category: { id: string; name: string }) => (
                                  <ComboboxItem
                                    value={category.id}
                                    key={category.id}
                                    className="py-2 text-base sm:py-1.5 sm:text-sm"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 size-4",
                                        category.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category.name}
                                  </ComboboxItem>
                                )
                              )}
                            </ComboboxGroup>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      {field.value && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            form.setValue("categoryId", "")
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </Field>
                )}
              />
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Allergens and Indicators</FieldLegend>
              <FieldDescription>
                Select allergens or special indicators for this item
              </FieldDescription>
              <Controller
                name="allergens"
                control={form.control}
                render={({ field, fieldState }) => {
                  const values =
                    ((field.value ?? "")
                      .split(",")
                      .filter(Boolean) as string[]) || []

                  return (
                    <Field>
                      <Tags
                        value={field.value}
                        setValue={(v: string) => form.setValue("allergens", v)}
                      >
                        <TagsTrigger placeholder="Search or add allergens">
                          {values.map(val => (
                            <TagsValue
                              variant="indigo"
                              key={val}
                              onRemove={() => {
                                const next = values.filter(v => v !== val)
                                form.setValue("allergens", next.join(","))
                              }}
                            >
                              {Allergens.find(a => a.value === val)?.label ??
                                val}
                            </TagsValue>
                          ))}
                        </TagsTrigger>
                        <TagsContent>
                          <TagsInput placeholder="Search or add allergens" />
                          <TagsList>
                            <TagsEmpty className="p-2" />
                            <TagsGroup>
                              {Allergens.map(allergen => (
                                <TagsItem
                                  key={allergen.value}
                                  onSelect={() => {
                                    const next = Array.from(
                                      new Set([...values, allergen.value])
                                    )
                                    form.setValue("allergens", next.join(","))
                                  }}
                                >
                                  {allergen.label}
                                </TagsItem>
                              ))}
                            </TagsGroup>
                          </TagsList>
                        </TagsContent>
                      </Tags>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldSet>
          </FieldGroup>
        </div>
      </form>
      <VariantCreate
        menuItemId={item.id}
        open={openVariant}
        setOpen={setOpenVariant}
      />
      {/* <DevTool control={form.control} /> */}
    </div>
  )
}
