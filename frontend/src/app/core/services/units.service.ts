import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from 'src/environment/environment';

import { SignalService } from '@server/core/services/signal.service';
import { IUnits } from '@server/core/interface';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = environment.baseApiURL;

  // Signals only trigger if the new value is different to current value
  // to ensure this signal triggers use getUnits.set(Date.now())
  readonly getUnits: WritableSignal<number | null> = signal(null);

  private unitRequestResolved = effect(() => {
    if (this.unitRequest.status() === 'resolved') {
      this.signalService.units.set(this.unitRequest.value() as IUnits[]);
    }
  })

  private unitRequestError = effect(() => {
    if (this.unitRequest.error()) {
      console.error('Units error', this.unitRequest.error()?.message);
    }
  })

  private unitRequest = httpResource<IUnits[]>(() => {
    return this.getUnits() ? `${this.apiUrl}units` : undefined
  });
}
