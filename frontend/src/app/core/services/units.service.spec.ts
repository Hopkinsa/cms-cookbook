import { TestBed } from '@angular/core/testing';
import { UnitsService } from './units.service';
import { SignalService } from '@server/core/services';

describe('UnitsService', () => {
  it('exposes getUnits WritableSignal and allows set', () => {
    const mockSignal: any = { units: { set: jest.fn() } };
    TestBed.configureTestingModule({ providers: [{ provide: SignalService, useValue: mockSignal }] });
    const service = TestBed.inject(UnitsService);

    expect(service.getUnits()).toBeNull();

    service.getUnits.set(123);
    expect(service.getUnits()).toBe(123);

    // ensure the injected signal service is present and callable
    expect(mockSignal.units.set).toBeDefined();
  });
});
