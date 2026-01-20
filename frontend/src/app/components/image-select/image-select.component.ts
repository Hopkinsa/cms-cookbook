import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { environment } from 'src/environment/environment';

import { FileService } from '@server/core/services';
import { SortArrayPipe, TruncatePipe } from '@server/shared/pipes';

@Component({
  selector: 'app-image-select',
  templateUrl: './image-select.component.html',
  styleUrls: ['./image-select.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatSelectModule, Field, TruncatePipe, SortArrayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSelectComponent {
  signalField = input<any>(null, {
    alias: 'formField',
  });
  fieldChange = output<string>();

  protected imgUrl = `${environment.baseImgURL}`;
  protected fileService: FileService = inject(FileService);
  protected fieldModel = signal<string>('');
  protected fieldForm = form(this.fieldModel);

  private initSelector = effect(() => {
    if (this.fileService.imageList() === null || this.fileService.imageList() === undefined) {
      this.fileService.getImages.set(Date.now());
    }
  });

  private fieldInit = effect(() => {
    // populate on change
    const fieldSignal = this.signalField();
    // Prevent initial null value from signal creation and repeated updated on signal change
    if (fieldSignal !== null) {
      let initForm;
      if (fieldSignal !== undefined) {
        initForm = fieldSignal;
      } else {
        initForm = '';
      }
      this.fieldModel.set(initForm);
    }
  });

  // Update form if input signal value has changed
  private selectUpdateEffect = effect(() => {
    let updateData = null;
    if (this.fieldModel() !== this.signalField()) {
      updateData = this.signalField();
    }
    if (updateData !== null) {
      this.fieldModel.set(updateData);
    }
  });

  // Update parent via output signal if value has changed
  private updateEffect = effect(() => {
    let updateData = null;
    if (this.fieldModel() !== this.signalField()) {
      updateData = this.fieldModel();
    }
    if (updateData !== null) {
      this.fieldChange.emit(updateData);
    }
  });
}
