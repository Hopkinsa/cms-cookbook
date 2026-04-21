import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeChar',
  standalone: true,
})
export class RemoveCharactersPipe implements PipeTransform {
  transform(text: string | number | null | undefined, char: string, newChar: string): string {
    return String(text ?? '').replaceAll(char, newChar);
  }
}
