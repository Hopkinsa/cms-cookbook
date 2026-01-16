import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Field, form } from '@angular/forms/signals';
import { environment } from 'src/environment/environment';

import { RecipeListService, RecipeService, SignalService } from '@server/core/services';
import { IRecipeSearch, IRecipeSearchInit } from '@server/core/interface';
import { generateFilename } from '@server/shared/helper/filename.helper';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);
  private recipeListService: RecipeListService = inject(RecipeListService);
  private recipeService: RecipeService = inject(RecipeService);

  protected imgURL = `${environment.baseImgURL}image/`;
  protected readonly fieldModel = signal<IRecipeSearch>(IRecipeSearchInit);
  protected searchForm = form(this.fieldModel);

  icon(img_url: string): string {
    const imgNames = generateFilename(img_url);
    return this.imgURL + imgNames.icon;
  }

  sortOption(): void {
    let sortValue = { target: 'title', direction: 'asc' };
    if (this.fieldModel().sortSelect === 't1') {
      sortValue = { target: 'title', direction: 'asc' };
    }
    if (this.fieldModel().sortSelect === 't2') {
      sortValue = { target: 'title', direction: 'desc' };
    }
    this.recipeListService.recipeSort.set(sortValue);
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
  }

  delete(id: number): void {
    if (id >= 0) {
      this.recipeService.deleteRecipe(id).subscribe(() => {
        this.recipeListService.getRecipeList.set(Date.now());
      });
    }
  }

  amend(id: number): void {
    this.signalService.returnTo.set('recipes');
    this.router.navigate(['/recipe', id, 'amend']);
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
