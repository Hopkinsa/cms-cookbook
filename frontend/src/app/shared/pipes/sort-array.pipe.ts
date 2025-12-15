import { C } from '@angular/cdk/keycodes';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArrays',
  standalone: true,
})
export class SortArrayPipe implements PipeTransform {
  transform(collection: Array<any> | null, field: string, dir: string) {
    if (!collection) {
      return null;
    }
    if (!field) {
      return collection;
    }
    const direction = (dir) ? dir : 'asc';
    const isCollectionArray = Array.isArray(collection);
    collection.sort((a, b) => {
      let val1: string = (isCollectionArray) ? a : a[field];
      let val2: string = (isCollectionArray) ? b : b[field];
      let sortDir = 0;
      if (direction === 'desc') {
        if (val1 > val2) { sortDir = -1 };
        if (val1 < val2) { sortDir = 1 };
      } else {
        // ascending
        if (val1 < val2) { sortDir = -1 };
        if (val1 > val2) { sortDir = 1 };
      }
      return sortDir;
    });
    return collection;
  }
}