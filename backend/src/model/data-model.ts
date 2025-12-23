export type IResponse = {
  completed?: boolean;
  message?: string;
};

export type ITags = {
  id: number;
  type: string;
  tag: string;
};

export type IUnit = {
  id: number;
  title: string;
  unit: string;
  abbreviation: string;
};

export type ICard = {
  id: number;
  card: Text;
};

export type IRecipe = {
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
  date_created?: number;
  date_updated?: number;
};

export type IIngredients = {
  is_title: boolean;
  ingredient: string;
  preparation: string;
  quantity: number;
  quantity_unit: number;
};

export type IStep = {
  is_title: boolean;
  step: string;
};

export type ISearchResults = {
  total: number;
  page?: { offset: number; quantity: number };
  sort?: { target: string; direction: string };
  terms?: string;
  results: IRecipe[];
};
