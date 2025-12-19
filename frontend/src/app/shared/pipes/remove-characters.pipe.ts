import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeChar',
  standalone: true,
})
export class RemoveCharactersPipe implements PipeTransform {
  // "any" used to account for key value pairs
  transform(text: any | null, char: string, newChar: string): string {
    return (text as string).replaceAll(char, newChar);
  }
}
