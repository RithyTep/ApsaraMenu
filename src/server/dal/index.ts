/**
 * Data Access Layer (DAL) - Central export
 *
 * The DAL provides auth-wrapped data access functions.
 * All functions verify user authentication and organization membership
 * before accessing data, ensuring secure data access patterns.
 *
 * Usage:
 * import { getUserMenus, getMenuById } from "@/server/dal"
 *
 * // In a Server Component
 * const menus = await getUserMenus()
 *
 * // In a Server Action (with ownership verification)
 * const menu = await verifyMenuOwnership(menuId)
 */

// Menu DAL
export {
  getUserMenus,
  getMenuById,
  getMenuCount,
  getThemes,
  getActiveMenuBySlug,
  verifyMenuOwnership,
  type MenuWithOrganization
} from "./menu"

// Item DAL
export {
  getUserMenuItems,
  getMenuItemById,
  getUserCategories,
  getCategoriesWithItems,
  getUncategorizedItems,
  getFeaturedItems,
  getItemCount,
  verifyItemOwnership,
  verifyCategoryOwnership,
  type MenuItemWithCategory,
  type CategoryWithItems
} from "./item"

// Organization DAL
export {
  getCurrentOrganization,
  getOrganizationById,
  getOnboardingStatus,
  verifyOrganizationOwnership,
  getOrganizationBySlug,
  getAllActiveOrganizationSlugs
} from "./organization"

// Location DAL
export {
  getDefaultLocation,
  getUserLocations,
  getLocationById,
  verifyLocationOwnership,
  type LocationWithHours
} from "./location"
