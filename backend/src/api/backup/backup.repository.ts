import { ICard, ITags, IUnit } from '../../model/data-model.ts';
import {
  type PasswordResetTokenTableRecord,
  type PermissionTableRecord,
  type UserPermissionTableRecord,
  type UserTableRecord,
} from '../../auth/auth.types.ts';
import { executeReadAllOrNull } from '../shared/read-handler.ts';
import {
  GET_PASSWORD_RESET_TOKENS,
  GET_PERMISSIONS,
  GET_RECIPES,
  GET_TAGS,
  GET_UNITS,
  GET_USER_PERMISSIONS,
  GET_USERS,
} from './backup.sql.ts';

const DEBUG = 'backup | ';

export async function getBackupTags(): Promise<ITags[] | null> {
  return executeReadAllOrNull<ITags>(GET_TAGS, [], `${DEBUG}getTags`);
}

export async function getBackupUnits(): Promise<IUnit[] | null> {
  return executeReadAllOrNull<IUnit>(GET_UNITS, [], `${DEBUG}getUnits`);
}

export async function getBackupRecipes(): Promise<ICard[] | null> {
  return executeReadAllOrNull<ICard>(GET_RECIPES, [], `${DEBUG}getRecipes`);
}

export async function getBackupUsers(): Promise<UserTableRecord[] | null> {
  return executeReadAllOrNull<UserTableRecord>(GET_USERS, [], `${DEBUG}getUsers`);
}

export async function getBackupPermissions(): Promise<PermissionTableRecord[] | null> {
  return executeReadAllOrNull<PermissionTableRecord>(GET_PERMISSIONS, [], `${DEBUG}getPermissions`);
}

export async function getBackupUserPermissions(): Promise<UserPermissionTableRecord[] | null> {
  return executeReadAllOrNull<UserPermissionTableRecord>(GET_USER_PERMISSIONS, [], `${DEBUG}getUserPermissions`);
}

export async function getBackupPasswordResetTokens(): Promise<PasswordResetTokenTableRecord[] | null> {
  return executeReadAllOrNull<PasswordResetTokenTableRecord>(GET_PASSWORD_RESET_TOKENS, [], `${DEBUG}getPasswordResetTokens`);
}
