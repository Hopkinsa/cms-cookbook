import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IRecipeSearchInit } from '@server/core/interface';
import { SignalService } from './signal.service';

describe('SignalService', () => {
  it('canEdit navigates to / when editEnabled is false', () => {
    const router = { navigate: jest.fn() } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });

    // Using TestBed to get a real instance
    const service = TestBed.inject(SignalService);

    TestBed.runInInjectionContext(() => {
      const spy = jest.spyOn(router, 'navigate');
      service.editEnabled.set(true);
      expect(service.editEnabled()).toBe(true);
      service.canEdit();
      expect(spy).not.toHaveBeenCalled();
      const svc = new SignalService();
      svc.editEnabled.set(false);
      expect(svc.editEnabled()).toBe(false);
      svc.canEdit();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('recipeServesAdjustment returns correct ratio or 1 when missing', () => {
    const router = { navigate: jest.fn() } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });

    const service = TestBed.inject(SignalService);
    // no recipe set
    expect(service.recipeServesAdjustment()).toBe(1);

    service.recipe.set({ serves: 4 } as any);
    service.recipeServes.set(2 as any);
    expect(service.recipeServesAdjustment()).toBe(0.5);
  });

  it('filters recipes with OR and AND category matching', () => {
    const router = { navigate: jest.fn() } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });

    const service = TestBed.inject(SignalService);

    service.recipeList.set([
      { id: 1, title: 'Veg Curry', img_url: '', tags: ['vegan', 'dinner'], date_created: 1, date_updated: 1 },
      { id: 2, title: 'Pancakes', img_url: '', tags: ['breakfast'], date_created: 1, date_updated: 1 },
      { id: 3, title: 'Fruit Bowl', img_url: '', tags: ['vegan', 'breakfast'], date_created: 1, date_updated: 1 },
    ]);

    service.recipeSearch.set({ ...IRecipeSearchInit, tags: ['vegan', 'breakfast'], tagMode: 'or' });
    expect(service.filteredRecipeList()?.map((recipe) => recipe.id)).toEqual([1, 2, 3]);

    service.recipeSearch.set({ ...IRecipeSearchInit, tags: ['vegan', 'breakfast'], tagMode: 'and' });
    expect(service.filteredRecipeList()?.map((recipe) => recipe.id)).toEqual([3]);
    expect(service.filteredRecipesFound()).toBe(1);
  });
});
