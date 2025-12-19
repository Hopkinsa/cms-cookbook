import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArrays',
  standalone: true,
})
export class SortArrayPipe implements PipeTransform {
  transform(collection: any[] | null, field: string, dir: string): any[] | null {
    if (!collection) {
      return null;
    }
    if (!field) {
      return collection;
    }
    const direction = dir ? dir : 'asc';
    const isCollectionArray = Array.isArray(collection);
    collection.sort((a, b) => {
      const val1: string = isCollectionArray ? a : a[field];
      const val2: string = isCollectionArray ? b : b[field];
      let sortDir = 0;
      if (direction === 'desc') {
        if (val1 > val2) {
          sortDir = -1;
        }
        if (val1 < val2) {
          sortDir = 1;
        }
      } else {
        // ascending
        if (val1 < val2) {
          sortDir = -1;
        }
        if (val1 > val2) {
          sortDir = 1;
        }
      }
      return sortDir;
    });
    return collection;
  }
}
