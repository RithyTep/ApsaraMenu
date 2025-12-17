import { redirect } from "next/navigation"

import { getCurrentMembership } from "@/server/actions/user/queries"
import { getCurrentUser } from "@/lib/session"

/**
 * Auth utilities for Data Access Layer (DAL)
 * These functions ensure proper authentication before data access
 */

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

export class MembershipError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MembershipError"
  }
}

/**
 * Requires authenticated user, redirects to login if not authenticated
 * @returns The authenticated user object
 */
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

/**
 * Requires authenticated user with organization membership
 * @returns The membership object with user and organization info
 */
export async function requireMembership() {
  const membership = await getCurrentMembership()

  if (!membership?.user) {
    redirect("/login")
  }

  return membership
}

/**
 * Throws error if user is not authenticated (for API routes / server actions)
 * @returns The authenticated user object
 * @throws AuthError if not authenticated
 */
export async function requireAuthOrThrow() {
  const user = await getCurrentUser()

  if (!user) {
    throw new AuthError("User not authenticated")
  }

  return user
}

/**
 * Throws error if user doesn't have organization membership (for API routes / server actions)
 * @returns The membership object with user and organization info
 * @throws MembershipError if not a member
 */
export async function requireMembershipOrThrow() {
  const membership = await getCurrentMembership()

  if (!membership?.user) {
    throw new MembershipError("User is not a member of any organization")
  }

  return membership
}

/**
 * Type guard to check if user has required role
 */
export function hasRole(
  membership: Awaited<ReturnType<typeof getCurrentMembership>>,
  roles: ("owner" | "admin" | "member")[]
): boolean {
  if (!membership?.role) return false
  return roles.includes(membership.role as "owner" | "admin" | "member")
}

/**
 * Requires specific role, throws if not authorized
 */
export async function requireRole(roles: ("owner" | "admin" | "member")[]) {
  const membership = await requireMembership()

  if (!hasRole(membership, roles)) {
    throw new AuthError(
      `Required role: ${roles.join(" or ")}. Current role: ${membership.role}`
    )
  }

  return membership
}
