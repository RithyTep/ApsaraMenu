import { Skeleton } from "@/components/ui/skeleton"

export default function CreateOrgLoading() {
  return (
    <div className="mx-auto max-w-lg space-y-6 p-6">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-[250px]" />
        <Skeleton className="mx-auto h-4 w-[300px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
