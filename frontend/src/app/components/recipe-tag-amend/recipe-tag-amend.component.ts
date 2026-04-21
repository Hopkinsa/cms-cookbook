import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';

import { IRecipeTagForm, recipeTagFormInitialState } from '@server/core/interface';
import { SignalService } from '@server/core/services';
import { GroupByPipe } from '@server/shared/pipes';

type RecipeTagField = () => {
  value(): string;
};

@Component({
  selector: 'app-recipe-tag-amend',
  templateUrl: './recipe-tag-amend.component.html',
  styleUrls: ['./recipe-tag-amend.component.scss'],
  standalone: true,
  imports: [FormField, MatIconModule, MatChipsModule, GroupByPipe, KeyValuePipe, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeTagAmendComponent {
  readonly signalRecipeTag = input<RecipeTagField | undefined>(undefined, {
    alias: 'tag',
  });
  readonly recipeTagChange = output<string>();
  readonly recipeTagRemove = output<boolean>();

  protected signalService: SignalService = inject(SignalService);

  protected readonly tagModel = signal<IRecipeTagForm>({ ...recipeTagFormInitialState });
  protected tagForm = form(this.tagModel);

  protected enableSave = true;
  private formInit = true;

  private recipeTagInit = effect(() => {
    // populate on change
    const recipeTagSignal = this.signalRecipeTag();
    const currentTag = recipeTagSignal?.().value();

    if (recipeTagSignal !== null && !this.formInit) {
      // Check if value on form matches value from signal, if not then update component
      this.formInit = this.tagForm.tag().value() !== currentTag;
    }

    // Prevent initial null value from signal creation and repeated updated on signal change
    if (recipeTagSignal !== null && this.formInit) {
      let initForm: IRecipeTagForm;

      if (currentTag !== undefined) {
        initForm = {
          tag: currentTag,
        };
      } else {
        initForm = { tag: '' };
      }
      this.tagModel.set(initForm);
      this.formInit = false;
    }
  });

  // Update parent via output signal if value has changed
  private updateEffect = effect(() => {
    const currentTag = this.signalRecipeTag()?.().value();
    let updateData = null;
    if (currentTag !== undefined && this.tagModel().tag !== currentTag) {
      updateData = this.tagModel().tag;
    }
    if (updateData !== null) {
      this.recipeTagChange.emit(updateData);
    }
  });

  remove(): void {
    this.recipeTagRemove.emit(true);
  }
}
