import { inject } from '@angular/core';
import { FileService } from '@server/core/services';

import type { ResolveFn } from '@angular/router';

export const imagesResolver: ResolveFn<boolean> = () => {
  const fileService: FileService = inject(FileService);
  if (fileService.getImages() === null || fileService.getImages() === undefined) {
    fileService.getImages.set(Date.now());
  }
  return true;
};
