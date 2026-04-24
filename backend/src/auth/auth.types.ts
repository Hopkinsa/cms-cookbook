export const AUTH_PERMISSION_CODES = [
  'recipe.read-admin-ui',
  'recipe.create',
  'recipe.update',
  'recipe.delete',
  'tag.create',
  'tag.update',
  'tag.delete',
  'image.upload',
  'image.update',
  'image.delete',
  'backup.export',
  'backup.restore',
  'user.read',
  'user.create',
  'user.update',
  'user.delete',
  'user.permissions.manage',
] as const;

export type PermissionCode = (typeof AUTH_PERMISSION_CODES)[number];

export type AuthPermissionSeed = {
  code: PermissionCode;
  description: string;
};

export type StoredUser = {
  id: number;
  firstName: string;
  surname: string;
  username: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  permissions: PermissionCode[];
};

export type SessionUser = {
  userId: number;
  firstName: string;
  surname: string;
  username: string;
  email: string;
  permissions: PermissionCode[];
};

export type UserRecord = Omit<StoredUser, 'passwordHash'>;

export type CreateUserInput = {
  firstName: string;
  surname: string;
  username: string;
  email: string;
  password: string;
  permissions: PermissionCode[];
  isActive: boolean;
};

export type UpdateUserInput = {
  firstName: string;
  surname: string;
  username: string;
  email: string;
  password?: string;
  permissions: PermissionCode[];
  isActive: boolean;
};

export type PasswordResetTokenRecord = {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: number;
  createdAt: number;
  usedAt: number | null;
};

export type UserTableRecord = {
  id: number;
  first_name: string;
  surname: string;
  username: string;
  email: string;
  password_hash: string;
  is_active: number;
  created_at: number;
  updated_at: number;
};

export type PermissionTableRecord = {
  id: number;
  code: PermissionCode;
  description: string;
};

export type UserPermissionTableRecord = {
  user_id: number;
  permission_id: number;
};

export type PasswordResetTokenTableRecord = {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: number;
  created_at: number;
  used_at: number | null;
};
