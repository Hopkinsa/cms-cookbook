import { inject } from '@angular/core';
import { TagService } from '@server/core/services/tag.service';

import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const tagResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
   const tagService: TagService = inject(TagService);
   if (tagService.getTags() === null || tagService.getTags() === undefined) {
      tagService.getTags.set(Date.now());
   }
   return true;
};