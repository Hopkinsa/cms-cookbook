import { IRecipe, ITags, IUnit } from '../../model/data-model.ts';
import { unitData } from './units.ts';
import { tagData } from './tags.ts';
import { recipeData } from './recipes.ts';

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

let jsonCards = '';
recipeData.forEach((recipe) => {
  jsonCards += `( ${recipe.id}, ${recipe.card}),`;
});

export const RECIPE_DATA = `
INSERT INTO "recipe" (
    "id",
    "card"
)
VALUES
 ${jsonCards};
`;

let jsonUnits = '';
unitData.forEach((unit) => {
  jsonUnits += `( ${unit.id}, '${unit.title}', '${unit.unit}, '${unit.abbreviation}'),`;
});

export const UNIT_DATA = `
INSERT INTO "units" (
    "id",
    "title",
    "unit",
    "abbreviation"
    )
VALUES
 ${jsonUnits};
 `;

let jsonTags = '';
tagData.forEach((tag) => {
  jsonTags += `( ${tag.id}, '${tag.type}', '${tag.tag}'),`;
});

export const TAG_DATA = `
INSERT INTO "tags" (
    "id",
    "type",
    "tag"
    )
VALUES
 ${jsonTags};
 `;
