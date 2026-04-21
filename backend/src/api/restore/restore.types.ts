import { ICard, ITags, IUnit } from '../../model/data-model.ts';

export type RestoreArchiveData = {
  tags: ITags[];
  units: IUnit[];
  recipes: ICard[];
};
