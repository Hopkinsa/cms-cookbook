import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RecipeListService } from './recipe-list.service';
import { SignalService } from '@server/core/services';

describe('RecipeListService', () => {
  it('has default signals and allows search triggers to change', () => {
    const mockSignal: any = {
      recipeList: { set: jest.fn() },
      recipesFound: { set: jest.fn() },
      pageIndex: { set: jest.fn() },
      pageSort: signal({ target: 'title', direction: 'asc' }),
    };
    TestBed.configureTestingModule({ providers: [{ provide: SignalService, useValue: mockSignal }] });
    const svc = TestBed.inject(RecipeListService);

    expect(svc.getRecipeList()).toBeNull();
    expect(svc.findRecipes()).toBeNull();

    svc.getRecipeList.set(123);
    svc.findRecipes.set('cake');

    expect(svc.getRecipeList()).toBe(123);
    expect(svc.findRecipes()).toBe('cake');
  });
});
