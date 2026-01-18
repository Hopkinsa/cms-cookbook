import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
  standalone: true,
})
export class FilterArrayPipe implements PipeTransform {
  transform(collection: any[] | null, field: string, searchString: string): any[] | null {
    if (!collection) {
      return null;
    }
    if (!field || !searchString) {
      return collection;
    }
    const filteredList: any[] = [];

    collection.filter((item) => {
      const itemParsed = JSON.parse(JSON.stringify(item));
      let property: any[] | string = '';
      // Ensure an element that should be an array is an actual array and not a string
      try {
        property = JSON.parse(itemParsed[field]);
      } catch {
        property = itemParsed[field].toString();
      }

      if (Array.isArray(property)) {
        if (property.includes(searchString)) {
          filteredList.push(item);
        }
      } else {
        if (property.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
          filteredList.push(item);
        }
      }
    });
    return filteredList;
  }
}
