import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
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
import { generateFilename } from '@server/shared/helper/filename.helper';

@Component({
  selector: 'app-display-recipe',
  templateUrl: './display-recipe.component.html',
  styleUrls: ['./display-recipe.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatChipsModule, MatIconModule, IngredientsComponent, StepsComponent, HoursMinutesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayRecipeComponent {
  private title: Title = inject(Title);
  private router: Router = inject(Router);

  protected imgURL = `${environment.baseImgURL}`;
  protected imgPlaceholderURL = `${environment.baseTemplateURL}`;
  protected signalService: SignalService = inject(SignalService);
  protected readonly recipeTitle = computed(() => {
    if (this.signalService.recipe()) {
      this.title.setTitle(`${this.signalService.recipe()!.title} | Cookbook`);
    }
    return this.signalService.recipe()!.title || 'Unknown';
  });
  protected readonly totalTime = computed(() => {
    if (this.signalService.recipe()) {
      return this.signalService.recipe()!.prep_time + this.signalService.recipe()!.cook_time;
    }
    return;
  });

  protected readonly banner = computed(() => {
    if (this.signalService.recipe()) {
      const imgNames = generateFilename(this.signalService.recipe()!.img_url);
      return this.imgURL + imgNames.banner;
    }
    return;
  });

  constructor() {
    this.signalService.recipeServes.set(this.signalService.recipe()!.serves as number);
  }

  servingUp(): void {
    const serve: number | null = this.signalService.recipeServes();
    if (serve !== null) {
      if (serve < 10) {
        // Because can be <number | null> cast as <number> to avoid error
        // +(value as number) used as type being lost and defaulting to string
        this.signalService.recipeServes.update((value: number | null) => +(value as number) + 1);
      }
    }
  }

  servingDown(): void {
    const serve: number | null = this.signalService.recipeServes();
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
