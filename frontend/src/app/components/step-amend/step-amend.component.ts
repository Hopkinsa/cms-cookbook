import { Component, effect, input, output, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';

import { IStep, stepInitialState } from '@server/core/interface';

@Component({
  selector: 'app-step-amend',
  templateUrl: './step-amend.component.html',
  styleUrls: ['./step-amend.component.scss'],
  standalone: true,
  imports: [
    Field,
  ],
  animations: [],
})
export class StepAmendComponent {
  signalStep = input<any>(stepInitialState, {
    alias: "step",
  });
  stepChange = output<any>();

  protected stepModel = signal<IStep>(stepInitialState);
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
          step: stepSignal.step().value()
        }
      } else {
        initForm = stepInitialState;
      }
      this.stepModel.set(initForm);
      this.formInit = false;
    }
  });

  private isTitleUpdate = effect(() => {
    // update on change
    const stepSignal = this.signalStep();
    const isTitleField = this.stepForm.is_title().value();

    // prevent update if new value is equal to old value - stops update when form initialised
    if ((isTitleField && stepSignal === undefined) || (isTitleField && isTitleField !== stepSignal.is_title().value())) {
      this.stepChange.emit({ is_title: isTitleField });
    }
  });

  private stepUpdate = effect(() => {
    // update on change
    const stepSignal = this.signalStep();
    const stepField = this.stepForm.step().value();

    if ((stepField && stepSignal === undefined) || (stepField && stepField !== stepSignal.step().value())) {
      this.stepChange.emit({ step: stepField });
    }
  });
}
