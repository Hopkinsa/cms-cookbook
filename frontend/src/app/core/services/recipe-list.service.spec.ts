import { TestBed } from '@angular/core/testing';
import { RecipeListService } from './recipe-list.service';
import { SignalService } from '@server/core/services';

describe('RecipeListService', () => {
  it('has default signals and allows recipeSort changes', () => {
    const mockSignal: any = { recipeList: { set: jest.fn() }, recipesFound: { set: jest.fn() } };
    TestBed.configureTestingModule({ providers: [{ provide: SignalService, useValue: mockSignal }] });
    const svc = TestBed.inject(RecipeListService);

    expect(svc.getRecipeList()).toBeNull();
    expect(svc.findRecipes()).toBeNull();
    expect(svc.recipeSort().target).toBe('title');

    svc.recipeSort.set({ target: 'prep_time', direction: 'desc' });
    expect(svc.recipeSort().target).toBe('prep_time');
  });
});
