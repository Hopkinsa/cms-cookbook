import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';

import {
  IIngredients,
  ingredientInitialState,
  IRecipe,
  IStep,
  recipeInitialState,
  stepInitialState,
} from '@server/core/interface';
import { SignalService } from '@server/core/services';

type IImport = {
  recipe: string;
};

@Component({
  selector: 'app-import-recipe',
  templateUrl: './import-recipe.component.html',
  styleUrls: ['./import-recipe.component.scss'],
  standalone: true,
  imports: [Field, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportRecipeComponent {
  recipeImport = output<any>();

  protected signalService: SignalService = inject(SignalService);
  protected processedRecipe: IRecipe = {...recipeInitialState};

  protected readonly importModel = signal<IImport>({ recipe: '' });
  protected importForm = form(this.importModel);

  toTitleCase(str: string): string {
    return str.toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  import(e: Event): void {
    e.preventDefault();
    if (this.importForm.recipe().value().trim() !== '') {
      this.processRecipe();
    }
  }

  calculateTimes(matched: RegExpMatchArray): number | null {
    let timeInMinutes: number | null = null;

    if (matched) {
      const timeString = matched[1];
      // Extract hours
      const hoursMatch = timeString.match(/(\d+)\s*(?:hour|hr)s?/i);
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      // Extract minutes
      const minutesMatch = timeString.match(/(\d+)\s*(?:minute|min)s?/i);
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      timeInMinutes = hours * 60 + minutes;
    }
    return timeInMinutes;
  }

  findTimes(data: string): number | null {
    // Find and extract the time in minutes or return null
    let timeInMinutes: number | null = null;

    const timeMatch = data.match(/(\d+(?:\s*(?:hour|hr|minute|min)s?)(?:\s*\d+(?:\s*(?:minute|min)s?)?)?)/i);
    if (timeMatch !== null) {
      timeInMinutes = this.calculateTimes(timeMatch);
    }
    return timeInMinutes;
  }

  addTitle(data: string[]): void {
    // Assume first line is the recipe title
    this.processedRecipe.title = this.toTitleCase(data[0].trim());
  }

  addPrepTime(data: string[]): void {
    // Find prep time and convert to minutes
    let idx = data.findIndex((elm) => elm.match(/(?:prep(?:aration)?\s*time|time\s*to\s*prepare)/i));
    if (idx >= 0) {
      let prepTimeMatch = this.findTimes(data[idx]);
      if (prepTimeMatch !== null) {
        this.processedRecipe.prep_time = prepTimeMatch;
      } else {
        idx++;
        prepTimeMatch = this.findTimes(data[idx]);
        if (prepTimeMatch !== null) {
          this.processedRecipe.prep_time = prepTimeMatch;
        }
      }
    }
  }

  addCookTime(data: string[]): void {
    // Find cook time and convert to minutes
    let idx = data.findIndex((elm) => elm.match(/(?:cook(?:ing)?\s*time|time\s*to\s*cook)/i));
    if (idx >= 0) {
      let cookTimeMatch = this.findTimes(data[idx]);
      if (cookTimeMatch !== null) {
        this.processedRecipe.cook_time = cookTimeMatch;
      } else {
        idx++;
        cookTimeMatch = this.findTimes(data[idx]);
        if (cookTimeMatch !== null) {
          this.processedRecipe.cook_time = cookTimeMatch;
        }
      }
    }
  }

  addServing(data: string[]): void {
    let idx = data.findIndex((elm) => elm.match(/(?:\s*(?:serve|serving|yield)s?)/i));
    if (idx >= 0) {
      let servesMatch = data[idx].match(/(\d+)/i);
      if (servesMatch !== null) {
        this.processedRecipe.serves = parseInt(servesMatch[1]);
      } else {
        idx++;
        servesMatch = data[idx].match(/(\d+)/i);
        if (servesMatch !== null) {
          this.processedRecipe.serves = parseInt(servesMatch[1]);
        }
      }
    }
  }

  processIngredient(data: string): IIngredients {
    let processData = data;
    const ingredient: IIngredients = ingredientInitialState;
    // Find qty
    const qtyMatch = processData.match(/(\d+(?:\.\d+)?)/i);
    const qty = qtyMatch ? parseFloat(qtyMatch[1]) : 0;
    if (qty > 0) {
      processData = processData.replace(qtyMatch![1], '').trim();
    }
    // Find unit of measurement
    const firstWord = processData.split(' ')[0];
    let unit = 0;
    unit = this.signalService
      .units()!
      .findIndex(
        (elm) =>
          elm.abbreviation.toLowerCase() === firstWord.toLowerCase() ||
          `${elm.abbreviation.toLowerCase()}s` === firstWord.toLowerCase() ||
          elm.unit.toLowerCase() === firstWord.toLowerCase() ||
          `${elm.unit.toLowerCase()}s` === firstWord.toLowerCase(),
      );

    if (unit >= 0) {
      // found, remove word from string
      processData = processData.replace(firstWord, '').trim();
    } else {
      // not found (-1), set to 0
      unit = 0;
    }
    // Find ingredient name and preparation
    const remainingWords = processData.split(',');

    ingredient.quantity = qty;
    ingredient.quantity_unit = unit;
    ingredient.ingredient = remainingWords[0].trim();
    ingredient.preparation = remainingWords.length > 1 ? remainingWords[1].trim() : '';

    return ingredient;
  }

  addIngredients(data: string[]): void {
    let idx = data.findIndex((elm) => elm.match(/(?:\s*(?:ingredient)s?)/i));
    if (idx >= 0) {
      const idxEnd = data.findIndex((elm) => elm.match(/(?:\s*(?:step|direction|method|instruction)s?)/i));
      let ingredientString = '';
      const ingredientArray: string[] = [];
      while (idx < idxEnd - 1) {
        idx++;
        ingredientString = data[idx].trim();
        ingredientArray.push(ingredientString);
      }
      const ingredients: IIngredients[] = [];
      ingredientArray.forEach((element) => {
        const ingredient: IIngredients = this.processIngredient(element);
        ingredients.push({ ...ingredient });
      });
      this.processedRecipe.ingredients = ingredients;
    }
  }

  addSteps(data: string[]): void {
    let idx = data.findIndex((elm) => elm.match(/(?:\s*(?:step|direction|method|instruction)s?)/i));
    if (idx >= 0) {
      const idxEnd = data.length - 1;
      const stepArray: IStep[] = [];
      const stepStage: IStep = stepInitialState;

      while (idx < idxEnd) {
        idx++;
        stepStage.step = data[idx].trim();
        stepArray.push({ ...stepStage });
      }
      this.processedRecipe.steps = stepArray;
    }
  }

  processRecipe(): void {
    const recipeArray = this.importForm
      .recipe()
      .value()
      .trim()
      .split('\n')
      .filter((x) => x.trim() !== ''); // remove empty elements

    this.addTitle(recipeArray);
    this.addPrepTime(recipeArray);
    this.addCookTime(recipeArray);
    this.addServing(recipeArray);
    this.addIngredients(recipeArray);
    this.addSteps(recipeArray);

    this.recipeImport.emit(this.processedRecipe);
  }
}
