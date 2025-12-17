import { notFound } from "next/navigation"
import type { Metadata } from "next/types"

import { EmptyState } from "@/components/dashboard/empty-state"
import PageHeader from "@/components/dashboard/page-header"
import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  getCurrentMembership,
  getCurrentOrganization
} from "@/server/actions/user/queries"
import { MembershipRole } from "@/lib/types"
import { getInitials } from "@/lib/utils"

export const metadata: Metadata = {
  title: "My Profile"
}

export default async function ProfilePage() {
  const [organization, membership] = await Promise.all([
    getCurrentOrganization(),
    getCurrentMembership()
  ])

  if (!membership) return notFound()

  const roleLabel = (() => {
    switch (membership?.role) {
      case MembershipRole.ADMIN:
        return "Admin"
      case MembershipRole.MEMBER:
        return "Member"
      case MembershipRole.OWNER:
        return "Owner"
      default:
        return ""
    }
  })()

  return (
    <>
      <PageHeader title="My Profile" />
      <div className="flex grow py-4">
        <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
          <PageSubtitle
            title="General data"
            description="General information about my account"
          />
          <div className="relative my-6 rounded-xl bg-linear-to-t from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
            <div className="bg-dot-pattern dark:bg-dot-pattern-white absolute inset-0 size-full mask-t-from-50%" />
            <div className="flex h-36 items-center overflow-hidden px-7">
              <Avatar className="size-20 shadow-lg">
                {membership.user.image && (
                  <AvatarImage src={membership.user.image} />
                )}
                <AvatarFallback className="text-2xl">
                  {getInitials(
                    membership.user.name ?? membership.user.email ?? "U"
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="relative pr-8 pb-8 pl-8">
              <h3 className="text-xl leading-none font-semibold">
                {membership.user.name}
              </h3>
              <p className="mt-1.5 leading-none font-medium text-gray-600 dark:text-gray-400">
                {membership.user.email}
              </p>
            </div>
          </div>
          <div>
            <PageSubtitle
              title="Current membership"
              description="Information about your current membership"
            />
            <div className="mt-6">
              {membership ? (
                <div className="grid grid-cols-1 gap-6 rounded-lg border border-gray-200 px-6 py-3 sm:grid-cols-2 dark:border-gray-800">
                  <div>
                    <Label>Organization</Label>
                    <h4 className="text-gray-500">
                      {organization?.name || "N/A"}
                    </h4>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="text-gray-500">{roleLabel}</p>
                  </div>
                </div>
              ) : (
                <EmptyState title="You don't have membership in any organization" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
