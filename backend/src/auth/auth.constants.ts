import { type AuthPermissionSeed } from './auth.types.ts';

export const AUTH_PERMISSIONS: readonly AuthPermissionSeed[] = [
  { code: 'recipe.read-admin-ui', description: 'View recipe administration controls' },
  { code: 'recipe.create', description: 'Create recipes' },
  { code: 'recipe.update', description: 'Update recipes' },
  { code: 'recipe.delete', description: 'Delete recipes' },
  { code: 'tag.create', description: 'Create tags and categories' },
  { code: 'tag.update', description: 'Update tags and categories' },
  { code: 'tag.delete', description: 'Delete tags and categories' },
  { code: 'image.upload', description: 'Upload images' },
  { code: 'image.update', description: 'Edit images' },
  { code: 'image.delete', description: 'Delete images' },
  { code: 'backup.export', description: 'Export backups' },
  { code: 'backup.restore', description: 'Restore backups' },
  { code: 'user.read', description: 'View users' },
  { code: 'user.create', description: 'Create users' },
  { code: 'user.update', description: 'Update users' },
  { code: 'user.delete', description: 'Delete users' },
  { code: 'user.permissions.manage', description: 'Manage user permissions' },
];

export const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:4200';
export const DEFAULT_SESSION_SECRET = 'change-me-in-production';
export const SESSION_COOKIE_NAME = 'cms-cookbook.sid';
export const PASSWORD_RESET_TTL_MS = 1000 * 60 * 30;
