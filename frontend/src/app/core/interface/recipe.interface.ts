import { IIngredients, IStep } from './';

export interface ISortSignal {
  target: string;
  direction: string;
}
export interface IRecipeSearch {
  total?: number;
  page?: { offset: number; quantity: number };
  sortSelect: string;
  sort?: ISortSignal;
  terms: string;
  tag: string;
  tags: string[];
}

export const IRecipeSearchInit: IRecipeSearch = {
  sortSelect: 't1',
  sort: { target: 'title', direction: 'asc' },
  terms: '',
  tag: '',
  tags: [],
};

export interface IRecipeList {
  id: number;
  title: string;
  img_url: string;
  tags: string[];
  date_created: number;
  date_updated: number;
}

export const recipeListInitialState: IRecipeList = {
  id: 0,
  title: '',
  img_url: '',
  tags: [],
  date_created: 0,
  date_updated: 0,
};

export interface ISearchResults {
  total: number;
  page?: { offset: number; quantity: number };
  sort?: ISortSignal;
  terms?: string;
  results: IRecipeList[];
}

export const ISearchResultsInit: ISearchResults = {
  total: 0,
  page: { offset: 0, quantity: 0 },
  sort: { target: '', direction: '' },
  results: [],
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
  date_created: number;
  date_updated: number;
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
  date_created: 0,
  date_updated: 0,
};
