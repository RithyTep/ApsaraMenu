import { Clock, MapPin } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import { Separator } from "@/components/ui/separator"
import { getDefaultLocation } from "@/server/actions/location/queries"
import { getCurrentOrganization } from "@/server/actions/user/queries"
import HoursForm from "@/app/dashboard/settings/locations/hours-form"
import LocationForm from "@/app/dashboard/settings/locations/location-form"

export const metadata: Metadata = {
  title: "Location"
}

export default async function LocationPage() {
  const currentOrg = await getCurrentOrganization()

  if (!currentOrg) {
    return notFound()
  }

  const data = await getDefaultLocation(currentOrg.id)

  return (
    <div className="mx-auto max-w-2xl grow px-4 sm:px-0">
      <PageSubtitle
        title="Location"
        description="Contact information"
        Icon={MapPin}
      />
      <LocationForm data={data} enabled />
      <Separator className="my-8" />
      <PageSubtitle
        title="Business hours"
        description="Public service hours"
        Icon={Clock}
      />
      <HoursForm data={data} />
    </div>
  )
}
