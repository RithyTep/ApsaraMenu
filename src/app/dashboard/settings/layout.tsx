import SecondaryNav from "@/components/dashboard/secondary-nav"

const SecondaryNavItems = [
  {
    title: "General",
    href: "dashboard/settings"
  },
  {
    title: "Location",
    href: "dashboard/settings/locations"
  },
  {
    title: "Members",
    href: "dashboard/settings/members"
  },
  {
    title: "Subscription",
    href: "dashboard/settings/billing"
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SecondaryNav items={SecondaryNavItems} />
      <div className="flex grow pb-4">{children}</div>
    </>
  )
}
