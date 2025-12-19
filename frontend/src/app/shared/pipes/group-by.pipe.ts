import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy',
  standalone: true,
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[] | null, field: string): any[] | null {
    if (!collection) {
      return null;
    }
    const newCollection = collection.reduce((group, item) => {
      const property = item[field];

      // Initialize the group if it doesn't exist
      if (!group[property]) {
        group[property] = [];
      }

      // Add the user to the corresponding age group
      group[property].push(item);
      return group;
    }, {});
    return newCollection;
  }
}
