import { Store } from "lucide-react"

import PageSubtitle from "@/components/dashboard/page-subtitle"
import NewOrgForm from "../../(auth)/new-org/new-org-form"

export const metadata = {
  title: "Create Organization",
  description: "Create and configure your business in ApsaraMenu"
}

export default function Page() {
  return (
    <div className="flex grow py-4">
      <div className="mx-auto flex max-w-2xl grow flex-col gap-4 px-4 sm:px-0">
        <PageSubtitle
          title="Create Organization"
          description="Basic business information"
          Icon={Store}
        />
        <NewOrgForm />
      </div>
    </div>
  )
}
