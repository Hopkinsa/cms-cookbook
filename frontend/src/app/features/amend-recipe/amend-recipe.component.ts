import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from 'src/environment/environment';

import { RecipeService, SignalService } from '@server/core/services';
import {
  crudResponse,
  IIngredients,
  IIngredientsUpdate,
  ingredientInitialState,
  IRecipe,
  IStep,
  IStepUpdate,
  recipeInitialState,
  stepInitialState,
} from '@server/core/interface';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { ImportRecipeComponent } from '@server/components/import-recipe/import-recipe.component';
import { RecipeTagAmendComponent } from '@server/components/recipe-tag-amend/recipe-tag-amend.component';
import { IngredientAmendComponent } from '@server/components/ingredient-amend/ingredient-amend.component';
import { StepAmendComponent } from '@server/components/step-amend/step-amend.component';
import { ImageSelectComponent } from '@server/components/image-select/image-select.component';
import { ImageUploadComponent } from '@server/components/image-upload/image-upload.component';
import {
  appendItem,
  moveItem,
  normalizeRecipeServes,
  removeItem,
  replaceItem,
  updateIngredientAt,
  updateStepAt,
} from './amend-recipe.utils';

@Component({
  selector: 'app-amend-recipe',
  templateUrl: './amend-recipe.component.html',
  styleUrls: ['./amend-recipe.component.scss'],
  standalone: true,
  imports: [
    FormField,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    FeedbackComponent,
    ImportRecipeComponent,
    ImageSelectComponent,
    ImageUploadComponent,
    RecipeTagAmendComponent,
    IngredientAmendComponent,
    StepAmendComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmendRecipeComponent {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private recipeService: RecipeService = inject(RecipeService);
  protected readonly id = this.route.snapshot.data['id'] as number;

  protected imgUrl = `${environment.baseImgURL}`;
  protected signalService: SignalService = inject(SignalService);
  protected readonly showImportField = signal(false);
  protected readonly enableSave = signal(true);
  protected readonly recipeModel = signal<IRecipe>({ ...recipeInitialState });
  protected recipeForm = form(this.recipeModel);

  private initPage = effect(() => {
    this.signalService.canEdit(this.id === -1 ? 'recipe.create' : 'recipe.update');
    // populate on change
    const recipe = this.signalService.recipe();
    if (recipe === null) {
      // Add / amend setup
      this.recipeModel.set({ ...recipeInitialState });
    } else {
      this.recipeModel.set(recipe);
    }
  });

  private patchRecipe(recipePatch: Partial<IRecipe>): void {
    this.recipeModel.update((currentRecipe) => ({ ...currentRecipe, ...recipePatch }));
  }

  private updateTags(tags: string[] | undefined): void {
    if (tags !== undefined) {
      this.patchRecipe({ tags });
    }
  }

  private updateIngredients(ingredients: IIngredients[] | undefined): void {
    if (ingredients !== undefined) {
      this.patchRecipe({ ingredients });
    }
  }

  private updateSteps(steps: IStep[] | undefined): void {
    if (steps !== undefined) {
      this.patchRecipe({ steps });
    }
  }

  private withSaveState(action: () => void): void {
    this.enableSave.set(false);
    action();
  }

  private finishSave(feedbackMessage: string, response: crudResponse): void {
    if (response.completed) {
      this.signalService.feedbackMessage.set({ type: 'success', message: feedbackMessage });
    }

    this.enableSave.set(true);
  }

  showImport(): void {
    this.showImportField.set(true);
  }

  imageSelected(imageName: string): void {
    this.patchRecipe({ img_url: imageName });
  }

  importedRecipe(event: IRecipe): void {
    this.recipeModel.set({ ...event });
  }

  addTag(): void {
    this.updateTags(appendItem(this.recipeModel().tags, ''));
  }

  tagUpdate(event: string, idx: number): void {
    this.updateTags(replaceItem(this.recipeModel().tags, idx, event));
  }

  removeTag(index: number): void {
    this.updateTags(removeItem(this.recipeModel().tags, index));
  }

  addIngredient(): void {
    this.updateIngredients(appendItem(this.recipeModel().ingredients, ingredientInitialState));
  }

  ingredientUpdate(event: IIngredientsUpdate, idx: number): void {
    this.updateIngredients(updateIngredientAt(this.recipeModel().ingredients, idx, event));
  }

  removeIngredient(index: number): void {
    this.updateIngredients(removeItem(this.recipeModel().ingredients, index));
  }

  dropIngredient(event: CdkDragDrop<IIngredients[]>): void {
    this.updateIngredients(moveItem(this.recipeModel().ingredients, event.previousIndex, event.currentIndex));
  }

  addStep(): void {
    this.updateSteps(appendItem(this.recipeModel().steps, stepInitialState));
  }

  stepUpdate(event: IStepUpdate, idx: number): void {
    this.updateSteps(updateStepAt(this.recipeModel().steps, idx, event));
  }

  removeStep(index: number): void {
    this.updateSteps(removeItem(this.recipeModel().steps, index));
  }

  dropStep(event: CdkDragDrop<IStep[]>): void {
    this.updateSteps(moveItem(this.recipeModel().steps, event.previousIndex, event.currentIndex));
  }

  save(): void {
    const normalizedRecipe = normalizeRecipeServes(this.recipeModel());
    this.recipeModel.set(normalizedRecipe);

    if (this.id >= 0) {
      this.withSaveState(() => {
        this.signalService.recipe.set(normalizedRecipe);
        this.recipeService.updateRecipe(this.id).subscribe((res) => {
          this.finishSave('Recipe saved', res);
        });
      });
    }

    if (this.id === -1) {
      this.withSaveState(() => {
        this.recipeService.createRecipe(normalizedRecipe).subscribe((res) => {
          this.finishSave('Recipe added', res);
        });
      });
    }
  }

  back(): void {
    const backTo = this.signalService.returnTo();
    if (backTo === 'display') {
      this.router.navigate(['/recipe', this.id]);
      return;
    }
    this.router.navigate(['/recipes']);
  }
}
