import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
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

@Component({
  selector: 'app-amend-recipe',
  templateUrl: './amend-recipe.component.html',
  styleUrls: ['./amend-recipe.component.scss'],
  standalone: true,
  imports: [
    Field,
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
  protected id = this.route.snapshot.data['id'];

  protected imgUrl = `${environment.baseImgURL}`;
  protected signalService: SignalService = inject(SignalService);
  protected readonly showImportField = signal(false);
  protected readonly enableSave = signal(true);
  protected readonly recipeModel = signal<IRecipe>(recipeInitialState);
  protected recipeForm = form(this.recipeModel);

  private initPage = effect(() => {
    this.signalService.canEdit();

    // populate on change
    const recipe = this.signalService.recipe();
    // Prevent initial null value from signal creation
    if (recipe !== null) {
      this.recipeModel.set(recipe);
    }
  });

  showImport(): void {
    this.showImportField.set(true);
  }

  imageSelected(imageName: string): void {
    const x = this.recipeModel() as IRecipe;
    this.recipeForm.img_url().value.set(imageName);
    this.signalService.recipe.set({ ...x, img_url: imageName });
  }

  importedRecipe(event: IRecipe): void {
    this.signalService.recipe.set({ ...event });
  }

  addTag(): void {
    const x = this.recipeModel() as IRecipe;
    const y: string[] | undefined = x.tags;
    if (y !== undefined) {
      y.push('');
      this.signalService.recipe.set({ ...x, tags: y });
    }
  }

  tagUpdate(event: string, idx: number): void {
    const x = this.recipeModel() as IRecipe;
    const y: string[] | undefined = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    if (y !== undefined) {
      y[idx] = event;
      this.recipeModel.set({ ...x, tags: y });
    }
  }

  removeTag(index: number): void {
    const x = this.recipeModel() as IRecipe;
    const y: string[] | undefined = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    if (y !== undefined) {
      y.splice(index, 1);
      this.signalService.recipe.set({ ...x, tags: y });
    }
  }

  addIngredient(): void {
    const x = this.recipeModel() as IRecipe;
    const y: IIngredients[] | undefined = x.ingredients?.slice();
    if (y !== undefined) {
      y.push(ingredientInitialState);
      this.recipeModel.set({ ...x, ingredients: y });
    }
  }

  ingredientUpdate(event: IIngredientsUpdate, idx: number): void {
    const x = this.recipeModel() as IRecipe;
    const y: IIngredients[] | undefined = x.ingredients?.slice();
    if (y !== undefined) {
      y[idx] = { ...y[idx], ...event };
      this.recipeModel.set({ ...x, ingredients: y });
    }
  }

  removeIngredient(index: number): void {
    const x = this.recipeModel() as IRecipe;
    const y: IIngredients[] | undefined = x.ingredients?.slice();
    if (y !== undefined) {
      y.splice(index, 1);
      this.recipeModel.set({ ...x, ingredients: y });
    }
  }

  dropIngredient(event: CdkDragDrop<any[]>): void {
    const x = this.recipeModel() as IRecipe;
    const y: IIngredients[] | undefined = x.ingredients?.slice();
    if (y !== undefined) {
      moveItemInArray(y, event.previousIndex, event.currentIndex);
      this.recipeModel.set({ ...x, ingredients: y });
    }
  }

  addStep(): void {
    const x = this.recipeModel() as IRecipe;
    const y: IStep[] | undefined = x.steps?.slice();
    if (y !== undefined) {
      y.push(stepInitialState);
      this.recipeModel.set({ ...x, steps: y });
    }
  }

  stepUpdate(event: IStepUpdate, idx: number): void {
    const x = this.recipeModel() as IRecipe;
    const y: IStep[] | undefined = x.steps?.slice();
    if (y !== undefined) {
      y[idx] = { ...y[idx], ...event };
      this.recipeModel.set({ ...x, steps: y });
    }
  }

  removeStep(index: number): void {
    const x = this.recipeModel() as IRecipe;
    const y: IStep[] | undefined = x.steps?.slice();
    if (y !== undefined) {
      y.splice(index, 1);
      this.recipeModel.set({ ...x, steps: y });
    }
  }

  dropStep(event: CdkDragDrop<any[]>): void {
    const x = this.recipeModel() as IRecipe;
    const y: IStep[] | undefined = x.steps?.slice();
    if (y !== undefined) {
      moveItemInArray(y, event.previousIndex, event.currentIndex);
      this.recipeModel.set({ ...x, steps: y });
    }
  }

  save(): void {
    // ensure serves is at least 1
    if (
      this.recipeForm.serves() === null ||
      this.recipeForm.serves() === undefined ||
      parseInt(this.recipeForm.serves().value().toString()) === 0 // handle form type issues between string and number
    ) {
      const x = this.recipeModel() as IRecipe;
      this.recipeForm.serves().value.set(1);
      this.recipeModel.set({ ...x, serves: 1 });
    }
    if (this.id >= 0) {
      this.enableSave.set(false);
      this.signalService.recipe.set(this.recipeModel());
      this.recipeService.updateRecipe(this.id).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Recipe saved' });
          }
        }
        this.enableSave.set(true);
      });
    }
    if (this.id === -1) {
      this.enableSave.set(false);
      const data = this.recipeModel();
      this.recipeService.createRecipe(data).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Recipe added' });
          }
        }
        this.enableSave.set(true);
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
