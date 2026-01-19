import { TestBed } from '@angular/core/testing';
import { RecipeListService } from '@server/core/services';
import { recipeListResolver } from './recipe-list.resolver';

describe('recipeListResolver', () => {
  it('sets getRecipeList and does not throw', () => {
    const getRecipeList: any = (() => null);
    getRecipeList.set = jest.fn();
    const svc = { getRecipeList } as any;
    TestBed.configureTestingModule({ providers: [{ provide: RecipeListService, useValue: svc }] });

    const res = TestBed.runInInjectionContext(() => recipeListResolver({} as any, {} as any));
    // resolver does not return anything explicitly
    expect(getRecipeList.set).toHaveBeenCalled();
  });
});