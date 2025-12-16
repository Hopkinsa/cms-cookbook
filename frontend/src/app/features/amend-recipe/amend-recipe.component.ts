import { Component, inject, signal, effect } from '@angular/core';
import { form, Field } from '@angular/forms/signals';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from 'src/environment/environment';

import { SignalService, RecipeService } from '@server/core/services';
import { IIngredients, IIngredientsUpdate, ingredientInitialState, IRecipe, IStep, IStepUpdate, recipeInitialState, stepInitialState, crudResponse } from '@server/core/interface';
import { FeedbackComponent } from '@server/components/feedback/feedback.component';
import { RecipeTagAmendComponent } from '@server/components/recipe-tag-amend/recipe-tag-amend.component';
import { IngredientAmendComponent } from '@server/components/ingredient-amend/ingredient-amend.component'
import { StepAmendComponent } from '@server/components/step-amend/step-amend.component'
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
    ImageSelectComponent,
    ImageUploadComponent,
    RecipeTagAmendComponent,
    IngredientAmendComponent,
    StepAmendComponent
  ],
  animations: [],
})
export class AmendRecipeComponent {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private recipeService: RecipeService = inject(RecipeService);
  private id = this.route.snapshot.data['id'];

  protected imgURL = `${ environment.baseImgURL }image/`;
  protected signalService: SignalService = inject(SignalService);
  protected enableSave = true;
  protected recipeModel = signal<IRecipe>(recipeInitialState);
  protected recipeForm = form(this.recipeModel);

  private initPage = effect(() => {
    this.signalService.canEdit();

    // populate on change
    const recipe = this.signalService.recipe();
    // Prevent initial null value from signal creation
    if (recipe !== null) {
      this.recipeModel.set(recipe);
    }
  })

  imageSelected(imageName: string): void {
    const x = this.recipeModel() as IRecipe;
    this.recipeForm.img_url().value.set(imageName);
    this.signalService.recipe.set({ ...x, img_url: imageName });
  }

  addTag(): void {
    const x = this.recipeModel() as IRecipe;
    let y: string[] | undefined = x.tags;
    if (y !== undefined) {
      y.push('');
      this.signalService.recipe.set({ ...x, tags: y });
    }
  }

  tagUpdate(event: string, idx: number): void {
    const x = this.recipeModel() as IRecipe;
    let y: string[] | undefined = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    if (y !== undefined) {
      y[idx] = event;
      this.recipeModel.set({ ...x, tags: y });
    }
  }

  removeTag(index: number): void {
    const x = this.recipeModel() as IRecipe;
    let y: string[] | undefined = x.tags.slice(); // copy by value, not reference to ensure it's seen as a change
    if (y !== undefined) {
      y.splice(index, 1);
      this.signalService.recipe.set({ ...x, tags: y });
    }
  }

  addIngredient(): void {
    const x = this.recipeModel() as IRecipe;
    let y: IIngredients[] | undefined = x.ingredients;
    if (y !== undefined) {
      y.push(ingredientInitialState);
      this.recipeModel.set(x);
    }
  }

  ingredientUpdate(event: IIngredientsUpdate, idx: number): void {
    const x = this.recipeModel() as IRecipe;
    let y: IIngredients[] | undefined = x.ingredients;
    if (y !== undefined) {
      y[idx] = { ...y[idx], ...event };
    }
    this.recipeModel.set(x)
  }

  removeIngredient(index: number): void {
    const x = this.recipeModel() as IRecipe;
    let y: IIngredients[] | undefined = x.ingredients;
    if (y !== undefined) {
      y.splice(index, 1);
      this.recipeModel.set(x);
    }
  }

  dropIngredient(event: CdkDragDrop<any[]>): void {
    const x = this.recipeModel() as IRecipe;
    let y: IIngredients[] | undefined = x.ingredients;
    if (y !== undefined) {
      moveItemInArray(y, event.previousIndex, event.currentIndex);
      this.recipeModel.set(x);
    }
  }

  addStep(): void {
    const x = this.recipeModel() as IRecipe;
    let y: IStep[] | undefined = x.steps;
    if (y !== undefined) {
      y.push(stepInitialState);
      this.recipeModel.set(x);
    }
  }

  stepUpdate(event: IStepUpdate, idx: number): void {
    const x = this.recipeModel() as IRecipe;
    let y: IStep[] | undefined = x.steps;
    if (y !== undefined) {
      y[idx] = { ...y[idx], ...event };
    }
    this.recipeModel.set(x);
  }

  removeStep(index: number): void {
    const x = this.recipeModel() as IRecipe;
    let y: IStep[] | undefined = x.steps;
    if (y !== undefined) {
      y.splice(index, 1);
      this.recipeModel.set(x);
    }
  }

  dropStep(event: CdkDragDrop<any[]>): void {
    const x = this.recipeModel() as IRecipe;
    let y: IStep[] | undefined = x.steps;
    if (y !== undefined) {
      moveItemInArray(y, event.previousIndex, event.currentIndex);
      this.recipeModel.set(x);
    }
  }

  save(): void {
    if (this.id >= 0) {
      this.enableSave = false;
      this.signalService.recipe.set(this.recipeModel());
      this.recipeService.updateRecipe(this.id).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Recipe saved' });
          }
        }
        this.enableSave = true;
      });
    }
    if (this.id === -1) {
      this.enableSave = false;
      const data = this.recipeModel();
      this.recipeService.createRecipe(data).subscribe((res) => {
        if (res !== null && res !== undefined) {
          if ((res as unknown as crudResponse).completed) {
            this.signalService.feedbackMessage.set({ type: 'success', message: 'Recipe added' });
          }
        }
        this.enableSave = true;
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
