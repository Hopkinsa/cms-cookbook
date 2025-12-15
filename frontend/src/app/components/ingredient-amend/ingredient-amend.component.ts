import { Component, effect, input, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';

import { IIngredients, ingredientInitialState } from '@server/core/interface';
import { UnitSelectComponent } from '@server/components/unit-select/unit-select.component';

@Component({
  selector: 'app-ingredient-amend',
  templateUrl: './ingredient-amend.component.html',
  styleUrls: ['./ingredient-amend.component.scss'],
  standalone: true,
  imports: [
    Field,
    UnitSelectComponent,
  ],
  animations: [],
})
export class IngredientAmendComponent {
  signalIngredient = input<any>(ingredientInitialState, {
    alias: "ingredient",
  });
  ingredientChange = output<any>();

  protected ingredientModel = signal<IIngredients>(ingredientInitialState);
  protected ingredientForm = form(this.ingredientModel);

  private formInit = true;

  private ingredientInit = effect(() => {
    // populate on change
    const ingredientSignal = this.signalIngredient();

    // Prevent initial null value from signal creation and repeated updated on signal change
    if (ingredientSignal !== null && this.formInit) {
      let initForm;
      if (ingredientSignal !== undefined) {
        initForm = {
          is_title: ingredientSignal.is_title().value(),
          ingredient: ingredientSignal.ingredient().value(),
          preparation: ingredientSignal.preparation().value(),
          quantity: ingredientSignal.quantity().value(),
          quantity_unit: ingredientSignal.quantity_unit().value()
        }
      } else {
        initForm = ingredientInitialState;
      }
      this.ingredientModel.set(initForm);
      this.formInit = false;
    }
  });

  private isTitleUpdate = effect(() => {
    // update on change
    const ingredientSignal = this.signalIngredient();
    const isTitleField = this.ingredientForm.is_title().value();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((isTitleField && ingredientSignal === undefined) || (isTitleField && isTitleField !== ingredientSignal.is_title().value())) {
      this.ingredientChange.emit({ is_title: isTitleField });
    }
  });

  private isIngredient = effect(() => {
    // update on change
    const ingredientSignal = this.signalIngredient();
    const ingredientField = this.ingredientForm.ingredient().value();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((ingredientField && ingredientSignal === undefined) || (ingredientField && ingredientField !== ingredientSignal.ingredient().value())) {
      this.ingredientChange.emit({ ingredient: ingredientField });
    }
  });

  private isPreparation = effect(() => {
    // update on change
    const ingredientSignal = this.signalIngredient();
    const preparationField = this.ingredientForm.preparation().value();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((preparationField && ingredientSignal === undefined) || (preparationField && preparationField !== ingredientSignal.preparation().value())) {
      this.ingredientChange.emit({ preparation: preparationField });
    }
  });

  private qtyUpdate = effect(() => {
    // update on change
    const ingredientSignal = this.signalIngredient();
    const qtyField = this.ingredientForm.quantity().value();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((qtyField && ingredientSignal === undefined) || (qtyField && qtyField !== ingredientSignal.quantity().value())) {
      this.ingredientChange.emit({ quantity: qtyField });
    }
  });

  private qtyUnitUpdate = effect(() => {
    // update on change
    const ingredientSignal = this.signalIngredient();
    const qtyUnitField = this.ingredientForm.quantity_unit().value();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((qtyUnitField && ingredientSignal === undefined) || (qtyUnitField && qtyUnitField !== ingredientSignal.quantity_unit().value())) {
      this.ingredientChange.emit({ quantity_unit: qtyUnitField });
    }
  });

  qtyUnitSelectUpdate(event: number): void {
    // update form model, to trigger signals change detection and processes
    this.ingredientModel.update((val) => ({ ...val, quantity_unit: event }));
  }
}
