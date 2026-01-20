import { TestBed } from '@angular/core/testing';
import { SignalService } from '@server/core/services';
import { addRecipeResolver } from './add-recipe.resolver';

describe('addRecipeResolver', () => {
  it('sets initial recipe state and returns -1', () => {
    const recipeSet = jest.fn();
    const svc = { recipe: { set: recipeSet } } as any;
    TestBed.configureTestingModule({ providers: [{ provide: SignalService, useValue: svc }] });

    const res = TestBed.runInInjectionContext(() => addRecipeResolver({} as any, {} as any));
    expect(recipeSet).toHaveBeenCalled();
    expect(res).toBe(-1);
  });
});
