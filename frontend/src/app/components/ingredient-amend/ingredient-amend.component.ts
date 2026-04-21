import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { IIngredients, IIngredientsUpdate, ingredientInitialState } from '@server/core/interface';
import { UnitSelectComponent } from '@server/components/unit-select/unit-select.component';

type IngredientField = {
  is_title(): { value(): boolean };
  ingredient(): { value(): string };
  preparation(): { value(): string };
  quantity(): { value(): number };
  quantity_unit(): { value(): number };
};

@Component({
  selector: 'app-ingredient-amend',
  templateUrl: './ingredient-amend.component.html',
  styleUrls: ['./ingredient-amend.component.scss'],
  standalone: true,
  imports: [FormField, UnitSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientAmendComponent {
  readonly signalIngredient = input<IngredientField | undefined>(undefined, {
    alias: 'ingredient',
  });
  readonly ingredientChange = output<IIngredientsUpdate>();

  protected readonly ingredientModel = signal<IIngredients>({ ...ingredientInitialState });
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
          quantity_unit: ingredientSignal.quantity_unit().value(),
        };
      } else {
        initForm = ingredientInitialState;
      }
      this.ingredientModel.set(initForm);
      this.formInit = false;
    }
  });

  // Update parent via output signal if value has changed
  private updateEffect = effect(() => {
      const ingredientSignal = this.signalIngredient();

      if (ingredientSignal === undefined) {
        return;
      }

    let updateData = null;
      if (this.ingredientModel().is_title !== ingredientSignal.is_title().value()) {
      updateData = { is_title: this.ingredientModel().is_title };
    }
      if (this.ingredientModel().ingredient !== ingredientSignal.ingredient().value()) {
      updateData = { ingredient: this.ingredientModel().ingredient };
    }
      if (this.ingredientModel().preparation !== ingredientSignal.preparation().value()) {
      updateData = { preparation: this.ingredientModel().preparation };
    }
      if (this.ingredientModel().quantity !== ingredientSignal.quantity().value()) {
      updateData = { quantity: this.ingredientModel().quantity };
    }
      if (this.ingredientModel().quantity_unit !== ingredientSignal.quantity_unit().value()) {
      updateData = { quantity_unit: this.ingredientModel().quantity_unit };
    }
    if (updateData !== null) {
      this.ingredientChange.emit(updateData);
    }
  });

  qtyUnitSelectUpdate(event: number): void {
    // update form model, to trigger signals change detection and processes
    this.ingredientModel.update((val) => ({ ...val, quantity_unit: event }));
  }
}
