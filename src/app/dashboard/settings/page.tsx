import { Store } from "lucide-react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import OrganizationDelete from "@/components/features/settings/organization-delete"
import OrganizationForm from "@/components/features/settings/organization-form"
import { Badge } from "@/components/ui/badge"
import {
  getCurrentOrganization,
  safeHasPermission
} from "@/server/actions/user/queries"
import { SubscriptionStatus } from "@/lib/types"

export const metadata: Metadata = {
  title: "My Organization",
  description: "General business information"
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const variants: Record<
    SubscriptionStatus,
    { label: string; variant: "green" | "yellow" | "destructive" | "violet" }
  > = {
    [SubscriptionStatus.ACTIVE]: { label: "Active", variant: "green" },
    [SubscriptionStatus.TRIALING]: {
      label: "Trial",
      variant: "violet"
    },
    [SubscriptionStatus.CANCELED]: {
      label: "Canceled",
      variant: "destructive"
    },
    [SubscriptionStatus.INCOMPLETE]: { label: "Incomplete", variant: "yellow" },
    [SubscriptionStatus.INCOMPLETE_EXPIRED]: {
      label: "Expired",
      variant: "destructive"
    },
    [SubscriptionStatus.PAST_DUE]: {
      label: "Past due",
      variant: "yellow"
    },
    [SubscriptionStatus.UNPAID]: { label: "Unpaid", variant: "destructive" },
    [SubscriptionStatus.PAUSED]: { label: "Paused", variant: "yellow" },
    [SubscriptionStatus.SPONSORED]: { label: "Sponsored", variant: "green" }
  }

  const { label, variant } = variants[status]
  return <Badge variant={variant}>{label}</Badge>
}

export default async function SettingsPage() {
  const [currentOrg, canDeleteOrg] = await Promise.all([
    getCurrentOrganization(),
    safeHasPermission({
      headers: await headers(),
      body: { permissions: { organization: ["delete"] } }
    })
  ])

  if (!currentOrg) {
    return notFound()
  }

  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <div className="flex items-center justify-between">
        <PageSubtitle
          title="My Organization"
          description="General business information"
          Icon={Store}
        />
        <StatusBadge status={currentOrg.status as SubscriptionStatus} />
      </div>
      <OrganizationForm data={currentOrg} enabled />
      {canDeleteOrg?.success && (
        <OrganizationDelete organizationId={currentOrg.id} />
      )}
    </div>
  )
}
