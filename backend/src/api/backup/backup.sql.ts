const UNIT_COLUMNS = 'id, title, unit, abbreviation';
const TAG_COLUMNS = 'id, type, tag';
const RECIPE_COLUMNS = 'id, card';
const USER_COLUMNS = 'id, first_name, surname, username, email, password_hash, is_active, created_at, updated_at';
const PERMISSION_COLUMNS = 'id, code, description';
const USER_PERMISSION_COLUMNS = 'user_id, permission_id';
const PASSWORD_RESET_TOKEN_COLUMNS = 'id, user_id, token_hash, expires_at, created_at, used_at';

export const GET_RECIPES = `SELECT ${RECIPE_COLUMNS} FROM recipe`;
export const GET_UNITS = `SELECT ${UNIT_COLUMNS} FROM units`;
export const GET_TAGS = `SELECT ${TAG_COLUMNS} FROM tags`;
export const GET_USERS = `SELECT ${USER_COLUMNS} FROM users ORDER BY id ASC`;
export const GET_PERMISSIONS = `SELECT ${PERMISSION_COLUMNS} FROM permissions ORDER BY id ASC`;
export const GET_USER_PERMISSIONS = `SELECT ${USER_PERMISSION_COLUMNS} FROM user_permissions ORDER BY user_id ASC, permission_id ASC`;
export const GET_PASSWORD_RESET_TOKENS = `SELECT ${PASSWORD_RESET_TOKEN_COLUMNS} FROM password_reset_tokens ORDER BY id ASC`;
