const RECIPE_COLUMNS = 'id, card';

const RECIPE_LIST_COLUMNS = `id, json_extract(card, '$.title') as title,
json_extract(card, '$.img_url') as img_url,
json_extract(card, '$.tags') as tags,
json_extract(card, '$.date_created') as date_created,
json_extract(card, '$.date_updated') as date_updated`;

const RESULT_TOTAL = 'count(*) as total';

export const CREATE_RECIPE_DATA = `INSERT INTO recipe ("card") VALUES (?)`;
export const UPDATE_RECIPE_DATA = `UPDATE recipe SET card = ? WHERE id = ?`;
export const DELETE_RECIPE_DATA = `DELETE FROM recipe WHERE id = ?`;

export const FIND_RECIPE_BY_ID = `SELECT ${RECIPE_COLUMNS} FROM recipe WHERE id = ?`;
export const FIND_RECIPE_BY_TITLE = `SELECT ${RECIPE_COLUMNS} FROM recipe WHERE json_extract(card, '$.title') = ?`;
export const FIND_RECIPES = `SELECT ${RECIPE_LIST_COLUMNS} FROM recipe WHERE json_extract(card, '$.title') LIKE ? ORDER BY`;
export const FIND_RECIPES_TOTAL = `SELECT ${RESULT_TOTAL} FROM recipe WHERE json_extract(card, '$.title') LIKE ?`;
export const GET_RECIPES = `SELECT ${RECIPE_LIST_COLUMNS} FROM recipe ORDER BY`;
export const GET_RECIPES_TOTAL = `SELECT ${RESULT_TOTAL} FROM recipe`;
