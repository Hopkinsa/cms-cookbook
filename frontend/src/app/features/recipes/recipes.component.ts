import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Field, form } from '@angular/forms/signals';
import { environment } from 'src/environment/environment';

import { RecipeListService, RecipeService, SignalService } from '@server/core/services';
import { IRecipeSearch, IRecipeSearchInit } from '@server/core/interface';

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

  sortOption(): void {
      if (this.fieldModel().sortSelect === 't1') {
        this.recipeListService.recipeSort.set({ sortOn: 'title', sortDir: 'asc' });
        this.fieldModel().sort = { target: 'title', direction: 'asc' };
      }
      if (this.fieldModel().sortSelect === 't2') {
        this.recipeListService.recipeSort.set({ sortOn: 'title', sortDir: 'desc' });
        this.fieldModel().sort = { target: 'title', direction: 'desc' };
      }
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
    this.recipeListService.getRecipeList.set(Date.now());
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
