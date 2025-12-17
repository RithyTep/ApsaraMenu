import type {
  Menu,
  Organization,
  Theme
} from "@/generated/prisma-client/client"
import { cacheTag } from "next/cache"

import { requireMembership, requireMembershipOrThrow } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"
import { MenuStatus, SubscriptionStatus } from "@/lib/types"
import { env } from "@/env.mjs"

/**
 * Menu Data Access Layer (DAL)
 * All functions include auth checks to ensure secure data access
 */

export type MenuWithOrganization = Menu & {
  organization: Organization | null
}

/**
 * Get all menus for the current user's organization
 * @returns Array of menus
 */
export async function getUserMenus(): Promise<Menu[]> {
  "use cache"

  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return []
  }

  cacheTag(`menus-${orgId}`)

  return prisma.menu.findMany({
    where: {
      organizationId: orgId
    },
    orderBy: {
      publishedAt: "desc"
    }
  })
}

/**
 * Get a single menu by ID with organization ownership verification
 * @param id - Menu ID
 * @returns Menu with organization or null if not found/not authorized
 */
export async function getMenuById(
  id: string
): Promise<MenuWithOrganization | null> {
  const membership = await requireMembership()

  const menu = await prisma.menu.findUnique({
    where: { id },
    include: { organization: true }
  })

  // Verify organization ownership
  if (!menu || menu.organizationId !== membership.organizationId) {
    return null
  }

  // Transform image URLs
  if (menu.organization?.banner) {
    menu.organization.banner = `${env.R2_CUSTOM_DOMAIN}/${menu.organization.banner}`
  }

  if (menu.organization?.logo) {
    menu.organization.logo = `${env.R2_CUSTOM_DOMAIN}/${menu.organization.logo}`
  }

  return menu
}

/**
 * Get menu count for the current user's organization
 * @returns Number of menus
 */
export async function getMenuCount(): Promise<number> {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return 0
  }

  return prisma.menu.count({
    where: {
      organizationId: orgId
    }
  })
}

/**
 * Get themes available to the current organization
 * Includes global themes and organization-specific themes
 */
export async function getThemes({
  themeType
}: {
  themeType: string
}): Promise<Theme[]> {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  return prisma.theme.findMany({
    where: {
      themeType,
      OR: [{ organizationId: orgId }, { scope: "GLOBAL", organizationId: null }]
    }
  })
}

/**
 * Public function - Get active menu by organization slug
 * Used for public menu viewing (no auth required)
 */
export async function getActiveMenuBySlug(slug: string): Promise<Menu | null> {
  "use cache"
  cacheTag(`subdomain-${slug}`)

  return prisma.menu.findFirst({
    where: {
      status: MenuStatus.PUBLISHED,
      organization: {
        slug,
        OR: [
          { status: SubscriptionStatus.ACTIVE },
          { status: SubscriptionStatus.TRIALING },
          { status: SubscriptionStatus.SPONSORED }
        ]
      }
    },
    orderBy: {
      publishedAt: "desc"
    }
  })
}

/**
 * Verify menu belongs to current user's organization
 * Throws if not authorized (for use in server actions)
 */
export async function verifyMenuOwnership(menuId: string): Promise<Menu> {
  const membership = await requireMembershipOrThrow()

  const menu = await prisma.menu.findUnique({
    where: { id: menuId }
  })

  if (!menu || menu.organizationId !== membership.organizationId) {
    throw new Error("Menu not found or not authorized")
  }

  return menu
}
