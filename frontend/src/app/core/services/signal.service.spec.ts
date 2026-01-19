import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SignalService } from './signal.service';

describe('SignalService', () => {
  it('canEdit navigates to / when editEnabled is false', () => {
    const router = { navigate: jest.fn() } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });

    // Using TestBed to get a real instance
    const service = TestBed.inject(SignalService);

    TestBed.runInInjectionContext(() => {
      const spy = jest.spyOn(router, 'navigate');
      service.editEnabled.set(true);
      expect(service.editEnabled()).toBe(true);
      service.canEdit();
      expect(spy).not.toHaveBeenCalled();
      const svc = new SignalService();
      svc.editEnabled.set(false);
      expect(svc.editEnabled()).toBe(false);
      svc.canEdit();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('recipeServesAdjustment returns correct ratio or 1 when missing', () => {
    const router = { navigate: jest.fn() } as any;
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });

    const service = TestBed.inject(SignalService);
    // no recipe set
    expect(service.recipeServesAdjustment()).toBe(1);

    service.recipe.set({ serves: 4 } as any);
    service.recipeServes.set(2 as any);
    expect(service.recipeServesAdjustment()).toBe(0.5);
  });
});
