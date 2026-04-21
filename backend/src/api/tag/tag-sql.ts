const TAG_COLUMNS = 'id, type, tag';

export const CREATE_TAG_DATA = `INSERT INTO tags ("type", "tag") VALUES (?, ?)`;
export const UPDATE_TAG_DATA = `UPDATE tags SET type = ?, tag = ? WHERE id = ?`;
export const DELETE_TAG_DATA = `DELETE FROM tags WHERE id = ?`;

export const FIND_TAG_BY_ID = `SELECT ${TAG_COLUMNS} FROM tags WHERE id = ?`;
export const GET_TAGS = `SELECT ${TAG_COLUMNS} FROM tags`;
