import { AUTH_PERMISSIONS } from './auth.constants.ts';

export const USERS_TABLE = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
`;

export const PERMISSIONS_TABLE = `
CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL
);
`;

export const USER_PERMISSIONS_TABLE = `
CREATE TABLE IF NOT EXISTS user_permissions (
    user_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
`;

export const PASSWORD_RESET_TOKENS_TABLE = `
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    used_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const permissionValues = AUTH_PERMISSIONS.map((permission) => `('${permission.code}', '${permission.description}')`).join(',\n    ');

export const PERMISSION_DATA = `
INSERT OR IGNORE INTO permissions (
    code,
    description
)
VALUES
    ${permissionValues};
`;

export const FIND_USER_BY_LOGIN = `
SELECT
    id,
    first_name,
    surname,
    username,
    email,
    password_hash,
    is_active,
    created_at,
    updated_at
FROM users
WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
LIMIT 1
`;

export const FIND_USER_BY_ID = `
SELECT
    id,
    first_name,
    surname,
    username,
    email,
    password_hash,
    is_active,
    created_at,
    updated_at
FROM users
WHERE id = ?
LIMIT 1
`;

export const GET_USERS = `
SELECT
    id,
    first_name,
    surname,
    username,
    email,
    password_hash,
    is_active,
    created_at,
    updated_at
FROM users
ORDER BY surname ASC, first_name ASC, username ASC
`;

export const CREATE_USER = `
INSERT INTO users (
    first_name,
    surname,
    username,
    email,
    password_hash,
    is_active,
    created_at,
    updated_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

export const UPDATE_USER = `
UPDATE users
SET
    first_name = ?,
    surname = ?,
    username = ?,
    email = ?,
    password_hash = ?,
    is_active = ?,
    updated_at = ?
WHERE id = ?
`;

export const DELETE_USER = `DELETE FROM users WHERE id = ?`;

export const GET_USER_PERMISSION_CODES = `
SELECT permissions.code
FROM permissions
INNER JOIN user_permissions ON user_permissions.permission_id = permissions.id
WHERE user_permissions.user_id = ?
ORDER BY permissions.code ASC
`;

export const GET_PERMISSIONS_BY_CODES = `
SELECT id, code
FROM permissions
WHERE code IN
`;

export const DELETE_USER_PERMISSIONS = `DELETE FROM user_permissions WHERE user_id = ?`;

export const INSERT_USER_PERMISSION = `
INSERT INTO user_permissions (
    user_id,
    permission_id
)
VALUES (?, ?)
`;

export const COUNT_USERS = `SELECT COUNT(*) as total FROM users`;

export const CREATE_PASSWORD_RESET_TOKEN = `
INSERT INTO password_reset_tokens (
    user_id,
    token_hash,
    expires_at,
    created_at
)
VALUES (?, ?, ?, ?)
`;

export const FIND_PASSWORD_RESET_TOKEN = `
SELECT
    id,
    user_id,
    token_hash,
    expires_at,
    created_at,
    used_at
FROM password_reset_tokens
WHERE token_hash = ?
LIMIT 1
`;

export const INVALIDATE_PASSWORD_RESET_TOKENS_FOR_USER = `
UPDATE password_reset_tokens
SET used_at = ?
WHERE user_id = ? AND used_at IS NULL
`;

export const MARK_PASSWORD_RESET_TOKEN_USED = `
UPDATE password_reset_tokens
SET used_at = ?
WHERE id = ?
`;
