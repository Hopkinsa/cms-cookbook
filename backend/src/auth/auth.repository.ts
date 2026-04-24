import DBService from '../services/db.service.ts';
import { bool2Num, log, num2Bool } from '../utility/helpers.ts';
import { AUTH_PERMISSIONS, PASSWORD_RESET_TTL_MS } from './auth.constants.ts';
import { generateResetToken, hashPassword, hashResetToken } from './auth.password.ts';
import {
  COUNT_USERS,
  CREATE_PASSWORD_RESET_TOKEN,
  CREATE_USER,
  DELETE_USER,
  DELETE_USER_PERMISSIONS,
  FIND_PASSWORD_RESET_TOKEN,
  FIND_USER_BY_ID,
  FIND_USER_BY_LOGIN,
  GET_PERMISSIONS_BY_CODES,
  GET_USERS,
  GET_USER_PERMISSION_CODES,
  INSERT_USER_PERMISSION,
  INVALIDATE_PASSWORD_RESET_TOKENS_FOR_USER,
  MARK_PASSWORD_RESET_TOKEN_USED,
  UPDATE_USER,
} from './auth.sql.ts';
import { type CreateUserInput, type PasswordResetTokenRecord, type PermissionCode, type StoredUser, type UpdateUserInput, type UserRecord } from './auth.types.ts';

const DEBUG = 'auth.repository | ';

