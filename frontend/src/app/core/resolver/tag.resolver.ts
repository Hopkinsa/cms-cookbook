import { inject } from '@angular/core';
import { TagService } from '@server/core/services/tag.service';

import type { ResolveFn } from '@angular/router';

export const tagResolver: ResolveFn<boolean> = () => {
  const tagService: TagService = inject(TagService);
  if (tagService.getTags() === null || tagService.getTags() === undefined) {
    tagService.getTags.set(Date.now());
  }
  return true;
};
