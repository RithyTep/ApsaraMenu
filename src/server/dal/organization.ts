import type { Organization } from "@/generated/prisma-client/client"

import { requireMembership, requireMembershipOrThrow } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"
import { SubscriptionStatus } from "@/lib/types"
import { env } from "@/env.mjs"

/**
 * Organization Data Access Layer (DAL)
 * All functions include auth checks to ensure secure data access
 */

/**
 * Helper to transform image URLs
 */
function transformOrgImages(org: Organization): Organization {
  if (org.banner) {
    org.banner = `${env.R2_CUSTOM_DOMAIN}/${org.banner}`
  }
  if (org.logo) {
    org.logo = `${env.R2_CUSTOM_DOMAIN}/${org.logo}`
  }
  return org
}

/**
 * Get the current user's organization
 */
export async function getCurrentOrganization(): Promise<Organization | null> {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return null
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId }
  })

  return org ? transformOrgImages(org) : null
}

/**
 * Get organization by ID with ownership verification
 */
export async function getOrganizationById(
  id: string
): Promise<Organization | null> {
  const membership = await requireMembership()

  // Verify the user has access to this organization
  if (membership.organizationId !== id) {
    return null
  }

  const org = await prisma.organization.findUnique({
    where: { id }
  })

  return org ? transformOrgImages(org) : null
}

/**
 * Get organization onboarding status
 */
export async function getOnboardingStatus() {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return null
  }

  return prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      id: true,
      name: true,
      slug: true,
      banner: true,
      logo: true,
      location: {
        select: { id: true }
      },
      _count: {
        select: { menuItems: true }
      }
    }
  })
}

/**
 * Verify organization ownership - throws if not authorized
 */
export async function verifyOrganizationOwnership(
  orgId: string
): Promise<Organization> {
  const membership = await requireMembershipOrThrow()

  if (membership.organizationId !== orgId) {
    throw new Error("Not authorized to access this organization")
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId }
  })

  if (!org) {
    throw new Error("Organization not found")
  }

  return transformOrgImages(org)
}

/**
 * Public functions - No auth required
 */

/**
 * Get organization by slug (public - for menu viewing)
 */
export async function getOrganizationBySlug(
  slug: string
): Promise<Organization | null> {
  const org = await prisma.organization.findFirst({
    where: { slug }
  })

  return org ? transformOrgImages(org) : null
}

/**
 * Get all active organization slugs (public - for sitemap generation)
 */
export async function getAllActiveOrganizationSlugs(): Promise<
  { slug: string }[]
> {
  const orgs = await prisma.organization.findMany({
    where: {
      slug: { not: null },
      OR: [
        { status: SubscriptionStatus.ACTIVE },
        { status: SubscriptionStatus.TRIALING },
        { status: SubscriptionStatus.SPONSORED }
      ]
    },
    select: { slug: true }
  })

  // Filter out null slugs (TypeScript narrowing)
  return orgs.filter((org): org is { slug: string } => org.slug !== null)
}
