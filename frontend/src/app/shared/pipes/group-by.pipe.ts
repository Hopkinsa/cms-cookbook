import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy',
  standalone: true,
})
export class GroupByPipe implements PipeTransform {
  transform<T extends Record<string, unknown>>(
    collection: T[] | null,
    field: keyof T & string,
  ): Record<string, T[]> | null {
    if (!collection) {
      return null;
    }
    return collection.reduce<Record<string, T[]>>((group, item) => {
      const property = String(item[field] ?? '');

      // Initialize the group if it doesn't exist
      if (!group[property]) {
        group[property] = [];
      }

      // Add the user to the corresponding age group
      group[property].push(item);
      return group;
    }, {});
  }
}
