import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { IStep, IStepUpdate, stepInitialState } from '@server/core/interface';

type StepField = {
  is_title(): { value(): boolean };
  step(): { value(): string };
};

@Component({
  selector: 'app-step-amend',
  templateUrl: './step-amend.component.html',
  styleUrls: ['./step-amend.component.scss'],
  standalone: true,
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepAmendComponent {
  readonly signalStep = input<StepField | undefined>(undefined, {
    alias: 'step',
  });
  readonly stepChange = output<IStepUpdate>();

  protected readonly stepModel = signal<IStep>({ ...stepInitialState });
  protected stepForm = form(this.stepModel);

  private formInit = true;

  private stepInit = effect(() => {
    // populate on change
    const stepSignal = this.signalStep();

    // Prevent initial null value from signal creation and repeated updated on signal change
    if (stepSignal !== null && this.formInit) {
      let initForm;
      if (stepSignal !== undefined) {
        initForm = {
          is_title: stepSignal.is_title().value(),
          step: stepSignal.step().value(),
        };
      } else {
        initForm = stepInitialState;
      }
      this.stepModel.set(initForm);
      this.formInit = false;
    }
  });

  // Update parent via output signal if value has changed
  private updateEffect = effect(() => {
    const stepSignal = this.signalStep();

    if (stepSignal === undefined) {
      return;
    }

    let updateData = null;
    if (this.stepModel().is_title !== stepSignal.is_title().value()) {
      updateData = { is_title: this.stepModel().is_title };
    }
    if (this.stepModel().step !== stepSignal.step().value()) {
      updateData = { step: this.stepModel().step };
    }
    if (updateData !== null) {
      this.stepChange.emit(updateData);
    }
  });
}
