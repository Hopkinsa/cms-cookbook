import { inject } from '@angular/core';
import { UnitsService } from '@server/core/services/units.service';

import type { ResolveFn } from '@angular/router';

export const unitResolver: ResolveFn<boolean> = () => {
  const unitService: UnitsService = inject(UnitsService);
  if (unitService.getUnits() === null || unitService.getUnits() === undefined) {
    unitService.getUnits.set(Date.now());
  }
  return true;
};
