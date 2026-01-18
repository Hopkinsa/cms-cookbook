import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipeListService, RecipeService, SignalService } from '@server/core/services';
import { of } from 'rxjs';

describe('RecipesComponent', () => {
  it('icon, sortOption, search, reset, delete, amend and back', () => {
    const mockSignal: any = { returnTo: { set: jest.fn() } };
    const mockRecipeList: any = { recipeSort: { set: jest.fn() }, getRecipeList: { set: jest.fn() }, findRecipes: { set: jest.fn() } };
    const mockRecipeService: any = { deleteRecipe: jest.fn(() => of({})) };
    const mockRouter: any = { navigate: jest.fn() };

    TestBed.configureTestingModule({ imports: [RecipesComponent], providers: [{ provide: SignalService, useValue: mockSignal }, { provide: RecipeListService, useValue: mockRecipeList }, { provide: RecipeService, useValue: mockRecipeService }, { provide: Router, useValue: mockRouter }] });

    const fixture = TestBed.createComponent(RecipesComponent);
    const comp = fixture.componentInstance as any;

    // icon should include img path fragment
    expect(comp.icon('file.name.png')).toContain('image/');

    // sortOption triggers recipeSort.set and getRecipeList.set
    comp.fieldModel.set({ sortSelect: 't2', terms: '' });
    comp.sortOption();
    expect(mockRecipeList.recipeSort.set).toHaveBeenCalled();

    // search with empty terms does nothing
    const fakeEvent: any = { preventDefault: jest.fn() };
    comp.fieldModel.set({ terms: '' });
    comp.search(fakeEvent);
    expect(mockRecipeList.findRecipes.set).not.toHaveBeenCalled();

    // reset
    comp.reset();
    expect(mockRecipeList.findRecipes.set).toHaveBeenCalledWith(null);

    // delete
    comp.delete(2);
    expect(mockRecipeService.deleteRecipe).toHaveBeenCalled();

    // amend
    comp.amend(3);
    expect(mockSignal.returnTo.set).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalled();

    // back
    comp.back();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});