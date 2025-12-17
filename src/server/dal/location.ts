import type { Location, OpeningHours } from "@/generated/prisma-client/client"
import { cacheTag } from "next/cache"

import { requireMembership, requireMembershipOrThrow } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"

/**
 * Location Data Access Layer (DAL)
 * All functions include auth checks to ensure secure data access
 */

export type LocationWithHours = Location & {
  openingHours: OpeningHours[]
}

/**
 * Get the default (first) location for the current user's organization
 */
export async function getDefaultLocation(): Promise<LocationWithHours | null> {
  "use cache"

  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return null
  }

  cacheTag(`locations-${orgId}`)

  return prisma.location.findFirst({
    where: { organizationId: orgId },
    include: { openingHours: true },
    orderBy: { createdAt: "asc" }
  })
}

/**
 * Get all locations for the current user's organization
 */
export async function getUserLocations(): Promise<LocationWithHours[]> {
  "use cache"

  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return []
  }

  cacheTag(`locations-${orgId}`)

  return prisma.location.findMany({
    where: { organizationId: orgId },
    include: { openingHours: true },
    orderBy: { createdAt: "asc" }
  })
}

/**
 * Get a location by ID with ownership verification
 */
export async function getLocationById(
  id: string
): Promise<LocationWithHours | null> {
  const membership = await requireMembership()

  const location = await prisma.location.findUnique({
    where: { id },
    include: { openingHours: true }
  })

  // Verify organization ownership
  if (!location || location.organizationId !== membership.organizationId) {
    return null
  }

  return location
}

/**
 * Verify location belongs to current user's organization
 * Throws if not authorized (for use in server actions)
 */
export async function verifyLocationOwnership(
  locationId: string
): Promise<Location> {
  const membership = await requireMembershipOrThrow()

  const location = await prisma.location.findUnique({
    where: { id: locationId }
  })

  if (!location || location.organizationId !== membership.organizationId) {
    throw new Error("Location not found or not authorized")
  }

  return location
}
