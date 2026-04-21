import { ICard, ITags, IUnit } from '../../model/data-model.ts';
import { executeReadAllOrNull } from '../shared/read-handler.ts';
import { GET_RECIPES, GET_TAGS, GET_UNITS } from './backup.sql.ts';

const DEBUG = 'backup | ';

export async function getBackupTags(): Promise<ITags[] | null> {
  return executeReadAllOrNull<ITags>(GET_TAGS, [], `${DEBUG}getTags`);
}

export async function getBackupUnits(): Promise<IUnit[] | null> {
  return executeReadAllOrNull<IUnit>(GET_UNITS, [], `${DEBUG}getUnits`);
}

export async function getBackupRecipes(): Promise<ICard[] | null> {
  return executeReadAllOrNull<ICard>(GET_RECIPES, [], `${DEBUG}getRecipes`);
}
