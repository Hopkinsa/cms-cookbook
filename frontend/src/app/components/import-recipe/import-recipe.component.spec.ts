import { TestBed } from '@angular/core/testing';
import { ImportRecipeComponent } from './import-recipe.component';

import { SignalService } from '@server/core/services';

describe('ImportRecipeComponent', () => {
  let comp: ImportRecipeComponent;

  beforeEach(() => {
    const mockSignal: any = { units: () => [{ abbreviation: 'g', unit: 'gram' }] };
    TestBed.configureTestingModule({ imports: [ImportRecipeComponent], providers: [{ provide: SignalService, useValue: mockSignal }] });
    const fixture = TestBed.createComponent(ImportRecipeComponent);
    comp = fixture.componentInstance;
  });

  it('calculateTimes parses hours and minutes', () => {
    // calculateTimes expects a RegExpMatchArray with [full, group]
    const match: any = ['2 hours 15 minutes', '2 hours 15 minutes'];
    expect(comp.calculateTimes(match)).toBe(135);
    // test via findTimes
    expect(comp.findTimes('2 hours 15 minutes')).toBe(135);
    expect(comp.findTimes('1 hr 5 min')).toBe(65);
  });

  it('addIngredients parses a list into processedRecipe.ingredients', () => {
    // set the import form model directly
    comp['importModel'].set({ recipe: 'Title\nIngredients\n2 g sugar, powdered\n1 cup milk\nSteps\nStep 1\nStep 2' });
    comp.processRecipe();
    expect(comp.processedRecipe.title).toBe('Title');
    expect(comp.processedRecipe.ingredients!.length).toBeGreaterThan(0);
    expect(comp.processedRecipe.steps!.length).toBeGreaterThan(0);
  });

  it('processIngredient extracts quantity, unit and ingredient', () => {
    const ing = comp.processIngredient('2 g sugar, powdered');
    expect(ing.quantity).toBe(2);
    expect(ing.ingredient).toBe('sugar');
    expect(ing.preparation).toBe('powdered');
  });
});