type RawUserRow = {
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

function mapUserRow(row: RawUserRow, permissions: PermissionCode[]): StoredUser {
  return {
    id: row.id,
    firstName: row.first_name,
    surname: row.surname,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    isActive: num2Bool(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    permissions,
  };
}

function toUserRecord(user: StoredUser): UserRecord {
  return {
    id: user.id,
    firstName: user.firstName,
    surname: user.surname,
    username: user.username,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    permissions: user.permissions,
  };
}

function getPermissionCodes(userId: number): PermissionCode[] {
  const rows = DBService.db.prepare(GET_USER_PERMISSION_CODES).all(userId) as Array<{ code: PermissionCode }>;
  return rows.map((row) => row.code);
}

function resolvePermissionIds(permissionCodes: PermissionCode[]): Array<{ id: number; code: PermissionCode }> {
  if (!permissionCodes.length) {
    return [];
  }

  const placeholders = permissionCodes.map(() => '?').join(', ');
  const statement = `${GET_PERMISSIONS_BY_CODES} (${placeholders})`;
  return DBService.db.prepare(statement).all(...permissionCodes) as Array<{ id: number; code: PermissionCode }>;
}

function replaceUserPermissions(userId: number, permissionCodes: PermissionCode[]): void {
  const permissionRows = resolvePermissionIds(permissionCodes);
  if (permissionCodes.length !== permissionRows.length) {
    throw new Error('Invalid permission code supplied');
  }

  const runTransaction = DBService.db.transaction((targetUserId: number, rows: Array<{ id: number }>) => {
    DBService.db.prepare(DELETE_USER_PERMISSIONS).run(targetUserId);
    const insertStatement = DBService.db.prepare(INSERT_USER_PERMISSION);
    for (const row of rows) {
      insertStatement.run(targetUserId, row.id);
    }
  });

  runTransaction(userId, permissionRows);
}

function getBootstrapAdminPermissions(): PermissionCode[] {
  return AUTH_PERMISSIONS.map((permission) => permission.code);
}

function getBootstrapAdminConfig(): {
  username: string;
  email: string;
  password: string;
  firstName: string;
  surname: string;
} | null {
  const username = process.env['BOOTSTRAP_ADMIN_USERNAME'];
  const email = process.env['BOOTSTRAP_ADMIN_EMAIL'];
  const password = process.env['BOOTSTRAP_ADMIN_PASSWORD'];
  const firstName = process.env['BOOTSTRAP_ADMIN_FIRST_NAME'] ?? 'Admin';
  const surname = process.env['BOOTSTRAP_ADMIN_SURNAME'] ?? 'User';

  if (!username || !email || !password) {
    log.info_lv1(`${DEBUG}No bootstrap admin configured. Set BOOTSTRAP_ADMIN_USERNAME, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD to create the first administrator.`);
    return null;
  }

  return {
    username,
    email,
    password,
    firstName,
    surname,
  };
}

function syncBootstrapAdminPermissions(user: StoredUser): void {
  const bootstrapPermissions = getBootstrapAdminPermissions();
  const existingPermissions = [...user.permissions].sort();
  const desiredPermissions = [...bootstrapPermissions].sort();

  if (existingPermissions.length === desiredPermissions.length && existingPermissions.every((permission, index) => permission === desiredPermissions[index])) {
    return;
  }

  replaceUserPermissions(user.id, bootstrapPermissions);
  log.info_lv1(`${DEBUG}Updated bootstrap admin permissions for '${user.username}'.`);
}

export async function ensureBootstrapAdmin(): Promise<void> {
  const bootstrapAdmin = getBootstrapAdminConfig();
  if (!bootstrapAdmin) {
    return;
  }

  const existingBootstrapAdmin = findUserByLogin(bootstrapAdmin.username) ?? findUserByLogin(bootstrapAdmin.email);
  if (existingBootstrapAdmin) {
    syncBootstrapAdminPermissions(existingBootstrapAdmin);
    return;
  }

  const countRow = DBService.db.prepare(COUNT_USERS).get() as { total: number } | undefined;
  if ((countRow?.total ?? 0) > 0) {
    return;
  }

  await createUser({
    firstName: bootstrapAdmin.firstName,
    surname: bootstrapAdmin.surname,
    username: bootstrapAdmin.username,
    email: bootstrapAdmin.email,
    password: bootstrapAdmin.password,
    isActive: true,
    permissions: getBootstrapAdminPermissions(),
  });
}

export function findUserByLogin(login: string): StoredUser | null {
  const row = DBService.db.prepare(FIND_USER_BY_LOGIN).get(login, login) as RawUserRow | undefined;
  if (!row) {
    return null;
  }

  return mapUserRow(row, getPermissionCodes(row.id));
}

export function findUserById(userId: number): StoredUser | null {
  const row = DBService.db.prepare(FIND_USER_BY_ID).get(userId) as RawUserRow | undefined;
  if (!row) {
    return null;
  }

  return mapUserRow(row, getPermissionCodes(row.id));
}

export function getUsers(): UserRecord[] {
  const rows = DBService.db.prepare(GET_USERS).all() as RawUserRow[];
  return rows.map((row) => toUserRecord(mapUserRow(row, getPermissionCodes(row.id))));
}

export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const now = Date.now();
  const passwordHash = await hashPassword(input.password);

  const result = DBService.db.prepare(CREATE_USER).run(
    input.firstName,
    input.surname,
    input.username,
    input.email,
    passwordHash,
    bool2Num(input.isActive),
    now,
    now,
  );

  const userId = Number(result.lastInsertRowid);
  replaceUserPermissions(userId, input.permissions);

  const user = findUserById(userId);
  if (!user) {
    throw new Error('Failed to load created user');
  }

  return toUserRecord(user);
}

export async function updateUser(userId: number, input: UpdateUserInput): Promise<UserRecord | null> {
  const currentUser = findUserById(userId);
  if (!currentUser) {
    return null;
  }

  const passwordHash = input.password ? await hashPassword(input.password) : currentUser.passwordHash;
  DBService.db.prepare(UPDATE_USER).run(
    input.firstName,
    input.surname,
    input.username,
    input.email,
    passwordHash,
    bool2Num(input.isActive),
    Date.now(),
    userId,
  );

  replaceUserPermissions(userId, input.permissions);

  const user = findUserById(userId);
  return user ? toUserRecord(user) : null;
}

export function deleteUser(userId: number): boolean {
  const result = DBService.db.prepare(DELETE_USER).run(userId);
  return result.changes > 0;
}

export async function createPasswordResetToken(login: string): Promise<{ resetToken: string; user: StoredUser } | null> {
  const user = findUserByLogin(login);
  if (!user || !user.isActive) {
    return null;
  }

  const resetToken = generateResetToken();
  const tokenHash = hashResetToken(resetToken);
  const createdAt = Date.now();
  const expiresAt = createdAt + PASSWORD_RESET_TTL_MS;

  DBService.db.prepare(INVALIDATE_PASSWORD_RESET_TOKENS_FOR_USER).run(createdAt, user.id);
  DBService.db.prepare(CREATE_PASSWORD_RESET_TOKEN).run(user.id, tokenHash, expiresAt, createdAt);

  return { resetToken, user };
}

export function findPasswordResetToken(token: string): PasswordResetTokenRecord | null {
  const tokenHash = hashResetToken(token);
  const row = DBService.db.prepare(FIND_PASSWORD_RESET_TOKEN).get(tokenHash) as PasswordResetTokenRecord | undefined;
  return row ?? null;
}

export async function resetUserPassword(token: string, password: string): Promise<boolean> {
  const tokenRecord = findPasswordResetToken(token);
  if (!tokenRecord || tokenRecord.usedAt !== null || tokenRecord.expiresAt < Date.now()) {
    return false;
  }

  const user = findUserById(tokenRecord.userId);
  if (!user) {
    return false;
  }

  const passwordHash = await hashPassword(password);
  DBService.db.prepare(UPDATE_USER).run(
    user.firstName,
    user.surname,
    user.username,
    user.email,
    passwordHash,
    bool2Num(user.isActive),
    Date.now(),
    user.id,
  );

  const now = Date.now();
  DBService.db.prepare(MARK_PASSWORD_RESET_TOKEN_USED).run(now, tokenRecord.id);
  DBService.db.prepare(INVALIDATE_PASSWORD_RESET_TOKENS_FOR_USER).run(now, user.id);
  return true;
}
