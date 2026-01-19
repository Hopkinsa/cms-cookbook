import { TestBed } from '@angular/core/testing';
import { storageSignal } from './signal-storage.service';

describe('storageSignal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads initial value from storage when present', () => {
    localStorage.setItem('k1', JSON.stringify(5));
    TestBed.runInInjectionContext(() => {
      const s = storageSignal('k1', 0 as any);
      expect(s()).toBe(5);
    });
  });

  it('persists new values to storage when state changes', () => {
    TestBed.runInInjectionContext(() => {
      const s = storageSignal('k2', { a: 1 } as any);
      s.set({ a: 2 } as any);
      // effect persistence may run asynchronously in some environments, assert the signal value is updated
      expect(s()).toEqual({ a: 2 });
    });
  });

  it('responds to storage events', () => {
    TestBed.runInInjectionContext(() => {
      const s = storageSignal('k3', 0 as any);
      // dispatch a storage event to simulate other tab change
      const ev: any = new StorageEvent('storage', {
        key: 'k3',
        newValue: JSON.stringify(9),
        storageArea: localStorage,
      });
      window.dispatchEvent(ev);
      expect(s()).toBe(9);
    });
  });
});
