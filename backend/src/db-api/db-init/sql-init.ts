import { data } from './recipes-obj.ts';

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
data.forEach((line) => {
    jsonCards += `('${JSON.stringify(line)}'),`;
});

export const RECIPE_DATA = `
INSERT INTO "recipe" (
    "card"
)
VALUES ${jsonCards.replace(/,$/,'')};
`;

export const UNIT_DATA = `
INSERT INTO "units" (
    "id",
    "title",
    "unit",
    "abbreviation"
    )
VALUES
    (0, '', '---', ''),
    (1, 'Imperial Volume', 'Teaspoon', 'tsp'),
    (2, 'Imperial Volume', 'Tablespoon', 'tbsp'),
    (3, 'Imperial Volume', 'Cup', 'cup'),
    (4, 'Imperial Volume', 'Fluid ounce', 'fl oz'),
    (5, 'Imperial Volume', 'Pint', 'pt'),
    (6, 'Imperial Volume', 'Quart', 'qt'),
    (7, 'Imperial Volume', 'Gallon', 'gal'),
    (8, 'Imperial Weight', 'Ounce', 'oz'),
    (9, 'Imperial Weight', 'Pound', 'lb'),
    (10, 'Metric Volume', 'Milliliter', 'ml'),
    (11, 'Metric Volume', 'Liter', 'l'),
    (12, 'Metric Weight', 'Milligram', 'mg'),
    (13, 'Metric Weight', 'Gram', 'g'),
    (14, 'Metric Weight', 'Kilogram', 'kg')
`;

export const TAG_DATA = `
INSERT INTO "tags" (
    "id",
    "type",
    "tag"
    )
VALUES
    (0, 'category', 'Gluten Free'),
    (1, 'category', 'Family'),
    (2, 'category', 'Dessert'),
    (3, 'cuisine', 'African'),
    (4, 'cuisine', 'BBQ'),
    (5, 'cuisine', 'British'),
    (6, 'cuisine', 'Chinese'),
    (7, 'cuisine', 'French'),
    (8, 'cuisine', 'Hungarian'),
    (9, 'cuisine', 'Indian'),
    (10, 'cuisine', 'Italian'),
    (11, 'cuisine', 'Japanese'),
    (12, 'cuisine', 'Mexican'),
    (13, 'cuisine', 'Spanish'),
    (14, 'cuisine', 'Thai'),
    (15, 'cuisine', 'Welsh')
`;