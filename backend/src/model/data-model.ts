export interface IResponse {
  completed?: boolean;
  message?: string;
}
export interface ITags {
  id: number;
  type: string;
  tag: string;
}

export interface IUnit {
  id: number;
  title: string;
  unit: string;
  abbreviation: string;
}

export interface ICard {
  id: number;
  card: Text;
}

export interface IRecipe {
  title: string;
  description: string;
  tags: Array<string>;
  img_url: string;
  prep_time: number;
  cook_time: number;
  serves: number;
  ingredients?: Array<IIngredients>;
  steps?: Array<IStep>;
  notes: string;
  date_created?: number;
  date_updated?: number;
}

export interface IIngredients {
  is_title: boolean;
  ingredient: string;
  preparation: string;
  quantity: number;
  quantity_unit: number;
}

export interface IStep {
  is_title: boolean;
  step: string;
}