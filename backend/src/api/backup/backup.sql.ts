const UNIT_COLUMNS = 'id, title, unit, abbreviation';
const TAG_COLUMNS = 'id, type, tag';
const RECIPE_COLUMNS = 'id, card';

export const GET_RECIPES = `SELECT ${RECIPE_COLUMNS} FROM recipe`;
export const GET_UNITS = `SELECT ${UNIT_COLUMNS} FROM units`;
export const GET_TAGS = `SELECT ${TAG_COLUMNS} FROM tags`;
