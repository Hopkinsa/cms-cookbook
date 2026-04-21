import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArrays',
  standalone: true,
})
export class SortArrayPipe implements PipeTransform {
  transform<T>(collection: T[] | null, field: string, dir: string): T[] | null {
    if (!collection) {
      return null;
    }
    if (!field) {
      return collection;
    }
    const direction = dir || 'asc';
    const sortDirection = direction === 'desc' ? -1 : 1;

    return [...collection].sort((leftItem, rightItem) => {
      const leftValue = this.resolveSortValue(leftItem, field);
      const rightValue = this.resolveSortValue(rightItem, field);

      if (leftValue === rightValue) {
        return 0;
      }

      return leftValue < rightValue ? -1 * sortDirection : sortDirection;
    });
  }

  private resolveSortValue<T>(item: T, field: string): string {
    if (typeof item === 'string' || typeof item === 'number') {
      return String(item).toLowerCase();
    }

    if (item && typeof item === 'object' && field in (item as Record<string, unknown>)) {
      return String((item as Record<string, unknown>)[field] ?? '').toLowerCase();
    }

    return '';
  }
}
