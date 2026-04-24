import { ICard, ITags, IUnit } from '../../model/data-model.ts';
import {
  type PasswordResetTokenTableRecord,
  type PermissionTableRecord,
  type UserPermissionTableRecord,
  type UserTableRecord,
} from '../../auth/auth.types.ts';
import { executeLoggedWriteStatement } from '../shared/write-handler.ts';
import {
  PASSWORD_RESET_TOKENS_TABLE,
  PASSWORD_RESET_TOKEN_CLEAR_DATA,
  PASSWORD_RESET_TOKEN_DATA,
  PERMISSIONS_TABLE,
  PERMISSION_CLEAR_DATA,
  PERMISSION_DATA,
  RECIPE_CLEAR_DATA,
  RECIPE_DATA,
  RECIPE_TABLE,
  TAG_CLEAR_DATA,
  TAG_DATA,
  TAG_TABLE,
  UNIT_CLEAR_DATA,
  UNIT_DATA,
  UNIT_TABLE,
  USERS_TABLE,
  USER_CLEAR_DATA,
  USER_DATA,
  USER_PERMISSIONS_TABLE,
  USER_PERMISSION_CLEAR_DATA,
  USER_PERMISSION_DATA,
} from './restore.sql.ts';
import { type RestoreArchiveData } from './restore.types.ts';

const DEBUG = 'restore | ';

type SqlValue = number | string | null;

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function serializeSqlValue(value: SqlValue): string {
  if (value === null) {
    return 'NULL';
  }

  return typeof value === 'number' ? `${value}` : `'${escapeSqlString(value)}'`;
}

function buildValuesClause(rows: readonly (readonly SqlValue[])[]): string {
  return rows.map((values) => `(${values.map(serializeSqlValue).join(', ')})`).join(',');
}

function runStatement(statement: string, successMessage: string, errorMessage: string): void {
  executeLoggedWriteStatement(statement, [], `${DEBUG}${successMessage}`, `${DEBUG}${errorMessage}`);
}

export async function createRestoreSchema(): Promise<void> {
  runStatement(TAG_TABLE, 'Tag table created successfully', 'Error creating Tag table');
  runStatement(UNIT_TABLE, 'Unit table created successfully', 'Error creating Unit table');
  runStatement(RECIPE_TABLE, 'Recipe table created successfully', 'Error creating Recipe table');
  runStatement(USERS_TABLE, 'User table created successfully', 'Error creating User table');
  runStatement(PERMISSIONS_TABLE, 'Permissions table created successfully', 'Error creating Permissions table');
  runStatement(USER_PERMISSIONS_TABLE, 'User permissions table created successfully', 'Error creating User permissions table');
  runStatement(PASSWORD_RESET_TOKENS_TABLE, 'Password reset token table created successfully', 'Error creating Password reset token table');
}

export async function truncateRestoreDatabase(): Promise<void> {
  runStatement(PASSWORD_RESET_TOKEN_CLEAR_DATA, 'Password reset token data truncated successfully', 'Error truncating Password reset token data');
  runStatement(USER_PERMISSION_CLEAR_DATA, 'User permission data truncated successfully', 'Error truncating User permission data');
  runStatement(USER_CLEAR_DATA, 'User data truncated successfully', 'Error truncating User data');
  runStatement(PERMISSION_CLEAR_DATA, 'Permission data truncated successfully', 'Error truncating Permission data');
  runStatement(TAG_CLEAR_DATA, 'Tag data truncated', 'Error truncating Tag data');
  runStatement(UNIT_CLEAR_DATA, 'Unit data truncated successfully', 'Error truncating Unit data');
  runStatement(RECIPE_CLEAR_DATA, 'Recipe data truncated successfully', 'Error adding Recipe data');
}

export async function populateTagDatabase(tagData: ITags[]): Promise<void> {
  if (tagData.length === 0) {
    return;
  }

  const values = buildValuesClause(tagData.map((tag) => [tag.id, tag.type, tag.tag] as const));
  runStatement(`${TAG_DATA} ${values}`, 'Tag data restored successfully', 'Error adding Tag data');
}

export async function populateUnitDatabase(unitData: IUnit[]): Promise<void> {
  if (unitData.length === 0) {
    return;
  }

  const values = buildValuesClause(unitData.map((unit) => [unit.id, unit.title, unit.unit, unit.abbreviation] as const));
  runStatement(`${UNIT_DATA} ${values}`, 'Unit data restored successfully', 'Error adding Unit data');
}

export async function populateRecipeDatabase(recipeData: ICard[]): Promise<void> {
  if (recipeData.length === 0) {
    return;
  }

  const values = buildValuesClause(recipeData.map((recipe) => [recipe.id, recipe.card] as const));
  runStatement(`${RECIPE_DATA} ${values}`, 'Recipe data restored successfully', 'Error adding Recipe data');
}

export async function populateUserDatabase(userData: UserTableRecord[]): Promise<void> {
  if (userData.length === 0) {
    return;
  }

  const values = buildValuesClause(
    userData.map((user) => [
      user.id,
      user.first_name,
      user.surname,
      user.username,
      user.email,
      user.password_hash,
      user.is_active,
      user.created_at,
      user.updated_at,
    ] as const),
  );
  runStatement(`${USER_DATA} ${values}`, 'User data restored successfully', 'Error adding User data');
}

export async function populatePermissionDatabase(permissionData: PermissionTableRecord[]): Promise<void> {
  if (permissionData.length === 0) {
    return;
  }

  const values = buildValuesClause(permissionData.map((permission) => [permission.id, permission.code, permission.description] as const));
  runStatement(`${PERMISSION_DATA} ${values}`, 'Permission data restored successfully', 'Error adding Permission data');
}

export async function populateUserPermissionDatabase(userPermissionData: UserPermissionTableRecord[]): Promise<void> {
  if (userPermissionData.length === 0) {
    return;
  }

  const values = buildValuesClause(userPermissionData.map((userPermission) => [userPermission.user_id, userPermission.permission_id] as const));
  runStatement(`${USER_PERMISSION_DATA} ${values}`, 'User permission data restored successfully', 'Error adding User permission data');
}

export async function populatePasswordResetTokenDatabase(passwordResetTokenData: PasswordResetTokenTableRecord[]): Promise<void> {
  if (passwordResetTokenData.length === 0) {
    return;
  }

  const values = buildValuesClause(
    passwordResetTokenData.map((passwordResetToken) => [
      passwordResetToken.id,
      passwordResetToken.user_id,
      passwordResetToken.token_hash,
      passwordResetToken.expires_at,
      passwordResetToken.created_at,
      passwordResetToken.used_at,
    ] as const),
  );
  runStatement(`${PASSWORD_RESET_TOKEN_DATA} ${values}`, 'Password reset token data restored successfully', 'Error adding Password reset token data');
}

export async function restoreArchiveData(archiveData: RestoreArchiveData): Promise<void> {
  await createRestoreSchema();
  await truncateRestoreDatabase();
  await populateUserDatabase(archiveData.users);
  await populatePermissionDatabase(archiveData.permissions);
  await populateUserPermissionDatabase(archiveData.userPermissions);
  await populatePasswordResetTokenDatabase(archiveData.passwordResetTokens);
  await populateTagDatabase(archiveData.tags);
  await populateUnitDatabase(archiveData.units);
  await populateRecipeDatabase(archiveData.recipes);
}
