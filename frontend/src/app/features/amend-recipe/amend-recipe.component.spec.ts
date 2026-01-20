import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AmendRecipeComponent } from './amend-recipe.component';
import { RecipeService, SignalService } from '@server/core/services';

describe('AmendRecipeComponent', () => {
  it('initializes and updates image/tags/ingredients/steps', () => {
    const recipe = { id: 1, tags: ['a'], ingredients: [], steps: [], img_url: '' } as any;
    const mockSignal: any = { recipe: () => recipe, recipe: { set: jest.fn() }, canEdit: jest.fn() };
    const mockRecipeService: any = {
      updateRecipe: jest.fn(() => of({ completed: true })),
      createRecipe: jest.fn(() => of({ completed: true })),
    };

    const mockRoute: any = { snapshot: { data: { id: 1 } } };
    const mockRouter: any = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [AmendRecipeComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
      ],
    });

    const fixture = TestBed.createComponent(AmendRecipeComponent);
    const comp = fixture.componentInstance as any;

    // imageSelected should set img and call signal
    comp.recipeModel.set({ ...recipe });
    comp.imageSelected('x.png');
    expect(mockSignal.recipe.set).toHaveBeenCalled();

    // add tag
    comp.addTag();
    expect(mockSignal.recipe.set).toHaveBeenCalled();

    // tag update
    comp.recipeModel.set({ ...recipe, tags: ['a', ''] });
    comp.tagUpdate('b', 1);
    expect(comp.recipeModel().tags[1]).toBe('b');

    // remove tag
    comp.removeTag(0);
    expect(mockSignal.recipe.set).toHaveBeenCalled();

    // add ingredient
    comp.recipeModel.set({ ...recipe, ingredients: [] });
    comp.addIngredient();
    expect(comp.recipeModel().ingredients!.length).toBeGreaterThan(0);

    // remove ingredient
    comp.removeIngredient(0);

    // add step
    comp.recipeModel.set({ ...recipe, steps: [] });
    comp.addStep();
    expect(comp.recipeModel().steps!.length).toBeGreaterThan(0);

    // remove step
    comp.removeStep(0);
  });

  it('save - update and create flows and back navigation', () => {
    const recipe = { id: 2 } as any;
    const mockSignal: any = {
      recipe: () => recipe,
      recipe: { set: jest.fn() },
      canEdit: jest.fn(),
      feedbackMessage: { set: jest.fn() },
      returnTo: { set: jest.fn(), value: () => 'recipes' },
    };
    const mockRecipeService: any = {
      updateRecipe: jest.fn(() => of({ completed: true })),
      createRecipe: jest.fn(() => of({ completed: true })),
    };

    const mockRouteUpdate: any = { snapshot: { data: { id: 3 } } };
    const mockRouteCreate: any = { snapshot: { data: { id: -1 } } };
    const mockRouter: any = { navigate: jest.fn() };

    // update path
    TestBed.configureTestingModule({
      imports: [AmendRecipeComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRouteUpdate },
      ],
    });
    const fixtureU = TestBed.createComponent(AmendRecipeComponent);
    const compU = fixtureU.componentInstance as any;
    compU.recipeModel.set({ id: 9 });

    compU.save();
    expect(mockRecipeService.updateRecipe).toHaveBeenCalled();

    // create path
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AmendRecipeComponent],
      providers: [
        { provide: SignalService, useValue: mockSignal },
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRouteCreate },
      ],
    });
    const fixtureC = TestBed.createComponent(AmendRecipeComponent);
    const compC = fixtureC.componentInstance as any;
    compC.recipeModel.set({ id: -1 });
    compC.save();
    expect(mockRecipeService.createRecipe).toHaveBeenCalled();

    // back navigation based on returnTo
    mockSignal.returnTo = jest.fn(() => 'display');
    compU.back();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });
});
