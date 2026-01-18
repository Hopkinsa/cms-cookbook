import { inject } from '@angular/core';
import { FileService } from '@server/core/services';

import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const imagesResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const fileService: FileService = inject(FileService);
  if (fileService.getImages() === null || fileService.getImages() === undefined) {
    fileService.getImages.set(Date.now());
  }
  return true;
};
