import type { AppRole } from './roles';

export const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
  admin: ['dashboard:read', 'products:write', 'users:read', 'rentals:read', 'release:write'],
  staff: ['rentals:read', 'release:write'],
};

export const hasPermission = (role: string, permission: string) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};
