import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SignalService } from '@server/core/services/signal.service';
import { IUnits } from '@server/core/interface';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  protected signalService: SignalService = inject(SignalService);
  private apiUrl = 'http://localhost:3000/';

  // Signals only trigger if the new value is different to current value
  // to ensure this signal triggers use getUnits.set(Date.now())
  public getUnits: WritableSignal<number | null> = signal(null);

  private unitRequestResolved = effect(() => {
    if (this.unitRequest.status() === 'resolved') {
      this.signalService.units.set(this.unitRequest.value() as Array<IUnits>);
    }
  })

  private unitRequestError = effect(() => {
    if (this.unitRequest.error()) {
      console.error('Units error', this.unitRequest.error()?.message);
    }
  })

  private unitRequest = httpResource<Array<IUnits>>(() => {
    return this.getUnits() ? `${this.apiUrl}units` : undefined
  });
}
