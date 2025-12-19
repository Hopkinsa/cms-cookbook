import { KeyValuePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';

import { SignalService } from '@server/core/services/signal.service';
import { GroupByPipe } from '@server/shared/pipes/group-by.pipe';

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.scss'],
  standalone: true,
  imports: [KeyValuePipe, Field, GroupByPipe],
  animations: [],
})
export class UnitSelectComponent {
  signalField = input<any>(null, {
    alias: "formField",
  });
  fieldChange = output<number>();

  protected signalService: SignalService = inject(SignalService);
  protected fieldModel = signal<string>('0');
  protected fieldForm = form(this.fieldModel);

  private formInit = true;

  private fieldInit = effect(() => {
    // populate on change
    const fieldSignal = this.signalField();

    // Prevent initial null value from signal creation and repeated updated on signal change
    if (fieldSignal !== null && this.formInit) {
      let initForm;
      if (fieldSignal !== undefined) {
        initForm = fieldSignal
      } else {
        initForm = '0';
      }
      this.fieldModel.set(initForm);
      this.formInit = false;
    }
  });

  // Update parent via output signal if value has changed
  private updateEffect = effect(() => {
    let updateData = null;
    if (this.fieldModel() !== this.signalField()) { updateData = parseInt(this.fieldModel()); }
    if (updateData !== null) {
      this.fieldChange.emit(updateData);
    }
  });
}
