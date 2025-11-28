/**
 * Utility functions for checking admin permissions
 */

export type UserRole = "ADMIN" | "MANAGER" | "CUSTOMER";

/**
 * Check if user has admin access (ADMIN or MANAGER)
 */
export function isAdminOrManager(role: string | undefined): boolean {
  return role === "ADMIN" || role === "MANAGER";
}

/**
 * Check if user is a primary admin (can manage other admins)
 */
export function isPrimaryAdmin(role: string | undefined): boolean {
  return role === "ADMIN";
}

/**
 * Check if user can manage admins (only primary ADMIN)
 */
export function canManageAdmins(role: string | undefined): boolean {
  return role === "ADMIN";
}

