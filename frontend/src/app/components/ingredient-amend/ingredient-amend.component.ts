import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';
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

  // Update parent via output signal if value has changed
  private updateEffect = effect(() => {
    let updateData = null;
    if (this.ingredientModel().is_title !== this.signalIngredient().is_title().value()) { updateData = { is_title: this.ingredientModel().is_title }; }
    if (this.ingredientModel().ingredient !== this.signalIngredient().ingredient().value()) { updateData = { ingredient: this.ingredientModel().ingredient }; }
    if (this.ingredientModel().preparation !== this.signalIngredient().preparation().value()) { updateData = { preparation: this.ingredientModel().preparation }; }
    if (this.ingredientModel().quantity !== this.signalIngredient().quantity().value()) { updateData = { quantity: this.ingredientModel().quantity }; }
    if (this.ingredientModel().quantity_unit !== this.signalIngredient().quantity_unit().value()) { updateData = { quantity_unit: this.ingredientModel().quantity_unit }; }
    if (updateData !== null) {
      this.ingredientChange.emit(updateData);
    }
  });

  protected test = linkedSignal({
    source: () => ({ imodel: this.ingredientModel }),
    computation: (source, previous) => {
      console.log(source.imodel()); if (source.imodel().is_title !== this.signalIngredient().is_title) { console.log('CHANGE'); }
    }
  })

  qtyUnitSelectUpdate(event: number): void {
    // update form model, to trigger signals change detection and processes
    this.ingredientModel.update((val) => ({ ...val, quantity_unit: event }));
  }
}
