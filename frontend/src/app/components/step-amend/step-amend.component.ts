import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';

import { IStep, stepInitialState } from '@server/core/interface';

@Component({
  selector: 'app-step-amend',
  templateUrl: './step-amend.component.html',
  styleUrls: ['./step-amend.component.scss'],
  standalone: true,
  imports: [Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepAmendComponent {
  signalStep = input<any>(stepInitialState, {
    alias: 'step',
  });
  stepChange = output<any>();

  protected stepModel = signal<IStep>({...stepInitialState});
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
    let updateData = null;
    if (this.stepModel().is_title !== this.signalStep().is_title().value()) {
      updateData = { is_title: this.stepModel().is_title };
    }
    if (this.stepModel().step !== this.signalStep().step().value()) {
      updateData = { step: this.stepModel().step };
    }
    if (updateData !== null) {
      this.stepChange.emit(updateData);
    }
  });
}
