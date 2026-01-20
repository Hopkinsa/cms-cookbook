import { TestBed } from '@angular/core/testing';
import { StepAmendComponent } from './step-amend.component';

describe('StepAmendComponent', () => {
  it('initializes from input and emits changes', () => {
    const fixture = TestBed.configureTestingModule({ imports: [StepAmendComponent] }).createComponent(
      StepAmendComponent,
    );
    const comp = fixture.componentInstance;

    const mockSignal: any = () => ({
      is_title: () => ({ value: () => false }),
      step: () => ({ value: () => 'initial step' }),
    });

    // set the underlying input signal function so component effects receive the value
    (comp as any).signalStep = () => ({
      is_title: () => ({ value: () => false }),
      step: () => ({ value: () => 'initial step' }),
    });
    fixture.detectChanges();

    expect(comp['stepModel']().step).toBe('initial step');

    const spy = jest.spyOn(comp['stepChange'], 'emit');
    comp['stepModel'].set({ is_title: true, step: 'new step' } as any);
    // allow effects to run
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
