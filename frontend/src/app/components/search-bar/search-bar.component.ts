import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormField, form } from '@angular/forms/signals';
import { TitleCasePipe } from '@angular/common';

import { RecipeListService, SignalService } from '@server/core/services';
import { IRecipeSearch, IRecipeSearchInit, ITags, RecipeTagFilterMode } from '@server/core/interface';

interface ITagGroup {
  type: string;
  items: ITags[];
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
    standalone: true,
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    FormField,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent {
  protected signalService: SignalService = inject(SignalService);
  private recipeListService: RecipeListService = inject(RecipeListService);

  protected readonly fieldModel = this.signalService.recipeSearch;
  protected readonly searchForm = form(this.fieldModel);
  protected readonly showTagMode = computed(() => this.fieldModel().tags.length > 1);
  protected readonly activeTagModeLabel = computed(() => `Matching: ${this.fieldModel().tagMode.toUpperCase()}`);
  protected readonly availableTagGroups = computed<ITagGroup[]>(() => {
    const allTags = this.signalService.tags() ?? [];
    const selectedTags = new Set(this.fieldModel().tags);
    const groups = new Map<string, ITags[]>();

    for (const tag of allTags) {
      if (selectedTags.has(tag.tag)) {
        continue;
      }

      const currentGroup = groups.get(tag.type) ?? [];
      currentGroup.push(tag);
      groups.set(tag.type, currentGroup);
    }

    return Array.from(groups.entries()).map(([type, items]) => ({ type, items }));
  });


  sortOption(): void {
    let sortValue = { target: 'title', direction: 'asc' };
    if (this.fieldModel().sortSelect === 't1') {
      sortValue = { target: 'title', direction: 'asc' };
    }
    if (this.fieldModel().sortSelect === 't2') {
      sortValue = { target: 'title', direction: 'desc' };
    }
    if (this.fieldModel().sortSelect === 't3') {
      sortValue = { target: 'created', direction: 'desc' };
    }
    if (this.fieldModel().sortSelect === 't4') {
      sortValue = { target: 'created', direction: 'asc' };
    }
    if (this.fieldModel().sortSelect === 't5') {
      sortValue = { target: 'updated', direction: 'desc' };
    }
    if (this.fieldModel().sortSelect === 't6') {
      sortValue = { target: 'updated', direction: 'asc' };
    }
    this.signalService.pageSort.set(sortValue);
    this.fieldModel.update((current: IRecipeSearch) => ({ ...current, sort: sortValue }));
    this.recipeListService.getRecipeList.set(Date.now());
  }

  search(e: Event): void {
    e.preventDefault();
    const terms = this.fieldModel().terms;
    this.signalService.pageIndex.set(0);
    if (terms !== null && terms !== undefined && terms.trim() !== '') {
      this.recipeListService.findRecipes.set(terms);
      return;
    }

    this.recipeListService.findRecipes.set(null);
    this.recipeListService.getRecipeList.set(Date.now());
  }

  reset(): void {
    this.fieldModel.set({ ...IRecipeSearchInit });
    this.signalService.pageIndex.set(0);
    this.recipeListService.findRecipes.set(null);
    this.recipeListService.getRecipeList.set(Date.now());
  }

  addTag(): void {
    const x = this.fieldModel();
    const y: string[] = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    const z = this.fieldModel().tag.trim();

    if (z !== '' && !y.includes(z)) {
      y.push(z);
      this.fieldModel.set({ ...x, tag: '', tags: y });
      this.signalService.pageIndex.set(0);
    }
  }

  removeTag(index: number): void {
    const x = this.fieldModel();
    const y: string[] | undefined = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    if (y !== undefined) {
      y.splice(index, 1);
      this.fieldModel.set({ ...x, tags: y });
      this.signalService.pageIndex.set(0);
    }
  }

  tagModeChanged(): void {
    const tagMode = this.fieldModel().tagMode as RecipeTagFilterMode;
    this.fieldModel.update((current: IRecipeSearch) => ({ ...current, tagMode }));
    this.signalService.pageIndex.set(0);
  }
}
