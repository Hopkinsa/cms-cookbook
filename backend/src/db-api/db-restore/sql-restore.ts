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
