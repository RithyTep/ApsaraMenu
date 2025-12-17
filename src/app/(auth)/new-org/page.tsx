import { redirect } from "next/navigation"

import ConfettiOnMount from "@/components/shared/confetti-on-mount"
import { getCurrentOrganization } from "@/server/actions/user/queries"
import NewOrgForm from "@/app/(auth)/new-org/new-org-form"

export const metadata = {
  title: "Create new business",
  description: "Set up a new organization for your business"
}

export default async function NewOrgPage() {
  const currentOrg = await getCurrentOrganization()

  if (currentOrg) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <ConfettiOnMount />
      <h1 className="font-display text-3xl font-semibold">
        Welcome to ApsaraMenu 🎉!
      </h1>
      <p className="text-muted-foreground mt-2">
        Tell us a bit about your business
      </p>
      <div className="mt-8">
        <NewOrgForm />
      </div>
    </div>
  )
}
