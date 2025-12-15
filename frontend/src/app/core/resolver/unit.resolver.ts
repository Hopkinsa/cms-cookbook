import { inject } from '@angular/core';
import { UnitsService } from '@server/core/services/units.service';

import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const unitResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
   const unitService: UnitsService = inject(UnitsService);
   if (unitService.getUnits() === null || unitService.getUnits() === undefined) {
      unitService.getUnits.set(Date.now());
   }
   return true;
};