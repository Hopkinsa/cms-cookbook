import { crudResponse } from './feedback.interface';

export const authPermissionCodes = [
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

export type AuthPermissionCode = (typeof authPermissionCodes)[number];

export type AuthSessionUser = {
  userId: number;
  firstName: string;
  surname: string;
  username: string;
  email: string;
  permissions: AuthPermissionCode[];
};

export type AuthSessionState = {
  authenticated: boolean;
  user: AuthSessionUser | null;
};

export const authSessionInitialState: AuthSessionState = {
  authenticated: false,
  user: null,
};

export type AuthUser = {
  id: number;
  firstName: string;
  surname: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  permissions: AuthPermissionCode[];
};

export type AuthLoginRequest = {
  login: string;
  password: string;
};

export type AuthUserUpsert = {
  firstName: string;
  surname: string;
  username: string;
  email: string;
  password?: string;
  isActive: boolean;
  permissions: AuthPermissionCode[];
};

export type PasswordResetRequestResponse = crudResponse & {
  message?: string;
  resetToken?: string;
};
