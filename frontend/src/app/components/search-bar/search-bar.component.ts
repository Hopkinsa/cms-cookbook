import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Field, form } from '@angular/forms/signals';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';

import { RecipeListService, SignalService } from '@server/core/services';
import { IRecipeSearch, IRecipeSearchInit} from '@server/core/interface';
import { GroupByPipe } from '@server/shared/pipes';

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
    Field,
    GroupByPipe,
    KeyValuePipe,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent {

  protected signalService: SignalService = inject(SignalService);
  private recipeListService: RecipeListService = inject(RecipeListService);

  protected readonly fieldModel = signal<IRecipeSearch>({ ...IRecipeSearchInit });
  protected searchForm = form(this.fieldModel);


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
    this.fieldModel().sort = sortValue;
    this.recipeListService.getRecipeList.set(Date.now());
  }

  search(e: Event): void {
    e.preventDefault();
    const terms = this.fieldModel().terms;
    if (terms !== null && terms !== undefined && terms.trim() !== '') {
      this.recipeListService.findRecipes.set(terms);
    }
  }

  reset(): void {
    this.fieldModel.set(IRecipeSearchInit);
    this.recipeListService.findRecipes.set(null);
    this.recipeListService.getRecipeList.set(Date.now());
  }

  addTag(): void {
    const x = this.fieldModel();
    const y: string[] = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    const z = this.fieldModel().tag;
    if (!y.includes(z)) {
      y.push(z);
      this.fieldModel.set({...x, tags: y});
    }
  }

  removeTag(index: number): void {
    const x = this.fieldModel();
    const y: string[] | undefined = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    if (y !== undefined) {
      y.splice(index, 1);
      this.fieldModel.set({...x, tags: y});
    }
  }
}
