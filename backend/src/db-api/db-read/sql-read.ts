const UNIT_COLUMNS = 'id, title, unit, abbreviation';
const TAG_COLUMNS = 'id, type, tag';
const RECIPE_COLUMNS = 'id, card';

const RECIPE_LIST_COLUMNS = `id, json_extract(card, '$.title') as title, json_extract(card, '$.img_url') as img_url, json_extract(card, '$.tags') as tags, json_extract(card, '$.date_created') as date_created, json_extract(card, '$.date_updated') as date_updated`;

const RESULT_TOTAL = 'count(*) as total';


export const FIND_RECIPE_BY_ID = `SELECT ${RECIPE_COLUMNS} FROM recipe WHERE id = ?`;
export const FIND_RECIPE_BY_TITLE = `SELECT ${RECIPE_COLUMNS} FROM recipe WHERE json_extract(card, '$.title') = ?`;
export const FIND_RECIPES = `SELECT ${RECIPE_LIST_COLUMNS} FROM recipe WHERE json_extract(card, '$.title') LIKE ? ORDER BY title ASC`;
export const FIND_RECIPES_TOTAL = `SELECT ${RESULT_TOTAL} FROM recipe WHERE json_extract(card, '$.title') LIKE ?`;
export const GET_RECIPES = `SELECT ${RECIPE_LIST_COLUMNS} FROM recipe ORDER BY ?`;
export const GET_RECIPES_TOTAL = `SELECT ${RESULT_TOTAL} FROM recipe`;

export const FIND_UNIT_BY_ID = `SELECT ${UNIT_COLUMNS} FROM units WHERE id = ?`;
export const GET_UNITS = `SELECT ${UNIT_COLUMNS} FROM units`;

export const FIND_TAG_BY_ID = `SELECT ${TAG_COLUMNS} FROM tags WHERE id = ?`;
export const GET_TAGS = `SELECT ${TAG_COLUMNS} FROM tags`;
