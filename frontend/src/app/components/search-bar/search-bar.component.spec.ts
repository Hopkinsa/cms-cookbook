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
    pageSort: { set: jest.fn() },
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
    mockSignalService.pageSort.set.mockClear();
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

  it('maps each sort option to the expected sort value', () => {
    const sortCases = [
      { sortSelect: 't1', sort: { target: 'title', direction: 'asc' } },
      { sortSelect: 't2', sort: { target: 'title', direction: 'desc' } },
      { sortSelect: 't3', sort: { target: 'created', direction: 'desc' } },
      { sortSelect: 't4', sort: { target: 'created', direction: 'asc' } },
      { sortSelect: 't5', sort: { target: 'updated', direction: 'desc' } },
      { sortSelect: 't6', sort: { target: 'updated', direction: 'asc' } },
    ];

    for (const sortCase of sortCases) {
      mockSignalService.recipeSearch.set({ ...IRecipeSearchInit, sortSelect: sortCase.sortSelect });

      component.sortOption();

      expect(mockSignalService.pageSort.set).toHaveBeenLastCalledWith(sortCase.sort);
      expect(mockSignalService.recipeSearch().sort).toEqual(sortCase.sort);
      expect(mockRecipeListService.getRecipeList.set).toHaveBeenLastCalledWith(expect.any(Number));
    }
  });

  it('searches by terms and falls back to refreshing the list for blank terms', () => {
    const event = { preventDefault: jest.fn() } as unknown as Event;

    mockSignalService.recipeSearch.set({ ...IRecipeSearchInit, terms: 'pasta' });
    component.search(event);

    expect(mockSignalService.pageIndex.set).toHaveBeenCalledWith(0);
    expect(mockRecipeListService.findRecipes.set).toHaveBeenCalledWith('pasta');

    mockSignalService.recipeSearch.set({ ...IRecipeSearchInit, terms: '   ' });
    component.search(event);

    expect(mockRecipeListService.findRecipes.set).toHaveBeenLastCalledWith(null);
    expect(mockRecipeListService.getRecipeList.set).toHaveBeenLastCalledWith(expect.any(Number));
  });

  it('resets search state and ignores blank or duplicate tags', () => {
    mockSignalService.recipeSearch.set({
      ...IRecipeSearchInit,
      terms: 'soup',
      tag: ' breakfast ',
      tags: ['vegan'],
    });

    component.addTag();
    expect(mockSignalService.recipeSearch().tags).toEqual(['vegan', 'breakfast']);

    mockSignalService.recipeSearch.set({ ...mockSignalService.recipeSearch(), tag: 'breakfast' });
    component.addTag();
    expect(mockSignalService.recipeSearch().tags).toEqual(['vegan', 'breakfast']);

    mockSignalService.recipeSearch.set({ ...mockSignalService.recipeSearch(), tag: '   ' });
    component.addTag();
    expect(mockSignalService.recipeSearch().tags).toEqual(['vegan', 'breakfast']);

    component.reset();
    expect(mockSignalService.recipeSearch()).toEqual(IRecipeSearchInit);
    expect(mockSignalService.pageIndex.set).toHaveBeenCalledWith(0);
    expect(mockRecipeListService.findRecipes.set).toHaveBeenLastCalledWith(null);
    expect(mockRecipeListService.getRecipeList.set).toHaveBeenLastCalledWith(expect.any(Number));
  });
});
