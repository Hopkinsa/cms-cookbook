import { TestBed } from '@angular/core/testing';
import { UnitsService } from '@server/core/services/units.service';
import { unitResolver } from './unit.resolver';

describe('unitResolver', () => {
  it('sets getUnits when null', () => {
    const getUnits: any = () => null;
    getUnits.set = jest.fn();
    const svc = { getUnits } as any;
    TestBed.configureTestingModule({ providers: [{ provide: UnitsService, useValue: svc }] });

    const res = TestBed.runInInjectionContext(() => unitResolver({} as any, {} as any));
    expect(getUnits.set).toHaveBeenCalled();
    expect(res).toBe(true);
  });
});
