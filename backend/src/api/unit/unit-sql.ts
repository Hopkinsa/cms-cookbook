const UNIT_COLUMNS = 'id, title, unit, abbreviation';

export const FIND_UNIT_BY_ID = `SELECT ${UNIT_COLUMNS} FROM units WHERE id = ?`;
export const GET_UNITS = `SELECT ${UNIT_COLUMNS} FROM units`;
