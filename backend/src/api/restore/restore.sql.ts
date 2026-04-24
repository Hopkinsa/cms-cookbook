import { PASSWORD_RESET_TOKENS_TABLE, PERMISSIONS_TABLE, USERS_TABLE, USER_PERMISSIONS_TABLE } from '../../auth/auth.sql.ts';

export const TAG_TABLE = `
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    tag TEXT NOT NULL
);
`;

export const UNIT_TABLE = `
CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY,
    title TEXT,
    unit TEXT,
    abbreviation TEXT
);
`;

export const RECIPE_TABLE = `
CREATE TABLE IF NOT EXISTS recipe (
    id INTEGER PRIMARY KEY,
    card TEXT
);
`;

export const RECIPE_CLEAR_DATA = `DELETE FROM recipe;`;
export const UNIT_CLEAR_DATA = `DELETE FROM units;`;
export const TAG_CLEAR_DATA = `DELETE FROM tags;`;
export const PASSWORD_RESET_TOKEN_CLEAR_DATA = `DELETE FROM password_reset_tokens;`;
export const USER_PERMISSION_CLEAR_DATA = `DELETE FROM user_permissions;`;
export const USER_CLEAR_DATA = `DELETE FROM users;`;
export const PERMISSION_CLEAR_DATA = `DELETE FROM permissions;`;

export { USERS_TABLE, PERMISSIONS_TABLE, USER_PERMISSIONS_TABLE, PASSWORD_RESET_TOKENS_TABLE };

export const RECIPE_DATA = `
INSERT INTO "recipe" (
    "id",
    "card"
)
VALUES
`;

export const UNIT_DATA = `
INSERT INTO "units" (
    "id",
    "title",
    "unit",
    "abbreviation"
    )
VALUES

 `;

export const TAG_DATA = `
INSERT INTO "tags" (
    "id",
    "type",
    "tag"
    )
VALUES
`;

export const USER_DATA = `
INSERT INTO "users" (
    "id",
    "first_name",
    "surname",
    "username",
    "email",
    "password_hash",
    "is_active",
    "created_at",
    "updated_at"
    )
VALUES
`;

export const PERMISSION_DATA = `
INSERT INTO "permissions" (
    "id",
    "code",
    "description"
    )
VALUES
`;

export const USER_PERMISSION_DATA = `
INSERT INTO "user_permissions" (
    "user_id",
    "permission_id"
    )
VALUES
`;

export const PASSWORD_RESET_TOKEN_DATA = `
INSERT INTO "password_reset_tokens" (
    "id",
    "user_id",
    "token_hash",
    "expires_at",
    "created_at",
    "used_at"
    )
VALUES
`;
