import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray',
  standalone: true,
})
export class FilterArrayPipe implements PipeTransform {
  transform<T extends Record<string, unknown>>(
    collection: T[] | null,
    field: keyof T & string,
    searchString: string,
  ): T[] | null {
    if (!collection) {
      return null;
    }
    if (!field || !searchString) {
      return collection;
    }

    return collection.filter((item) => {
      const property = item[field];

      if (Array.isArray(property)) {
        return property.map((value) => String(value).toLowerCase()).includes(searchString.toLowerCase());
      }

      if (typeof property === 'string') {
        try {
          const parsedProperty = JSON.parse(property) as unknown;

          if (Array.isArray(parsedProperty)) {
            return parsedProperty.map((value) => String(value).toLowerCase()).includes(searchString.toLowerCase());
          }
        } catch {
          return property.toLowerCase().includes(searchString.toLowerCase());
        }

        return property.toLowerCase().includes(searchString.toLowerCase());
      }

      return String(property ?? '').toLowerCase().includes(searchString.toLowerCase());
    });
  }
}
