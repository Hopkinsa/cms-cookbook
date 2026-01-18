import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { SignalService } from '@server/core/services/signal.service';

describe('ErrorHandlerService', () => {
  it('sets feedbackMessage and returns an observable with completed false', (done) => {
    const mockFeedback = { set: jest.fn() };
    const fakeSignalService = { feedbackMessage: mockFeedback } as any;

    TestBed.configureTestingModule({
      providers: [{ provide: SignalService, useValue: fakeSignalService }],
    });

    const service = TestBed.inject(ErrorHandlerService);
    const handler = service.handleError('op', 'feedback message', {} as any);

    const result$ = handler(new Error('boom'));
    result$.subscribe((res) => {
      expect(mockFeedback.set).toHaveBeenCalledWith({ type: 'error', message: 'feedback message' });
      expect(res).toEqual({ completed: false });
      done();
    });
  });
});
