import { TestBed } from '@angular/core/testing';
import { IngredientAmendComponent } from './ingredient-amend.component';

describe('IngredientAmendComponent', () => {
  it('initializes from input signal and updates quantity unit on event', () => {
    const fixture = TestBed.configureTestingModule({ imports: [IngredientAmendComponent] }).createComponent(IngredientAmendComponent);
    const comp = fixture.componentInstance;

    const mockSignal: any = () => ({
      is_title: () => ({ value: () => false }),
      ingredient: () => ({ value: () => 'Sugar' }),
      preparation: () => ({ value: () => 'powdered' }),
      quantity: () => ({ value: () => 2 }),
      quantity_unit: () => ({ value: () => 1 }),
    });

    // set underlying input signal function so component effects receive the value
    (comp as any).signalIngredient = () => ({
      is_title: () => ({ value: () => false }),
      ingredient: () => ({ value: () => 'Sugar' }),
      preparation: () => ({ value: () => 'powdered' }),
      quantity: () => ({ value: () => 2 }),
      quantity_unit: () => ({ value: () => 1 }),
    });
    fixture.detectChanges();

    expect(comp['ingredientModel']().ingredient).toBe('Sugar');
    // now update via method
    comp.qtyUnitSelectUpdate(5);
    expect(comp['ingredientModel']().quantity_unit).toBe(5);
  });
});
