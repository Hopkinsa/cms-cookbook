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
import { FormField, form } from '@angular/forms/signals';
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
  imports: [MatFormFieldModule, MatSelectModule, FormField, TruncatePipe, SortArrayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSelectComponent {
  readonly signalField = input<any>(null, {
    alias: 'formField',
  });
  readonly fieldChange = output<string>();

  protected imgUrl = `${environment.baseImgURL}`;
  protected fileService: FileService = inject(FileService);
  protected readonly fieldModel = signal<string>('');
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
        initForm = fieldSignal().value();
      } else {
        initForm = '';
      }
      this.fieldModel.set(initForm);
    }
  });

  // Update form if input signal value has changed
  private selectUpdateEffect = effect(() => {
    let updateData = null;
    const fieldSignal = this.signalField();
    if (fieldSignal !== null && fieldSignal !== undefined && this.fieldModel() !== fieldSignal().value()) {
      updateData = fieldSignal().value();
    }
    if (updateData !== null) {
      this.fieldModel.set(updateData);
    }
  });

  selected(): void {
    this.fieldChange.emit(this.fieldModel());
  }
}
