"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import slugify from "@sindresorhus/slugify"
import { Loader } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import type { z } from "zod/v4"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel
} from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"
import { bootstrapOrg } from "@/server/actions/organization/mutations"
import { orgSchema, Plan, SubscriptionStatus } from "@/lib/types"

export default function NewOrgForm() {
  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      status: SubscriptionStatus.ACTIVE,
      plan: Plan.BASIC
    }
  })
  const router = useRouter()

  const slug = form.watch("name", "my-business")

  useEffect(() => {
    form.setValue("slug", slugify(slug))
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const { execute, status, reset } = useAction(bootstrapOrg, {
    onSuccess: ({ data }) => {
      if (data?.failure) {
        toast.error(data.failure.reason ?? "An error occurred")
        return
      } else if (data?.success) {
        router.push("/dashboard")
      }
      reset()
    },
    onError: () => {
      toast.error("Could not update business information")
      reset()
    }
  })

  const onSubmit = (data: z.infer<typeof orgSchema>) => {
    execute(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="min-w-96 shadow-xl">
          <CardHeader>
            <CardTitle>General information</CardTitle>
          </CardHeader>
          <CardContent>
            <fieldset className="space-y-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Business name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Business name"
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
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Description"
                    />
                    <FieldDescription>
                      Write a brief description of your business
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Website</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="your-site"
                        className="!pl-1"
                      />
                      <InputGroupAddon>
                        <InputGroupText>https://.biztro.co/</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      This will be your website name
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </fieldset>
          </CardContent>
          <CardFooter>
            <Button
              disabled={status === "executing"}
              type="submit"
              className="w-full"
            >
              {status === "executing" ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
