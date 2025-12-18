import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { HoursMinutesPipe } from '@server/shared/pipes';
import { IngredientsComponent } from '@server/components/ingredients/ingredients.component';
import { StepsComponent } from '@server/components/steps/steps.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-display-recipe',
  templateUrl: './display-recipe.component.html',
  styleUrls: ['./display-recipe.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    IngredientsComponent,
    StepsComponent,
    HoursMinutesPipe,
  ],
  animations: [],
})
export class DisplayRecipeComponent {
  private title: Title = inject(Title);
  private router: Router = inject(Router);
  private formInit = true;

  protected imgURL = `${ environment.baseImgURL }image/`;
  protected imgPlaceholderURL = `${ environment.baseImgURL }template/`;
  protected signalService: SignalService = inject(SignalService);

  totalTime = 0;

  private displayInit = effect(() => {
    const data = this.signalService.recipe();

    if (data !== null && this.formInit) {
      const recipeTitle = data.title || 'Unknown';
      this.title.setTitle(`${recipeTitle} | Cookbook`)
      this.totalTime = data.prep_time + data.cook_time;
      this.signalService.recipeServes.set((data.serves as number))
      this.formInit = false;
    }
  });

  servingUp(): void {
    let serve: number | null = this.signalService.recipeServes();
    if (serve !== null) {
      if (serve < 10) {
        // Because can be <number | null> cast as <number> to avoid error
        // +(value as number) used as type being lost and defaulting to string
        this.signalService.recipeServes.update((value: number | null) => +(value as number) + 1);
      }
    }
  }

  servingDown(): void {
    let serve: number | null = this.signalService.recipeServes();
    if (serve !== null) {
      if (serve > 1) {
        // Because can be <number | null> cast as <number> to avoid error
        // +(value as number) used as type being lost and defaulting to string
        this.signalService.recipeServes.update((value: number | null) => +(value as number) - 1);
      }
    }
  }

  amend(): void {
    this.signalService.returnTo.set('display');
    this.router.navigate([this.router.url, 'amend']);
  }

  back(): void {
    this.router.navigate(['/recipes']);
  }
}
