export interface IIngredients {
  is_title: boolean;
  ingredient: string;
  preparation: string;
  quantity: number;
  quantity_unit: number;
}

export interface IIngredientsUpdate {
  is_title?: boolean;
  ingredient?: string;
  preparation?: string;
  quantity?: number;
  quantity_unit?: number;
}

export const ingredientInitialState: IIngredients = {
  is_title: false,
  ingredient: '',
  preparation: '',
  quantity: 0,
  quantity_unit: 0,
};
