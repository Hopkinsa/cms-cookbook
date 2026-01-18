import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  // "any" used to account for key value pairs
  transform(sentence: any, length: number): string {
    let newSentence: string = sentence.toString();
    if (newSentence.length > length) {
      newSentence = newSentence.slice(0, length);
      newSentence += '...';
    }
    return newSentence;
  }
}
