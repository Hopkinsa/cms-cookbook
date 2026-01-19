import { TestBed } from '@angular/core/testing';
import { RecipeService } from '@server/core/services/recipe.service';
import { recipeResolver } from './recipe.resolver';

describe('recipeResolver', () => {
  it('returns id and sets getRecipe when id > 0', () => {
    const mockRecipeService = { getRecipe: { set: jest.fn() } } as any;
    TestBed.configureTestingModule({ providers: [{ provide: RecipeService, useValue: mockRecipeService }] });

    const route: any = { paramMap: { get: () => '5' } };
    const res = TestBed.runInInjectionContext(() => recipeResolver(route as any, {} as any));
    expect(res).toBe(5);
    expect(mockRecipeService.getRecipe.set).toHaveBeenCalledWith(5);
  });

  it('returns 0 for invalid id', () => {
    const mockRecipeService = { getRecipe: { set: jest.fn() } } as any;
    TestBed.configureTestingModule({ providers: [{ provide: RecipeService, useValue: mockRecipeService }] });

    const route: any = { paramMap: { get: () => '0' } };
    const res = TestBed.runInInjectionContext(() => recipeResolver(route as any, {} as any));
    expect(res).toBe(0);
    expect(mockRecipeService.getRecipe.set).not.toHaveBeenCalled();
  });
});
