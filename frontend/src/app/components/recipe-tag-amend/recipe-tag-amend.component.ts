import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';

import { IRecipeTagForm, recipeTagFormInitialState } from '@server/core/interface';
import { SignalService } from '@server/core/services';
import { GroupByPipe } from '@server/shared/pipes';

@Component({
  selector: 'app-recipe-tag-amend',
  templateUrl: './recipe-tag-amend.component.html',
  styleUrls: ['./recipe-tag-amend.component.scss'],
  standalone: true,
  imports: [
    Field,
    MatIconModule,
    MatChipsModule,
    GroupByPipe,
    KeyValuePipe,
    TitleCasePipe
  ],
  animations: [],
})
export class RecipeTagAmendComponent {
  signalRecipeTag = input<any>('', {
    alias: "tag",
  });
  recipeTagChange = output<any>();
  recipeTagRemove = output<any>();


  protected signalService: SignalService = inject(SignalService);

  protected tagModel = signal<IRecipeTagForm>(recipeTagFormInitialState);
  protected tagForm = form(this.tagModel);

  protected enableSave = true;
  private formInit = true;

  private recipeTagInit = effect(() => {
    // populate on change
    const recipeTagSignal = this.signalRecipeTag();

    if (recipeTagSignal !== null && !this.formInit) {
      // Check if value on form matches value from signal, if not then update component
      this.formInit = this.tagForm.tag().value() !== recipeTagSignal().value();
    }

    // Prevent initial null value from signal creation and repeated updated on signal change
    if (recipeTagSignal !== null && this.formInit) {
      let initForm: IRecipeTagForm;

      if (recipeTagSignal !== undefined) {
        initForm = {
          tag: recipeTagSignal().value()
        }
      } else {
        initForm = { tag: '' };
      }
      this.tagModel.set(initForm);
      this.formInit = false;
    }
  });

   // Update parent via output signal if value has changed
  private updateEffect = effect(() => {
    let updateData = null;
    if (this.tagModel().tag !== this.signalRecipeTag()) { updateData = this.tagModel().tag ; }
    if (updateData !== null) {
      this.recipeTagChange.emit(updateData);
    }
  });

  remove(): void {
    this.recipeTagRemove.emit(true);
  }
}
