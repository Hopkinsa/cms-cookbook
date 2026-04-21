import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursMinutes',
  standalone: true,
})
export class HoursMinutesPipe implements PipeTransform {
  transform(minutes: number | string | null | undefined): string {
    const timeStart = Number(minutes ?? 0);

    if (!Number.isFinite(timeStart) || timeStart <= 0) {
      return '';
    }

    const hrs = Math.floor(timeStart / 60);
    const min = timeStart % 60;
    let timeText = '';
    if (hrs > 0) {
      timeText += `${hrs} hour`;
      if (hrs > 1) {
        timeText += `s`;
      }
      timeText += ' ';
    }
    if (min > 0) {
      timeText += `${min} minute`;
      if (min > 1) {
        timeText += `s`;
      }
    }
    return timeText;
  }
}
