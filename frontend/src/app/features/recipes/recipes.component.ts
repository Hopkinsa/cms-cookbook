import { ChangeDetectionStrategy, Component, inject, linkedSignal, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { environment } from 'src/environment/environment';

import { RecipeListService, RecipeService, SignalService } from '@server/core/services';
import { generateFilename } from '@server/shared/helper/filename.helper';
import { SearchBarComponent } from "@server/components/search-bar/search-bar.component";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    SearchBarComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RecipesComponent {
  private router: Router = inject(Router);
  protected signalService: SignalService = inject(SignalService);
  private recipeListService: RecipeListService = inject(RecipeListService);
  private recipeService: RecipeService = inject(RecipeService);

  protected readonly resultsPage = linkedSignal(() => {
    const start = this.signalService.pageIndex() * this.signalService.pageSize();
    const end = start + this.signalService.pageSize();
    return this.signalService.recipeList()!.slice(start, end);
  });

  protected imgURL = `${environment.baseImgURL}`;

  icon(img_url: string): string {
    const imgNames = generateFilename(img_url);
    return this.imgURL + imgNames.icon;
  }

  onPageChange(event: any): void {
    // keep top and bottom paginator in sync
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.signalService.pageIndex.set(pageIndex);
    this.signalService.pageSize.set(pageSize);
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

  add(): void {
    this.signalService.returnTo.set('recipes');
    this.router.navigate(['/recipe', 'add']);
  }

  back(): void {
    this.router.navigate(['/']);
  }
}
