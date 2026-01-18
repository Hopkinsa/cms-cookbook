import { TestBed } from '@angular/core/testing';
import { FeedbackComponent } from './feedback.component';
import { SignalService } from '@server/core/services';

jest.useFakeTimers();

describe('FeedbackComponent', () => {
  it('fadeInit sets display and triggers fade out eventually', () => {
    const mockSignal: any = { feedbackMessage: { set: jest.fn() } };
    TestBed.configureTestingModule({ imports: [FeedbackComponent], providers: [{ provide: SignalService, useValue: mockSignal }] });
    const fixture = TestBed.createComponent(FeedbackComponent);
    const comp = fixture.componentInstance;

    const elm = document.createElement('div');
    elm.className = 'feedback-container';

    comp.fadeInit(elm);
    expect(elm.style.display).toBe('flex');
    // simulate completion of fade in and display, then run fade decrement steps directly
    elm.style.opacity = '1';
    // call fadeDecrement multiple times to simulate the fade out steps
    for (let i = 0; i < 12; i++) {
      // access protected fadeOutSpeed via indexed access
      (comp as any).fadeDecrement(elm, (comp as any).fadeOutSpeed);
    }
    // after manual run, feedbackMessage.set(null) should have been called
    expect(mockSignal.feedbackMessage.set).toHaveBeenCalledWith(null);
  });
});
