import type {
  Category,
  MenuItem,
  Variant
} from "@/generated/prisma-client/client"
import { cacheTag } from "next/cache"

import { requireMembership, requireMembershipOrThrow } from "@/lib/auth-utils"
import prisma from "@/lib/prisma"
import type { MenuItemQueryFilter } from "@/lib/types"
import { env } from "@/env.mjs"

/**
 * Item Data Access Layer (DAL)
 * All functions include auth checks to ensure secure data access
 */

export type MenuItemWithCategory = MenuItem & {
  category: Category | null
  variants: Variant[]
}

export type CategoryWithItems = Category & {
  menuItems: (MenuItem & { variants: Variant[] })[]
}

/**
 * Helper to transform image URLs
 */
function transformImageUrl(image: string | null): string | null {
  return image ? `${env.R2_CUSTOM_DOMAIN}/${image}` : null
}

/**
 * Get menu items for the current user's organization with filters
 */
export async function getUserMenuItems(
  filter?: MenuItemQueryFilter
): Promise<MenuItemWithCategory[]> {
  "use cache"

  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return []
  }

  cacheTag(`menu-items-${orgId}`)

  return prisma.menuItem.findMany({
    where: {
      organizationId: orgId,
      status: filter?.status ? { in: filter.status.split(",") } : undefined,
      categoryId: filter?.category
        ? { in: filter.category.split(",") }
        : undefined
    },
    include: {
      category: true,
      variants: true
    }
  })
}

/**
 * Get a single menu item by ID with ownership verification
 */
export async function getMenuItemById(
  id: string
): Promise<MenuItemWithCategory | null> {
  "use cache"

  const membership = await requireMembership()
  cacheTag(`menu-item-${id}`)

  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: true,
      variants: true
    }
  })

  // Verify organization ownership
  if (!item || item.organizationId !== membership.organizationId) {
    return null
  }

  if (item.image) {
    item.image = transformImageUrl(item.image)
  }

  return item
}

/**
 * Get categories for the current user's organization
 */
export async function getUserCategories(): Promise<Category[]> {
  "use cache"

  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return []
  }

  cacheTag(`categories-${orgId}`)

  return prisma.category.findMany({
    where: { organizationId: orgId }
  })
}

/**
 * Get categories with their active menu items
 */
export async function getCategoriesWithItems(): Promise<CategoryWithItems[]> {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return []
  }

  const data = await prisma.category.findMany({
    where: {
      organizationId: orgId,
      menuItems: {
        some: { status: "ACTIVE" }
      }
    },
    include: {
      menuItems: {
        where: { status: "ACTIVE" },
        include: {
          variants: {
            orderBy: { price: "asc" }
          }
        },
        orderBy: { name: "asc" }
      }
    }
  })

  // Transform image URLs
  for (const category of data) {
    for (const item of category.menuItems) {
      if (item.image) {
        item.image = transformImageUrl(item.image)
      }
    }
  }

  return data
}

/**
 * Get uncategorized menu items for the current organization
 */
export async function getUncategorizedItems(): Promise<
  (MenuItem & { variants: Variant[] })[]
> {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return []
  }

  const data = await prisma.menuItem.findMany({
    where: {
      organizationId: orgId,
      categoryId: null,
      status: "ACTIVE"
    },
    include: {
      variants: {
        orderBy: { price: "asc" }
      }
    },
    orderBy: { name: "asc" }
  })

  // Transform image URLs
  for (const item of data) {
    if (item.image) {
      item.image = transformImageUrl(item.image)
    }
  }

  return data
}

/**
 * Get featured items for the current organization
 */
export async function getFeaturedItems(): Promise<
  (MenuItem & { variants: Variant[] })[]
> {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return []
  }

  const data = await prisma.menuItem.findMany({
    where: {
      organizationId: orgId,
      featured: true,
      status: "ACTIVE"
    },
    include: {
      variants: {
        orderBy: { price: "asc" }
      }
    },
    orderBy: { name: "asc" }
  })

  // Transform image URLs
  for (const item of data) {
    if (item.image) {
      item.image = transformImageUrl(item.image)
    }
  }

  return data
}

/**
 * Get item count for the current organization
 */
export async function getItemCount(): Promise<number> {
  const membership = await requireMembership()
  const orgId = membership.organizationId

  if (!orgId) {
    return 0
  }

  return prisma.menuItem.count({
    where: { organizationId: orgId }
  })
}

/**
 * Verify menu item belongs to current user's organization
 * Throws if not authorized (for use in server actions)
 */
export async function verifyItemOwnership(itemId: string): Promise<MenuItem> {
  const membership = await requireMembershipOrThrow()

  const item = await prisma.menuItem.findUnique({
    where: { id: itemId }
  })

  if (!item || item.organizationId !== membership.organizationId) {
    throw new Error("Menu item not found or not authorized")
  }

  return item
}

/**
 * Verify category belongs to current user's organization
 * Throws if not authorized (for use in server actions)
 */
export async function verifyCategoryOwnership(
  categoryId: string
): Promise<Category> {
  const membership = await requireMembershipOrThrow()

  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })

  if (!category || category.organizationId !== membership.organizationId) {
    throw new Error("Category not found or not authorized")
  }

  return category
}
