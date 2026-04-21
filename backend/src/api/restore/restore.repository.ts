import { ICard, ITags, IUnit } from '../../model/data-model.ts';
import { executeLoggedWriteStatement } from '../shared/write-handler.ts';
import {
  RECIPE_CLEAR_DATA,
  RECIPE_DATA,
  RECIPE_TABLE,
  TAG_CLEAR_DATA,
  TAG_DATA,
  TAG_TABLE,
  UNIT_CLEAR_DATA,
  UNIT_DATA,
  UNIT_TABLE,
} from './restore.sql.ts';
import { type RestoreArchiveData } from './restore.types.ts';

const DEBUG = 'restore | ';

type SqlValue = number | string;

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function serializeSqlValue(value: SqlValue): string {
  return typeof value === 'number' ? `${value}` : `'${escapeSqlString(value)}'`;
}

function buildValuesClause(rows: readonly (readonly SqlValue[])[]): string {
  return rows.map((values) => `(${values.map(serializeSqlValue).join(', ')})`).join(',');
}

function runStatement(statement: string, successMessage: string, errorMessage: string): void {
  executeLoggedWriteStatement(statement, [], `${DEBUG}${successMessage}`, `${DEBUG}${errorMessage}`);
}

export async function createRestoreSchema(): Promise<void> {
  runStatement(TAG_TABLE, 'Tag table created successfully', 'Error creating Tag table');
  runStatement(UNIT_TABLE, 'Unit table created successfully', 'Error creating Unit table');
  runStatement(RECIPE_TABLE, 'Recipe table created successfully', 'Error creating Recipe table');
}

export async function truncateRestoreDatabase(): Promise<void> {
  runStatement(TAG_CLEAR_DATA, 'Tag data truncated', 'Error truncating Tag data');
  runStatement(UNIT_CLEAR_DATA, 'Unit data truncated successfully', 'Error truncating Unit data');
  runStatement(RECIPE_CLEAR_DATA, 'Recipe data truncated successfully', 'Error adding Recipe data');
}

export async function populateTagDatabase(tagData: ITags[]): Promise<void> {
  if (tagData.length === 0) {
    return;
  }

  const values = buildValuesClause(tagData.map((tag) => [tag.id, tag.type, tag.tag] as const));
  runStatement(`${TAG_DATA} ${values}`, 'Tag data restored successfully', 'Error adding Tag data');
}

export async function populateUnitDatabase(unitData: IUnit[]): Promise<void> {
  if (unitData.length === 0) {
    return;
  }

  const values = buildValuesClause(unitData.map((unit) => [unit.id, unit.title, unit.unit, unit.abbreviation] as const));
  runStatement(`${UNIT_DATA} ${values}`, 'Unit data restored successfully', 'Error adding Unit data');
}

export async function populateRecipeDatabase(recipeData: ICard[]): Promise<void> {
  if (recipeData.length === 0) {
    return;
  }

  const values = buildValuesClause(recipeData.map((recipe) => [recipe.id, recipe.card] as const));
  runStatement(`${RECIPE_DATA} ${values}`, 'Recipe data restored successfully', 'Error adding Recipe data');
}

export async function restoreArchiveData(archiveData: RestoreArchiveData): Promise<void> {
  await createRestoreSchema();
  await truncateRestoreDatabase();
  await populateTagDatabase(archiveData.tags);
  await populateUnitDatabase(archiveData.units);
  await populateRecipeDatabase(archiveData.recipes);
}
