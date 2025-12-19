import { IIngredients, IStep } from './';

export interface IRecipeList {
  id: number;
  title: string;
  img_url: string;
  tags: string[];
}

export const recipeListInitialState: IRecipeList = {
  id: 0,
  title: '',
  img_url: '',
  tags: [],
};

export interface IRecipeTagForm {
  tag: string;
}

export const recipeTagFormInitialState: IRecipeTagForm = {
  tag: '',
};

export interface IRecipe {
  title: string;
  description: string;
  tags: string[];
  img_url: string;
  prep_time: number;
  cook_time: number;
  serves: number;
  ingredients?: IIngredients[];
  steps?: IStep[];
  notes: string;
}

export const recipeInitialState: IRecipe = {
  title: '',
  description: '',
  tags: [],
  img_url: '',
  prep_time: 0,
  cook_time: 0,
  serves: 0,
  ingredients: [],
  steps: [],
  notes: '',
};
