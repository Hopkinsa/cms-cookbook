import { TestBed } from '@angular/core/testing';
import { StepsComponent } from './steps.component';
import { SignalService } from '@server/core/services';

describe('StepsComponent', () => {
  it('creates and injects signal service', () => {
    const mockSignal = {};
    TestBed.configureTestingModule({
      imports: [StepsComponent],
      providers: [{ provide: SignalService, useValue: mockSignal }],
    });
    const fixture = TestBed.createComponent(StepsComponent);
    const comp = fixture.componentInstance as any;

    expect(comp).toBeTruthy();
    expect(comp.signalService).toBeDefined();
  });
});
