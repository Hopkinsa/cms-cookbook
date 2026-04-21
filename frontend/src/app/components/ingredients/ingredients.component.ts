import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { SignalService } from '@server/core/services/signal.service';
import {
  getIngredientMeasurementDisplay,
  IngredientMeasurementMode,
} from '@server/shared/helper/ingredient-measurement.helper';
import { IngredientQuantityPipe } from '@server/shared/pipes';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  standalone: true,
  imports: [IngredientQuantityPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent {
  readonly displayMode = input<IngredientMeasurementMode>('original');
  protected signalService: SignalService = inject(SignalService);
  protected readonly displayIngredients = computed(() => {
    const ingredients = this.signalService.ingredients() ?? [];
    const units = this.signalService.units();
    const quantityMultiplier = this.signalService.recipeServesAdjustment();

    return ingredients.map((ingredient) => ({
      ...ingredient,
      measurement: getIngredientMeasurementDisplay(ingredient, units, this.displayMode(), quantityMultiplier),
    }));
  });
}
