import { IIngredients, IRecipe, IStep } from '@server/core/interface';

export function appendItem<T>(collection: readonly T[] | undefined, item: T): T[] | undefined {
  return collection ? [...collection, item] : undefined;
}

export function replaceItem<T>(collection: readonly T[] | undefined, index: number, item: T): T[] | undefined {
  return collection?.map((entry, entryIndex) => (entryIndex === index ? item : entry));
}

export function removeItem<T>(collection: readonly T[] | undefined, index: number): T[] | undefined {
  return collection?.filter((_, entryIndex) => entryIndex !== index);
}

export function moveItem<T>(collection: readonly T[] | undefined, fromIndex: number, toIndex: number): T[] | undefined {
  if (!collection) {
    return undefined;
  }

  const nextItems = [...collection];
  const [movedItem] = nextItems.splice(fromIndex, 1);

  if (movedItem === undefined) {
    return nextItems;
  }

  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function updateIngredientAt(
  ingredients: readonly IIngredients[] | undefined,
  index: number,
  update: Partial<IIngredients>,
): IIngredients[] | undefined {
  const currentIngredient = ingredients?.[index];

  if (!currentIngredient) {
    return ingredients ? [...ingredients] : undefined;
  }

  return replaceItem(ingredients, index, { ...currentIngredient, ...update });
}

export function updateStepAt(
  steps: readonly IStep[] | undefined,
  index: number,
  update: Partial<IStep>,
): IStep[] | undefined {
  const currentStep = steps?.[index];

  if (!currentStep) {
    return steps ? [...steps] : undefined;
  }

  return replaceItem(steps, index, { ...currentStep, ...update });
}

export function normalizeRecipeServes(recipe: IRecipe): IRecipe {
  const parsedServes = Number(recipe.serves);

  if (Number.isFinite(parsedServes) && parsedServes > 0) {
    return { ...recipe, serves: parsedServes };
  }

  return { ...recipe, serves: 1 };
}
