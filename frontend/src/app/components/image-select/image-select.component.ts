import { Component, effect, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FileService } from '@server/core/services';
import { SortArrayPipe, TruncatePipe } from '@server/shared/pipes';

@Component({
  selector: 'app-image-select',
  templateUrl: './image-select.component.html',
  styleUrls: ['./image-select.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatSelectModule, Field, TruncatePipe, SortArrayPipe],
  animations: [],
})
export class ImageSelectComponent {
  signalField = input<any>(null, {
    alias: "formField",
  });
  fieldChange = output<string>();

  protected fileService: FileService = inject(FileService);
  protected fieldModel = signal<string>('');
  protected fieldForm = form(this.fieldModel);

  private initSelector = effect(() => {
    if (this.fileService.imageList() === null || this.fileService.imageList() === undefined) {
      this.fileService.getImages.set(Date.now());
    }
  })

  private fieldInit = effect(() => {
    // populate on change
    const fieldSignal = this.signalField();
    // Prevent initial null value from signal creation and repeated updated on signal change
    if (fieldSignal !== null) {
      let initForm;
      if (fieldSignal !== undefined) {
        initForm = fieldSignal
      } else {
        initForm = '';
      }
      this.fieldModel.set(initForm);
    }
  });

  private selectionUpdate = effect(() => {
    // update select on change from parent
    const recipeImageSignal = this.signalField();
    const imageForm = this.fieldForm();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((imageForm && recipeImageSignal !== null && recipeImageSignal !== undefined) || (imageForm && imageForm.value() !== recipeImageSignal().value())) {
      this.fieldForm().value.set(recipeImageSignal().value());
    }
  });

  private parentUpdate = effect(() => {
    // update parent on change of select
    const recipeImageSignal = this.signalField();
    const imageForm = this.fieldForm();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((imageForm && recipeImageSignal === undefined) || (imageForm && imageForm.value() !== recipeImageSignal().value())) {
      this.fieldChange.emit(imageForm.value());
    }
  });
}
