export const UPDATE_RECIPE_DATA = `UPDATE recipe SET card = ? WHERE id = ?`;

export const UPDATE_TAG_DATA = `UPDATE tags SET type = ?, tag = ? WHERE id = ?`;
export const CREATE_TAG_DATA = `INSERT INTO tags ("type", "tag") VALUES (?, ?)`;