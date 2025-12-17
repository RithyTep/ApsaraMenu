import { AlertCircle, HeartHandshake } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getCurrentSubscription } from "@/server/actions/subscriptions/queries"
import { getCurrentOrganization } from "@/server/actions/user/queries"
import { CustomerPortalButton } from "@/app/dashboard/settings/billing/customer-portal-button"
import { SubscriptionStatus, Tiers } from "@/lib/types"

export async function ProPlanView() {
  const org = await getCurrentOrganization()

  if (!org) {
    return null
  }
  const subscription = await getCurrentSubscription(org?.id)

  if (org.status === SubscriptionStatus.SPONSORED) {
    return (
      <Alert variant="success">
        <HeartHandshake className="size-5" />
        <AlertTitle>Sponsored Organization</AlertTitle>
        <AlertDescription>
          Your organization is on a sponsored PRO plan. Enjoy all the features
          of ApsaraMenu Pro at no cost.
        </AlertDescription>
      </Alert>
    )
  }

  if (!subscription) {
    return null
  }

  return (
    <div className="rounded-xl bg-gray-100 dark:bg-gray-900/70">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>PRO</span>
            {(() => {
              switch (subscription.status) {
                case "trialing":
                  return <Badge variant="violet">Trial</Badge>
                case "active":
                  return <Badge variant="green">Active</Badge>
                case "canceled":
                  return <Badge variant="destructive">Canceled</Badge>
                case "incomplete":
                  return <Badge variant="yellow">Incomplete</Badge>
                case "incomplete_expired":
                  return <Badge variant="destructive">Incomplete Expired</Badge>
                case "past_due":
                  return <Badge variant="yellow">Past Due</Badge>
                case "unpaid":
                  return <Badge variant="destructive">Unpaid</Badge>
                case "paused":
                  return <Badge variant="secondary">Paused</Badge>
                default:
                  return <Badge variant="secondary">Unknown</Badge>
              }
            })()}
            {subscription.status === "trialing" && (
              <span className="text-sm text-gray-500">
                - Ends on{" "}
                {subscription?.trialEnd
                  ? new Date(subscription.trialEnd).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "N/A"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* <Separator /> */}
          <div className="mt-2 flex flex-row justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">Price</div>
              <div className="text-base font-medium">
                {(() => {
                  const tier = Tiers.find(
                    t =>
                      t.priceMonthlyId === subscription.priceId ||
                      t.priceYearlyId === subscription.priceId
                  )
                  if (!tier) return "N/A"
                  const isMonthly = tier.priceMonthlyId === subscription.priceId
                  const price = isMonthly ? tier.priceMonthly : tier.priceYearly
                  return `${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "MXN"
                  }).format(price)} MXN/${isMonthly ? "month" : "year"}`
                })()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Active Period</div>
              <div className="text-base font-medium">
                {subscription?.periodStart
                  ? new Date(subscription.periodStart).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "N/A"}
              </div>
            </div>
            {subscription?.cancelAtPeriodEnd ? (
              <div>
                <div className="text-sm text-gray-500">Cancels on</div>
                <div className="text-base font-medium">
                  {subscription?.periodEnd
                    ? new Date(subscription.periodEnd).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }
                      )
                    : "N/A"}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-500">Next Renewal</div>
                <div className="text-base font-medium">
                  {subscription?.periodEnd
                    ? new Date(subscription.periodEnd).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }
                      )
                    : "N/A"}
                </div>
              </div>
            )}
          </div>
          {subscription?.cancelAtPeriodEnd && (
            <Alert variant="warning" className="mt-4">
              <AlertCircle className="size-4" />
              <AlertTitle>Subscription Scheduled to End</AlertTitle>
              <AlertDescription>
                Your subscription is set to end on{" "}
                {subscription?.periodEnd
                  ? new Date(subscription.periodEnd).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }
                    )
                  : "N/A"}
                . You will have access until that date. If you wish to
                reactivate your subscription, go to the payment portal.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <Separator />
        <CardFooter className="items-center justify-between py-4">
          <p className="text-sm text-gray-500">
            Manage your subscription in Stripe
          </p>
          <CustomerPortalButton referenceId={org.id} />
        </CardFooter>
      </Card>
      <div className="w-full px-4 py-2 text-sm text-gray-400 dark:text-gray-600">
        Having any issues with your subscription? Send an email to{" "}
        <a
          href="mailto:teprithy2020@gmail.com"
          className="text-indigo-500 hover:underline"
        >
          teprithy2020@gmail.com
        </a>
      </div>
    </div>
  )
}
