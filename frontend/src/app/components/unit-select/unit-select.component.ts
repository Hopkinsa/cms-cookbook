import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { SignalService } from '@server/core/services/signal.service';
import { GroupByPipe } from '@server/shared/pipes/group-by.pipe';

type UnitField = () => {
  value(): string | number;
};

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.scss'],
  standalone: true,
  imports: [KeyValuePipe, FormField, GroupByPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitSelectComponent {
  readonly signalField = input<UnitField | undefined>(undefined, {
    alias: 'formField',
  });
  readonly fieldChange = output<number>();

  protected signalService: SignalService = inject(SignalService);
  protected readonly fieldModel = signal('0');
  protected fieldForm = form(this.fieldModel);

  private formInit = true;

  private fieldInit = effect(() => {
    // populate on change
    const fieldSignal = this.signalField();

    // Prevent initial null value from signal creation and repeated updated on signal change
    if (fieldSignal !== null && this.formInit) {
      let initForm;
      if (fieldSignal !== undefined) {
        initForm = String(fieldSignal().value());
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
    const fieldSignal = this.signalField();
    if (fieldSignal !== null && fieldSignal !== undefined && this.fieldModel() !== fieldSignal().value()) {
      updateData = parseInt(this.fieldModel());
    }
    if (updateData !== null) {
      this.fieldChange.emit(updateData);
    }
  });
}
