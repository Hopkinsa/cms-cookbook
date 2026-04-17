import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IRecipeSearchInit } from '@server/core/interface';
import { RecipeListService, SignalService } from '@server/core/services';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  const mockSignalService: any = {
    recipeList: signal([]),
    filteredRecipesFound: signal(0),
    recipeSearch: signal({ ...IRecipeSearchInit }),
    pageIndex: { set: jest.fn() },
    tags: signal([
      { id: 1, type: 'meal', tag: 'breakfast' },
      { id: 2, type: 'meal', tag: 'dinner' },
      { id: 3, type: 'diet', tag: 'vegan' },
    ]),
  };
  const mockRecipeListService: any = {
    getRecipeList: { set: jest.fn() },
    findRecipes: { set: jest.fn() },
  };

  beforeEach(async () => {
    mockSignalService.recipeSearch.set({ ...IRecipeSearchInit });
    mockSignalService.pageIndex.set.mockClear();
    mockRecipeListService.getRecipeList.set.mockClear();
    mockRecipeListService.findRecipes.set.mockClear();

    await TestBed.configureTestingModule({
      providers: [
        { provide: SignalService, useValue: mockSignalService },
        { provide: RecipeListService, useValue: mockRecipeListService },
      ],
    })
      .compileComponents();

    component = TestBed.runInInjectionContext(() => new SearchBarComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removes selected categories from the dropdown and restores original order when removed', () => {
    mockSignalService.recipeSearch.set({ ...IRecipeSearchInit, tag: 'breakfast' });

    component.addTag();

    expect(mockSignalService.recipeSearch().tags).toEqual(['breakfast']);
    expect(mockSignalService.recipeSearch().tag).toBe('');
    expect(component['availableTagGroups']().find((group: any) => group.type === 'meal')?.items.map((item: any) => item.tag)).toEqual([
      'dinner',
    ]);

    component.removeTag(0);

    expect(mockSignalService.recipeSearch().tags).toEqual([]);
    expect(component['availableTagGroups']().find((group: any) => group.type === 'meal')?.items.map((item: any) => item.tag)).toEqual([
      'breakfast',
      'dinner',
    ]);
    expect(mockSignalService.pageIndex.set).toHaveBeenCalled();
  });

  it('uses the current tag mode when more than one category is selected', () => {
    mockSignalService.recipeSearch.set({ ...IRecipeSearchInit, tags: ['breakfast', 'vegan'], tagMode: 'and' });

    component.tagModeChanged();

    expect(mockSignalService.recipeSearch().tagMode).toBe('and');
    expect(component['showTagMode']()).toBe(true);
    expect(component['activeTagModeLabel']()).toBe('Matching: AND');
    expect(mockSignalService.pageIndex.set).toHaveBeenCalled();
  });
});
