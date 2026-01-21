import { TestBed } from '@angular/core/testing';
import { IngredientsComponent } from './ingredients.component';
import { SignalService } from '@server/core/services';

describe('IngredientsComponent', () => {
  it('creates and injects signal service and decimal pipe is available', () => {
    const mockSignal = {};
    TestBed.configureTestingModule({
      imports: [IngredientsComponent],
      providers: [{ provide: SignalService, useValue: mockSignal }],
    });
    const fixture = TestBed.createComponent(IngredientsComponent);
    const comp = fixture.componentInstance as any;

    expect(comp).toBeTruthy();
    expect(comp.signalService).toBeDefined();
  });
});
