import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipeListService, RecipeService, SignalService } from '@server/core/services';
import { of } from 'rxjs';

describe('RecipesComponent', () => {
  it('paginates filtered recipes and supports delete, amend and back', () => {
    const mockSignal: any = {
      returnTo: { set: jest.fn() },
      filteredRecipeList: signal([
        { id: 1, title: 'A', img_url: '', tags: ['vegan'], date_created: 1, date_updated: 1 },
        { id: 2, title: 'B', img_url: '', tags: ['vegan', 'quick'], date_created: 1, date_updated: 1 },
        { id: 3, title: 'C', img_url: '', tags: ['breakfast'], date_created: 1, date_updated: 1 },
      ]),
      filteredRecipesFound: signal(3),
      pageIndex: signal(0),
      pageSize: signal(2),
      pageSizeOptions: [2, 4, 6],
    };
    const mockRecipeList: any = {
      getRecipeList: { set: jest.fn() },
      findRecipes: { set: jest.fn() },
    };
    const mockRecipeService: any = { deleteRecipe: jest.fn(() => of({})) };
    const mockRouter: any = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: RecipeListService, useValue: mockRecipeList },
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const comp = TestBed.runInInjectionContext(() => new RecipesComponent()) as any;

    expect(comp.icon('file.name.png')).toContain('file.name-Icon.png');
    expect(comp.filteredRecipes().map((recipe: any) => recipe.id)).toEqual([1, 2, 3]);
    expect(comp.resultsPage().map((recipe: any) => recipe.id)).toEqual([1, 2]);

    comp.delete(2);
    expect(mockRecipeService.deleteRecipe).toHaveBeenCalled();

    comp.amend(3);
    expect(mockSignal.returnTo.set).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();

    comp.back();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
