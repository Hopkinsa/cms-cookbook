import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(sentence: unknown, length: number): string {
    let newSentence = String(sentence);
    if (newSentence.length > length) {
      newSentence = newSentence.slice(0, length);
      newSentence += '...';
    }
    return newSentence;
  }
}
